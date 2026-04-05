const prisma = require("@/libs/prisma");

const JOB_SELECT = {
  id: true,
  title: true,
  company: true,
  location: true,
  salary: true,
  type: true,
  level: true,
  tags: true,
  description: true,
  benefits: true,
  slots: true,
  deadline: true,
  status: true,
  isHot: true,
  createdAt: true,
  postedBy: {
    select: { id: true, email: true, profile: { select: { fullName: true } } },
  },
  _count: { select: { applications: true } },
};

const getJobs = async ({
  page = 1,
  limit = 12,
  search,
  type,
  location,
  status = "PUBLISHED",
}) => {
  const where = {
    status,
    ...(search && {
      OR: [{ title: { contains: search } }, { company: { contains: search } }],
    }),
    ...(type && type !== "ALL" && { type }),
    ...(location && location !== "ALL" && { location: { contains: location } }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: JOB_SELECT,
      orderBy: [{ isHot: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getJobById = async (id) => {
  return prisma.job.findUnique({ where: { id }, select: JOB_SELECT });
};

const createJob = async (data, postedById) => {
  const { deadline, ...rest } = data;
  return prisma.job.create({
    data: {
      ...rest,
      ...(deadline && { deadline: new Date(deadline) }),
      postedById,
    },
    select: JOB_SELECT,
  });
};

const updateJob = async (id, data) => {
  const { deadline, ...rest } = data;
  return prisma.job.update({
    where: { id },
    data: {
      ...rest,
      ...(deadline !== undefined && {
        deadline: deadline ? new Date(deadline) : null,
      }),
    },
    select: JOB_SELECT,
  });
};

const deleteJob = async (id) => {
  return prisma.job.delete({ where: { id } });
};

const getJobsForUser = async (keywords = [], limit = 10) => {
  if (!keywords.length) {
    return prisma.job.findMany({
      where: { status: "PUBLISHED" },
      select: JOB_SELECT,
      orderBy: [{ isHot: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  const orConditions = keywords.flatMap((kw) => [
    { title: { contains: kw } },
    { description: { contains: kw } },
  ]);

  return prisma.job.findMany({
    where: { status: "PUBLISHED", OR: orConditions },
    select: JOB_SELECT,
    orderBy: [{ isHot: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
};

const isOwner = async (id, userId) => {
  const count = await prisma.job.count({ where: { id, postedById: userId } });
  return count > 0;
};

const getMyJobs = async (userId, { page = 1, limit = 10, status, search }) => {
  const where = {
    postedById: userId,
    ...(status && status !== "ALL" && { status }),
    ...(search && {
      OR: [{ title: { contains: search } }, { company: { contains: search } }],
    }),
  };
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: JOB_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);
  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getMyStats = async (userId) => {
  const [totalJobs, jobsByStatus, totalApplications, appsByStatus] =
    await Promise.all([
      prisma.job.count({ where: { postedById: userId } }),
      prisma.job.groupBy({
        by: ["status"],
        where: { postedById: userId },
        _count: { _all: true },
      }),
      prisma.application.count({ where: { job: { postedById: userId } } }),
      prisma.application.groupBy({
        by: ["status"],
        where: { job: { postedById: userId } },
        _count: { _all: true },
      }),
    ]);

  const toMap = (arr) =>
    arr.reduce(
      (acc, item) => ({ ...acc, [item.status]: item._count._all }),
      {},
    );

  return {
    totalJobs,
    totalApplications,
    jobsByStatus: toMap(jobsByStatus),
    appsByStatus: toMap(appsByStatus),
  };
};

module.exports = {
  getJobs,
  getJobById,
  getJobsForUser,
  createJob,
  updateJob,
  deleteJob,
  isOwner,
  getMyJobs,
  getMyStats,
};
