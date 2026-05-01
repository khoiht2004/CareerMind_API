const model = require("@/models/job.model");
const { toJsonString } = require("../utils/helper");

async function getJobs(req, res) {
  const { page = 1, limit = 12, search, type, location } = req.query;
  const result = await model.getJobs({
    page: +page,
    limit: +limit,
    search,
    type,
    location,
  });
  return res.success(200, result);
}

async function getJobById(req, res) {
  const job = await model.getJobById(req.params.id);
  if (!job || job.status === "CLOSED")
    return res.error(404, "Không tìm thấy công việc");
  return res.success(200, job);
}

async function createJob(req, res) {
  const { title, location, description } = req.body;
  const companyId = req.auth.user.companyId;

  if (!title || !location || !description) {
    return res.error(400, "Tiêu đề, địa điểm và mô tả là bắt buộc");
  }
  if (!companyId) {
    return res.error(400, "Tài khoản của bạn chưa được liên kết với công ty");
  }

  const payload = {
    ...req.body,
    tags: req.body.tags,
    benefits: req.body.benefits,
    requirements: req.body.requirements,
  };

  const job = await model.createJob(payload, req.auth.user.id, companyId);
  return res.success(201, job);
}

async function updateJob(req, res) {
  const { id } = req.params;
  const { user } = req.auth;

  const existing = await model.getJobById(id);
  if (!existing) return res.error(404, "Không tìm thấy công việc");
  if (user.role !== "ADMIN" && existing.postedBy.id !== user.id) {
    return res.error(403, "Bạn không có quyền chỉnh sửa công việc này");
  }

  const payload = {
    ...req.body,
    tags: req.body.tags,
    benefits: req.body.benefits,
    requirements: req.body.requirements,
  };

  const job = await model.updateJob(id, payload);
  return res.success(200, job);
}

async function deleteJob(req, res) {
  const { id } = req.params;
  const { user } = req.auth;

  const existing = await model.getJobById(id);
  if (!existing) return res.error(404, "Không tìm thấy công việc");
  if (user.role !== "ADMIN" && existing.postedBy.id !== user.id) {
    return res.error(403, "Bạn không có quyền xóa công việc này");
  }

  await model.deleteJob(id);
  return res.success(200, "Xóa công việc thành công");
}

async function getMyJobs(req, res) {
  const { page = 1, limit = 10, status, search } = req.query;
  const result = await model.getMyJobs(req.auth.user.id, {
    page: +page,
    limit: +limit,
    status,
    search,
  });
  return res.success(200, result);
}

async function getMyStats(req, res) {
  const stats = await model.getMyStats(req.auth.user.id);
  return res.success(200, stats);
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getMyStats,
};
