const router = require("express").Router();
const controller = require("@/controllers/savedJob.controller");
const { authRequired } = require("@/middlewares");

router.use(authRequired);

router.get("/", controller.getSaved);
router.post("/", controller.save);
router.get("/:jobId/check", controller.checkSaved);
router.delete("/:jobId", controller.unsave);

module.exports = router;
