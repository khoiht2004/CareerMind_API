const router = require("express").Router();
const controller = require("@/controllers/company.controller");
const { authRequired, roleRequired } = require("@/middlewares");
const permissionRequired = require("@/middlewares/permissionRequired");

router.get("/", controller.getCompanies);

router.get("/my/profile", authRequired, roleRequired("RECRUITER"), controller.getMyCompanyProfile);
router.put(
  "/my/profile",
  authRequired,
  roleRequired("RECRUITER"),
  permissionRequired("company:manage"),
  controller.updateMyCompanyProfile,
);
router.get("/my/stats", authRequired, roleRequired("RECRUITER"), controller.getCompanyStats);
router.get("/my/personnel", authRequired, roleRequired("RECRUITER"), controller.getCompanyPersonnel);
router.get("/my/jobs", authRequired, roleRequired("RECRUITER"), controller.getMyCompanyJobs);
router.get(
  "/my/applications",
  authRequired,
  roleRequired("RECRUITER"),
  permissionRequired("application:read:company"),
  controller.getMyCompanyApplications,
);

router.get("/:id", controller.getCompanyById);
router.post("/:id/reviews", authRequired, roleRequired("CANDIDATE"), controller.upsertCompanyReview);

module.exports = router;
