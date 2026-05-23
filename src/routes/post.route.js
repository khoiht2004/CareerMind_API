const router = require("express").Router();
const controller = require("@/controllers/post.controller");
const { authRequired, roleRequired } = require("@/middlewares");

router.get("/", controller.getPosts);

router.get(
  "/my/posts",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  controller.getMyPosts,
);

router.get("/:id", controller.getPostById);

router.post(
  "/",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  controller.createPost,
);

router.put(
  "/:id",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  controller.updatePost,
);

router.delete(
  "/:id",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  controller.deletePost,
);

module.exports = router;
