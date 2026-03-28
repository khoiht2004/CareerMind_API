const prisma = require("@/utils/prisma");

async function cleanupExpiredTokens() {
  const result = await prisma.revokedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  console.log(`Cleanup ${result.count} expired tokens`);
}

module.exports = cleanupExpiredTokens;
