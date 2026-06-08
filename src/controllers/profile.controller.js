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

async function getProfileView(req, res) {
  const { id } = req.params;
  const user = await model.getProfileView(id);
  if (!user) return res.error(404, "Không tìm thấy người dùng");

  let defaultCv = null;
  if (user.cvs && user.cvs.length > 0) {
    defaultCv = user.cvs.find((cv) => cv.isDefault) || user.cvs[0];
  }

  const responseData = {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    profile: user.profile,
    company: user.role === "RECRUITER" ? user.company : null,
    defaultCv: user.role === "CANDIDATE" ? defaultCv : null,
  };

  return res.success(200, responseData);
}

module.exports = { getProfile, updateProfile, updateAvatar, deleteAvatar, getProfileView };


