const multer = require("multer");

function handleMulterError(err, req, res, next) {
  const sendError = (status, msg) => {
    if (typeof res.error === 'function') return res.error(status, msg);
    return res.status(status).json({ status: "Error", message: msg });
  };

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendError(400, "Kích thước file vượt quá giới hạn cho phép");
    }
    return sendError(400, err.message);
  }
  if (err.message === "Loại file không hợp lệ, chỉ chấp nhận jpeg, png, webp") {
    return sendError(400, err.message);
  }
  if (err.message === "CV_INVALID_TYPE") {
    return sendError(400, "Loại file không hợp lệ, chỉ chấp nhận PDF, DOC, DOCX");
  }
  next(err);
}

module.exports = handleMulterError;
