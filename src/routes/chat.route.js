const router = require("express").Router();
const controller = require("@/controllers/chat.controller");
const { authRequired, roleRequired } = require("@/middlewares");
const permissionRequired = require("@/middlewares/permissionRequired");

router.use(authRequired);

router.get("/sessions", controller.getSessions);
router.post("/sessions", controller.createSession);
router.get("/sessions/:id", controller.getMessages);
router.post("/sessions/:id/messages", controller.sendMessage);
router.patch("/sessions/:id", controller.updateTitle);
router.delete("/sessions/:id", controller.deleteSession);
router.post("/generate-cover-letter", controller.generateCoverLetter);
router.post(
  "/recruiter/candidate-analysis",
  roleRequired("ADMIN", "RECRUITER"),
  permissionRequired("application:read:company"),
  controller.analyzeRecruiterCandidates,
);
router.post(
  "/candidate/job-fit",
  roleRequired("CANDIDATE"),
  controller.analyzeCandidateJobFit,
);

module.exports = router;
