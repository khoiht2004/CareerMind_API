const router = require("express").Router();
const controller = require("@/controllers/application.controller");
const { authRequired, roleRequired } = require("@/middlewares");
const permissionRequired = require("@/middlewares/permissionRequired");

router.use(authRequired);

// Candidate
router.post("/", controller.apply);
router.get("/me", controller.getMyApplications);
router.get("/my/insights", controller.getMyInsights);
router.get("/check", controller.checkApplied);
router.delete("/:id", controller.deleteApplication);
router.get("/:id", controller.getApplicationById);

// Admin + Recruiter
router.get(
  "/",
  roleRequired("ADMIN", "RECRUITER"),
  permissionRequired("application:read:company"),
  controller.getAllApplications,
);
router.patch(
  "/:id/status",
  roleRequired("ADMIN", "RECRUITER"),
  permissionRequired("application:update:status"),
  controller.updateStatus,
);

module.exports = router;
