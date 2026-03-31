const authModel = require("@/models/auth.model");
const revokedTokenModel = require("@/models/revokedToken.model");
const AuthService = require("@/services/auth.service");

async function authRequired(req, res, next) {
  const accessToken = req.headers?.authorization?.replace("Bearer ", "").trim();
  const payload = await AuthService.verifyAccessToken(accessToken);

  const isRevoked = await revokedTokenModel.isRevoked(accessToken);

  if (isRevoked || payload.exp < Date.now() / 1000)
    return res.error(401, "Bạn không có quyền truy cập");

  const user = await authModel.getUserById(payload.sub);
  if (!user) return res.error(401, "Không tìm thấy người dùng");

  req.auth = {
    user,
    accessToken,
    payload,
  };

  next();
}

module.exports = authRequired;
