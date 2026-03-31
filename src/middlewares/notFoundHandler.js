function notFoundHandler(req, res, next) {
  return res.error(404, "Không tìm thấy tài nguyên");
}

module.exports = notFoundHandler;
