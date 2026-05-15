const router = require("express").Router();
const controller = require("@/controllers/insight.controller");
const { authRequired, roleRequired } = require("@/middlewares");

router.get("/me", authRequired, roleRequired("CANDIDATE"), controller.getCandidateInsights);

module.exports = router;
