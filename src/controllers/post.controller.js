const model = require("@/models/post.model");

async function getPosts(req, res) {
  const result = await model.getPosts(req.query);
  return res.success(200, result);
}

async function getPostById(req, res) {
  const post = await model.getPostById(req.params.id);
  if (!post) return res.error(404, "Không tìm thấy bài viết");
  return res.success(200, post);
}

async function getMyPosts(req, res) {
  const result = await model.getMyPosts(req.auth.user.id, req.query);
  return res.success(200, result);
}

async function createPost(req, res) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.error(400, "Tiêu đề và nội dung là bắt buộc");
  }

  const post = await model.createPost(req.body, req.auth.user.id);
  return res.success(201, post);
}

async function updatePost(req, res) {
  const { id } = req.params;
  const { user } = req.auth;

  const existing = await model.getEditablePost(id);
  if (!existing) return res.error(404, "Không tìm thấy bài viết");
  if (user.role !== "ADMIN" && existing.authorId !== user.id) {
    return res.error(403, "Bạn không có quyền chỉnh sửa bài viết này");
  }

  const post = await model.updatePost(id, req.body);
  return res.success(200, post);
}

async function deletePost(req, res) {
  const { id } = req.params;
  const { user } = req.auth;

  const existing = await model.getEditablePost(id);
  if (!existing) return res.error(404, "Không tìm thấy bài viết");
  if (user.role !== "ADMIN" && existing.authorId !== user.id) {
    return res.error(403, "Bạn không có quyền xóa bài viết này");
  }

  await model.deletePost(id);
  return res.success(200, "Xóa bài viết thành công");
}

module.exports = {
  getPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
};
