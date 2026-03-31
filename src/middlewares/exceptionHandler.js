const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

function exceptionHandler(error, req, res, next) {
  if (error instanceof JsonWebTokenError) {
    return res.error(401, "Bạn không có quyền truy cập");
  }

  if (error instanceof TokenExpiredError) {
    return res.error(401, "Token đã hết hạn");
  }

  return res.error(
    500,
    process.env.NODE_ENV !== "production" ? error.message : "Lỗi hệ thống",
  );
}

module.exports = exceptionHandler;
