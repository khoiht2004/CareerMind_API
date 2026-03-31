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
  deadline: true,
  isHot: true,
  createdAt: true,
  _count: { select: { applications: true } },
};

const saveJob = async (userId, jobId) => {
  const exists = await prisma.savedJob.count({ where: { userId, jobId } });
  if (exists) return null;
  return prisma.savedJob.create({ data: { userId, jobId } });
};

const unsaveJob = async (userId, jobId) => {
  return prisma.savedJob.deleteMany({ where: { userId, jobId } });
};

const getSavedJobs = async (userId) => {
  const saved = await prisma.savedJob.findMany({
    where: { userId },
    select: { job: { select: JOB_SELECT } },
    orderBy: { createdAt: "desc" },
  });
  return saved.map((s) => s.job);
};

const isJobSaved = async (userId, jobId) => {
  const count = await prisma.savedJob.count({ where: { userId, jobId } });
  return count > 0;
};

module.exports = { saveJob, unsaveJob, getSavedJobs, isJobSaved };
