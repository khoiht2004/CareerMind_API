const prisma = require("@/utils/prisma");

const PROFILE_SELECT = {
  id: true, fullName: true, phone: true, avatarUrl: true,
  bio: true, address: true, skills: true, updatedAt: true,
  user: { select: { id: true, email: true, role: true, createdAt: true } },
};

const getProfile = async (userId) => {
  return prisma.profile.findUnique({ where: { userId }, select: PROFILE_SELECT });
};

const upsertProfile = async (userId, data) => {
  const { skills, ...rest } = data;
  return prisma.profile.upsert({
    where: { userId },
    update: { ...rest, ...(skills !== undefined && { skills: JSON.stringify(skills) }) },
    create: { userId, ...rest, ...(skills !== undefined && { skills: JSON.stringify(skills) }) },
    select: PROFILE_SELECT,
  });
};

module.exports = { getProfile, upsertProfile };
