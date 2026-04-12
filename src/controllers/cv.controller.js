const model = require('@/models/cv.model');
const { cloudinaryConfig } = require('@/config');

// POST /cv — upload a new CV file
async function uploadCv(req, res) {
  if (!req.file) return res.error(400, 'Không có file được tải lên');

  const { name } = req.body;

  // multer-storage-cloudinary stores the URL in req.file.path
  // and the Cloudinary response fields (bytes, public_id, etc.) are also attached
  const fileUrl = req.file.path;
  const fileSize = req.file.size || req.file.bytes || 0;
  const mimeType = req.file.mimetype || '';
  const fileType = mimeType.includes('pdf')
    ? 'pdf'
    : mimeType.includes('msword')
      ? 'doc'
      : 'docx';

  const cv = await model.createCv(req.auth.user.id, {
    name: (name || req.file.originalname || 'CV').trim(),
    fileUrl,
    fileType,
    fileSize,
    isDefault: false,
  });

  return res.success(201, cv);
}

// GET /cv — list current user's CVs
async function getMyCvs(req, res) {
  const cvs = await model.getMyCvs(req.auth.user.id);
  return res.success(200, cvs);
}

// GET /cv/:id — get a single CV (owner or recruiter/admin)
async function getCvById(req, res) {
  const cv = await model.getCvById(req.params.id);
  if (!cv) return res.error(404, 'Không tìm thấy CV');

  // Candidates can only view their own CV
  if (cv.userId !== req.auth.user.id && req.auth.user.role === 'CANDIDATE') {
    return res.error(403, 'Không có quyền truy cập');
  }

  return res.success(200, cv);
}

// DELETE /cv/:id — delete a CV and clean up Cloudinary
async function deleteCv(req, res) {
  const cv = await model.getCvById(req.params.id);
  if (!cv) return res.error(404, 'Không tìm thấy CV');
  if (cv.userId !== req.auth.user.id) return res.error(403, 'Không có quyền xóa');

  // Extract Cloudinary public_id from URL and delete from cloud storage
  // URL pattern: https://res.cloudinary.com/{cloud}/raw/upload/v{ver}/sra_cv/{id}.{ext}
  const publicId = cv.fileUrl
    .split('/upload/')[1]
    ?.replace(/^v\d+\//, '')
    ?.replace(/\.[^.]+$/, '');

  if (publicId) {
    await cloudinaryConfig.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => {});
  }

  const result = await model.deleteCv(req.params.id, req.auth.user.id);
  if (!result) return res.error(403, 'Không có quyền xóa CV này');

  return res.success(200, { message: 'Đã xóa CV' });
}

// PATCH /cv/:id/default — set a CV as the default
async function setDefault(req, res) {
  const result = await model.setDefault(req.params.id, req.auth.user.id);
  if (!result) return res.error(404, 'Không tìm thấy CV hoặc không có quyền');
  return res.success(200, result);
}

module.exports = { uploadCv, getMyCvs, getCvById, deleteCv, setDefault };
