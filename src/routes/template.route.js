const router = require("express").Router();
const controller = require("@/controllers/template.controller");

router.get("/cv", controller.getCvTemplates);
router.get("/cover-letter", controller.getCoverLetterTemplates);

module.exports = router;
