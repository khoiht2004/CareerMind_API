const prisma = require("@/libs/prisma");

async function getUserPermissions(userId, role) {
  const [rolePerms, userPerms] = await Promise.all([
    prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    }),
    prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    }),
  ]);

  const perms = new Set(rolePerms.map((rp) => rp.permission.name));

  userPerms.forEach((up) => {
    if (up.isGranted) perms.add(up.permission.name);
    else perms.delete(up.permission.name);
  });

  return perms;
}

module.exports = { getUserPermissions };
