const router = require("express").Router();
const controller = require("@/controllers/post.controller");
const { authRequired, roleRequired } = require("@/middlewares");
const permissionRequired = require("@/middlewares/permissionRequired");

router.get("/", controller.getPosts);

router.get(
  "/my/posts",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("post:read:own"),
  controller.getMyPosts,
);

router.get("/:id", controller.getPostById);

router.post(
  "/",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("post:create"),
  controller.createPost,
);

router.put(
  "/:id",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("post:update:own"),
  controller.updatePost,
);

router.delete(
  "/:id",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("post:delete:own"),
  controller.deletePost,
);

module.exports = router;
