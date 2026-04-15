const router = require("express").Router();
const controller = require("@/controllers/company.controller");
const { authRequired, roleRequired } = require("@/middlewares");

router.get("/", controller.getCompanies);
router.get("/:id", controller.getCompanyById);

router.get("/my/profile", authRequired, roleRequired("RECRUITER"), controller.getMyCompanyProfile);
router.put("/my/profile", authRequired, roleRequired("RECRUITER"), controller.updateMyCompanyProfile);
router.get("/my/stats", authRequired, roleRequired("RECRUITER"), controller.getCompanyStats);
router.get("/my/personnel", authRequired, roleRequired("RECRUITER"), controller.getCompanyPersonnel);
router.get("/my/jobs", authRequired, roleRequired("RECRUITER"), controller.getMyCompanyJobs);
router.get("/my/applications", authRequired, roleRequired("RECRUITER"), controller.getMyCompanyApplications);

module.exports = router;
