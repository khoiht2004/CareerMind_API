const prisma = require("@/utils/prisma");

const getSessions = async (userId) => {
  return prisma.chatSession.findMany({
    where: { userId },
    select: {
      id: true, title: true, createdAt: true, updatedAt: true,
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
};

const createSession = async (userId, title) => {
  return prisma.chatSession.create({
    data: { userId, title: title || "Cuộc trò chuyện mới" },
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
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, createdAt: true },
  });
};

const addMessage = async (sessionId, role, content) => {
  const msg = await prisma.chatMessage.create({
    data: { sessionId, role, content },
    select: { id: true, role: true, content: true, createdAt: true },
  });
  await prisma.chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
  return msg;
};

const updateTitle = async (id, title) => {
  return prisma.chatSession.update({ where: { id }, data: { title } });
};

const deleteSession = async (id) => {
  return prisma.chatSession.delete({ where: { id } });
};

module.exports = { getSessions, createSession, getSession, getMessages, addMessage, updateTitle, deleteSession };
