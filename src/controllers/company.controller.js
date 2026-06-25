const companyModel = require("@/models/company.model");

async function getCompanies(req, res) {
  const { page = 1, limit = 10, search, industry, size } = req.query;
  const result = await companyModel.getCompanies({
    page,
    limit,
    search,
    industry,
    size,
  });
  return res.success(200, result);
}

async function getCompanyById(req, res) {
  const { id } = req.params;
  const company = await companyModel.getCompanyById(id);
  if (!company || !company.isActive) return res.error(404, "Khong tim thay cong ty");
  const reviewSummary = await companyModel.getCompanyReviewSummary(id);
  return res.success(200, { ...company, ...reviewSummary });
}

async function upsertCompanyReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  if (!rating || +rating < 1 || +rating > 5) {
    return res.error(400, "Rating phai tu 1 den 5");
  }

  const company = await companyModel.getCompanyById(id);
  if (!company) return res.error(404, "Khong tim thay cong ty");

  const review = await companyModel.upsertCompanyReview(id, req.auth.user.id, {
    rating,
    comment,
  });
  return res.success(200, review);
}

async function getMyCompanyJobs(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tai khoan chua lien ket voi cong ty nao");
  const { page, limit, status, search } = req.query;
  const result = await companyModel.getMyJobs(companyId, {
    page,
    limit,
    status,
    search,
  });
  return res.success(200, result);
}

async function getMyCompanyApplications(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tai khoan chua lien ket voi cong ty nao");
  const { page, limit, status, jobId } = req.query;
  const result = await companyModel.getMyApplications(companyId, {
    page,
    limit,
    status,
    jobId,
  });
  return res.success(200, result);
}

async function getMyCompanyProfile(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tai khoan chua lien ket voi cong ty nao");
  const company = await companyModel.getCompanyById(companyId);
  if (!company) return res.error(404, "Khong tim thay cong ty");
  return res.success(200, company);
}

async function updateMyCompanyProfile(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tai khoan chua lien ket voi cong ty nao");
  const company = await companyModel.updateCompany(companyId, req.body);
  return res.success(200, company);
}

async function getCompanyStats(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tai khoan chua lien ket voi cong ty nao");
  const stats = await companyModel.getCompanyStats(companyId);
  return res.success(200, stats);
}

async function getCompanyPersonnel(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tai khoan chua lien ket voi cong ty nao");
  const personnel = await companyModel.getCompanyPersonnel(companyId);
  return res.success(200, personnel);
}

module.exports = {
  getCompanies,
  getCompanyById,
  upsertCompanyReview,
  getMyCompanyJobs,
  getMyCompanyApplications,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  getCompanyStats,
  getCompanyPersonnel,
};
