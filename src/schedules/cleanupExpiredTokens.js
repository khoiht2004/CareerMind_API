const prisma = require("@/libs/prisma");
const { getIO } = require("@/libs/socket");

async function cleanupExpiredTokens() {
  const result = await prisma.revokedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  console.log(`Cleanup ${result.count} expired tokens`);

  try {
    const io = getIO();
    io.to("role:ADMIN").emit("notification:admin_new", {
      title: "Quét dọn hệ thống",
      content: `Đã dọn dẹp ${result.count} tokens hết hạn thành công.`,
      type: "SYSTEM_LOG",
      createdAt: new Date(),
    });
  } catch (error) {
    // Socket chưa init hoặc lỗi khác
    console.log("Lỗi khi gửi thông báo realtime:", error);
  }
}

module.exports = cleanupExpiredTokens;
