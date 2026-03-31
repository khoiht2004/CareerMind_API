const prisma = require("@/libs/prisma");

class CoverLetterModel {
  async getAllByUserId(userId) {
    return prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id, userId) {
    return prisma.coverLetter.findFirst({
      where: { id, userId },
    });
  }

  async create(userId, data) {
    return prisma.coverLetter.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
      },
    });
  }

  async update(id, userId, data) {
    // Check ownership first
    const coverLetter = await this.getById(id, userId);
    if (!coverLetter) return null;

    return prisma.coverLetter.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
      },
    });
  }

  async delete(id, userId) {
    const coverLetter = await this.getById(id, userId);
    if (!coverLetter) return false;

    await prisma.coverLetter.delete({
      where: { id },
    });
    return true;
  }
}

module.exports = new CoverLetterModel();
