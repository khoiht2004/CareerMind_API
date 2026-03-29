const model = require("@/models/savedJob.model");
const jobModel = require("@/models/job.model");

async function save(req, res) {
  const { jobId } = req.body;
  if (!jobId) return res.error(400, "jobId là bắt buộc");

  const job = await jobModel.getJobById(jobId);
  if (!job) return res.error(404, "Công việc không tồn tại");

  const result = await model.saveJob(req.auth.user.id, jobId);
  if (!result) return res.error(409, "Bạn đã lưu công việc này rồi");

  return res.success(201, { message: "Đã lưu công việc" });
}

async function unsave(req, res) {
  await model.unsaveJob(req.auth.user.id, req.params.jobId);
  return res.success(200, { message: "Đã bỏ lưu công việc" });
}

async function getSaved(req, res) {
  const jobs = await model.getSavedJobs(req.auth.user.id);
  return res.success(200, jobs);
}

async function checkSaved(req, res) {
  const isSaved = await model.isJobSaved(req.auth.user.id, req.params.jobId);
  return res.success(200, { isSaved });
}

module.exports = { save, unsave, getSaved, checkSaved };
