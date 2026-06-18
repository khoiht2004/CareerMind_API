const model = require('@/models/cv.model');
const { cloudinaryConfig } = require('@/config');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromUrl(fileUrl, fileType) {
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Tải file từ Cloudinary thất bại, status: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';
    if (fileType === 'pdf') {
      const result = await pdfParse(buffer);
      text = result.text?.trim() || '';
    } else if (fileType === 'doc' || fileType === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value?.trim() || '';
    }

    if (text.length > 8000) {
      text = text.slice(0, 8000);
    }
    return text;
  } catch (err) {
    console.error('[cv.controller] extractTextFromUrl failed:', err.message);
    return '';
  }
}

// POST /cv — upload a new CV file
async function uploadCv(req, res) {
  if (!req.file) return res.error(400, 'Không có file được tải lên');

  const { name } = req.body;

  const fileUrl = req.file.path;
  const fileSize = req.file.size || 0;
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

  let parsedProfile = null;
  if (['pdf', 'doc', 'docx'].includes(fileType)) {
    try {
      const extractedText = await extractTextFromUrl(fileUrl, fileType);
      if (extractedText) {
        const aiService = require('@/services/ai.service');
        parsedProfile = await aiService.parseCV(extractedText);
      }
    } catch (err) {
      console.error('[cv.controller] parse CV failed:', err.message);
    }
  }

  return res.success(201, {
    ...cv,
    parsedProfile,
  });
}


async function getMyCvs(req, res) {
  const cvs = await model.getMyCvs(req.auth.user.id);
  return res.success(200, cvs);
}

async function getCvById(req, res) {
  const cv = await model.getCvById(req.params.id);
  if (!cv) return res.error(404, 'Không tìm thấy CV');

  if (cv.userId !== req.auth.user.id && req.auth.user.role === 'CANDIDATE') {
    return res.error(403, 'Không có quyền truy cập');
  }

  return res.success(200, cv);
}

async function deleteCv(req, res) {
  const cv = await model.getCvById(req.params.id);
  if (!cv) return res.error(404, 'Không tìm thấy CV');
  if (cv.userId !== req.auth.user.id) return res.error(403, 'Không có quyền xóa');

  // URL pattern: https://res.cloudinary.com/{cloud}/raw/upload/v{ver}/sra_cv/{id}.{ext}
  const publicId = cv.fileUrl
    .split('/upload/')[1]
    ?.replace(/^v\d+\//, '')
    ?.replace(/\.[^.]+$/, '');

  if (publicId) {
    const resourceType = cv.fileType === 'pdf' ? 'image' : 'raw';
    await cloudinaryConfig.uploader.destroy(publicId, { resource_type: resourceType }).catch(() => { });
  }

  const result = await model.deleteCv(req.params.id, req.auth.user.id);
  if (!result) return res.error(403, 'Không có quyền xóa CV này');

  return res.success(200, { message: 'Đã xóa CV' });
}

async function setDefault(req, res) {
  const result = await model.setDefault(req.params.id, req.auth.user.id);
  if (!result) return res.error(404, 'Không tìm thấy CV hoặc không có quyền');
  return res.success(200, result);
}

module.exports = { uploadCv, getMyCvs, getCvById, deleteCv, setDefault };
