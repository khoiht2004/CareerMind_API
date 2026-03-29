const model = require("@/models/coverLetter.model");

async function getMyCoverLetters(req, res) {
  const data = await model.getAllByUserId(req.auth.user.id);
  return res.success(200, data);
}

async function getCoverLetterById(req, res) {
  const { id } = req.params;
  const coverLetter = await model.getById(id, req.auth.user.id);
  
  if (!coverLetter) {
    return res.error(404, "Không tìm thấy thư ứng tuyển này");
  }
  
  return res.success(200, coverLetter);
}

async function createCoverLetter(req, res) {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.error(400, "Vui lòng nhập đầy đủ tiêu đề và nội dung");
  }
  
  const newCoverLetter = await model.create(req.auth.user.id, { title, content });
  return res.success(201, newCoverLetter);
}

async function updateCoverLetter(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;
  
  if (!title && !content) {
    return res.error(400, "Vui lòng nhập dữ liệu cần cập nhật");
  }
  
  const updated = await model.update(id, req.auth.user.id, { title, content });
  
  if (!updated) {
    return res.error(404, "Không tìm thấy thư ứng tuyển hoặc bạn không có quyền sửa");
  }
  
  return res.success(200, updated);
}

async function deleteCoverLetter(req, res) {
  const { id } = req.params;
  const deleted = await model.delete(id, req.auth.user.id);
  
  if (!deleted) {
    return res.error(404, "Không tìm thấy thư ứng tuyển hoặc bạn không có quyền xóa");
  }
  
  return res.success(200, { message: "Đã xóa thư ứng tuyển" });
}

module.exports = {
  getMyCoverLetters,
  getCoverLetterById,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
};
