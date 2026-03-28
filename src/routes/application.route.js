const router = require("express").Router();
const controller = require("@/controllers/application.controller");
const authRequired = require("@/middlewares/authRequired");
const roleRequired = require("@/middlewares/roleRequired");

// Candidate
router.post("/", authRequired, roleRequired("CANDIDATE"), controller.apply);
router.get("/me", authRequired, controller.getMyApplications);
router.get("/:id", authRequired, controller.getApplicationById);

// Admin + Recruiter
router.get("/", authRequired, roleRequired("ADMIN", "RECRUITER"), controller.getAllApplications);
router.patch("/:id/status", authRequired, roleRequired("ADMIN", "RECRUITER"), controller.updateStatus);

module.exports = router;
