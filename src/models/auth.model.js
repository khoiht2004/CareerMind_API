const prisma = require("@/libs/prisma");

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      isVerified: true,
      role: true,
    },
  });
};

const createUser = async (email, password, name) => {
  const exists = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (exists) return null;

  return prisma.user.create({
    data: {
      email,
      password,
      profile: { create: { fullName: name } },
    },
    select: { id: true, email: true },
  });
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
      profile: {
        select: {
          fullName: true,
          phone: true,
          avatarUrl: true,
          bio: true,
          address: true,
        },
      },
    },
  });
  if (!user) return null;

  const { profile, ...rest } = user;
  return {
    ...rest,
    name: profile?.fullName ?? null,
    phone: profile?.phone ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    bio: profile?.bio ?? null,
  };
};

const getUserPasswordById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });
  return user?.password ?? null;
};

const saveOtp = async (userId, code, expAt) => {
  return prisma.user.update({
    where: { id: userId },
    data: { verificationCode: code, verificationCodeExpAt: expAt },
  });
};

const verifyOtp = async (email, code) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isVerified: true,
      verificationCode: true,
      verificationCodeExpAt: true,
    },
  });
  if (!user) return "Không tìm thấy tài khoản";
  if (user.isVerified) return "Email đã được xác thực";
  if (user.verificationCode !== code) return "Mã xác thực không đúng";
  if (!user.verificationCodeExpAt || user.verificationCodeExpAt < new Date())
    return "Mã xác thực đã hết hạn";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationCode: null,
      verificationCodeExpAt: null,
    },
  });
  return null;
};

const createRefreshToken = async (userId, token, expiresAt) => {
  return prisma.refreshToken.create({ data: { userId, token, expiresAt } });
};

const getRefreshToken = async (token) => {
  return prisma.refreshToken.findUnique({
    where: { token },
    select: { userId: true, expiresAt: true },
  });
};

const deleteRefreshToken = async (token) => {
  return prisma.refreshToken.deleteMany({ where: { token } });
};

const revokeToken = async (token, expiresAt, userId) => {
  return prisma.revokedToken.create({
    data: { token, expiresAt, userId: userId ?? null },
  });
};

const changePassword = async (id, password) => {
  return prisma.user.update({ where: { id }, data: { password } });
};

module.exports = {
  findByEmail,
  createUser,
  getUserById,
  getUserPasswordById,
  saveOtp,
  verifyOtp,
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  revokeToken,
  changePassword,
};
