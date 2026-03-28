const prisma = require("@/utils/prisma");

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
  postedBy: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
  _count: { select: { applications: true } },
};

const getJobs = async ({ page = 1, limit = 12, search, type, location, status = "PUBLISHED" }) => {
  const where = {
    status,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { company: { contains: search } },
        { tags: { contains: search } },
      ],
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
  const { tags, benefits, ...rest } = data;
  return prisma.job.create({
    data: {
      ...rest,
      tags: tags ? JSON.stringify(tags) : null,
      benefits: benefits ? JSON.stringify(benefits) : null,
      postedById,
    },
    select: JOB_SELECT,
  });
};

const updateJob = async (id, data) => {
  const { tags, benefits, ...rest } = data;
  return prisma.job.update({
    where: { id },
    data: {
      ...rest,
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      ...(benefits !== undefined && { benefits: JSON.stringify(benefits) }),
    },
    select: JOB_SELECT,
  });
};

const deleteJob = async (id) => {
  return prisma.job.delete({ where: { id } });
};

const isOwner = async (id, userId) => {
  const count = await prisma.job.count({ where: { id, postedById: userId } });
  return count > 0;
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, isOwner };
