const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

function exceptionHandler(error, req, res, next) {
  console.error("[exceptionHandler] Caught error:", error);

  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ status: "Error", message: "Bạn không có quyền truy cập" });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({ status: "Error", message: "Token đã hết hạn" });
  }

  if (typeof res.error === 'function') {
    return res.error(
      500,
      process.env.NODE_ENV !== "production" ? error.message : "Lỗi hệ thống",
    );
  } else {
    return res.status(500).json({
      status: "Error",
      message: process.env.NODE_ENV !== "production" ? error.message : "Lỗi hệ thống",
    });
  }
}

module.exports = exceptionHandler;
