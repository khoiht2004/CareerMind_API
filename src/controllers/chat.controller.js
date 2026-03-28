const model = require("@/models/chat.model");

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
  const { content } = req.body;
  if (!content?.trim()) return res.error(400, "Nội dung tin nhắn không được trống");

  const session = await model.getSession(id, req.auth.user.id);
  if (!session) return res.error(404, "Không tìm thấy cuộc trò chuyện");

  const userMsg = await model.addMessage(id, "USER", content);

  // Placeholder AI response — replace with actual AI integration
  const aiReply = `Tôi đã nhận được tin nhắn của bạn: "${content}". Đây là phản hồi tạm thời từ hệ thống.`;
  const aiMsg = await model.addMessage(id, "ASSISTANT", aiReply);

  return res.success(200, { userMessage: userMsg, assistantMessage: aiMsg });
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

module.exports = { getSessions, createSession, getMessages, sendMessage, updateTitle, deleteSession };
