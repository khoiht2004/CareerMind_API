const companyModel = require("@/models/company.model");



// [GET] Lấy danh sách public các công ty
async function getCompanies(req, res) {
  const { page = 1, limit = 10, search } = req.query;
  const result = await companyModel.getCompanies({ page, limit, search });
  return res.success(200, result);
}

// [GET] Xem profile công ty (public) -> Gồm cả jobs của họ
async function getCompanyById(req, res) {
  const { id } = req.params;
  const company = await companyModel.getCompanyById(id);
  if (!company) return res.error(404, "Không tìm thấy công ty");
  return res.success(200, company);
}


// ==========================================
// RECRUITER / COMPANY MANAGERS ROUTES
// ==========================================

// [GET] Danh sách tất cả jobs của công ty
async function getMyCompanyJobs(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tài khoản chưa được liên kết với công ty nào");
  const { page, limit, status, search } = req.query;
  const result = await companyModel.getMyJobs(companyId, { page, limit, status, search });
  return res.success(200, result);
}

// [GET] Danh sách tất cả đơn ứng tuyển của công ty
async function getMyCompanyApplications(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tài khoản chưa được liên kết với công ty nào");
  const { page, limit, status, jobId } = req.query;
  const result = await companyModel.getMyApplications(companyId, { page, limit, status, jobId });
  return res.success(200, result);
}

// [GET] Lấy thông tin công ty của chính người đang đăng nhập (Recruiter/Company)
async function getMyCompanyProfile(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tài khoản chưa được liên kết với công ty nào");
  const company = await companyModel.getCompanyById(companyId);
  if (!company) return res.error(404, "Không tìm thấy công ty");
  return res.success(200, company);
}

// [PUT] Cập nhật thông tin công ty của chính người đang đăng nhập
async function updateMyCompanyProfile(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tài khoản chưa được liên kết với công ty nào");
  const company = await companyModel.updateCompany(companyId, req.body);
  return res.success(200, company);
}

// [GET] Lấy thống kê của công ty (Dành cho Dashboard của Recruiter)
async function getCompanyStats(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tài khoản chưa được liên kết với công ty nào");
  const stats = await companyModel.getCompanyStats(companyId);
  return res.success(200, stats);
}

// [GET] Danh sách nhân sự / admin của công ty
async function getCompanyPersonnel(req, res) {
  const companyId = req.auth.user.companyId;
  if (!companyId) return res.error(404, "Tài khoản chưa được liên kết với công ty nào");
  const personnel = await companyModel.getCompanyPersonnel(companyId);
  return res.success(200, personnel);
}

module.exports = {
  getCompanies,
  getCompanyById,
  getMyCompanyJobs,
  getMyCompanyApplications,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  getCompanyStats,
  getCompanyPersonnel,
};
