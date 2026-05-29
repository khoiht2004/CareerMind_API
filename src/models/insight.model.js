const prisma = require("@/libs/prisma");

async function getCandidateInsights(userId) {
  const [totalApplications, applicationsByStatus, savedJobs, cvCount, coverLetterCount] =
    await Promise.all([
      prisma.application.count({ where: { userId, isDraft: false } }),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId, isDraft: false },
        _count: { _all: true },
      }),
      prisma.savedJob.count({ where: { userId } }),
      prisma.cv.count({ where: { userId } }),
      prisma.coverLetter.count({ where: { userId } }),
    ]);

  const byStatus = applicationsByStatus.reduce(
    (acc, item) => ({ ...acc, [item.status]: item._count._all }),
    {},
  );

  const interviewCount = byStatus.INTERVIEW ?? 0;
  const acceptedCount = byStatus.ACCEPTED ?? 0;

  return {
    totalApplications,
    savedJobs,
    cvCount,
    coverLetterCount,
    byStatus,
    interviewRate: totalApplications ? Math.round((interviewCount / totalApplications) * 100) : 0,
    acceptedRate: totalApplications ? Math.round((acceptedCount / totalApplications) * 100) : 0,
  };
}

module.exports = { getCandidateInsights };
