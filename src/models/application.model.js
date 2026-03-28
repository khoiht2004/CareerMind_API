const prisma = require("@/utils/prisma");

const APP_SELECT = {
  id: true,
  coverLetter: true,
  cvUrl: true,
  status: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  job: {
    select: {
      id: true, title: true, company: true, location: true,
      salary: true, type: true, deadline: true,
    },
  },
  user: { select: { id: true, email: true, profile: { select: { fullName: true, avatarUrl: true } } } },
};

const apply = async (userId, jobId, data) => {
  const exists = await prisma.application.count({ where: { userId, jobId } });
  if (exists) return null;
  return prisma.application.create({ data: { userId, jobId, ...data }, select: APP_SELECT });
};

const getMyApplications = async (userId, { page = 1, limit = 10, status }) => {
  const where = { userId, ...(status && { status }) };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where, select: APP_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.application.count({ where }),
  ]);
  return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getApplicationById = async (id) => {
  return prisma.application.findUnique({ where: { id }, select: APP_SELECT });
};

const getAllApplications = async ({ page = 1, limit = 10, status, jobId }) => {
  const where = {
    ...(status && { status }),
    ...(jobId && { jobId }),
  };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where, select: APP_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.application.count({ where }),
  ]);
  return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const updateStatus = async (id, status, note) => {
  return prisma.application.update({
    where: { id },
    data: { status, ...(note !== undefined && { note }) },
    select: APP_SELECT,
  });
};

module.exports = { apply, getMyApplications, getApplicationById, getAllApplications, updateStatus };
