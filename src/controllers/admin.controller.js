const prisma = require("@/utils/prisma");

async function getStats(req, res) {
  const [totalUsers, totalJobs, totalApplications, activeJobs] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.job.count({ where: { status: "PUBLISHED" } }),
  ]);

  return res.success(200, { totalUsers, totalJobs, totalApplications, activeJobs });
}

async function getApplicationTrend(req, res) {
  // Last 7 days trend
  const days = 7;
  const results = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const count = await prisma.application.count({
      where: { createdAt: { gte: start, lt: end } },
    });
    results.push({
      date: start.toISOString().slice(0, 10),
      applications: count,
    });
  }
  return res.success(200, results);
}

async function getJobsByType(req, res) {
  const types = ["FULL_TIME", "PART_TIME", "REMOTE", "INTERNSHIP", "CONTRACT"];
  const results = await Promise.all(
    types.map(async (type) => ({
      type,
      count: await prisma.job.count({ where: { type } }),
    }))
  );
  return res.success(200, results);
}

async function getRecentApplications(req, res) {
  const applications = await prisma.application.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      user: { select: { id: true, email: true, profile: { select: { fullName: true, avatarUrl: true } } } },
      job: { select: { id: true, title: true, company: true } },
    },
  });
  return res.success(200, applications);
}

async function getUsers(req, res) {
  const { page = 1, limit = 20, search, role } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(search && { OR: [{ email: { contains: search } }, { profile: { fullName: { contains: search } } }] }),
    ...(role && { role }),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: +limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, role: true, isVerified: true, isActive: true, createdAt: true,
        profile: { select: { fullName: true, avatarUrl: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return res.success(200, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ["CANDIDATE", "RECRUITER", "ADMIN"];
  if (!validRoles.includes(role)) return res.error(400, "Role không hợp lệ");

  const user = await prisma.user.update({ where: { id }, data: { role }, select: { id: true, email: true, role: true } });
  return res.success(200, user);
}

async function toggleUserActive(req, res) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id }, select: { isActive: true } });
  if (!user) return res.error(404, "Không tìm thấy người dùng");

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: { id: true, email: true, isActive: true },
  });
  return res.success(200, updated);
}

// ─── Admin Jobs ───────────────────────────────────────────────────────────────

async function getAdminJobs(req, res) {
  const { page = 1, limit = 20, search, type, status } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(search && { OR: [{ title: { contains: search } }, { company: { contains: search } }] }),
    ...(type && { type }),
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where, skip, take: +limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, company: true, location: true, type: true,
        status: true, isHot: true, deadline: true, slots: true, createdAt: true,
        postedBy: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return res.success(200, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
}

async function updateJobStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const VALID = ["DRAFT", "PUBLISHED", "CLOSED"];
  if (!status || !VALID.includes(status)) return res.error(400, "Trạng thái không hợp lệ");

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return res.error(404, "Không tìm thấy công việc");

  const updated = await prisma.job.update({
    where: { id }, data: { status },
    select: { id: true, title: true, status: true },
  });
  return res.success(200, updated);
}

// ─── Admin Applications ───────────────────────────────────────────────────────

async function getAdminApplications(req, res) {
  const { page = 1, limit = 20, search, status, jobId } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(status && { status }),
    ...(jobId && { jobId }),
    ...(search && {
      OR: [
        { user: { email: { contains: search } } },
        { user: { profile: { fullName: { contains: search } } } },
        { job: { title: { contains: search } } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.application.findMany({
      where, skip, take: +limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, status: true, createdAt: true, note: true,
        user: { select: { id: true, email: true, profile: { select: { fullName: true, avatarUrl: true } } } },
        job: { select: { id: true, title: true, company: true } },
      },
    }),
    prisma.application.count({ where }),
  ]);

  return res.success(200, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
}

async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status, note } = req.body;
  const VALID = ["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"];
  if (!status || !VALID.includes(status)) return res.error(400, "Trạng thái không hợp lệ");

  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) return res.error(404, "Không tìm thấy đơn ứng tuyển");

  const updated = await prisma.application.update({
    where: { id }, data: { status, ...(note && { note }) },
    select: { id: true, status: true, note: true },
  });
  return res.success(200, updated);
}

// ─── Admin Chat ───────────────────────────────────────────────────────────────

async function getChatStats(req, res) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalSessions, totalMessages, recentSessions] = await Promise.all([
    prisma.chatSession.count(),
    prisma.chatMessage.count(),
    prisma.chatSession.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
  ]);
  return res.success(200, { totalSessions, totalMessages, recentSessions });
}

async function getAdminChatSessions(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const skip = (+page - 1) * +limit;

  const [data, total] = await Promise.all([
    prisma.chatSession.findMany({
      skip, take: +limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true, title: true, createdAt: true, updatedAt: true,
        user: { select: { id: true, email: true, profile: { select: { fullName: true } } } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.chatSession.count(),
  ]);

  return res.success(200, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
}

// ─── Admin System ─────────────────────────────────────────────────────────────

async function getSystemStats(req, res) {
  const [totalQueues, pendingQueues, failedQueues, processedQueues] = await Promise.all([
    prisma.queue.count(),
    prisma.queue.count({ where: { status: "pending" } }),
    prisma.queue.count({ where: { status: "failed" } }),
    prisma.queue.count({ where: { status: "done" } }),
  ]);
  return res.success(200, { totalQueues, pendingQueues, failedQueues, processedQueues });
}

module.exports = {
  getStats, getApplicationTrend, getJobsByType, getRecentApplications,
  getUsers, updateUserRole, toggleUserActive,
  getAdminJobs, updateJobStatus,
  getAdminApplications, updateApplicationStatus,
  getChatStats, getAdminChatSessions,
  getSystemStats,
};
