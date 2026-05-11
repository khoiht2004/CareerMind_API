const prisma = require("@/libs/prisma");

class AdminModel {
  static async getDashboardStats() {
    return Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.job.count({ where: { status: "PUBLISHED" } }),
    ]);
  }

  static async getApplicationCountByDateRange(start, end) {
    return prisma.application.count({
      where: { createdAt: { gte: start, lt: end } },
    });
  }

  static async getJobCountByType(type) {
    return prisma.job.count({ where: { type } });
  }

  static async getRecentApplications(limit) {
    return prisma.application.findMany({
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true, avatarUrl: true } },
          },
        },
        job: { select: { id: true, title: true, company: { select: { id: true, name: true } } } },
      },
    });
  }

  static async getUsersAndCount(where, skip, limit) {
    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          profile: { select: { fullName: true, avatarUrl: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
  }

  static async updateUserRole(id, role) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }

  static async findUserById(id, selectFields) {
    return prisma.user.findUnique({
      where: { id },
      select: selectFields,
    });
  }

  static async toggleUserActive(id, isActive) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });
  }

  static async getJobsAndCount(where, skip, limit) {
    return Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          company: { select: { id: true, name: true } },
          location: true,
          type: true,
          status: true,
          isHot: true,
          deadline: true,
          slots: true,
          createdAt: true,
          postedBy: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);
  }

  static async findJobById(id) {
    return prisma.job.findUnique({ where: { id } });
  }

  static async updateJobStatus(id, status) {
    return prisma.job.update({
      where: { id },
      data: { status },
      select: { id: true, title: true, status: true },
    });
  }

  static async getApplicationsAndCount(where, skip, limit) {
    return Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          note: true,
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true, avatarUrl: true } },
            },
          },
          job: { select: { id: true, title: true, company: { select: { id: true, name: true } } } },
        },
      }),
      prisma.application.count({ where }),
    ]);
  }

  static async findApplicationById(id) {
    return prisma.application.findUnique({ where: { id } });
  }

  static async updateApplicationStatus(id, data) {
    return prisma.application.update({
      where: { id },
      data,
      select: { id: true, status: true, note: true },
    });
  }

  static async getChatStats(sevenDaysAgo) {
    return Promise.all([
      prisma.chatSession.count(),
      prisma.chatMessage.count(),
      prisma.chatSession.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
    ]);
  }

  static async getChatSessionsAndCount(skip, limit) {
    return Promise.all([
      prisma.chatSession.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
          _count: { select: { messages: true } },
        },
      }),
      prisma.chatSession.count(),
    ]);
  }

  static async getSystemStats() {
    return Promise.all([
      prisma.queue.count(),
      prisma.queue.count({ where: { status: "pending" } }),
      prisma.queue.count({ where: { status: "failed" } }),
      prisma.queue.count({ where: { status: "done" } }),
    ]);
  }

  // ─── Admin Company ─────────────────────────────────────────────────────────────
  static async getCompaniesAndCount(where, skip, limit) {
    return Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          logoUrl: true,
          isVerified: true,
          isActive: true,
          totalJobs: true,
          totalApplications: true,
          createdAt: true,
          _count: { select: { user: true, jobs: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);
  }

  static async createCompany(data) {
    return prisma.company.create({
      data,
    });
  }

  static async findCompanyById(id) {
    return prisma.company.findUnique({ where: { id } });
  }

  static async verifyCompany(id) {
    return prisma.company.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  static async toggleCompanyActive(id, isActive) {
    return prisma.company.update({
      where: { id },
      data: { isActive },
    });
  }

  // ─── Permission Management ───────────────────────────────────────────────────

  static async getAllPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ group: "asc" }, { name: "asc" }],
      include: { rolePermissions: { select: { role: true } } },
    });
  }

  static async getQueuesAndCount(where, skip, limit) {
    return Promise.all([
      prisma.queue.findMany({ where, skip, take: limit, orderBy: { id: "desc" } }),
      prisma.queue.count({ where }),
    ]);
  }

  static async findUserById(id) {
    return prisma.user.findUnique({ where: { id }, select: { id: true, role: true, email: true } });
  }

  static async getRolePermissions(role) {
    return prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    });
  }

  static async getUserPermissions(userId) {
    return prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
  }

  static async upsertUserPermission(userId, permissionId, isGranted) {
    return prisma.userPermission.upsert({
      where: { userId_permissionId: { userId, permissionId } },
      update: { isGranted },
      create: { userId, permissionId, isGranted },
    });
  }

  static async createPermission(data) {
    return prisma.permission.create({ data });
  }

  static async findPermissionById(id) {
    return prisma.permission.findUnique({ where: { id } });
  }

  static async findPermissionByName(name) {
    return prisma.permission.findUnique({ where: { name } });
  }

  static async deletePermission(id) {
    return prisma.permission.delete({ where: { id } });
  }
}

module.exports = AdminModel;
