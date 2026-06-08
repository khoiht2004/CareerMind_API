const router = require("express").Router();
const controller = require("@/controllers/auth.controller");
const { authRequired, validate } = require("@/middlewares");
const { registerSchema, loginSchema, changePasswordSchema, googleLoginSchema, githubLoginSchema } = require("@/validation/auth.schema");

// AUTH ROUTES
router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/google", validate(googleLoginSchema), controller.googleLogin);
router.post("/github", validate(githubLoginSchema), controller.githubLogin);
router.post("/refresh-token", controller.refreshToken);
router.post("/verify-email", controller.verifyEmail);
router.post("/resend-verification", controller.resendVerification);

// PROTECTED ROUTES
router.get("/me", authRequired, controller.getMe);
router.post("/logout", authRequired, controller.logout);
router.post("/change-password", authRequired, validate(changePasswordSchema), controller.changePassword);

module.exports = router;
