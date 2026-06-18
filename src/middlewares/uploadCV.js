const { cloudinaryConfig } = require('@/config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const ALLOWED_MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: async (req, file) => {
    const ext = ALLOWED_MIME_TYPES[file.mimetype] || 'pdf';
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return {
      folder: 'sra_cv',
      resource_type: ext === 'pdf' ? 'image' : 'raw',
      public_id: uniqueId,
      format: ext,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('CV_INVALID_TYPE'), false);
  }
};

const uploadCV = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = uploadCV;
