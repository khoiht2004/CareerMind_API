const router = require("express").Router();
const controller = require("@/controllers/coverLetter.controller");
const { authRequired } = require("@/middlewares");

router.use(authRequired);

router.get("/", controller.getMyCoverLetters);
router.post("/", controller.createCoverLetter);
router.get("/:id", controller.getCoverLetterById);
router.patch("/:id", controller.updateCoverLetter);
router.delete("/:id", controller.deleteCoverLetter);

module.exports = router;
