const router = require("express").Router();
const controller = require("@/controllers/conversation.controller");
const { authRequired } = require("@/middlewares");

router.use(authRequired);

router.get("/", controller.getConversations);
router.post("/", controller.createOrGetConversation);
router.get("/unread-count", controller.getUnreadCount);
router.get("/:id/messages", controller.getMessages);
router.post("/:id/messages", controller.sendMessage);
router.patch("/:id/read", controller.markAsRead);

module.exports = router;
