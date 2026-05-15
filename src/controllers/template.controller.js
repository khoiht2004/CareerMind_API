const model = require("@/models/template.model");

async function getCvTemplates(req, res) {
  const result = await model.getCvTemplates(req.query);
  return res.success(200, result);
}

async function getCoverLetterTemplates(req, res) {
  const result = await model.getCoverLetterTemplates(req.query);
  return res.success(200, result);
}

module.exports = { getCvTemplates, getCoverLetterTemplates };
