const model = require("@/models/profile.model");

async function getProfile(req, res) {
  const profile = await model.getProfile(req.auth.user.id);
  if (!profile) return res.success(200, null);
  if (profile.skills) profile.skills = JSON.parse(profile.skills);
  return res.success(200, profile);
}

async function updateProfile(req, res) {
  const profile = await model.upsertProfile(req.auth.user.id, req.body);
  if (profile.skills) profile.skills = JSON.stringify(profile.skills);
  return res.success(200, profile);
}

module.exports = { getProfile, updateProfile };
