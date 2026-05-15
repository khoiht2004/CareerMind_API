const model = require("@/models/post.model");

async function getPosts(req, res) {
  const result = await model.getPosts(req.query);
  return res.success(200, result);
}

async function getPostById(req, res) {
  const post = await model.getPostById(req.params.id);
  if (!post) return res.error(404, "Khong tim thay bai viet");
  return res.success(200, post);
}

module.exports = { getPosts, getPostById };
