const prisma = require("@/libs/prisma");

const parseImages = (msg) => ({
  ...msg,
  images: msg.images ? JSON.parse(msg.images) : null,
});

const getSessions = async (userId) => {
  return prisma.chatSession.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
};

const createSession = async (userId, title) => {
  return prisma.chatSession.create({
    data: { userId, title: title || "AI Scout" },
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
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, images: true, createdAt: true },
  });
  return messages.map(parseImages);
};

const getRecentMessages = async (sessionId, limit = 10) => {
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, role: true, content: true, images: true, createdAt: true },
  });
  return messages.reverse().map(parseImages);
};

const addMessage = async (sessionId, role, content, images = null) => {
  const msg = await prisma.chatMessage.create({
    data: {
      sessionId,
      role,
      content,
      images: images?.length ? JSON.stringify(images) : null,
    },
    select: { id: true, role: true, content: true, images: true, createdAt: true },
  });
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });
  return parseImages(msg);
};

const updateTitle = async (id, title) => {
  return prisma.chatSession.update({ where: { id }, data: { title } });
};

const deleteSession = async (id) => {
  return prisma.chatSession.delete({ where: { id } });
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
};
