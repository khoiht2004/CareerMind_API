const router = require("express").Router();
const controller = require("@/controllers/job.controller");
const authRequired = require("@/middlewares/authRequired");
const roleRequired = require("@/middlewares/roleRequired");

// Public
router.get("/", controller.getJobs);

// Recruiter + Admin - must be before /:id
router.get("/my/jobs", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.getMyJobs);
router.get("/my/stats", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.getMyStats);

router.get("/:id", controller.getJobById);

// Recruiter + Admin
router.post("/", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.createJob);
router.put("/:id", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.updateJob);
router.delete("/:id", authRequired, roleRequired("RECRUITER", "ADMIN"), controller.deleteJob);

module.exports = router;
