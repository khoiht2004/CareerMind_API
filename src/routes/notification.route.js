const router = require("express").Router();
const controller = require("@/controllers/notification.controller");
const { authRequired } = require("@/middlewares");

router.use(authRequired);

router.get("/", controller.getNotifications);
router.patch("/read-all", controller.markAllAsRead);
router.patch("/:id/read", controller.markAsRead);

module.exports = router;
