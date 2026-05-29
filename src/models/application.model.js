const prisma = require("@/libs/prisma");

const APP_SELECT = {
  id: true,
  coverLetter: true,
  cvUrl: true,
  phone: true,
  status: true,
  isDraft: true,
  note: true,
  interviewDate: true,
  interviewTime: true,
  interviewFormat: true,
  interviewLocation: true,
  confirmDeadline: true,
  startDate: true,
  startTime: true,
  officeAddress: true,
  createdAt: true,
  updatedAt: true,
  cv: {
    select: {
      id: true,
      name: true,
      fileUrl: true,
      fileType: true,
      fileSize: true,
    },
  },
  job: {
    select: {
      id: true,
      title: true,
      company: { select: { id: true, name: true, logoUrl: true } },
      location: true,
      salary: true,
      type: true,
      deadline: true,
      status: true,
      postedBy: { select: { id: true } },
    },
  },
  user: {
    select: {
      id: true,
      email: true,
      profile: { select: { fullName: true, avatarUrl: true, phone: true, bio: true, skills: true, address: true } },
    },
  },
};

const apply = async (userId, jobId, data) => {
  const { isDraft = false, ...rest } = data;

  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
    select: { id: true, isDraft: true },
  });

  if (isDraft) {
    if (existing) {
      if (!existing.isDraft) return null; // Already submitted, can't overwrite
      return prisma.application.update({
        where: { id: existing.id },
        data: { isDraft: true, status: "DRAFT", ...rest },
        select: APP_SELECT,
      });
    }
    return prisma.application.create({
      data: { userId, jobId, isDraft: true, status: "DRAFT", ...rest },
      select: APP_SELECT,
    });
  }

  // Submit: upgrade existing draft OR create new
  if (existing) {
    if (!existing.isDraft) return null; // Already submitted, block duplicate
    return prisma.application.update({
      where: { id: existing.id },
      data: { isDraft: false, status: "PENDING", ...rest },
      select: APP_SELECT,
    });
  }
  return prisma.application.create({
    data: { userId, jobId, isDraft: false, status: "PENDING", ...rest },
    select: APP_SELECT,
  });
};

const getMyApplications = async (userId, { page = 1, limit = 10, status, isDraft }) => {
  const where = {
    userId,
    ...(status && { status }),
    ...(isDraft !== undefined && { isDraft }),
  };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      select: APP_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);
  return {
    applications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getApplicationById = async (id) => {
  return prisma.application.findUnique({ where: { id }, select: APP_SELECT });
};

const getAllApplications = async ({
  page = 1,
  limit = 10,
  status,
  jobId,
  postedById,
}) => {
  const where = {
    ...(status && { status }),
    ...(jobId && { jobId }),
    ...(postedById && { job: { postedById } }),
  };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      select: APP_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);
  return {
    applications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const updateStatus = async (id, status, note, extraFields = {}) => {
  return prisma.application.update({
    where: { id },
    data: {
      status,
      ...(note !== undefined && { note }),
      ...extraFields,
    },
    select: APP_SELECT,
  });
};

const deleteApplication = async (id, userId) => {
  const app = await prisma.application.findUnique({
    where: { id },
    select: { userId: true, status: true, isDraft: true },
  });
  if (!app || app.userId !== userId) return null;
  if (app.status !== "DRAFT" && app.status !== "PENDING") return "NOT_PENDING";
  return prisma.application.delete({ where: { id } });
};

const checkApplied = async (userId, jobId) => {
  const count = await prisma.application.count({ where: { userId, jobId } });
  return count > 0;
};

const getScreeningApplicationsByJob = async (jobId, recruiterId) => {
  return prisma.application.findMany({
    where: {
      jobId,
      status: { in: ["PENDING", "REVIEWING"] },
      isDraft: false,
      ...(recruiterId && { job: { postedById: recruiterId } }),
    },
    select: APP_SELECT,
    orderBy: { createdAt: "desc" },
    take: 30,
  });
};

module.exports = {
  apply,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateStatus,
  deleteApplication,
  checkApplied,
  getScreeningApplicationsByJob,
};
