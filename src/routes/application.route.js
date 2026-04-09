const router = require("express").Router();
const controller = require("@/controllers/application.controller");
const { authRequired, roleRequired } = require("@/middlewares");

router.use(authRequired);

// Candidate
router.post("/", roleRequired("CANDIDATE"), controller.apply);
router.get("/me", controller.getMyApplications);
router.get("/check", controller.checkApplied);
router.delete("/:id", roleRequired("CANDIDATE"), controller.deleteApplication);
router.get("/:id", controller.getApplicationById);

// Admin + Recruiter
router.get("/", roleRequired("ADMIN", "RECRUITER"), controller.getAllApplications);
router.patch("/:id/status", roleRequired("ADMIN", "RECRUITER"), controller.updateStatus);

module.exports = router;
