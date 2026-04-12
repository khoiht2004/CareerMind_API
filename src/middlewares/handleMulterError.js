const multer = require("multer");

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.error(400, "Kích thước file vượt quá giới hạn cho phép");
    }
    return res.error(400, err.message);
  }
  if (err.message === "Loại file không hợp lệ, chỉ chấp nhận jpeg, png, webp") {
    return res.error(400, err.message);
  }
  if (err.message === "CV_INVALID_TYPE") {
    return res.error(400, "Loại file không hợp lệ, chỉ chấp nhận PDF, DOC, DOCX");
  }
  next(err);
}

module.exports = handleMulterError;
