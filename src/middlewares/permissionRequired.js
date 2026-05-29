const { getUserPermissions } = require("@/utils/permission.util");

// Hỗ trợ nhiều permission với OR logic: user chỉ cần có ít nhất 1 trong số các permission được truyền vào
function permissionRequired(...requiredPermissions) {
  return async (req, res, next) => {
    try {
      const { user } = req.auth;
      if (user.role === "ADMIN") return next();

      const userPerms = await getUserPermissions(user.id, user.role);
      const hasAny = requiredPermissions.some((p) => userPerms.has(p));

      if (!hasAny) {
        return res.error(403, "Bạn không có quyền thực hiện hành động này");
      }

      req.auth.permissions = userPerms;
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = permissionRequired;
