const router = require("express").Router();
const controller = require("@/controllers/savedJob.controller");
const authRequired = require("@/middlewares/authRequired");

router.get("/", authRequired, controller.getSaved);
router.post("/", authRequired, controller.save);
router.get("/:jobId/check", authRequired, controller.checkSaved);
router.delete("/:jobId", authRequired, controller.unsave);

module.exports = router;
