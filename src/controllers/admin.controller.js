const AdminModel = require("@/models/admin.model");

async function getStats(req, res) {
  const [totalUsers, totalJobs, totalApplications, activeJobs] =
    await AdminModel.getDashboardStats();

  return res.success(200, {
    totalUsers,
    totalJobs,
    totalApplications,
    activeJobs,
  });
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

    const count = await AdminModel.getApplicationCountByDateRange(start, end);
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
      count: await AdminModel.getJobCountByType(type),
    })),
  );
  return res.success(200, results);
}

async function getRecentApplications(req, res) {
  const { limit = 10 } = req.query;
  const applications = await AdminModel.getRecentApplications(limit);
  return res.success(200, applications);
}

async function getUsers(req, res) {
  const { page = 1, limit = 20, search, role } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(search && {
      OR: [
        { email: { contains: search } },
        { profile: { fullName: { contains: search } } },
      ],
    }),
    ...(role && { role }),
  };

  const [data, total] = await AdminModel.getUsersAndCount(where, skip, +limit);

  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ["CANDIDATE", "RECRUITER", "ADMIN"];
  if (!validRoles.includes(role)) return res.error(400, "Role không hợp lệ");

  const user = await AdminModel.updateUserRole(id, role);
  return res.success(200, user);
}

async function toggleUserActive(req, res) {
  const { id } = req.params;
  const user = await AdminModel.findUserById(id, { isActive: true });
  if (!user) return res.error(404, "Không tìm thấy người dùng");

  const updated = await AdminModel.toggleUserActive(id, !user.isActive);
  return res.success(200, updated);
}

// ─── Admin Jobs ───────────────────────────────────────────────────────────────

async function getAdminJobs(req, res) {
  const { page = 1, limit = 20, search, type, status } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(search && {
      OR: [
        { title: { contains: search } },
        { company: { name: { contains: search } } },
      ],
    }),
    ...(type && { type }),
    ...(status && { status }),
  };

  const [data, total] = await AdminModel.getJobsAndCount(where, skip, +limit);

  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

async function updateJobStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const VALID = ["DRAFT", "PUBLISHED", "CLOSED"];
  if (!status || !VALID.includes(status))
    return res.error(400, "Trạng thái không hợp lệ");

  const job = await AdminModel.findJobById(id);
  if (!job) return res.error(404, "Không tìm thấy công việc");

  const updated = await AdminModel.updateJobStatus(id, status);
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

  const [data, total] = await AdminModel.getApplicationsAndCount(where, skip, +limit);

  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status, note } = req.body;
  const VALID = ["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"];
  if (!status || !VALID.includes(status))
    return res.error(400, "Trạng thái không hợp lệ");

  const app = await AdminModel.findApplicationById(id);
  if (!app) return res.error(404, "Không tìm thấy đơn ứng tuyển");

  const updated = await AdminModel.updateApplicationStatus(id, { status, ...(note && { note }) });
  return res.success(200, updated);
}

// ─── Admin Chat ───────────────────────────────────────────────────────────────

async function getChatStats(req, res) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalSessions, totalMessages, recentSessions] = await AdminModel.getChatStats(sevenDaysAgo);
  return res.success(200, { totalSessions, totalMessages, recentSessions });
}

async function getAdminChatSessions(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const skip = (+page - 1) * +limit;

  const [data, total] = await AdminModel.getChatSessionsAndCount(skip, +limit);

  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

// ─── Admin System ─────────────────────────────────────────────────────────────

async function getSystemStats(req, res) {
  const [totalQueues, pendingQueues, failedQueues, processedQueues] = await AdminModel.getSystemStats();
  return res.success(200, {
    totalQueues,
    pendingQueues,
    failedQueues,
    processedQueues,
  });
}

async function getAdminQueues(req, res) {
  const { page = 1, limit = 20, status, type } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(status && status !== "ALL" && { status }),
    ...(type && { type }),
  };
  const [data, total] = await AdminModel.getQueuesAndCount(where, skip, +limit);
  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

// ─── Admin Company ─────────────────────────────────────────────────────────────

// [GET] Lấy danh sách công ty cho Admin
async function getAdminCompanies(req, res) {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } },
      ],
    }),
  };
  const [data, total] = await AdminModel.getCompaniesAndCount(where, skip, +limit);
  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

// [POST] Admin tạo một công ty mới (Hoặc có thể lúc recruiter signup thì tự tạo)
async function createCompany(req, res) {
  const { name, email, description, logoUrl, phone, address, coverImageUrl, socialLinks } = req.body;
  if (!name || !email || !description || !logoUrl) {
    return res.error(400, "Thiếu thông tin bắt buộc: name, email, description, logoUrl");
  }

  const company = await AdminModel.createCompany({
    name, email, description, logoUrl, phone, address, coverImageUrl, socialLinks
  });
  res.success(201, company);
}

// [PUT] Duyệt công ty (Xác thực chống spam)
async function verifyCompany(req, res) {
  const { id } = req.params;
  const company = await AdminModel.findCompanyById(id);
  if (!company) return res.error(404, "Không tìm thấy công ty");

  const updated = await AdminModel.verifyCompany(id);
  res.success(200, updated);
}

// [PUT] Khóa/Mở khóa công ty
async function toggleCompanyActive(req, res) {
  const { id } = req.params;
  const company = await AdminModel.findCompanyById(id);
  if (!company) return res.error(404, "Không tìm thấy công ty");

  const updated = await AdminModel.toggleCompanyActive(id, !company.isActive);
  res.success(200, updated);
}

// ─── Admin Permission Management ──────────────────────────────────────────────

async function getAllPermissions(req, res) {
  const permissions = await AdminModel.getAllPermissions();
  return res.success(200, permissions);
}

async function getUserPermissionDetails(req, res) {
  const { userId } = req.params;
  const user = await AdminModel.findUserById(userId);
  if (!user) return res.error(404, "Không tìm thấy người dùng");

  const [rolePerms, userPerms] = await Promise.all([
    AdminModel.getRolePermissions(user.role),
    AdminModel.getUserPermissions(userId),
  ]);
  return res.success(200, { rolePerms, userPerms });
}

async function updateUserPermissions(req, res) {
  const { userId } = req.params;
  const { permissionId, isGranted } = req.body;
  if (!permissionId || isGranted === undefined) {
    return res.error(400, "permissionId và isGranted là bắt buộc");
  }

  const user = await AdminModel.findUserById(userId);
  if (!user) return res.error(404, "Không tìm thấy người dùng");

  await AdminModel.upsertUserPermission(userId, permissionId, isGranted);
  return res.success(200, { message: "Cập nhật quyền thành công" });
}

async function createPermission(req, res) {
  const { name, description, group } = req.body;
  if (!name || !group) return res.error(400, "name và group là bắt buộc");
  const existing = await AdminModel.findPermissionByName(name);
  if (existing) return res.error(409, "Tên quyền đã tồn tại");
  const permission = await AdminModel.createPermission({ name, description, group });
  return res.success(201, permission);
}

async function deletePermission(req, res) {
  const { id } = req.params;
  const perm = await AdminModel.findPermissionById(id);
  if (!perm) return res.error(404, "Không tìm thấy quyền");
  await AdminModel.deletePermission(id);
  return res.success(200, { message: "Đã xóa quyền thành công" });
}

module.exports = {
  getStats,
  getApplicationTrend,
  getJobsByType,
  getRecentApplications,
  getUsers,
  updateUserRole,
  toggleUserActive,
  getAdminJobs,
  updateJobStatus,
  getAdminApplications,
  updateApplicationStatus,
  getChatStats,
  getAdminChatSessions,
  getSystemStats,
  getAdminQueues,
  getAdminCompanies,
  createCompany,
  verifyCompany,
  toggleCompanyActive,
  getAllPermissions,
  getUserPermissionDetails,
  updateUserPermissions,
  createPermission,
  deletePermission,
};
