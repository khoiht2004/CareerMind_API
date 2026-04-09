const prisma = require("@/libs/prisma");

const PROFILE_SELECT = {
  id: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  bio: true,
  address: true,
  skills: true,
  updatedAt: true,
  user: { select: { id: true, email: true, role: true, createdAt: true } },
};

const getProfile = async (userId) => {
  return prisma.profile.findUnique({
    where: { userId },
    select: PROFILE_SELECT,
  });
};

const upsertProfile = async (userId, data) => {
  const { skills, ...rest } = data;
  return prisma.profile.upsert({
    where: { userId },
    update: {
      ...rest,
      ...(skills !== undefined && { skills: JSON.stringify(skills) }),
    },
    create: {
      userId,
      ...rest,
      ...(skills !== undefined && { skills: JSON.stringify(skills) }),
    },
    select: PROFILE_SELECT,
  });
};

const updateAvatar = async (userId, avatarUrl) => {
  return prisma.profile.update({
    where: { userId },
    data: { avatarUrl },
    select: PROFILE_SELECT,
  });
};

const deleteAvatar = async (userId) => {
  return prisma.$transaction(async (tx) => {
    const current = await tx.profile.findUnique({
      where: { userId },
      select: { avatarUrl: true },
    });
    const updated = await tx.profile.update({
      where: { userId },
      data: { avatarUrl: null },
      select: PROFILE_SELECT,
    });
    return { prevAvatarUrl: current?.avatarUrl ?? null, ...updated };
  });
};

module.exports = { getProfile, upsertProfile, updateAvatar, deleteAvatar };
