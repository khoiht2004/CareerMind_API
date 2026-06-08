const prisma = require("@/libs/prisma");

const getSessions = async (userId) => {
  return prisma.chatSession.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          profile: {
            select: {
              avatarUrl: true,
            },
          },
        },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
};

const createSession = async (userId, title) => {
  return prisma.chatSession.create({
    data: { userId, title: title || "MindScout" },
    select: { id: true, title: true, createdAt: true },
  });
};

const getSession = async (id, userId) => {
  return prisma.chatSession.findFirst({
    where: { id, userId },
    select: { id: true, title: true },
  });
};

const getMessages = async (sessionId) => {
  const allIds = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!allIds.length) return [];
  const ids = allIds.map((m) => m.id);

  const messages = await prisma.chatMessage.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      role: true,
      content: true,
      attachments: true,
      createdAt: true,
      cvAnalysis: true,
    },
  });

  // Sort ở Node.js memory dựa theo thứ tự của mảng ids ban đầu
  const messageMap = new Map(messages.map((message) => [message.id, message]));
  return ids.map((id) => messageMap.get(id)).filter(Boolean);
};

const getRecentMessages = async (sessionId, limit = 10) => {
  // Bước 1: Chỉ lấy danh sách ID của N tin nhắn gần nhất (siêu nhẹ, không kéo theo base64)
  const recentIds = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true },
  });

  if (!recentIds.length) return [];

  const ids = recentIds.map((m) => m.id);

  // Bước 2: Lấy full data của những ID đó (KHÔNG có ORDER BY)
  const messages = await prisma.chatMessage.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      role: true,
      content: true,
      attachments: true,
      createdAt: true,
      cvAnalysis: true,
    },
  });

  // Bước 3: Sort bằng JS và lật ngược thứ tự lại (vì lấy recent là desc, cần trả về asc cho UI)
  const messageMap = new Map(messages.map((m) => [m.id, m]));
  return ids
    .map((id) => messageMap.get(id))
    .filter(Boolean)
    .reverse();
};

const addMessage = async (sessionId, role, content, attachments = null) => {
  const msg = await prisma.chatMessage.create({
    data: {
      sessionId,
      role,
      content,
      attachments: attachments?.length ? attachments : null,
    },
    select: {
      id: true,
      role: true,
      content: true,
      attachments: true,
      createdAt: true,
    },
  });
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });
  return msg;
};

const updateTitle = async (id, title) => {
  return prisma.chatSession.update({ where: { id }, data: { title } });
};

const deleteSession = async (id) => {
  return prisma.chatSession.delete({ where: { id } });
};

const addCvAnalysis = async (messageId, analysisData) => {
  return prisma.cvAnalysis.create({
    data: {
      messageId,
      score: analysisData.score,
      strengths: analysisData.strengths,
      weaknesses: analysisData.weaknesses,
      improvements: analysisData.improvements,
      summary: analysisData.summary,
    },
  });
};

module.exports = {
  getSessions,
  createSession,
  getSession,
  getMessages,
  getRecentMessages,
  addMessage,
  updateTitle,
  deleteSession,
  addCvAnalysis,
};
