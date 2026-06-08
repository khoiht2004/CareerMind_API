const prisma = require("@/libs/prisma");

async function cleanupQueueTasks() {
  const targets = await prisma.queue.findMany({
    where: {
      status: { in: ["failed", "completed"] },
    },
    orderBy: { createdAt: "asc" },
    take: 10,
    select: { id: true },
  });

  if (targets.length === 0) {
    console.log("No queue tasks to cleanup");
    return;
  }

  const result = await prisma.queue.deleteMany({
    where: {
      id: { in: targets.map((t) => t.id) },
    },
  });

  console.log(`Cleanup ${result.count} queue tasks (failed/completed)`);

  try {
    const { getIO } = require("@/libs/socket");
    const io = getIO();
    io.to("role:ADMIN").emit("notification:admin_new", {
      title: "Dọn dẹp Queue",
      content: `Đã dọn dẹp ${result.count} tasks hoàn thành/thất bại khỏi hàng đợi.`,
      type: "QUEUE_LOG",
      createdAt: new Date(),
    });
  } catch (error) {
    // Socket chưa init hoặc lỗi khác
  }
}

module.exports = cleanupQueueTasks;
