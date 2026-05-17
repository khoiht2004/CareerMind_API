const prisma = require("@/libs/prisma");

const JOB_SELECT = {
  id: true,
  title: true,
  company: {
    select: { id: true, name: true, logoUrl: true, isVerified: true },
  },
  location: true,
  salary: true,
  type: true,
  level: true,
  tags: true,
  industry: true,
  description: true,
  benefits: true,
  slots: true,
  deadline: true,
  status: true,
  isHot: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  requirements: true,
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
  level,
  industry,
  salary,
  status = "PUBLISHED",
  sort = "newest",
}) => {
  const where = {
    status,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { company: { name: { contains: search } } },
      ],
    }),
    ...(type && type !== "ALL" && { type }),
    ...(location && location !== "ALL" && { location: { contains: location } }),
    ...(level && level !== "ALL" && { level }),
    ...(industry && industry !== "ALL" && {
      industry: { array_contains: industry },
    }),
    ...(salary && salary !== "ALL" && { salary: { contains: salary } }),
  };

  const orderBy =
    sort === "oldest"
      ? [{ createdAt: "asc" }]
      : sort === "views_desc"
        ? [{ viewCount: "desc" }, { createdAt: "desc" }]
        : [{ isHot: "desc" }, { createdAt: "desc" }];

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      select: JOB_SELECT,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getJobById = async (id) => {
  const exists = await prisma.job.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return null;
  return prisma.job.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: JOB_SELECT,
  });
};

const createJob = async (data, postedById, companyId) => {
  const { deadline, company, ...rest } = data; // strip legacy `company` string
  return prisma.job.create({
    data: {
      ...rest,
      ...(deadline && { deadline: new Date(deadline) }),
      postedById,
      companyId,
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
      OR: [
        { title: { contains: search } },
        { company: { name: { contains: search } } },
      ],
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
  const now = new Date();
  const nineMonthsAgo = new Date(now);
  nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 8);
  nineMonthsAgo.setDate(1);
  nineMonthsAgo.setHours(0, 0, 0, 0);

  const [totalJobs, jobsByStatus, totalApplications, appsByStatus, rawMonthly] =
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
      prisma.$queryRaw`
        SELECT MONTH(a.created_at) AS month, YEAR(a.created_at) AS year, COUNT(*) AS count
        FROM applications a
        INNER JOIN jobs j ON a.job_id = j.id
        WHERE j.posted_by_id = ${userId}
          AND a.created_at >= ${nineMonthsAgo}
        GROUP BY YEAR(a.created_at), MONTH(a.created_at)
        ORDER BY year ASC, month ASC
      `,
    ]);

  const toMap = (arr) =>
    arr.reduce(
      (acc, item) => ({ ...acc, [item.status]: item._count._all }),
      {},
    );

  // Build a continuous 9-month array (fills 0 for months with no data)
  const monthlyApplications = [];
  for (let i = 8; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const found = rawMonthly.find(
      (r) => Number(r.month) === m && Number(r.year) === y,
    );
    monthlyApplications.push({
      month: m,
      year: y,
      label: `Thg ${m}`,
      count: found ? Number(found.count) : 0,
    });
  }

  return {
    totalJobs,
    totalApplications,
    jobsByStatus: toMap(jobsByStatus),
    appsByStatus: toMap(appsByStatus),
    monthlyApplications,
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
