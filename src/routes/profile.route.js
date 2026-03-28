const router = require("express").Router();
const controller = require("@/controllers/profile.controller");
const authRequired = require("@/middlewares/authRequired");

router.get("/", authRequired, controller.getProfile);
router.put("/", authRequired, controller.updateProfile);

module.exports = router;
