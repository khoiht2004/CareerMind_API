const prisma = require("@/libs/prisma");

class QueueService {
  async push(type, payload, isPriority = 0) {
    return await prisma.queue.create({
      data: { type, payload: JSON.stringify(payload), isPriority },
    });
  }

  async getPendingJobs() {
    return await prisma.queue.findFirst({
      where: { status: "pending" },
      orderBy: [{ isPriority: "desc" }, { id: "asc" }],
    });
  }

  async updateStatus(id, status, info = null) {
    return await prisma.queue.update({
      where: { id },
      data: { status, info: info ? String(info) : null },
    });
  }
}

module.exports = new QueueService();
