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
  const user = await AdminModel.findUserByIdAndSelectFields(id, { isActive: true });
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

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function buildPostPayload(body, authorId) {
  const title = body.title?.trim();
  const slug = body.slug?.trim() || slugify(title);

  return {
    title,
    slug: slug || undefined,
    excerpt: body.excerpt?.trim() || null,
    content: body.content,
    contentFormat: body.contentFormat || "HTML",
    coverUrl: body.coverUrl?.trim() || null,
    category: body.category?.trim() || null,
    authorName: body.authorName?.trim() || null,
    isPublished:
      body.isPublished === undefined ? true : Boolean(body.isPublished),
    ...(authorId && { authorId }),
  };
}

async function getAdminPosts(req, res) {
  const { page = 1, limit = 20, search, category, status, authorId } = req.query;
  const skip = (+page - 1) * +limit;
  const where = {
    ...(category && { category }),
    ...(authorId && { authorId }),
    ...(status && status !== "ALL" && { isPublished: status === "PUBLISHED" }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { authorName: { contains: search } },
        { author: { email: { contains: search } } },
        { author: { profile: { fullName: { contains: search } } } },
      ],
    }),
  };

  const [data, total] = await AdminModel.getPostsAndCount(where, skip, +limit);
  return res.success(200, {
    data,
    total,
    page: +page,
    limit: +limit,
    totalPages: Math.ceil(total / +limit),
  });
}

async function getAdminPostById(req, res) {
  const post = await AdminModel.findPostById(req.params.id);
  if (!post) return res.error(404, "Không tìm thấy bài viết");
  return res.success(200, post);
}

async function createAdminPost(req, res) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.error(400, "Tiêu đề và nội dung là bắt buộc");
  }

  const post = await AdminModel.createPost(
    buildPostPayload(req.body, req.body.authorId || req.auth.user.id),
  );
  return res.success(201, post);
}

async function updateAdminPost(req, res) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.error(400, "Tiêu đề và nội dung là bắt buộc");
  }

  const post = await AdminModel.findPostById(req.params.id);
  if (!post) return res.error(404, "Không tìm thấy bài viết");

  const updated = await AdminModel.updatePost(
    req.params.id,
    buildPostPayload(req.body),
  );
  return res.success(200, updated);
}

async function updateAdminPostPublished(req, res) {
  const { isPublished } = req.body;
  if (typeof isPublished !== "boolean") {
    return res.error(400, "isPublished phải là boolean");
  }

  const post = await AdminModel.findPostById(req.params.id);
  if (!post) return res.error(404, "Không tìm thấy bài viết");

  const updated = await AdminModel.updatePostPublished(req.params.id, isPublished);
  return res.success(200, updated);
}

async function deleteAdminPost(req, res) {
  const post = await AdminModel.findPostById(req.params.id);
  if (!post) return res.error(404, "Không tìm thấy bài viết");

  await AdminModel.deletePost(req.params.id);
  return res.success(200, { message: "Đã xóa bài viết thành công" });
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

async function updatePermission(req, res) {
  const { id } = req.params;
  const { name, description, group, roles = [] } = req.body;

  if (!name || !group) return res.error(400, "name và group là bắt buộc");
  if (!group.label || !group.value) return res.error(400, "group phải có label và value");

  const perm = await AdminModel.findPermissionById(id);
  if (!perm) return res.error(404, "Không tìm thấy quyền");

  const conflict = await AdminModel.findPermissionByName(name);
  if (conflict && conflict.id !== id) return res.error(409, "Tên quyền đã tồn tại");

  const validRoles = ["ADMIN", "RECRUITER", "CANDIDATE"];
  const sanitizedRoles = roles.filter((r) => validRoles.includes(r));

  const [updated] = await Promise.all([
    AdminModel.updatePermission(id, { name, description, group }),
    AdminModel.syncRolePermissions(id, sanitizedRoles),
  ]);

  return res.success(200, updated);
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
  getAdminPosts,
  getAdminPostById,
  createAdminPost,
  updateAdminPost,
  updateAdminPostPublished,
  deleteAdminPost,
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
  updatePermission,
};
