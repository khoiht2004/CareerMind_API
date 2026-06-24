const rateLimit = require("express-rate-limit");

/**
 * Middleware Rate Limiter sử dụng thư viện express-rate-limit
 * Thay thế cho code tự viết để tránh memory leak và có thêm headers chuẩn
 */
const apiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Thời gian cửa sổ: 5 phút
  max: 5, // Tối đa 5 requests mỗi IP trong khoảng thời gian trên
  message: "Too many requests", // Thông báo lỗi
  standardHeaders: true, // Trả về thông tin rate limit qua các header `RateLimit-*`
  legacyHeaders: false, // Tắt các header `X-RateLimit-*` cũ
  handler: (req, res, next, options) => {
    // Gọi hàm res.error() (đã được config trong middleware responseFormat của mày)
    // Để định dạng lỗi trả về đồng nhất với toàn bộ dự án
    return res.error(options.statusCode, options.message);
  },
});

module.exports = { apiRateLimiter };
