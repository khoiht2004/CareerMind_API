const model = require("@/models/insight.model");

async function getCandidateInsights(req, res) {
  const result = await model.getCandidateInsights(req.auth.user.id);
  return res.success(200, result);
}

module.exports = { getCandidateInsights };
