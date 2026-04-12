const model = require("@/models/profile.model");
const { cloudinaryConfig } = require("@/config");

async function getProfile(req, res) {
  const profile = await model.getProfile(req.auth.user.id);
  if (!profile) return res.success(200, null);
  if (profile.skills) profile.skills = profile.skills;
  return res.success(200, profile);
}

async function updateProfile(req, res) {
  const profile = await model.upsertProfile(req.auth.user.id, req.body);
  if (profile.skills) profile.skills = profile.skills;
  return res.success(200, profile);
}

async function updateAvatar(req, res) {
  const file = req.file;
  if (!file) return res.error(400, "File không hợp lệ");
  const avatarUrl = file.path;
  const avatar = await model.updateAvatar(req.auth.user.id, avatarUrl);
  return res.success(200, avatar);
}

async function deleteAvatar(req, res) {
  const { prevAvatarUrl, ...avatar } = await model.deleteAvatar(req.auth.user.id);

  if (prevAvatarUrl) {
    const publicId = prevAvatarUrl
      .split("/upload/")[1]
      ?.replace(/^v\d+\//, "")
      ?.replace(/\.[^.]+$/, "");
    if (publicId) await cloudinaryConfig.uploader.destroy(publicId);
  }

  return res.success(200, avatar);
}

module.exports = { getProfile, updateProfile, updateAvatar, deleteAvatar };

