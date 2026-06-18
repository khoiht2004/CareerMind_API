const bcrypt = require("bcrypt");
const model = require("@/models/auth.model");
const AuthService = require("@/services/auth.service");
const {
  getUserPermissions,
  groupPermissions,
} = require("@/utils/permission.util");
const { google } = require("googleapis");
const { authConfig } = require("@/config");
const crypto = require("crypto");

async function register(req, res) {
  const { name, email, password } = req.body;

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

  if (!user.password) {
    return res.error(
      401,
      "Tài khoản của bạn được đăng ký bằng Google/GitHub. Vui lòng đăng nhập bằng dịch vụ tương ứng hoặc dùng Quên mật khẩu để tạo mật khẩu.",
    );
  }

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
    companyId: user.companyId,
    canCompanyManage: user.canCompanyManage,
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
  if (user.role === "ADMIN") {
    return res.success(200, {
      ...user,
      permissions: { system: ["*"] },
      permissionList: ["*"],
    });
  }
  const permSet = await getUserPermissions(user.id, user.role);
  return res.success(200, {
    ...user,
    permissions: groupPermissions(permSet),
    // permissionList: [...permSet],
  });
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

async function googleLogin(req, res) {
  const { code, redirectUri } = req.body;
  if (!code || !redirectUri) {
    return res.error(400, "Mã code và redirectUri là bắt buộc");
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      authConfig.googleClientId,
      authConfig.googleClientSecret,
      redirectUri,
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: authConfig.googleClientId,
    });
    const payload = ticket.getPayload();
    const { sub: providerId, email, name, picture: avatarUrl } = payload;

    if (!email) {
      return res.error(400, "Không thể lấy email từ tài khoản Google");
    }

    const user = await model.findOrCreateSocialUser({
      email,
      name,
      avatarUrl,
      provider: "google",
      providerId,
    });

    const { accessToken, timeExp } = await AuthService.signAccessToken(user);
    const refreshToken = await AuthService.createRefreshToken(user);

    return res.success(200, {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
      expiredAt: timeExp,
      companyId: user.companyId,
      canCompanyManage: user.canCompanyManage,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.error(500, "Đăng nhập bằng Google thất bại: " + error.message);
  }
}

async function githubLogin(req, res) {
  const { code, redirectUri } = req.body;
  if (!code) {
    return res.error(400, "Mã code là bắt buộc");
  }

  try {
    // 1. Đổi code lấy Access Token từ GitHub
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: authConfig.githubClientId,
          client_secret: authConfig.githubClientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      },
    );

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res.error(
        400,
        `GitHub OAuth Error: ${tokenData.error_description || tokenData.error}`,
      );
    }

    const githubAccessToken = tokenData.access_token;

    // 2. Lấy thông tin profile người dùng từ GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        "User-Agent": "Smart-Recruit-Assistant",
      },
    });
    const userData = await userResponse.json();
    if (!userData.id) {
      return res.error(400, "Không thể lấy thông tin người dùng từ GitHub");
    }

    const providerId = String(userData.id);
    const name = userData.name || userData.login;
    const avatarUrl = userData.avatar_url;
    let email = userData.email;

    // 3. Nếu email không được public, gọi API lấy danh sách email để tìm email chính
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          "User-Agent": "Smart-Recruit-Assistant",
        },
      });
      const emailsData = await emailsResponse.json();
      if (Array.isArray(emailsData)) {
        const primaryEmailObj =
          emailsData.find((e) => e.primary && e.verified) ||
          emailsData.find((e) => e.primary) ||
          emailsData[0];
        email = primaryEmailObj?.email;
      }
    }

    if (!email) {
      return res.error(
        400,
        "Không thể lấy email từ tài khoản GitHub. Hãy đảm bảo email được xác thực.",
      );
    }

    const user = await model.findOrCreateSocialUser({
      email,
      name,
      avatarUrl,
      provider: "github",
      providerId,
    });

    const { accessToken, timeExp } = await AuthService.signAccessToken(user);
    const refreshToken = await AuthService.createRefreshToken(user);

    return res.success(200, {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
      expiredAt: timeExp,
      companyId: user.companyId,
      canCompanyManage: user.canCompanyManage,
    });
  } catch (error) {
    console.error("GitHub login error:", error);
    return res.error(500, "Đăng nhập bằng GitHub thất bại: " + error.message);
  }
}

function generateRandomPassword() {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let pwd = "";
  pwd += letters[crypto.randomInt(0, letters.length)];
  pwd += numbers[crypto.randomInt(0, numbers.length)];
  const all = letters + numbers;
  for (let i = 0; i < 8; i++) {
    pwd += all[crypto.randomInt(0, all.length)];
  }
  return pwd
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await model.findByEmail(email);

  if (!user) {
    return res.success(200, "Nếu email hợp lệ, mật khẩu mới đã được gửi.");
  }

  const newPassword = generateRandomPassword();
  const hashed = await bcrypt.hash(newPassword, 10);
  await model.changePassword(user.id, hashed);

  await AuthService.sendForgotPasswordEmail(user.email, newPassword);
  return res.success(200, "Nếu email hợp lệ, mật khẩu mới đã được gửi.");
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
  googleLogin,
  githubLogin,
  forgotPassword,
};
