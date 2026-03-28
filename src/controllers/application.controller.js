const model = require("@/models/application.model");
const jobModel = require("@/models/job.model");

async function apply(req, res) {
  const { jobId, coverLetter, cvUrl } = req.body;
  if (!jobId) return res.error(400, "jobId là bắt buộc");

  const job = await jobModel.getJobById(jobId);
  if (!job || job.status !== "PUBLISHED") return res.error(404, "Công việc không tồn tại hoặc đã đóng");

  const application = await model.apply(req.auth.user.id, jobId, { coverLetter, cvUrl });
  if (!application) return res.error(409, "Bạn đã ứng tuyển vị trí này rồi");

  return res.success(201, application);
}

async function getMyApplications(req, res) {
  const { page = 1, limit = 10, status } = req.query;
  const result = await model.getMyApplications(req.auth.user.id, { page: +page, limit: +limit, status });
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
  const result = await model.getAllApplications({ page: +page, limit: +limit, status, jobId });
  return res.success(200, result);
}

async function updateStatus(req, res) {
  const { status, note } = req.body;
  const VALID = ["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"];
  if (!status || !VALID.includes(status)) return res.error(400, "Trạng thái không hợp lệ");

  const app = await model.getApplicationById(req.params.id);
  if (!app) return res.error(404, "Không tìm thấy đơn ứng tuyển");

  const updated = await model.updateStatus(req.params.id, status, note);
  return res.success(200, updated);
}

module.exports = { apply, getMyApplications, getApplicationById, getAllApplications, updateStatus };
