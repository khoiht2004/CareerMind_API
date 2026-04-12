const prisma = require('@/libs/prisma');

const CV_SELECT = {
  id: true,
  name: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
};

const createCv = async (userId, data) => {
  // If the new CV is set as default, unset others first
  if (data.isDefault) {
    await prisma.cv.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.cv.create({
    data: { userId, ...data },
    select: CV_SELECT,
  });
};

const getMyCvs = async (userId) => {
  return prisma.cv.findMany({
    where: { userId },
    select: CV_SELECT,
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
};

const getCvById = async (id) => {
  return prisma.cv.findUnique({
    where: { id },
    select: { ...CV_SELECT, userId: true },
  });
};

const deleteCv = async (id, userId) => {
  const cv = await prisma.cv.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!cv || cv.userId !== userId) return null;
  return prisma.cv.delete({ where: { id } });
};

const setDefault = async (id, userId) => {
  const cv = await prisma.cv.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!cv || cv.userId !== userId) return null;

  // Unset current default, then set new one
  await prisma.cv.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });
  return prisma.cv.update({
    where: { id },
    data: { isDefault: true },
    select: CV_SELECT,
  });
};

module.exports = { createCv, getMyCvs, getCvById, deleteCv, setDefault };
