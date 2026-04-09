const router = require("express").Router();
const controller = require("@/controllers/profile.controller");
const { authRequired, uploadCloud } = require("@/middlewares");

router.use(authRequired);

router.get("/", controller.getProfile);
router.put("/", controller.updateProfile);
router.post("/upload-avatar", uploadCloud.single("avatar_url"), controller.updateAvatar);
router.delete("/delete-avatar", controller.deleteAvatar);

module.exports = router;
