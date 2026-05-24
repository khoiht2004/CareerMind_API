const model = require("@/models/chat.model");
const chatbotService = require("@/services/chatbot.service");
const jobModel = require("@/models/job.model");
const profileModel = require("@/models/profile.model");

async function getSessions(req, res) {
  const sessions = await model.getSessions(req.auth.user.id);
  return res.success(200, sessions);
}

async function createSession(req, res) {
  const { title } = req.body;
  const session = await model.createSession(req.auth.user.id, title);
  return res.success(201, session);
}

async function getMessages(req, res) {
  const { id } = req.params;
  const session = await model.getSession(id, req.auth.user.id);
  if (!session) return res.error(404, "Không tìm thấy cuộc trò chuyện");
  const messages = await model.getMessages(id);
  return res.success(200, { session, messages });
}

async function sendMessage(req, res) {
  const { id } = req.params;
  const { content, attachments } = req.body;
  if (!content?.trim() && !attachments?.length)
    return res.error(400, "Vui lòng nhập nội dung hoặc đính kèm file");

  const session = await model.getSession(id, req.auth.user.id);
  if (!session) return res.error(404, "Không tìm thấy cuộc trò chuyện");

  const result = await chatbotService.chat(req.auth.user, id, content || "", attachments);
  return res.success(200, result);
}

async function updateTitle(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  if (!title?.trim()) return res.error(400, "Tiêu đề không được trống");

  const session = await model.getSession(id, req.auth.user.id);
  if (!session) return res.error(404, "Không tìm thấy cuộc trò chuyện");

  const updated = await model.updateTitle(id, title);
  return res.success(200, updated);
}

async function deleteSession(req, res) {
  const { id } = req.params;
  const session = await model.getSession(id, req.auth.user.id);
  if (!session) return res.error(404, "Không tìm thấy cuộc trò chuyện");

  await model.deleteSession(id);
  return res.success(200, "Xóa cuộc trò chuyện thành công");
}

async function generateCoverLetter(req, res) {
  const { jobId, title } = req.body;
  if (!jobId && !title?.trim()) return res.error(400, "jobId hoặc title là bắt buộc");

  let job;
  if (jobId) {
    job = await jobModel.getJobById(jobId);
    if (!job) return res.error(404, "Không tìm thấy công việc");
  } else {
    // No specific job — AI will infer from title + user profile
    job = { title: title.trim() };
  }

  const profile = await profileModel.getProfile(req.auth.user.id);
  const coverLetter = await chatbotService.generateCoverLetter(job, profile);
  return res.success(200, { coverLetter });
}

async function analyzeRecruiterCandidates(req, res) {
  const { jobId, criteria } = req.body;
  if (!jobId) return res.error(400, "jobId là bắt buộc");

  try {
    const result = await chatbotService.analyzeRecruiterCandidates(req.auth.user, {
      jobId,
      criteria,
    });
    return res.success(200, result);
  } catch (error) {
    return res.error(error.statusCode || 500, error.message || "Không thể phân tích ứng viên");
  }
}

module.exports = {
  getSessions,
  createSession,
  getMessages,
  sendMessage,
  updateTitle,
  deleteSession,
  generateCoverLetter,
  analyzeRecruiterCandidates,
};
