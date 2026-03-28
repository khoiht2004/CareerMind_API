const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authConfig } = require("@/config");
const generateKey = require("@/utils/generateKey");
const model = require("@/models/auth.model");
const queueService = require("@/services/queue.service");

class AuthService {
  async signAccessToken(user) {
    const timeExp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 giờ
    const accessToken = jwt.sign({ sub: user.id, exp: timeExp }, authConfig.jwtSecret);
    return { accessToken, timeExp };
  }

  async verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, authConfig.jwtSecret);
  }

  async createRefreshToken(user) {
    const token = generateKey();
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7); // 7 ngày
    await model.createRefreshToken(user.id, token, expiresAt);
    return token;
  }

  generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async sendVerificationOtp(userId, email) {
    const code = this.generateOtp();
    const expAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await model.saveOtp(userId, code, expAt);
    await queueService.push("sendVerificationEmail", { email, code });
  }

  async changePassword(user, oldPassword, newPassword, confirmPassword) {
    if (!oldPassword || !newPassword || !confirmPassword)
      return ["Vui lòng điền đầy đủ các trường", null];

    const hashedPw = await model.getUserPasswordById(user.id);
    const isMatch = await bcrypt.compare(oldPassword, hashedPw);
    if (!isMatch) return ["Mật khẩu hiện tại không đúng", null];
    if (newPassword === oldPassword) return ["Mật khẩu mới phải khác mật khẩu cũ", null];
    if (newPassword !== confirmPassword) return ["Xác nhận mật khẩu không khớp", null];

    const hashed = await bcrypt.hash(newPassword, 10);
    await model.changePassword(user.id, hashed);
    await queueService.push("sendPasswordChangeEmail", { id: user.id, email: user.email }, 1);
    return [null, "Đổi mật khẩu thành công"];
  }
}

module.exports = new AuthService();
