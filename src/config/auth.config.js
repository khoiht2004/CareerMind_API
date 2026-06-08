const auth = {
  jwtSecret: process.env.AUTH_JWT_SECRET,
  verifyJwtSecret: process.env.AUTH_VERIFICATION_JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
};

module.exports = auth;
