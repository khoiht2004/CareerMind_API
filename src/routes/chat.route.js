const router = require("express").Router();
const controller = require("@/controllers/chat.controller");
const { authRequired } = require("@/middlewares");

router.use(authRequired);

router.get("/sessions", controller.getSessions);
router.post("/sessions", controller.createSession);
router.get("/sessions/:id", controller.getMessages);
router.post("/sessions/:id/messages", controller.sendMessage);
router.patch("/sessions/:id", controller.updateTitle);
router.delete("/sessions/:id", controller.deleteSession);
router.post("/generate-cover-letter", controller.generateCoverLetter);

module.exports = router;
