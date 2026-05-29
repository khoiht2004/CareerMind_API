const router = require("express").Router();
const controller = require("@/controllers/job.controller");
const { authRequired, roleRequired } = require("@/middlewares");
const permissionRequired = require("@/middlewares/permissionRequired");

// Public
router.get("/", controller.getJobs);

// Recruiter + Admin - must be before /:id
router.get("/my/jobs", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.getMyJobs);
router.get("/my/stats", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.getMyStats);

router.get("/:id", controller.getJobById);

// Recruiter + Admin (permission-gated)
router.post(
  "/",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("job:create"),
  controller.createJob,
);
router.put(
  "/:id",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("job:update:own", "job:update:company"),
  controller.updateJob,
);
router.delete(
  "/:id",
  authRequired,
  roleRequired("RECRUITER", "ADMIN"),
  permissionRequired("job:delete:own"),
  controller.deleteJob,
);

module.exports = router;
