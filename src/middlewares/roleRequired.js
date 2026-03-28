/**
 * Middleware kiểm tra quyền truy cập theo role
 * @param {...string} roles - Danh sách roles được phép (CANDIDATE, RECRUITER, ADMIN)
 */
function roleRequired(...roles) {
  return (req, res, next) => {
    const { user } = req.auth;
    if (!roles.includes(user.role)) {
      return res.error(403, "Bạn không có quyền truy cập");
    }
    next();
  };
}

module.exports = roleRequired;
