const router = require("express").Router();
const controller = require("@/controllers/coverLetter.controller");
const authRequired = require("@/middlewares/authRequired");

router.get("/", authRequired, controller.getMyCoverLetters);
router.post("/", authRequired, controller.createCoverLetter);
router.get("/:id", authRequired, controller.getCoverLetterById);
router.patch("/:id", authRequired, controller.updateCoverLetter);
router.delete("/:id", authRequired, controller.deleteCoverLetter);

module.exports = router;
