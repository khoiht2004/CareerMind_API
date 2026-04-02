const bcrypt = require("bcrypt");
const model = require("@/models/auth.model");
const AuthService = require("@/services/auth.service");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.error(400, "Email và mật khẩu là bắt buộc");
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
    return res.error(400, "Email không hợp lệ");
  if (password.length < 6)
    return res.error(400, "Mật khẩu phải ít nhất 6 ký tự");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await model.createUser(
    email,
    hashedPassword,
    name?.trim() || null,
  );
  if (!user) return res.error(409, "Email đã tồn tại");

  await AuthService.sendVerificationOtp(user.id, user.email);

  return res.success(201, {
    message: "Đăng ký thành công, vui lòng xác thực email",
    id: user.id,
    email: user.email,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.error(400, "Email và mật khẩu là bắt buộc");

  const user = await model.findByEmail(email);
  if (!user) return res.error(401, "Email hoặc mật khẩu không đúng");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.error(401, "Email hoặc mật khẩu không đúng");

  if (!user.isVerified) return res.error(403, "Tài khoản chưa được xác thực");

  const { accessToken, timeExp } = await AuthService.signAccessToken(user);
  const refreshToken = await AuthService.createRefreshToken(user);

  return res.success(200, {
    id: user.id,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
    expiredAt: timeExp,
  });
}

async function verifyEmail(req, res) {
  const { email, code } = req.body;
  if (!email || !code)
    return res.error(400, "Email và mã xác thực là bắt buộc");

  const error = await model.verifyOtp(email, code);
  if (error) return res.error(400, error);

  return res.success(200, "Xác thực email thành công");
}

async function resendVerification(req, res) {
  const { email } = req.body;
  if (!email) return res.error(400, "Email là bắt buộc");

  const user = await model.findByEmail(email);
  if (!user) return res.error(404, "Không tìm thấy tài khoản");
  if (user.isVerified) return res.error(400, "Email đã được xác thực");

  await AuthService.sendVerificationOtp(user.id, user.email);
  return res.success(200, "Đã gửi lại mã xác thực");
}

async function getMe(req, res) {
  const { user } = req.auth;
  return res.success(200, user);
}

async function logout(req, res) {
  const { accessToken, payload } = req.auth;
  const expiresAt = new Date(payload.exp * 1000);
  await model.revokeToken(accessToken, expiresAt, req.auth.user.id);
  return res.success(200, null);
}

async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;
  if (!token) return res.error(400, "Refresh token là bắt buộc");

  const stored = await model.getRefreshToken(token);
  if (!stored || stored.expiresAt < new Date())
    return res.error(401, "Refresh token không hợp lệ hoặc đã hết hạn");

  await model.deleteRefreshToken(token);

  const user = await model.getUserById(stored.userId);
  if (!user) return res.error(401, "Không tìm thấy người dùng");

  const { accessToken, timeExp } = await AuthService.signAccessToken(user);
  const newRefreshToken = await AuthService.createRefreshToken(user);

  return res.success(200, {
    accessToken,
    refreshToken: newRefreshToken,
    expiredAt: timeExp,
  });
}

async function changePassword(req, res) {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { user } = req.auth;

  const [error, data] = await AuthService.changePassword(
    user,
    oldPassword,
    newPassword,
    confirmPassword,
  );
  if (error) return res.error(400, error);

  return res.success(200, data);
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  logout,
  refreshToken,
  changePassword,
};
