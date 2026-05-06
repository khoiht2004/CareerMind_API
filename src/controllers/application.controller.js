const model = require("@/models/application.model");
const jobModel = require("@/models/job.model");
const queueService = require("@/services/queue.service");

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
  const parsedIsDraft =
    isDraft === "true" ? true : isDraft === "false" ? false : undefined;
  const result = await model.getMyApplications(req.auth.user.id, {
    page: +page,
    limit: +limit,
    status,
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
    return res.error(400, "Trạng thái không hợp lệ");

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

module.exports = {
  apply,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateStatus,
  deleteApplication,
  checkApplied,
};
