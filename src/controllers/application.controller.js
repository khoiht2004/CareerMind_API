const model = require("@/models/application.model");
const jobModel = require("@/models/job.model");
const queueService = require("@/services/queue.service");
const prisma = require('@/libs/prisma');
const socketHelper = require("@/libs/socket");

async function apply(req, res) {
  const { jobId, coverLetter, cvUrl, cvId, phone, email, name, isDraft = false } = req.body;
  if (!jobId) return res.error(400, "jobId là bắt buộc");

  const job = await jobModel.getJobById(jobId);
  if (!job || job.status !== "PUBLISHED")
    return res.error(404, "Công việc không tồn tại hoặc đã đóng");

  const application = await model.apply(req.auth.user.id, jobId, {
    coverLetter,
    cvUrl,
    cvId: cvId || undefined,
    phone,
    isDraft: Boolean(isDraft),
  });

  if (!application)
    return res.error(
      409,
      isDraft
        ? "Bạn đã có đơn ứng tuyển hoặc bản nháp cho vị trí này"
        : "Bạn đã ứng tuyển vị trí này rồi",
    );

  if (!isDraft) {
    await queueService.push(
      "sendApplyEmail",
      {
        email: email,
        applicantName: name,
        jobTitle: job.title,
        company: job.company.name,
      },
      1,
    );
  }

  return res.success(201, application);
}

async function getMyApplications(req, res) {
  const { page = 1, limit = 10, status, isDraft } = req.query;
  // Support both legacy isDraft filter and new status-based filter
  const parsedIsDraft =
    isDraft === "true" ? true : isDraft === "false" ? false : undefined;
  const result = await model.getMyApplications(req.auth.user.id, {
    page: +page,
    limit: +limit,
    status: status || undefined,
    isDraft: parsedIsDraft,
  });
  return res.success(200, result);
}

async function getApplicationById(req, res) {
  const app = await model.getApplicationById(req.params.id);
  if (!app) return res.error(404, "Không tìm thấy đơn ứng tuyển");
  if (app.user.id !== req.auth.user.id && req.auth.user.role === "CANDIDATE") {
    return res.error(403, "Không có quyền truy cập");
  }
  return res.success(200, app);
}

async function getAllApplications(req, res) {
  const { page = 1, limit = 10, status, jobId } = req.query;
  const { user } = req.auth;
  const result = await model.getAllApplications({
    page: +page,
    limit: +limit,
    status,
    jobId,
    postedById: user.role === "RECRUITER" ? user.id : undefined,
  });
  return res.success(200, result);
}

async function updateStatus(req, res) {
  const {
    status,
    note,
    sendEmail = true,
    // Interview fields
    interviewDate,
    interviewTime,
    interviewFormat,
    interviewLocation,
    confirmDeadline,
    // Accepted fields
    startDate,
    startTime,
    officeAddress,
  } = req.body;

  const VALID = ["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"];
  if (!status || !VALID.includes(status))
    return res.error(400, "Trạng thái không hợp lệ. Recruiter không thể đặt trạng thái DRAFT");

  const app = await model.getApplicationById(req.params.id);
  if (!app) return res.error(404, "Không tìm thấy đơn ứng tuyển");

  const extraFields = {};
  if (status === "INTERVIEW") {
    if (interviewDate) extraFields.interviewDate = new Date(interviewDate);
    if (interviewTime) extraFields.interviewTime = interviewTime;
    if (interviewFormat) extraFields.interviewFormat = interviewFormat;
    if (interviewLocation) extraFields.interviewLocation = interviewLocation;
    if (confirmDeadline)
      extraFields.confirmDeadline = new Date(confirmDeadline);
  } else if (status === "ACCEPTED") {
    if (startDate) extraFields.startDate = new Date(startDate);
    if (startTime) extraFields.startTime = startTime;
    if (officeAddress) extraFields.officeAddress = officeAddress;
  }

  const updated = await model.updateStatus(
    req.params.id,
    status,
    note,
    extraFields,
  );

  try {
    // 1. Tạo Notification trong Database
    const jobTitle = app.job?.title ?? "vị trí tuyển dụng";
    let statusText = status;
    if (status === "REVIEWING") statusText = "Đang xem xét";
    else if (status === "INTERVIEW") statusText = "Lên lịch phỏng vấn";
    else if (status === "ACCEPTED") statusText = "Được nhận";
    else if (status === "REJECTED") statusText = "Từ chối";
    else if (status === "PENDING") statusText = "Chờ xét duyệt";

    let notiTitle = "Cập nhật đơn ứng tuyển";
    let notiContent = `Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" đã chuyển sang trạng thái: ${statusText}.`;

    if (status === "INTERVIEW") {
      notiTitle = "Lời mời phỏng vấn";
      notiContent = `Bạn có một lời mời phỏng vấn mới cho vị trí "${jobTitle}" vào ngày ${interviewDate} lúc ${interviewTime || ""}.`;
    } else if (status === "ACCEPTED") {
      notiTitle = "Chúc mừng! Bạn đã trúng tuyển";
      notiContent = `Chúc mừng bạn đã trúng tuyển vào vị trí "${jobTitle}". Ngày bắt đầu làm việc: ${startDate}.`;
    }

    // Lưu thông báo vào database (Prisma Client đã được generate mới nhất)
    const notification = await prisma.notification.create({
      data: {
        userId: app.user.id,
        title: notiTitle,
        content: notiContent,
      },
    });

    // 2. Gửi realtime socket
    socketHelper.sendToUser(app.user.id, "notification:new", notification);
  } catch (error) {
    console.error("Lỗi khi lưu và gửi thông báo realtime:", error);
  }

  // Gửi email thông báo nếu sendEmail = true
  if (sendEmail) {
    const candidateEmail = app.user?.email;
    const applicantName =
      app.user?.profile?.fullName ?? app.user?.email ?? "Ứng viên";
    const jobTitle = app.job?.title ?? "";
    const company = app.job?.company.name ?? "";

    if (status === "INTERVIEW") {
      await queueService.push("sendInterviewEmail", {
        email: candidateEmail,
        applicantName,
        jobTitle,
        company,
        interviewDate: interviewDate ?? null,
        interviewTime: interviewTime ?? null,
        interviewFormat: interviewFormat ?? null,
        interviewLocation: interviewLocation ?? null,
        confirmDeadline: confirmDeadline ?? null,
      });
    } else if (status === "ACCEPTED") {
      await queueService.push("sendAcceptedEmail", {
        email: candidateEmail,
        applicantName,
        jobTitle,
        company,
        startDate: startDate ?? null,
        startTime: startTime ?? null,
        officeAddress: officeAddress ?? null,
      });
    } else if (status === "REJECTED") {
      await queueService.push("sendRejectedEmail", {
        email: candidateEmail,
        applicantName,
        jobTitle,
        company,
      });
    }
  }

  return res.success(200, updated);
}

async function deleteApplication(req, res) {
  const result = await model.deleteApplication(req.params.id, req.auth.user.id);
  if (!result)
    return res.error(
      404,
      "Không tìm thấy đơn ứng tuyển hoặc không có quyền xóa",
    );
  if (result === "NOT_PENDING")
    return res.error(400, "Chỉ có thể rút đơn khi đang ở trạng thái chờ duyệt");
  return res.success(200, { message: "Đã xóa đơn ứng tuyển" });
}

async function checkApplied(req, res) {
  const { jobId } = req.query;
  if (!jobId) return res.error(400, "jobId là bắt buộc");
  const applied = await model.checkApplied(req.auth.user.id, jobId);
  return res.success(200, { applied });
}

async function getMyInsights(req, res) {
  const userId = req.auth.user.id;
  
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      job: { include: { company: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const total = applications.length;
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const rejectedApps = applications.filter(a => a.status === 'REJECTED').slice(0, 5);
  let feedback = "Bạn chưa có đơn ứng tuyển nào bị từ chối. Cứ tự tin ứng tuyển các công việc phù hợp nhé!";

  if (rejectedApps.length > 0) {
    const aiService = require("@/services/ai.service");
    const prompt = `Phân tích nguyên nhân rớt ứng tuyển của ứng viên này.
Đây là danh sách các công việc ứng viên đã bị từ chối gần đây:
${rejectedApps.map(a => `- Vị trí: ${a.job?.title} tại công ty ${a.job?.company?.name}`).join('\n')}

Dựa vào danh sách này, hãy đưa ra 1 đoạn nhận xét ngắn gọn (khoảng 3-4 câu) bằng tiếng Việt, mang tính động viên và khuyên ứng viên về định hướng hoặc cách cải thiện CV.`;
    try {
      feedback = await aiService.completions(prompt, [{ role: "user", content: "Phân tích và cho tôi lời khuyên" }]);
    } catch (e) {
      console.error(e);
      feedback = "Hệ thống AI đang bận, không thể phân tích lúc này.";
    }
  }

  return res.success(200, { total, statusCounts, feedback });
}

module.exports = {
  apply,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateStatus,
  deleteApplication,
  checkApplied,
  getMyInsights,
};
