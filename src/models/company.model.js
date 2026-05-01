const prisma = require("@/libs/prisma");

const COMPANY_PUBLIC_SELECT = {
      id: true,
      name: true,
      email: true,
      phone: true,
      description: true,
      subDescription: true,
      mapUrl: true,
      address: true,
      logoUrl: true,
      coverImageUrl: true,
      socialLinks: true,
      totalJobs: true,
      isVerified: true,
};

// ==========================================
// PUBLIC
// ==========================================
const getCompanies = async ({ page = 1, limit = 10, search }) => {
      const skip = (+page - 1) * +limit;
      const where = {
            ...(search && {
                  OR: [
                        { name: { contains: search } },
                        { description: { contains: search } },
                        { address: { contains: search } },
                        { email: { contains: search } },
                        { phone: { contains: search } },
                  ],
            }),
      };
      const [data, total] = await prisma.$transaction([
            prisma.company.findMany({
                  where,
                  select: COMPANY_PUBLIC_SELECT,
                  skip,
                  take: +limit,
            }),
            prisma.company.count({ where }),
      ]);
      return { data, total };
};

const getCompanyById = async (id) => {
      return prisma.company.findUnique({
            where: { id },
            select: {
                  ...COMPANY_PUBLIC_SELECT,
                  jobs: {
                        orderBy: { createdAt: "desc" },
                        where: { status: "PUBLISHED" },
                        select: {
                              id: true,
                              title: true,
                              type: true,
                              salary: true,
                              location: true,
                              createdAt: true,
                        },
                  },
            },
      });
};

// ==========================================
// RECRUITER / COMPANY MANAGER
// ==========================================
const getMyJobs = async (companyId, { page = 1, limit = 10, status, search }) => {
      const where = {
            companyId,
            ...(status && status !== "ALL" && { status }),
            ...(search && {
                  OR: [{ title: { contains: search } }],
            }),
      };
      const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                  where,
                  select: {
                        id: true,
                        title: true,
                        location: true,
                        type: true,
                        status: true,
                        isHot: true,
                        deadline: true,
                        slots: true,
                        salary: true,
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
                  orderBy: { createdAt: "desc" },
                  skip: (+page - 1) * +limit,
                  take: +limit,
            }),
            prisma.job.count({ where }),
      ]);
      return { jobs, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
};

const getMyApplications = async (companyId, { page = 1, limit = 10, status, jobId }) => {
      const where = {
            companyId,
            ...(status && status !== "ALL" && { status }),
            ...(jobId && { jobId }),
      };
      const [applications, total] = await Promise.all([
            prisma.application.findMany({
                  where,
                  select: {
                        id: true,
                        status: true,
                        createdAt: true,
                        note: true,
                        job: { select: { id: true, title: true } },
                        user: {
                              select: {
                                    id: true,
                                    email: true,
                                    profile: { select: { fullName: true, avatarUrl: true } },
                              },
                        },
                  },
                  orderBy: { createdAt: "desc" },
                  skip: (+page - 1) * +limit,
                  take: +limit,
            }),
            prisma.application.count({ where }),
      ]);
      return { applications, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
};

const updateCompany = async (id, data) => {
      const { name, email, phone, description, address, logoUrl, coverImageUrl, socialLinks } = data;
      return prisma.company.update({
            where: { id },
            data: {
                  ...(name !== undefined && { name }),
                  ...(email !== undefined && { email }),
                  ...(phone !== undefined && { phone }),
                  ...(description !== undefined && { description }),
                  ...(address !== undefined && { address }),
                  ...(logoUrl !== undefined && { logoUrl }),
                  ...(coverImageUrl !== undefined && { coverImageUrl }),
                  ...(socialLinks !== undefined && { socialLinks }),
            },
            select: COMPANY_PUBLIC_SELECT,
      });
};

const getCompanyStats = async (id) => {
      const [totalJobs, jobsByStatus, totalApplications, appsByStatus] = await Promise.all([
            prisma.job.count({ where: { companyId: id } }),
            prisma.job.groupBy({
                  by: ["status"],
                  where: { companyId: id },
                  _count: { _all: true },
            }),
            prisma.application.count({ where: { companyId: id } }),
            prisma.application.groupBy({
                  by: ["status"],
                  where: { companyId: id },
                  _count: { _all: true },
            }),
      ]);

      const toMap = (arr) =>
            arr.reduce((acc, item) => ({ ...acc, [item.status]: item._count._all }), {});

      return {
            totalJobs,
            totalApplications,
            jobsByStatus: toMap(jobsByStatus),
            appsByStatus: toMap(appsByStatus),
      };
};

const getCompanyPersonnel = async (id) => {
      return prisma.user.findMany({
            where: { companyId: id },
            select: {
                  id: true,
                  email: true,
                  role: true,
                  isActive: true,
                  createdAt: true,
                  profile: { select: { fullName: true, avatarUrl: true, phone: true } },
            },
      });
};

// ==========================================
// ADMIN
// ==========================================
const createCompany = async (data) => {
      return prisma.company.create({
            data,
            select: COMPANY_PUBLIC_SELECT,
      });
};

const updateCompanyStatus = async (id, { isVerified, isActive }) => {
      return prisma.company.update({
            where: { id },
            data: {
                  ...(isVerified !== undefined && { isVerified }),
                  ...(isActive !== undefined && { isActive }),
            },
            select: COMPANY_PUBLIC_SELECT,
      });
};

module.exports = {
      getCompanies,
      getCompanyById,
      getMyJobs,
      getMyApplications,
      updateCompany,
      getCompanyStats,
      getCompanyPersonnel,
      createCompany,
      updateCompanyStatus,
};
