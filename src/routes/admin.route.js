const router = require("express").Router();
const controller = require("@/controllers/admin.controller");
const authRequired = require("@/middlewares/authRequired");
const roleRequired = require("@/middlewares/roleRequired");

router.use(authRequired, roleRequired("ADMIN"));

router.get("/stats", controller.getStats);
router.get("/stats/applications-trend", controller.getApplicationTrend);
router.get("/stats/jobs-by-type", controller.getJobsByType);
router.get("/stats/recent-applications", controller.getRecentApplications);
router.get("/users", controller.getUsers);
router.patch("/users/:id/role", controller.updateUserRole);
router.patch("/users/:id/toggle-active", controller.toggleUserActive);

router.get("/jobs", controller.getAdminJobs);
router.patch("/jobs/:id/status", controller.updateJobStatus);

router.get("/applications", controller.getAdminApplications);
router.patch("/applications/:id/status", controller.updateApplicationStatus);

router.get("/chat-stats", controller.getChatStats);
router.get("/chat-sessions", controller.getAdminChatSessions);

router.get("/system-stats", controller.getSystemStats);

module.exports = router;
