// seed.js
// Run: node seed.js
// Requires: npm install @prisma/client bcryptjs

require("dotenv").config();
const { PrismaClient } = require("./generated/prisma");
const bcrypt = require("bcrypt");

// ─── Khởi tạo Prisma ─────────────────────────────────────────────────────────
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const prisma = new PrismaClient({ adapter });

// const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hash = (pw) => bcrypt.hashSync(pw, 10);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMany = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Sinh ngày random trong khoảng
const randDate = (startDaysAgo, endDaysAgo) => {
  const now = Date.now();
  const msPerDay = 86_400_000;
  const from = now - startDaysAgo * msPerDay;
  const to = now - endDaysAgo * msPerDay;
  return new Date(from + Math.random() * (to - from));
};

// Deadline: quá khứ, gần, xa
const pastDeadline = () => randDate(180, 30);
const nearDeadline = () => randDate(30, 0);
const futureDeadline = () =>
  new Date(Date.now() + randInt(30, 180) * 86_400_000);

// ─── 20 COMPANIES ─────────────────────────────────────────────────────────────
const COMPANIES_DATA = [
  {
    name: "FPT Software",
    email: "contact@fpt-software.com",
    phone: "02873006600",
    description:
      "FPT Software là một trong những công ty phần mềm và dịch vụ CNTT hàng đầu Việt Nam, cung cấp giải pháp chuyển đổi số toàn diện cho khách hàng toàn cầu.",
    address: "Lô E2a-7, Đường D1, Khu Công nghệ cao, Quận 9, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://fpt-software.com",
      linkedin: "https://linkedin.com/company/fpt-software",
    },
  },
  {
    name: "Vietcombank",
    email: "hr@vietcombank.com.vn",
    phone: "02438343137",
    description:
      "Ngân hàng TMCP Ngoại thương Việt Nam – một trong những ngân hàng thương mại lớn nhất Việt Nam với hơn 60 năm kinh nghiệm trong lĩnh vực tài chính ngân hàng.",
    address: "198 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
    isVerified: true,
    socialLinks: { website: "https://vietcombank.com.vn" },
  },
  {
    name: "Shopee Việt Nam",
    email: "careers@shopee.com",
    phone: "02839007788",
    description:
      "Shopee là nền tảng thương mại điện tử hàng đầu Đông Nam Á, kết nối hàng triệu người mua và người bán trong một hệ sinh thái mua sắm hiện đại.",
    address: "Tầng 17, WeWork, 364 Cộng Hòa, Tân Bình, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://careers.shopee.vn",
      facebook: "https://facebook.com/ShopeeCareersVN",
    },
  },
  {
    name: "Techcombank",
    email: "tuyen.dung@techcombank.com.vn",
    phone: "02439447699",
    description:
      "Techcombank – Ngân hàng TMCP Kỹ thương Việt Nam – một trong những ngân hàng tư nhân lớn nhất Việt Nam với chiến lược số hóa mạnh mẽ.",
    address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
    isVerified: true,
    socialLinks: { website: "https://techcombank.com" },
  },
  {
    name: "Vingroup",
    email: "careers@vingroup.net",
    phone: "02439740740",
    description:
      "Vingroup là tập đoàn kinh tế tư nhân đa ngành hàng đầu Việt Nam với hệ sinh thái rộng lớn từ bất động sản, bán lẻ, y tế, giáo dục đến công nghệ.",
    address: "Số 7 Bảng Lảng, Khu Đô thị Vinhomes Riverside, Long Biên, Hà Nội",
    isVerified: true,
    socialLinks: {
      website: "https://vingroup.net",
      linkedin: "https://linkedin.com/company/vingroup",
    },
  },
  {
    name: "Masan Group",
    email: "hr@masan.com.vn",
    phone: "02838321888",
    description:
      "Masan Group là tập đoàn kinh doanh hàng tiêu dùng và tài nguyên thiết yếu hàng đầu Việt Nam, sở hữu các thương hiệu nổi tiếng như Chinsu, Nam Ngư, WinMart.",
    address: "Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: { website: "https://masangroup.com" },
  },
  {
    name: "KPMG Việt Nam",
    email: "vn-fm-recruitment@kpmg.com.vn",
    phone: "02438310100",
    description:
      "KPMG Việt Nam là một trong bốn công ty kiểm toán và tư vấn lớn nhất thế giới (Big 4), cung cấp dịch vụ kiểm toán, thuế, và tư vấn quản lý.",
    address: "Tầng 46, Keangnam Hanoi Landmark Tower, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    isVerified: true,
    socialLinks: {
      website: "https://kpmg.com/vn",
      linkedin: "https://linkedin.com/company/kpmg-vietnam",
    },
  },
  {
    name: "Grab Việt Nam",
    email: "careers@grab.com",
    phone: "02838266999",
    description:
      "Grab là siêu ứng dụng hàng đầu Đông Nam Á cung cấp các dịch vụ vận tải, giao đồ ăn, thanh toán và tài chính kỹ thuật số cho hàng triệu người dùng.",
    address: "Tầng 9, Tòa nhà Deutsches Haus, 33 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://grab.com/vn",
      linkedin: "https://linkedin.com/company/grab",
    },
  },
  {
    name: "VNG Corporation",
    email: "hr@vng.com.vn",
    phone: "02839978797",
    description:
      "VNG là công ty công nghệ hàng đầu Việt Nam, nổi tiếng với Zalo, ZaloPay và các sản phẩm game, nội dung số phục vụ hàng triệu người dùng trong và ngoài nước.",
    address: "182 Lê Đại Hành, Phường 15, Quận 11, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://vng.com.vn",
      linkedin: "https://linkedin.com/company/vng-corporation",
    },
  },
  {
    name: "MoMo",
    email: "careers@momo.vn",
    phone: "02844455678",
    description:
      "MoMo là ví điện tử và nền tảng tài chính kỹ thuật số hàng đầu Việt Nam với hơn 31 triệu người dùng, cung cấp hàng ngàn dịch vụ tài chính tiện ích.",
    address: "Tầng 5-6, Tòa nhà IMS, 90 Nguyễn Hữu Cảnh, Bình Thạnh, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://momo.vn",
      facebook: "https://facebook.com/momo.vn",
    },
  },
  {
    name: "Tiki",
    email: "talent@tiki.vn",
    phone: "02873006789",
    description:
      "Tiki là sàn thương mại điện tử Việt Nam được yêu thích nhất với cam kết giao hàng nhanh TikiNOW và chất lượng sản phẩm đảm bảo cho hàng triệu khách hàng.",
    address: "Tầng 6, 52 Út Tịch, Tân Bình, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://tiki.vn",
      linkedin: "https://linkedin.com/company/tiki-vn",
    },
  },
  {
    name: "Lazada Việt Nam",
    email: "hr@lazada.vn",
    phone: "02839335577",
    description:
      "Lazada là nền tảng thương mại điện tử hàng đầu Đông Nam Á thuộc hệ sinh thái Alibaba, cung cấp trải nghiệm mua sắm trực tuyến đa dạng và tiện lợi.",
    address: "Tầng 22, Tòa nhà Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: { website: "https://lazada.vn" },
  },
  {
    name: "Deloitte Việt Nam",
    email: "vn.recruitment@deloitte.com",
    phone: "02838220100",
    description:
      "Deloitte Việt Nam cung cấp dịch vụ kiểm toán, tư vấn thuế, tư vấn quản lý và tư vấn tài chính cho các doanh nghiệp lớn và tổ chức tài chính hàng đầu.",
    address: "Tầng 15, Vietcombank Tower, 5 Công Trường Mê Linh, Quận 1, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://www2.deloitte.com/vn",
      linkedin: "https://linkedin.com/company/deloitte",
    },
  },
  {
    name: "Be Group",
    email: "careers@be.com.vn",
    phone: "02866662255",
    description:
      "Be Group là công ty công nghệ Việt Nam vận hành ứng dụng gọi xe beBike và beCar cùng các dịch vụ giao hàng beDelivery, phục vụ hàng triệu người dùng nội địa.",
    address: "Tầng 8, Tòa nhà IDMC My Dinh, 15 Phạm Hùng, Nam Từ Liêm, Hà Nội",
    isVerified: true,
    socialLinks: { website: "https://be.com.vn" },
  },
  {
    name: "Agribank",
    email: "tuyendung@agribank.com.vn",
    phone: "02438315270",
    description:
      "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam là ngân hàng thương mại lớn nhất Việt Nam về tài sản, phục vụ chủ yếu khu vực nông thôn và nông nghiệp.",
    address: "2 Láng Hạ, Ba Đình, Hà Nội",
    isVerified: true,
    socialLinks: { website: "https://agribank.com.vn" },
  },
  {
    name: "Unilever Việt Nam",
    email: "careers.vietnam@unilever.com",
    phone: "02837217150",
    description:
      "Unilever Việt Nam là công ty hàng tiêu dùng đa quốc gia với các thương hiệu đình đám như OMO, Dove, Knorr, Lipton phục vụ hàng chục triệu hộ gia đình Việt.",
    address: "156 Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://www.unilever.com/planet-and-society/sustainability-in-action/vietnam/",
      linkedin: "https://linkedin.com/company/unilever",
    },
  },
  {
    name: "Thế Giới Di Động",
    email: "tuyendung@thegioididong.com",
    phone: "19001222",
    description:
      "Công ty Cổ phần Đầu tư Thế Giới Di Động là nhà bán lẻ điện thoại, điện tử và thiết bị gia dụng lớn nhất Việt Nam với hệ thống hơn 2.200 cửa hàng trên toàn quốc.",
    address: "Số 128 Trần Quang Khải, Tân Định, Quận 1, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: { website: "https://thegioididong.com" },
  },
  {
    name: "PwC Việt Nam",
    email: "vn_recruitment@pwc.com",
    phone: "02838230796",
    description:
      "PricewaterhouseCoopers Việt Nam (PwC) cung cấp dịch vụ kiểm toán, thuế và tư vấn chuyên nghiệp cho các doanh nghiệp lớn, đa quốc gia tại thị trường Việt Nam.",
    address: "Tầng 8, Saigon Tower, 29 Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: {
      website: "https://pwc.com/vn",
      linkedin: "https://linkedin.com/company/pwc",
    },
  },
  {
    name: "Tập đoàn Hòa Phát",
    email: "nhansu@hoaphatteel.com",
    phone: "02462911111",
    description:
      "Tập đoàn Hòa Phát là doanh nghiệp sản xuất thép lớn nhất Đông Nam Á, đồng thời kinh doanh đa ngành trong lĩnh vực nội thất, điện lạnh, nông nghiệp và bất động sản.",
    address: "Tòa nhà Hòa Phát, 64 Triệu Việt Vương, Hai Bà Trưng, Hà Nội",
    isVerified: true,
    socialLinks: {
      website: "https://hoaphatteel.com",
      linkedin: "https://linkedin.com/company/hoa-phat-group",
    },
  },
  {
    name: "Sacombank",
    email: "tuyendung@sacombank.com",
    phone: "02838267530",
    description:
      "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank) là một trong những ngân hàng thương mại cổ phần lớn nhất Việt Nam với mạng lưới hơn 560 điểm giao dịch.",
    address: "266-268 Nam Kỳ Khởi Nghĩa, Quận 3, TP. Hồ Chí Minh",
    isVerified: true,
    socialLinks: { website: "https://sacombank.com" },
  },
];

// ─── RECRUITER cho từng company (1 recruiter / company) ───────────────────────
const RECRUITERS_DATA = [
  // FPT Software [0]
  {
    email: "hr.fpt@fpt-software.com",
    fullName: "Nguyễn Thị Thu Hà",
    phone: "0912000001",
    address: "Quận 9, TP. Hồ Chí Minh",
    bio: "Chuyên viên tuyển dụng cấp cao tại FPT Software với 7 năm kinh nghiệm trong lĩnh vực CNTT. Chuyên tuyển dụng kỹ sư phần mềm, BA, DevOps và data engineer từ fresher đến senior. Có mạng lưới ứng viên rộng và am hiểu thị trường IT Việt Nam.",
    skills: ["IT Recruitment", "Technical Screening", "Headhunting", "LinkedIn Sourcing", "ATS"],
  },
  // Vietcombank [1]
  {
    email: "hr.vcb@vietcombank.com.vn",
    fullName: "Trần Văn Minh Đức",
    phone: "0912000002",
    address: "Hoàn Kiếm, Hà Nội",
    bio: "Chuyên viên tuyển dụng tại Vietcombank với 6 năm kinh nghiệm trong ngành ngân hàng. Phụ trách tuyển dụng các vị trí từ chuyên viên quan hệ khách hàng, phân tích tín dụng đến vị trí quản lý cấp trung.",
    skills: ["Banking Recruitment", "Volume Hiring", "Competency Interview", "HRIS", "Onboarding"],
  },
  // Shopee [2]
  {
    email: "careers.shopee@shopee.com",
    fullName: "Lê Thị Phương Linh",
    phone: "0912000003",
    address: "Tân Bình, TP. Hồ Chí Minh",
    bio: "Senior Recruiter tại Shopee Vietnam với chuyên môn tuyển dụng tech và product trong môi trường startup quy mô lớn. 5 năm kinh nghiệm tuyển dụng tại các công ty công nghệ Đông Nam Á.",
    skills: ["Tech Recruiting", "Product Recruiting", "Global Hiring", "Diversity Hiring", "Offer Negotiation"],
  },
  // Techcombank [3]
  {
    email: "recruit.tcb@techcombank.com.vn",
    fullName: "Phạm Hồng Sơn",
    phone: "0912000004",
    address: "Hai Bà Trưng, Hà Nội",
    bio: "Chuyên viên tuyển dụng tại Techcombank với 6 năm kinh nghiệm ngân hàng tài chính. Chuyên tuyển dụng các vị trí phân tích tín dụng, quản lý rủi ro và kỹ sư phần mềm ngân hàng.",
    skills: ["Banking Recruitment", "Compliance Hiring", "Assessment Center", "Competency Interview"],
  },
  // Vingroup [4]
  {
    email: "careers.vin@vingroup.net",
    fullName: "Hoàng Thị Lan",
    phone: "0912000005",
    address: "Long Biên, Hà Nội",
    bio: "Talent Acquisition Manager tại Vingroup với 8 năm kinh nghiệm tuyển dụng đa lĩnh vực từ bất động sản, bán lẻ đến công nghệ. Chuyên tuyển dụng vị trí leadership và high-potential talent.",
    skills: ["Talent Strategy", "Executive Search", "Team Management", "Employer Branding", "Succession Planning"],
  },
  // Masan [5]
  {
    email: "hr.masan@masan.com.vn",
    fullName: "Vũ Thị Thanh Tâm",
    phone: "0912000006",
    address: "Quận 10, TP. Hồ Chí Minh",
    bio: "HR Business Partner tại Masan Group với 7 năm kinh nghiệm FMCG và bán lẻ. Phụ trách tuyển dụng sales, marketing và vận hành cho hệ thống phân phối toàn quốc.",
    skills: ["FMCG Recruiting", "Graduate Program", "Field Sales Hiring", "HRBP", "Workforce Planning"],
  },
  // KPMG [6]
  {
    email: "vn.recruit@kpmg.com.vn",
    fullName: "Nguyễn Minh Quân",
    phone: "0912000007",
    address: "Nam Từ Liêm, Hà Nội",
    bio: "Campus & Experienced Hire Recruiter tại KPMG Vietnam với 5 năm kinh nghiệm kiểm toán và tư vấn. Chuyên phụ trách chương trình tuyển sinh cho sinh viên mới ra trường và ứng viên có kinh nghiệm.",
    skills: ["Audit Hiring", "Campus Recruiting", "Case Interview", "Assessment Design", "Employer Branding"],
  },
  // Grab [7]
  {
    email: "talent.grab@grab.com",
    fullName: "Bùi Thị Thùy Tiên",
    phone: "0912000008",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Senior Technical Recruiter tại Grab Vietnam với chuyên môn tuyển dụng kỹ sư phần mềm và data scientist cho thị trường Đông Nam Á. 6 năm kinh nghiệm tại các công ty công nghệ đa quốc gia.",
    skills: ["Technical Recruiting", "Engineering Hiring", "Data Science Hiring", "Global Sourcing", "DEI"],
  },
  // VNG [8]
  {
    email: "hr.vng@vng.com.vn",
    fullName: "Trần Thị Hải Yến",
    phone: "0912000009",
    address: "Quận 11, TP. Hồ Chí Minh",
    bio: "Chuyên viên tuyển dụng tại VNG Corporation với 5 năm kinh nghiệm trong lĩnh vực game và công nghệ. Phụ trách tuyển dụng kỹ sư phần mềm, game designer và data analyst.",
    skills: ["Tech Recruiting", "Game Industry Hiring", "LinkedIn Sourcing", "Technical Interview"],
  },
  // MoMo [9]
  {
    email: "careers.momo@momo.vn",
    fullName: "Phan Quốc Hưng",
    phone: "0912000010",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    bio: "Talent Acquisition Specialist tại MoMo với 4 năm kinh nghiệm fintech. Chuyên tuyển dụng kỹ sư backend, mobile developer và chuyên viên tài chính số cho nền tảng ví điện tử lớn nhất Việt Nam.",
    skills: ["Fintech Recruiting", "Mobile Hiring", "Backend Hiring", "Stakeholder Management"],
  },
  // Tiki [10]
  {
    email: "talent.tiki@tiki.vn",
    fullName: "Lý Thị Kim Ngân",
    phone: "0912000011",
    address: "Tân Bình, TP. Hồ Chí Minh",
    bio: "Senior Recruiter tại Tiki với 5 năm kinh nghiệm e-commerce. Phụ trách tuyển dụng product, engineering và data cho nền tảng thương mại điện tử nội địa hàng đầu.",
    skills: ["E-commerce Recruiting", "Product Hiring", "Data Hiring", "ATS", "Employer Branding"],
  },
  // Lazada [11]
  {
    email: "hr.lazada@lazada.vn",
    fullName: "Đinh Văn Thắng",
    phone: "0912000012",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "HR Manager tại Lazada Vietnam với 6 năm kinh nghiệm trong ngành e-commerce và logistics. Phụ trách tuyển dụng toàn bộ vị trí từ operations đến technology.",
    skills: ["E-commerce Hiring", "Logistics Recruiting", "Volume Hiring", "Assessment Center"],
  },
  // Deloitte [12]
  {
    email: "vn.recruit@deloitte.com",
    fullName: "Ngô Thị Bích Phượng",
    phone: "0912000013",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Campus Recruiter tại Deloitte Vietnam với 4 năm kinh nghiệm professional services. Chuyên tuyển dụng cho các bộ phận Audit, Tax, Advisory và Consulting.",
    skills: ["Professional Services HR", "Campus Recruiting", "Case Interview", "Audit Hiring", "Tax Hiring"],
  },
  // Be Group [13]
  {
    email: "careers.be@be.com.vn",
    fullName: "Cao Minh Tuấn",
    phone: "0912000014",
    address: "Nam Từ Liêm, Hà Nội",
    bio: "Talent Acquisition tại Be Group với 3 năm kinh nghiệm trong lĩnh vực ride-hailing và công nghệ. Chuyên tuyển dụng mobile developer, backend engineer và operations specialist.",
    skills: ["Tech Recruiting", "Startup Hiring", "Mobile Hiring", "Operations Hiring"],
  },
  // Agribank [14]
  {
    email: "tuyendung.agribank@agribank.com.vn",
    fullName: "Dương Thị Mai Hương",
    phone: "0912000015",
    address: "Ba Đình, Hà Nội",
    bio: "Chuyên viên tuyển dụng tại Agribank với 8 năm kinh nghiệm trong ngành ngân hàng nhà nước. Phụ trách tuyển dụng cho hệ thống hơn 2.300 chi nhánh và phòng giao dịch toàn quốc.",
    skills: ["Banking Recruitment", "Volume Hiring", "Rural Banking Hiring", "Government Bank HR"],
  },
  // Unilever [15]
  {
    email: "careers.vn@unilever.com",
    fullName: "Hoàng Thị Diệu Linh",
    phone: "0912000016",
    address: "Quận 7, TP. Hồ Chí Minh",
    bio: "HR Business Partner tại Unilever Vietnam với 6 năm kinh nghiệm FMCG đa quốc gia. Phụ trách tuyển dụng và phát triển nhân sự cho khối marketing, sales và supply chain.",
    skills: ["FMCG Recruiting", "Graduate Program", "Management Trainee", "Employer Branding", "DEI"],
  },
  // TGDĐ [16]
  {
    email: "tuyendung.tgdd@thegioididong.com",
    fullName: "Phùng Văn Đại",
    phone: "0912000017",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Trưởng phòng tuyển dụng tại Thế Giới Di Động với 9 năm kinh nghiệm bán lẻ. Phụ trách tuyển dụng nhân sự cho hệ thống hơn 2.200 cửa hàng, trung tâm phân phối và văn phòng.",
    skills: ["Retail Recruiting", "Volume Hiring", "Store Staff Hiring", "Management Recruiting"],
  },
  // PwC [17]
  {
    email: "vn.careers@pwc.com",
    fullName: "Từ Thị Mỹ Linh",
    phone: "0912000018",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Recruiter tại PwC Vietnam với 4 năm kinh nghiệm professional services. Chuyên tuyển dụng cho các service line Assurance, Tax, Deals và Advisory.",
    skills: ["Big 4 Recruiting", "Campus Hiring", "Experienced Hire", "Professional Interview"],
  },
  // Hòa Phát [18]
  {
    email: "nhansu.hp@hoaphatteel.com",
    fullName: "Lê Bá Hoàng",
    phone: "0912000019",
    address: "Hai Bà Trưng, Hà Nội",
    bio: "Trưởng phòng nhân sự tuyển dụng tại Hòa Phát Group với 10 năm kinh nghiệm trong ngành sản xuất và công nghiệp nặng. Phụ trách tuyển dụng cho các nhà máy thép và các đơn vị sản xuất.",
    skills: ["Manufacturing Recruiting", "Engineering Hiring", "Industrial HR", "Volume Hiring"],
  },
  // Sacombank [19]
  {
    email: "tuyendung.scb@sacombank.com",
    fullName: "Võ Thị Thanh Thảo",
    phone: "0912000020",
    address: "Quận 3, TP. Hồ Chí Minh",
    bio: "Chuyên viên tuyển dụng tại Sacombank với 5 năm kinh nghiệm ngân hàng thương mại. Phụ trách tuyển dụng cho khối kinh doanh cá nhân, doanh nghiệp và các trung tâm giao dịch trên toàn quốc.",
    skills: ["Retail Banking HR", "Volume Hiring", "Relationship Banking Hiring", "Assessment Center"],
  },
];

// ─── 20 CANDIDATES ────────────────────────────────────────────────────────────
const CANDIDATES_DATA = [
  {
    email: "nguyenvanminh@gmail.com",
    fullName: "Nguyễn Văn Minh",
    phone: "0912345678",
    address: "Quận 3, TP. Hồ Chí Minh",
    bio: "Lập trình viên backend với hơn 3 năm kinh nghiệm làm việc với Node.js, NestJS và PostgreSQL. Đam mê xây dựng các hệ thống có khả năng mở rộng cao và luôn chú trọng đến chất lượng code. Đang tìm kiếm cơ hội phát triển tại các công ty công nghệ hàng đầu.",
    skills: ["Node.js", "NestJS", "PostgreSQL", "Docker", "Redis", "TypeScript", "REST API", "GraphQL"],
  },
  {
    email: "tranthilanhanh@gmail.com",
    fullName: "Trần Thị Lan Anh",
    phone: "0987654321",
    address: "Cầu Giấy, Hà Nội",
    bio: "Chuyên viên marketing với 4 năm kinh nghiệm trong digital marketing, SEO, SEM và quản lý mạng xã hội. Đã triển khai thành công nhiều chiến dịch cho các thương hiệu bán lẻ và thương mại điện tử.",
    skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Analytics", "Email Marketing", "Copywriting"],
  },
  {
    email: "phamquocbao@gmail.com",
    fullName: "Phạm Quốc Bảo",
    phone: "0901122334",
    address: "Hải Châu, Đà Nẵng",
    bio: "Nhân viên kinh doanh B2B với 5 năm kinh nghiệm trong ngành phần mềm doanh nghiệp. Kỹ năng đàm phán tốt, xây dựng mối quan hệ khách hàng bền vững và thành tích vượt KPI liên tục 3 năm liền.",
    skills: ["B2B Sales", "CRM", "Negotiation", "Prospecting", "Cold Calling", "HubSpot", "Presentation"],
  },
  {
    email: "lethibichngoc@gmail.com",
    fullName: "Lê Thị Bích Ngọc",
    phone: "0933445566",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    bio: "Chuyên viên nhân sự với 3 năm kinh nghiệm tuyển dụng và phát triển nguồn nhân lực. Thế mạnh trong xây dựng quy trình tuyển dụng, đánh giá năng lực ứng viên và triển khai chính sách phúc lợi.",
    skills: ["Recruitment", "HR Policy", "HRBP", "Onboarding", "Employee Relations", "KPI Design", "Labor Law"],
  },
  {
    email: "hoangminhtuan@gmail.com",
    fullName: "Hoàng Minh Tuấn",
    phone: "0944556677",
    address: "Hoàn Kiếm, Hà Nội",
    bio: "Kỹ sư frontend 4 năm kinh nghiệm với React, Next.js và TypeScript. Chú trọng UX/UI và tối ưu hiệu suất ứng dụng web. Đang tìm kiếm môi trường startup nơi vừa code vừa đóng góp ý kiến về product.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma", "Redux", "Jest", "Storybook"],
  },
  {
    email: "nguyenthimai@gmail.com",
    fullName: "Nguyễn Thị Mai",
    phone: "0955667788",
    address: "Thanh Khê, Đà Nẵng",
    bio: "Chuyên viên kế toán với 6 năm kinh nghiệm tại doanh nghiệp sản xuất và thương mại. Thành thạo MISA, Fast, SAP và có kiến thức vững về VAS lẫn IFRS. Mong muốn lên vị trí Kế toán trưởng trong 2-3 năm tới.",
    skills: ["MISA", "SAP", "VAS", "IFRS", "Tax Declaration", "Financial Reporting", "Excel Advanced", "Auditing"],
  },
  {
    email: "vuducthanh@gmail.com",
    fullName: "Vũ Đức Thành",
    phone: "0966778899",
    address: "Long Biên, Hà Nội",
    bio: "Data Analyst 3 năm kinh nghiệm phân tích dữ liệu kinh doanh cho fintech và e-commerce. Thành thạo Python, SQL và Power BI. Hiện đang nghiên cứu thêm machine learning để mở rộng khả năng phân tích.",
    skills: ["Python", "SQL", "Power BI", "Tableau", "Excel", "Statistics", "ETL", "A/B Testing"],
  },
  {
    email: "dothihuong@gmail.com",
    fullName: "Đỗ Thị Hương",
    phone: "0977889900",
    address: "Quận 7, TP. Hồ Chí Minh",
    bio: "Chuyên viên tư vấn tài chính cá nhân với chứng chỉ CFP và 5 năm kinh nghiệm tại ngân hàng. Có kiến thức sâu về sản phẩm ngân hàng, bảo hiểm nhân thọ, quỹ đầu tư và lập kế hoạch tài chính.",
    skills: ["Financial Planning", "Investment Advisory", "Insurance", "CFP", "Banking Products", "KYC", "AML"],
  },
  {
    email: "nguyenhuuphuc@gmail.com",
    fullName: "Nguyễn Hữu Phúc",
    phone: "0988990011",
    address: "Sơn Trà, Đà Nẵng",
    bio: "Kỹ sư DevOps 4 năm kinh nghiệm xây dựng và vận hành hạ tầng cloud. Kinh nghiệm với AWS, GCP, Kubernetes và các công cụ CI/CD. Thế mạnh trong tối ưu chi phí cloud và cải thiện độ tin cậy hệ thống.",
    skills: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux", "Monitoring", "Ansible"],
  },
  {
    email: "buithithuytien@gmail.com",
    fullName: "Bùi Thị Thùy Tiên",
    phone: "0999001122",
    address: "Quận 1, TP. Hồ Chí Minh",
    bio: "Chuyên viên quan hệ công chúng 4 năm kinh nghiệm trong PR và truyền thông doanh nghiệp. Quản lý nhiều chiến dịch PR thành công cho FMCG, bất động sản và công nghệ. Mạng lưới báo chí và truyền thông rộng.",
    skills: ["PR Strategy", "Media Relations", "Crisis Management", "Press Release", "Event Management", "Storytelling"],
  },
  {
    email: "tranvankhanh@gmail.com",
    fullName: "Trần Văn Khánh",
    phone: "0900112233",
    address: "Ba Đình, Hà Nội",
    bio: "Business Analyst 5 năm kinh nghiệm tại công ty phần mềm và ngân hàng. Khả năng thu thập yêu cầu, phân tích quy trình nghiệp vụ và viết tài liệu đặc tả kỹ thuật rõ ràng. Thành thạo Agile/Scrum.",
    skills: ["Business Analysis", "Requirements Gathering", "BPMN", "UML", "Agile", "Scrum", "JIRA", "SQL"],
  },
  {
    email: "phamthinghiem@gmail.com",
    fullName: "Phạm Thị Nghiêm",
    phone: "0911223344",
    address: "Ngũ Hành Sơn, Đà Nẵng",
    bio: "Giáo viên tiếng Anh với bằng TESOL và 6 năm kinh nghiệm tại trung tâm anh ngữ và trường quốc tế. Có kinh nghiệm dạy IELTS, TOEIC và Business English. Tìm cơ hội chuyển sang L&D doanh nghiệp.",
    skills: ["TESOL", "IELTS Training", "Business English", "Curriculum Design", "E-learning", "Facilitation"],
  },
  {
    email: "lethanhlong@gmail.com",
    fullName: "Lê Thành Long",
    phone: "0922334455",
    address: "Tân Bình, TP. Hồ Chí Minh",
    bio: "Kỹ sư AI/ML 3 năm kinh nghiệm triển khai mô hình học máy trong NLP và computer vision. Thành thạo TensorFlow, PyTorch. Đã publish paper nghiên cứu và tham gia các cuộc thi AI trên Kaggle.",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "MLOps", "Scikit-learn", "Transformers"],
  },
  {
    email: "nguyenthithuy@gmail.com",
    fullName: "Nguyễn Thị Thúy",
    phone: "0933556677",
    address: "Cầu Giấy, Hà Nội",
    bio: "Chuyên viên kiểm toán 4 năm kinh nghiệm tại Big 4. Thành thạo IFRS và VAS. Đang theo học ACCA và mong muốn phát triển lên Senior Auditor. Cẩn thận, tỉ mỉ và có khả năng làm việc dưới áp lực cao.",
    skills: ["External Audit", "IFRS", "VAS", "Financial Reporting", "Risk-based Audit", "Excel", "ACCA"],
  },
  {
    email: "dongocson@gmail.com",
    fullName: "Đỗ Ngọc Sơn",
    phone: "0944667788",
    address: "Hải Châu, Đà Nẵng",
    bio: "Kỹ sư phần mềm full-stack 3 năm kinh nghiệm với React và Node.js. Đam mê xây dựng sản phẩm từ đầu đến cuối và quan tâm đến trải nghiệm người dùng. Có kinh nghiệm làm việc trong môi trường startup.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Docker", "AWS", "REST API", "GraphQL"],
  },
  {
    email: "vuanhthu@gmail.com",
    fullName: "Vũ Anh Thư",
    phone: "0955778899",
    address: "Quận 2, TP. Hồ Chí Minh",
    bio: "Chuyên viên phân tích tín dụng 3 năm kinh nghiệm tại ngân hàng. Thành thạo phân tích báo cáo tài chính và mô hình tín dụng. Đang học CFA Level 2 và mong muốn phát triển trong lĩnh vực đầu tư.",
    skills: ["Credit Analysis", "Financial Statement Analysis", "Risk Assessment", "Excel", "Financial Modeling", "CFA"],
  },
  {
    email: "nguyenvanhung@gmail.com",
    fullName: "Nguyễn Văn Hùng",
    phone: "0966889900",
    address: "Thủ Đức, TP. Hồ Chí Minh",
    bio: "Kỹ sư mobile (iOS & Android) 4 năm kinh nghiệm. Thành thạo Swift và Kotlin. Đã publish nhiều ứng dụng lên App Store và Google Play. Đang tìm kiếm công ty sản phẩm để phát triển lâu dài.",
    skills: ["Swift", "Kotlin", "iOS", "Android", "React Native", "Firebase", "REST API", "Git"],
  },
  {
    email: "linhthinhung@gmail.com",
    fullName: "Linh Thị Nhung",
    phone: "0977990011",
    address: "Hoàng Mai, Hà Nội",
    bio: "Chuyên viên nhân sự tổng hợp 4 năm kinh nghiệm. Thành thạo quy trình tuyển dụng, lương thưởng, bảo hiểm và phúc lợi. Có kiến thức vững về Bộ luật Lao động và muốn phát triển theo hướng HRBP.",
    skills: ["Recruitment", "Payroll", "Labor Law", "HRIS", "Employee Relations", "Training", "Performance Management"],
  },
  {
    email: "caovantien@gmail.com",
    fullName: "Cao Văn Tiến",
    phone: "0988001122",
    address: "Bắc Từ Liêm, Hà Nội",
    bio: "Kỹ sư hệ thống & vận hành 5 năm kinh nghiệm trong lĩnh vực sản xuất và công nghiệp. Thành thạo quản lý dự án, kiểm soát chất lượng và tối ưu hóa quy trình sản xuất. Kinh nghiệm với các tiêu chuẩn ISO.",
    skills: ["Process Engineering", "Quality Control", "ISO 9001", "Project Management", "Lean Manufacturing", "AutoCAD"],
  },
  {
    email: "ngothilananh@gmail.com",
    fullName: "Ngô Thị Lan Anh",
    phone: "0999112233",
    address: "Đống Đa, Hà Nội",
    bio: "Chuyên viên tài chính kế hoạch (FP&A) 4 năm kinh nghiệm tại doanh nghiệp đa quốc gia. Thành thạo lập kế hoạch ngân sách, phân tích phương sai và báo cáo quản trị. Thành thạo Excel và Power BI.",
    skills: ["FP&A", "Budgeting", "Financial Modeling", "Excel", "Power BI", "Management Reporting", "Forecasting"],
  },
];

// ─── JOB TEMPLATES theo industry ─────────────────────────────────────────────
// companyIndex tương ứng với COMPANIES_DATA và RECRUITERS_DATA

const JOBS_TEMPLATES = [
  // ── FPT Software (0) ──────────────────────────────────────────────────────
  {
    title: "Kỹ sư Backend Cấp Cao (Node.js)",
    companyIndex: 0,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Node.js", "NestJS", "PostgreSQL", "Microservices", "Docker", "AWS", "TypeScript", "Redis"],
    description: "FPT Software tìm kiếm Kỹ sư Backend Senior có kinh nghiệm xây dựng hệ thống microservices quy mô lớn. Bạn sẽ thiết kế và phát triển các API hiệu suất cao, tối ưu cơ sở dữ liệu và mentoring cho junior developer.\n\nYêu cầu:\n- 4+ năm kinh nghiệm với Node.js/NestJS\n- Thành thạo PostgreSQL, Redis\n- Kinh nghiệm với Docker, Kubernetes\n- Hiểu biết về Clean Architecture và SOLID\n- Thành thạo TypeScript",
    benefits: ["Lương cạnh tranh", "Thưởng hiệu suất 2-4 tháng/năm", "Bảo hiểm sức khỏe cao cấp", "Budget học tập $500/năm", "Hybrid 2 ngày/tuần", "MacBook Pro được cấp"],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Lập trình viên Frontend (React/Next.js)",
    companyIndex: 0,
    location: "Remote",
    salary: "$1,500 - $2,500",
    type: "REMOTE",
    level: "Middle",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Figma", "Jest", "Performance Optimization"],
    description: "Vị trí Frontend Developer remote, tham gia phát triển sản phẩm web cho khách hàng quốc tế. Bạn sẽ làm việc chặt chẽ với đội design và backend để xây dựng giao diện chất lượng cao.\n\nYêu cầu:\n- 2+ năm với React, Next.js\n- Thành thạo TypeScript, Tailwind CSS\n- Kinh nghiệm với state management\n- Khả năng đọc hiểu Figma\n- Tiếng Anh giao tiếp tốt",
    benefits: ["Hoàn toàn remote", "Thiết bị làm việc được cấp", "Bảo hiểm sức khỏe", "13 tháng lương", "Flexible working hours", "Phụ cấp điện/internet"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kỹ sư DevOps",
    companyIndex: 0,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,000",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker", "Linux", "Monitoring", "Ansible"],
    description: "Tìm kiếm DevOps Engineer có kinh nghiệm vận hành và tối ưu hóa hạ tầng cloud cho các dự án outsourcing quy mô lớn.\n\nYêu cầu:\n- 3+ năm kinh nghiệm DevOps/SRE\n- Thành thạo AWS hoặc GCP\n- Kinh nghiệm với Kubernetes, Terraform\n- Hiểu biết về bảo mật hệ thống\n- Kỹ năng scripting (Bash, Python)",
    benefits: ["Lương hấp dẫn", "AWS/GCP certification được tài trợ", "Bảo hiểm sức khỏe", "On-call allowance", "Laptop cao cấp"],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý Dự án CNTT (IT Project Manager)",
    companyIndex: 0,
    location: "TP. Hồ Chí Minh",
    salary: "$2,500 - $4,000",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Project Management", "PMP", "Agile", "Scrum", "Budget Management", "Client Communication", "IT Outsourcing"],
    description: "FPT Software tìm IT Project Manager để quản lý các dự án outsourcing quy mô lớn cho khách hàng Nhật Bản và Mỹ. Bạn sẽ chịu trách nhiệm về tiến độ, chất lượng và ngân sách dự án.\n\nYêu cầu:\n- 5+ năm kinh nghiệm quản lý dự án IT\n- Chứng chỉ PMP hoặc PMI-ACP\n- Tiếng Anh thành thạo\n- Tiếng Nhật N2 là lợi thế",
    benefits: ["Lương cao theo năng lực", "Project completion bonus", "PMP renewal sponsored", "Bảo hiểm sức khỏe cao cấp", "MacBook Pro"],
    slots: 3,
    isHot: true,
    statusVariant: "published_near",
  },
  {
    title: "Thực tập sinh Phát triển Phần mềm",
    companyIndex: 0,
    location: "Đà Nẵng",
    salary: "5,000,000 - 8,000,000 VND",
    type: "INTERNSHIP",
    level: "Intern",
    tags: ["Java", "Python", "Git", "Agile", "REST API", "Problem Solving", "Teamwork"],
    description: "Chương trình thực tập 6 tháng dành cho sinh viên CNTT năm 3-4. Bạn sẽ tham gia các dự án thực tế với mentor support đầy đủ.\n\nYêu cầu:\n- Sinh viên năm 3-4 ngành CNTT\n- Biết lập trình Java hoặc Python cơ bản\n- Ham học hỏi và chịu khó",
    benefits: ["Thực tập có lương", "Mentor từ senior engineer", "Làm dự án thực tế", "Certificate hoàn thành", "Cơ hội offer full-time"],
    slots: 10,
    isHot: false,
    statusVariant: "published_past",
  },

  // ── Vietcombank (1) ──────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Quan hệ Khách hàng Doanh nghiệp",
    companyIndex: 1,
    location: "Hà Nội",
    salary: "22,000,000 - 38,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Corporate Banking", "Relationship Management", "Credit Analysis", "Trade Finance", "Cross-selling"],
    description: "Vietcombank tìm Chuyên viên QHKH Doanh nghiệp phụ trách quản lý và phát triển danh mục khách hàng doanh nghiệp vừa và lớn.\n\nYêu cầu:\n- 3+ năm kinh nghiệm corporate banking\n- Hiểu biết sâu về phân tích tín dụng\n- Kinh nghiệm với trade finance, cash management\n- Kỹ năng thuyết trình và đàm phán tốt",
    benefits: ["Lương cơ bản cao", "Hoa hồng theo danh mục", "Bảo hiểm cao cấp toàn gia đình", "Vay ưu đãi nhân viên", "Du lịch hàng năm"],
    slots: 5,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Phân tích Tín dụng Bán lẻ",
    companyIndex: 1,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 30,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Credit Analysis", "Financial Statement Analysis", "Risk Assessment", "Loan Structuring", "Excel"],
    description: "Tìm Chuyên viên Phân tích Tín dụng để thẩm định hồ sơ vay vốn của khách hàng cá nhân và doanh nghiệp nhỏ.\n\nYêu cầu:\n- 2+ năm kinh nghiệm phân tích tín dụng\n- Thành thạo phân tích báo cáo tài chính\n- Kỹ năng Excel tốt",
    benefits: ["Lương hấp dẫn", "Thưởng hiệu suất cuối năm", "Bảo hiểm sức khỏe", "Vay ưu đãi nhân viên", "Đào tạo chuyên sâu"],
    slots: 8,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Giao dịch viên",
    companyIndex: 1,
    location: "Hà Nội",
    salary: "12,000,000 - 18,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Teller", "Banking Products", "Cash Management", "Customer Service", "KYC"],
    description: "Tuyển Giao dịch viên tại các chi nhánh Vietcombank khu vực Hà Nội. Phù hợp cho người mới ra trường muốn xây dựng sự nghiệp ngân hàng.\n\nYêu cầu:\n- Tốt nghiệp Đại học (ưu tiên Kinh tế, Tài chính)\n- Ngoại hình sáng sủa, giao tiếp tốt\n- Cẩn thận và có trách nhiệm cao",
    benefits: ["Lương cơ bản + thưởng", "Bảo hiểm xã hội đầy đủ", "Đào tạo nghiệp vụ bài bản", "Môi trường chuyên nghiệp"],
    slots: 20,
    isHot: false,
    statusVariant: "closed",
  },

  // ── Shopee (2) ───────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Mobile (React Native)",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["React Native", "iOS", "Android", "TypeScript", "Redux", "Performance Optimization", "Fastlane"],
    description: "Shopee tìm Mobile Developer tài năng để phát triển ứng dụng di động phục vụ hàng triệu người dùng Đông Nam Á.\n\nYêu cầu:\n- 3+ năm kinh nghiệm React Native\n- Kinh nghiệm tối ưu hiệu suất ứng dụng\n- Hiểu biết về native iOS và Android\n- Thành thạo TypeScript",
    benefits: ["Mức lương top thị trường", "Annual bonus + Performance bonus", "Bảo hiểm sức khỏe cao cấp", "Free lunch tại văn phòng", "Learning budget $1,500/năm"],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý Sản phẩm - Thương mại Điện tử",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$2,500 - $4,000",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Product Management", "Agile", "User Research", "Data Analysis", "A/B Testing", "E-commerce"],
    description: "Tìm kiếm Product Manager có kinh nghiệm trong mảng e-commerce để dẫn dắt phát triển các tính năng người dùng cuối.\n\nYêu cầu:\n- 4+ năm kinh nghiệm Product Management\n- Hiểu biết sâu về e-commerce\n- Thành thạo data analysis, A/B testing\n- Tiếng Anh thành thạo",
    benefits: ["Competitive salary", "Annual bonus", "RSU cho cấp senior", "Premium health insurance", "Free lunch"],
    slots: 1,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhà thiết kế UX/UI",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$1,500 - $2,800",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["UI Design", "UX Research", "Figma", "Prototyping", "Design System", "User Testing", "Mobile Design"],
    description: "Shopee tìm UX/UI Designer cấp Senior để dẫn dắt thiết kế trải nghiệm người dùng cho các tính năng mới.\n\nYêu cầu:\n- 4+ năm kinh nghiệm UX/UI design\n- Portfolio mạnh\n- Thành thạo Figma\n- Kinh nghiệm thiết kế cho mobile app",
    benefits: ["Competitive salary", "Annual bonus", "Bảo hiểm sức khỏe", "Design tools license", "Free lunch", "MacBook Pro"],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Kỹ sư Dữ liệu (Data Engineer)",
    companyIndex: 2,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Python", "Spark", "Kafka", "Airflow", "Data Warehouse", "ETL", "SQL", "dbt"],
    description: "Shopee tìm Data Engineer để xây dựng và vận hành hạ tầng dữ liệu phục vụ hàng chục team analyst.\n\nYêu cầu:\n- 3+ năm kinh nghiệm data engineering\n- Thành thạo Python, SQL, Spark, Kafka\n- Kinh nghiệm cloud data warehouse\n- Hiểu biết về data modeling",
    benefits: ["Lương top market", "Annual bonus", "RSU", "Bảo hiểm cao cấp", "Free lunch", "MacBook Pro"],
    slots: 2,
    isHot: false,
    statusVariant: "closed",
  },

  // ── Techcombank (3) ──────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Phân tích Hệ thống Ngân hàng (BA)",
    companyIndex: 3,
    location: "Hà Nội",
    salary: "25,000,000 - 40,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Business Analysis", "Banking Systems", "BPMN", "Requirements Gathering", "Agile", "SQL", "Core Banking"],
    description: "Techcombank tìm BA có kinh nghiệm ngân hàng để tham gia các dự án chuyển đổi số.\n\nYêu cầu:\n- 4+ năm kinh nghiệm BA trong ngân hàng/tài chính\n- Am hiểu quy trình nghiệp vụ ngân hàng\n- Thành thạo BPMN, UML\n- Tiếng Anh đọc hiểu tốt",
    benefits: ["Lương cơ bản cao", "Thưởng hiệu suất", "Bảo hiểm cao cấp", "Vay ưu đãi lãi suất thấp", "Lộ trình thăng tiến rõ ràng"],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Lập trình viên Backend (Java Spring Boot)",
    companyIndex: 3,
    location: "Hà Nội",
    salary: "25,000,000 - 45,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Java", "Spring Boot", "Microservices", "Kafka", "Oracle", "Docker", "REST API", "Core Banking"],
    description: "Techcombank Technology tìm Senior Backend Developer để phát triển hệ thống ngân hàng lõi và các ứng dụng fintech.\n\nYêu cầu:\n- 4+ năm kinh nghiệm Java Spring Boot\n- Kinh nghiệm với Kafka, Redis\n- Hiểu biết về bảo mật ứng dụng ngân hàng\n- Kinh nghiệm TDD và Clean Code",
    benefits: ["Lương cạnh tranh với Big Tech", "Bonus hiệu suất", "Bảo hiểm sức khỏe", "Remote 2 ngày/tuần", "MacBook hoặc PC cao cấp"],
    slots: 3,
    isHot: true,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Quản lý Rủi ro Thị trường",
    companyIndex: 3,
    location: "Hà Nội",
    salary: "25,000,000 - 40,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Risk Management", "Basel III", "Market Risk", "Credit Risk", "Stress Testing", "VaR", "FRM"],
    description: "Techcombank tìm Chuyên viên Quản lý Rủi ro tham gia nhóm Enterprise Risk Management.\n\nYêu cầu:\n- 3+ năm kinh nghiệm quản lý rủi ro ngân hàng\n- Hiểu biết sâu về Basel II/III\n- FRM là lợi thế lớn\n- Tiếng Anh thành thạo",
    benefits: ["Lương cạnh tranh", "FRM sponsored", "Vay ưu đãi nhân viên", "Môi trường fintech hiện đại", "Annual trip"],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Vingroup (4) ─────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Phần mềm Nhúng (Embedded C/C++)",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "20,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["C/C++", "Embedded Systems", "RTOS", "CAN Bus", "AUTOSAR", "Linux Embedded", "Firmware"],
    description: "VinAI tìm kỹ sư phần mềm nhúng để phát triển hệ thống điều khiển xe ô tô điện VinFast.\n\nYêu cầu:\n- 3+ năm kinh nghiệm C/C++ nhúng\n- Kinh nghiệm với RTOS\n- Hiểu biết về giao thức CAN Bus, SPI, I2C\n- AUTOSAR là lợi thế",
    benefits: ["Lương tương đương thị trường quốc tế", "Bảo hiểm sức khỏe cao cấp", "Vay mua xe VinFast ưu đãi", "Đào tạo chuyên môn liên tục"],
    slots: 5,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý PR & Truyền thông",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "35,000,000 - 55,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["PR Strategy", "Media Relations", "Crisis Management", "Corporate Communication", "Brand Reputation"],
    description: "Vingroup tìm PR & Communications Manager để quản lý hình ảnh và truyền thông tập đoàn.\n\nYêu cầu:\n- 6+ năm kinh nghiệm PR/Corporate Communications\n- Mạng lưới quan hệ báo chí rộng\n- Kinh nghiệm xử lý khủng hoảng\n- Kỹ năng viết lách xuất sắc",
    benefits: ["Lương thỏa thuận", "Bonus hiệu suất cao", "Bảo hiểm toàn diện", "Xe đưa đón", "Đào tạo leadership"],
    slots: 1,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhân viên Quản lý Chương trình Đào tạo (L&D)",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "22,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Learning & Development", "Curriculum Design", "E-learning", "Facilitation", "LMS", "Leadership Development"],
    description: "Vingroup tìm Chuyên viên L&D để thiết kế và triển khai chương trình học tập cho hàng nghìn nhân viên.\n\nYêu cầu:\n- 3+ năm kinh nghiệm L&D hoặc đào tạo doanh nghiệp\n- Kinh nghiệm thiết kế chương trình và e-learning\n- Kỹ năng facilitation và presentation xuất sắc",
    benefits: ["Lương cạnh tranh", "L&D budget cho bản thân", "Bảo hiểm sức khỏe", "Flexible working"],
    slots: 1,
    isHot: false,
    statusVariant: "draft",
  },
  {
    title: "Chuyên viên Phát triển Kinh doanh Bất động sản",
    companyIndex: 4,
    location: "Hà Nội",
    salary: "28,000,000 - 50,000,000 VND + hoa hồng",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Real Estate", "Business Development", "Sales", "Negotiation", "Market Research", "Investment Analysis"],
    description: "VinHomes tìm Chuyên viên Phát triển Kinh doanh để mở rộng thị phần và phát triển các dự án bất động sản cao cấp.\n\nYêu cầu:\n- 5+ năm kinh nghiệm bán hàng bất động sản\n- Mạng lưới khách hàng tốt\n- Kỹ năng đàm phán xuất sắc",
    benefits: ["Lương cơ bản + hoa hồng không giới hạn", "Ưu đãi mua nhà VinHomes", "Bảo hiểm cao cấp", "Xe công ty"],
    slots: 10,
    isHot: true,
    statusVariant: "published_future",
  },

  // ── Masan Group (5) ──────────────────────────────────────────────────────────
  {
    title: "Trưởng Nhóm Kinh doanh FMCG",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "22,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Team Lead",
    tags: ["FMCG Sales", "Team Leadership", "Distribution Management", "Key Account", "Route to Market"],
    description: "Masan tìm Sales Team Leader phụ trách khu vực TP.HCM, dẫn dắt đội nhóm 8-10 nhân viên bán hàng.\n\nYêu cầu:\n- 4+ năm kinh nghiệm FMCG sales\n- 1 năm quản lý\n- Am hiểu thị trường bán lẻ truyền thống và hiện đại",
    benefits: ["Lương cơ bản + thưởng doanh số", "Xăng xe và phụ cấp đi lại", "Bảo hiểm sức khỏe", "Sản phẩm miễn phí hàng tháng"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Marketing Nội dung",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "15,000,000 - 22,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Content Writing", "SEO", "Social Media", "Copywriting", "Brand Storytelling", "Canva", "Analytics"],
    description: "Masan tìm Content Marketing Specialist cho các thương hiệu tiêu dùng hàng đầu. Sản xuất nội dung đa kênh từ social media, website đến email marketing.\n\nYêu cầu:\n- 1-2 năm kinh nghiệm content marketing\n- Khả năng viết lách sáng tạo\n- Hiểu biết về SEO cơ bản",
    benefits: ["Lương thưởng cạnh tranh", "Bảo hiểm sức khỏe", "Sản phẩm Masan miễn phí hàng tháng", "Teambuilding hàng quý"],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Kế toán Tổng hợp",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 28,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["General Accounting", "MISA", "VAS", "Tax Declaration", "Financial Reporting", "Month-end Close"],
    description: "Masan tìm Kế toán Tổng hợp để xử lý nghiệp vụ kế toán hàng ngày và hỗ trợ lập báo cáo tài chính.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kế toán tổng hợp\n- Thành thạo MISA\n- Hiểu biết vững về VAS và luật thuế",
    benefits: ["Lương cơ bản tốt", "Bảo hiểm sức khỏe", "Sản phẩm công ty", "13 tháng lương"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Phân tích Chuỗi Cung ứng (Supply Chain Analyst)",
    companyIndex: 5,
    location: "TP. Hồ Chí Minh",
    salary: "20,000,000 - 32,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Supply Chain", "Demand Planning", "Inventory Management", "SAP", "Data Analysis", "Forecasting", "S&OP"],
    description: "Masan tìm Supply Chain Analyst để tối ưu hoạt động chuỗi cung ứng từ nhà máy đến điểm bán lẻ.\n\nYêu cầu:\n- 2+ năm kinh nghiệm supply chain\n- Thành thạo Excel, SAP\n- Kỹ năng phân tích dữ liệu tốt",
    benefits: ["Lương cạnh tranh", "Performance bonus", "Sản phẩm Masan", "Đào tạo supply chain"],
    slots: 2,
    isHot: false,
    statusVariant: "closed",
  },

  // ── KPMG (6) ──────────────────────────────────────────────────────────────────
  {
    title: "Kiểm toán viên Cấp Cao (Senior Auditor)",
    companyIndex: 6,
    location: "Hà Nội",
    salary: "25,000,000 - 40,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["External Audit", "IFRS", "VAS", "Financial Reporting", "Risk-based Audit", "Client Management", "Big 4"],
    description: "KPMG tìm Senior Auditor để thực hiện kiểm toán báo cáo tài chính cho khách hàng lớn.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kiểm toán (ưu tiên Big 4)\n- ACCA/CPA là bắt buộc hoặc đang học\n- Thành thạo IFRS và VAS\n- Tiếng Anh thành thạo",
    benefits: ["Lương cạnh tranh", "ACCA/CPA study leave", "Bảo hiểm sức khỏe", "International secondment", "Fast-track promotion"],
    slots: 4,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Tư vấn Thuế",
    companyIndex: 6,
    location: "TP. Hồ Chí Minh",
    salary: "20,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Tax Advisory", "CIT", "VAT", "Transfer Pricing", "Tax Due Diligence", "International Tax", "BEPS"],
    description: "KPMG tìm Tax Consultant để cung cấp dịch vụ tư vấn thuế cho khách hàng doanh nghiệp và FDI.\n\nYêu cầu:\n- 2+ năm kinh nghiệm tư vấn thuế\n- Kiến thức sâu về CIT, VAT\n- Tiếng Anh thành thạo",
    benefits: ["Lương theo năng lực", "Performance bonus", "ACCA support", "Bảo hiểm sức khỏe", "International opportunities"],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Associate Kiểm toán (Dành cho Sinh viên mới tốt nghiệp)",
    companyIndex: 6,
    location: "Hà Nội",
    salary: "13,000,000 - 17,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["External Audit", "Financial Statements", "VAS", "Excel", "Teamwork", "ACCA", "Big 4"],
    description: "KPMG tuyển Associate cho bộ phận Kiểm toán, chào đón sinh viên mới tốt nghiệp.\n\nYêu cầu:\n- Tốt nghiệp loại Khá, ngành Kế toán/Kiểm toán\n- TOEIC 700+\n- Chăm chỉ, cẩn thận",
    benefits: ["Lương cơ bản + overtime pay", "ACCA support", "Big 4 training", "Mentorship program", "Annual leave 18 ngày"],
    slots: 15,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Tư vấn Quản lý",
    companyIndex: 6,
    location: "Hà Nội",
    salary: "25,000,000 - 45,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Management Consulting", "Strategy", "Process Improvement", "Change Management", "Stakeholder Engagement"],
    description: "KPMG Advisory tìm Senior Management Consultant cho các dự án tư vấn chiến lược.\n\nYêu cầu:\n- 4+ năm kinh nghiệm consulting\n- Tư duy phân tích xuất sắc\n- Tiếng Anh thành thạo\n- MBA là lợi thế",
    benefits: ["Lương cạnh tranh Big 4", "Performance bonus", "ACCA/MBA support", "International travel"],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Grab (7) ─────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư AI/ML Cấp Cao",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "$3,000 - $5,000",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Python", "TensorFlow", "PyTorch", "NLP", "MLOps", "Recommendation System", "Deep Learning"],
    description: "Grab tìm AI/ML Engineer tài năng để xây dựng mô hình recommendation và fraud detection cho hàng triệu người dùng Đông Nam Á.\n\nYêu cầu:\n- 3+ năm kinh nghiệm ML/AI trong production\n- Thành thạo Python, TensorFlow/PyTorch\n- Kinh nghiệm MLOps pipeline\n- Tiếng Anh thành thạo",
    benefits: ["Gói lương top thị trường", "RSU", "Bảo hiểm cao cấp", "Free GrabFood", "L&D budget", "Gym membership"],
    slots: 2,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Phân tích Dữ liệu Kinh doanh",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "$1,200 - $2,200",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["SQL", "Python", "Power BI", "Tableau", "A/B Testing", "Statistics", "Business Intelligence"],
    description: "Grab tìm Data Analyst để hỗ trợ đội ngũ Product và Business. Phân tích hành vi người dùng, đo lường hiệu quả tính năng.\n\nYêu cầu:\n- 2+ năm kinh nghiệm Data Analyst\n- Thành thạo SQL, Python\n- Kinh nghiệm BI tools\n- Khả năng thiết kế A/B test",
    benefits: ["Competitive salary", "Annual bonus", "Premium health insurance", "Free GrabFood", "Flexible hours", "Remote 2 ngày/tuần"],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kỹ sư iOS (Swift)",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "$2,000 - $3,500",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Swift", "iOS", "Xcode", "UIKit", "SwiftUI", "CocoaPods", "REST API", "Performance Optimization"],
    description: "Grab tuyển iOS Developer để phát triển ứng dụng Grab trên nền tảng iOS.\n\nYêu cầu:\n- 3+ năm kinh nghiệm iOS Swift\n- Kinh nghiệm với UIKit và SwiftUI\n- Hiểu biết về app performance optimization\n- Kinh nghiệm publish app lên App Store",
    benefits: ["Competitive salary", "Annual bonus", "Bảo hiểm cao cấp", "GrabFood credits", "MacBook Pro", "Gym membership"],
    slots: 3,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Thực tập sinh Mobile Developer",
    companyIndex: 7,
    location: "TP. Hồ Chí Minh",
    salary: "7,000,000 - 10,000,000 VND",
    type: "INTERNSHIP",
    level: "Intern",
    tags: ["React Native", "JavaScript", "TypeScript", "Git", "Mobile Development", "Teamwork"],
    description: "Grab tuyển thực tập sinh Mobile Developer (chương trình 6 tháng, có lương).\n\nYêu cầu:\n- Sinh viên năm 3-4 hoặc mới tốt nghiệp\n- Biết React Native hoặc React.js\n- Tiếng Anh đọc hiểu tốt",
    benefits: ["Thực tập có lương", "Mentor từ senior engineer", "GrabFood credits", "Cơ hội offer full-time"],
    slots: 5,
    isHot: false,
    statusVariant: "published_past",
  },

  // ── VNG (8) ──────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Backend Game (C++/Go)",
    companyIndex: 8,
    location: "TP. Hồ Chí Minh",
    salary: "25,000,000 - 45,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["C++", "Go", "Game Server", "Networking", "Distributed Systems", "Redis", "MySQL", "Performance"],
    description: "VNG tìm Kỹ sư Backend Game để phát triển hệ thống server cho các sản phẩm game online với hàng triệu người chơi đồng thời.\n\nYêu cầu:\n- 4+ năm kinh nghiệm backend C++ hoặc Go\n- Kinh nghiệm với distributed systems\n- Hiểu biết về networking và game server architecture\n- Khả năng tối ưu hiệu suất hệ thống",
    benefits: ["Lương hấp dẫn theo năng lực", "Thưởng dự án", "Bảo hiểm sức khỏe", "Zalo Premium", "Thiết bị làm việc cao cấp"],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Kỹ sư Phần mềm Zalo (Node.js/Python)",
    companyIndex: 8,
    location: "TP. Hồ Chí Minh",
    salary: "20,000,000 - 40,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Node.js", "Python", "Microservices", "Kafka", "Redis", "Elasticsearch", "Docker", "Kubernetes"],
    description: "VNG tìm kỹ sư phần mềm để phát triển nền tảng Zalo – ứng dụng nhắn tin lớn nhất Việt Nam với hơn 74 triệu người dùng.\n\nYêu cầu:\n- 3+ năm kinh nghiệm backend\n- Thành thạo Node.js hoặc Python\n- Kinh nghiệm với large-scale systems",
    benefits: ["Lương cạnh tranh", "Annual bonus", "Zalo OA Premium", "Bảo hiểm sức khỏe", "Flexible working", "Cantine nội bộ"],
    slots: 5,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Phân tích Dữ liệu - ZaloPay",
    companyIndex: 8,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 30,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["SQL", "Python", "Data Analysis", "Fintech", "Payment Analytics", "Power BI", "A/B Testing"],
    description: "ZaloPay cần Data Analyst để phân tích hành vi giao dịch và tối ưu trải nghiệm người dùng ví điện tử.\n\nYêu cầu:\n- 2+ năm kinh nghiệm phân tích dữ liệu\n- Thành thạo SQL, Python\n- Kinh nghiệm fintech là lợi thế",
    benefits: ["Lương cạnh tranh", "ZaloPay cashback", "Bảo hiểm sức khỏe", "13 tháng lương"],
    slots: 2,
    isHot: false,
    statusVariant: "closed",
  },

  // ── MoMo (9) ──────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Backend Cấp Cao - Nền tảng Thanh toán",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "30,000,000 - 55,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Java", "Spring Boot", "Microservices", "Kafka", "Redis", "Payment Gateway", "Security", "Fintech"],
    description: "MoMo tìm Senior Backend Engineer để xây dựng và tối ưu hệ thống thanh toán phục vụ hơn 31 triệu người dùng.\n\nYêu cầu:\n- 5+ năm kinh nghiệm backend\n- Thành thạo Java Spring Boot\n- Kinh nghiệm với hệ thống payment và bảo mật\n- Hiểu biết về PCI DSS",
    benefits: ["Lương top fintech market", "RSU", "Bảo hiểm cao cấp", "MoMo credits", "Free lunch", "MacBook Pro"],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Kỹ sư Android (Kotlin) - MoMo App",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "22,000,000 - 40,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Kotlin", "Android", "Jetpack Compose", "MVVM", "REST API", "Coroutines", "Unit Testing"],
    description: "MoMo tìm Android Developer để phát triển ứng dụng với hàng chục triệu lượt tải và hàng nghìn lượt update.\n\nYêu cầu:\n- 3+ năm kinh nghiệm Android Kotlin\n- Kinh nghiệm với Jetpack Compose\n- Hiểu biết về MVVM/Clean Architecture",
    benefits: ["Lương cạnh tranh", "Annual bonus", "MoMo cashback", "Bảo hiểm sức khỏe", "Flexible working"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Quan hệ Đối tác Thương mại (Partnership Executive)",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 30,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Business Development", "Partnership", "B2B Sales", "Negotiation", "Fintech", "Digital Payment"],
    description: "MoMo tìm Partnership Executive để phát triển và duy trì quan hệ với các đối tác thương mại trên nền tảng.\n\nYêu cầu:\n- 3+ năm kinh nghiệm business development hoặc account management\n- Kỹ năng đàm phán tốt\n- Hiểu biết về fintech/e-payment",
    benefits: ["Lương + hoa hồng", "MoMo credits", "Bảo hiểm sức khỏe", "Annual bonus"],
    slots: 4,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Tiki (10) ────────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Nền tảng Backend (Golang)",
    companyIndex: 10,
    location: "TP. Hồ Chí Minh",
    salary: "25,000,000 - 45,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Go", "Microservices", "gRPC", "Kafka", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    description: "Tiki tìm Senior Backend Engineer (Golang) để xây dựng nền tảng e-commerce phục vụ hàng triệu khách hàng Việt Nam.\n\nYêu cầu:\n- 4+ năm kinh nghiệm backend\n- Thành thạo Go\n- Kinh nghiệm microservices quy mô lớn\n- Thành thạo thiết kế database",
    benefits: ["Lương cạnh tranh", "Annual bonus", "Bảo hiểm sức khỏe", "Free TikiNOW shipping", "MacBook"],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Quản lý Phân tích Sản phẩm (Product Analytics Manager)",
    companyIndex: 10,
    location: "TP. Hồ Chí Minh",
    salary: "40,000,000 - 65,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Product Analytics", "SQL", "Python", "A/B Testing", "Data-driven Product", "Team Management"],
    description: "Tiki tìm Product Analytics Manager để dẫn dắt đội ngũ phân tích sản phẩm và cung cấp insight chiến lược cho C-level.\n\nYêu cầu:\n- 6+ năm kinh nghiệm data/product analytics\n- Kinh nghiệm quản lý team\n- Thành thạo SQL, Python\n- Tiếng Anh thành thạo",
    benefits: ["Gói lương hấp dẫn", "Annual bonus", "Bảo hiểm cao cấp", "RSU", "Remote partial"],
    slots: 1,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Kinh doanh - Merchant Acquisition",
    companyIndex: 10,
    location: "TP. Hồ Chí Minh",
    salary: "15,000,000 - 25,000,000 VND + hoa hồng",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["B2B Sales", "E-commerce", "Merchant Onboarding", "Negotiation", "CRM", "Cold Calling"],
    description: "Tiki tìm Chuyên viên Merchant Acquisition để phát triển số lượng nhà bán hàng trên sàn.\n\nYêu cầu:\n- 1-2 năm kinh nghiệm sales B2B\n- Kỹ năng giao tiếp và thuyết phục tốt\n- Chịu áp lực KPI",
    benefits: ["Lương cơ bản + hoa hồng", "TikiNOW vouchers", "Bảo hiểm sức khỏe", "Annual bonus"],
    slots: 5,
    isHot: false,
    statusVariant: "published_past",
  },

  // ── Lazada (11) ──────────────────────────────────────────────────────────────
  {
    title: "Quản lý Vận hành Kho (Warehouse Operations Manager)",
    companyIndex: 11,
    location: "TP. Hồ Chí Minh",
    salary: "30,000,000 - 50,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Warehouse Management", "WMS", "Inventory Control", "Team Supervision", "Process Improvement", "ERP", "Logistics"],
    description: "Lazada tìm Warehouse Operations Manager để lãnh đạo đội ngũ 100+ nhân viên kho tại trung tâm phân phối TP.HCM.\n\nYêu cầu:\n- 5+ năm kinh nghiệm quản lý kho e-commerce\n- Thành thạo WMS\n- Kinh nghiệm quản lý nhóm lớn\n- Hiểu biết về lean warehouse",
    benefits: ["Gói lương hấp dẫn", "Annual bonus", "Bảo hiểm cao cấp", "Xe đưa đón", "Lazada vouchers"],
    slots: 1,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Marketing Hiệu suất (Performance Marketing Specialist)",
    companyIndex: 11,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 30,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Performance Marketing", "Facebook Ads", "Google Ads", "A/B Testing", "Analytics", "Attribution", "Budget Optimization"],
    description: "Lazada tìm Performance Marketing Specialist để tối ưu chi phí acquisition và phát triển user base.\n\nYêu cầu:\n- 3+ năm kinh nghiệm performance marketing\n- Kinh nghiệm quản lý Facebook/Google Ads\n- Tư duy data-driven",
    benefits: ["Lương cạnh tranh", "Annual bonus", "Bảo hiểm sức khỏe", "Lazada vouchers", "Flexible hours"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhân viên Chăm sóc Khách hàng (Customer Service Agent)",
    companyIndex: 11,
    location: "TP. Hồ Chí Minh",
    salary: "12,000,000 - 18,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Customer Service", "CRM", "Problem Solving", "Communication", "Email Support", "Live Chat"],
    description: "Lazada tuyển Customer Service Agent để hỗ trợ người mua và người bán trên nền tảng.\n\nYêu cầu:\n- Tốt nghiệp đại học\n- Kỹ năng giao tiếp và xử lý tình huống tốt\n- Sẵn sàng làm ca",
    benefits: ["Lương cơ bản + KPI bonus", "Bảo hiểm xã hội", "Đào tạo bài bản", "Lazada vouchers"],
    slots: 10,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Deloitte (12) ────────────────────────────────────────────────────────────
  {
    title: "Senior Consultant - Tư vấn Chuyển đổi Số",
    companyIndex: 12,
    location: "TP. Hồ Chí Minh",
    salary: "30,000,000 - 55,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Digital Transformation", "IT Strategy", "Change Management", "ERP", "Cloud Advisory", "Project Management"],
    description: "Deloitte Consulting tìm Senior Consultant để tư vấn chuyển đổi số cho các tập đoàn lớn.\n\nYêu cầu:\n- 4+ năm kinh nghiệm tư vấn CNTT hoặc chuyển đổi số\n- Kinh nghiệm triển khai ERP (SAP/Oracle)\n- Kỹ năng quản lý dự án\n- Tiếng Anh thành thạo",
    benefits: ["Lương cạnh tranh Big 4", "Performance bonus", "International travel", "Bảo hiểm cao cấp", "Training budget"],
    slots: 3,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Manager - Dịch vụ Kiểm toán",
    companyIndex: 12,
    location: "TP. Hồ Chí Minh",
    salary: "55,000,000 - 85,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Audit Management", "IFRS", "Team Leadership", "Client Management", "Financial Services", "Big 4"],
    description: "Deloitte tìm Audit Manager để lãnh đạo nhóm kiểm toán và quản lý quan hệ khách hàng cấp cao.\n\nYêu cầu:\n- 7+ năm kinh nghiệm kiểm toán (Big 4)\n- ACCA/CPA/CFA\n- Kinh nghiệm quản lý nhóm 5+ người\n- Tiếng Anh thành thạo",
    benefits: ["Gói lương Manager Big 4", "Annual bonus lớn", "RSU", "Bảo hiểm VIP", "International secondment"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Analyst - Tư vấn Rủi ro & Tuân thủ",
    companyIndex: 12,
    location: "TP. Hồ Chí Minh",
    salary: "16,000,000 - 24,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Risk Advisory", "Compliance", "Internal Control", "AML/KYC", "Regulatory", "Financial Services"],
    description: "Deloitte Risk Advisory tuyển Analyst để hỗ trợ các dự án tư vấn quản lý rủi ro cho ngân hàng và tổ chức tài chính.\n\nYêu cầu:\n- Tốt nghiệp chuyên ngành Tài chính/Kế toán/Luật\n- Tiếng Anh IELTS 6.5+\n- Có chứng chỉ FRM là lợi thế",
    benefits: ["Lương cạnh tranh", "ACCA/FRM support", "Big 4 training", "Fast promotion", "Bảo hiểm"],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Be Group (13) ────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Mobile - Ứng dụng Be (Flutter)",
    companyIndex: 13,
    location: "Hà Nội",
    salary: "18,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Flutter", "Dart", "iOS", "Android", "REST API", "Firebase", "Git", "Agile"],
    description: "Be Group tìm Mobile Developer (Flutter) để phát triển ứng dụng gọi xe hàng đầu Việt Nam.\n\nYêu cầu:\n- 2+ năm kinh nghiệm Flutter\n- Hiểu biết về native iOS và Android\n- Kinh nghiệm publish app\n- Tiếng Anh đọc hiểu tốt",
    benefits: ["Lương cạnh tranh", "Be credits hàng tháng", "Bảo hiểm sức khỏe", "Flexible working", "MacBook"],
    slots: 3,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Vận hành Tài xế (Driver Operations Specialist)",
    companyIndex: 13,
    location: "Hà Nội",
    salary: "15,000,000 - 22,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Operations", "Driver Management", "KPI Monitoring", "Problem Solving", "Data Analysis", "Communication"],
    description: "Be Group tìm Operations Specialist để quản lý và phát triển mạng lưới tài xế Be trên địa bàn Hà Nội.\n\nYêu cầu:\n- 2+ năm kinh nghiệm operations hoặc field management\n- Kỹ năng phân tích dữ liệu cơ bản\n- Năng động và chịu áp lực tốt",
    benefits: ["Lương cơ bản + KPI bonus", "Be credits", "Bảo hiểm sức khỏe", "Young dynamic team"],
    slots: 5,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Quản lý Marketing Tăng trưởng (Growth Marketing Manager)",
    companyIndex: 13,
    location: "Hà Nội",
    salary: "28,000,000 - 45,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Growth Marketing", "User Acquisition", "Performance Marketing", "Budget Management", "Analytics", "A/B Testing"],
    description: "Be tìm Growth Marketing Manager để dẫn dắt chiến lược mở rộng tệp người dùng Be tại Việt Nam.\n\nYêu cầu:\n- 5+ năm kinh nghiệm marketing\n- 2 năm kinh nghiệm quản lý\n- Kinh nghiệm app marketing và ASO",
    benefits: ["Lương cạnh tranh", "Annual bonus", "Be credits", "Bảo hiểm cao cấp", "L&D budget"],
    slots: 1,
    isHot: true,
    statusVariant: "published_future",
  },

  // ── Agribank (14) ────────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Tín dụng Nông nghiệp",
    companyIndex: 14,
    location: "Hà Nội",
    salary: "16,000,000 - 26,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Agricultural Credit", "Loan Appraisal", "Risk Assessment", "Financial Analysis", "Rural Banking"],
    description: "Agribank tìm Chuyên viên Tín dụng để thẩm định và quản lý danh mục cho vay lĩnh vực nông nghiệp, nông thôn.\n\nYêu cầu:\n- 2+ năm kinh nghiệm tín dụng ngân hàng\n- Hiểu biết về lĩnh vực nông nghiệp là lợi thế\n- Am hiểu pháp lý về đất đai, tài sản đảm bảo",
    benefits: ["Lương theo thang bảng lương nhà nước", "Bảo hiểm đầy đủ", "Vay ưu đãi nhân viên", "Môi trường ổn định"],
    slots: 10,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Giao dịch viên Ngân hàng",
    companyIndex: 14,
    location: "TP. Hồ Chí Minh",
    salary: "12,000,000 - 16,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Teller", "Cash Management", "Customer Service", "Banking Products", "KYC/AML"],
    description: "Agribank tuyển Giao dịch viên tại các chi nhánh TP.HCM.\n\nYêu cầu:\n- Tốt nghiệp đại học\n- Ngoại hình tốt, giao tiếp linh hoạt\n- Cẩn thận và chịu khó",
    benefits: ["Lương ổn định", "Bảo hiểm xã hội", "Đào tạo bài bản", "Môi trường an toàn, ổn định"],
    slots: 30,
    isHot: false,
    statusVariant: "closed",
  },
  {
    title: "Chuyên viên Công nghệ Thông tin Ngân hàng",
    companyIndex: 14,
    location: "Hà Nội",
    salary: "20,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Java", "Spring Boot", "Banking System", "Oracle", "Core Banking", "Security", "IT Support"],
    description: "Agribank tìm Chuyên viên CNTT để phát triển và vận hành hệ thống ngân hàng lõi.\n\nYêu cầu:\n- 3+ năm kinh nghiệm phát triển phần mềm Java\n- Kinh nghiệm với hệ thống ngân hàng\n- Hiểu biết về bảo mật thông tin",
    benefits: ["Lương cạnh tranh", "Bảo hiểm đầy đủ", "Vay ưu đãi", "Môi trường ổn định", "Đào tạo nghiệp vụ"],
    slots: 5,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Unilever (15) ────────────────────────────────────────────────────────────
  {
    title: "Quản lý Thương hiệu (Brand Manager)",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "35,000,000 - 55,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Brand Management", "FMCG", "P&L Management", "Consumer Insights", "Campaign Planning", "Agency Management"],
    description: "Unilever tìm Brand Manager cho một thương hiệu chăm sóc cá nhân đang tăng trưởng mạnh tại Việt Nam.\n\nYêu cầu:\n- 5+ năm kinh nghiệm brand management trong FMCG đa quốc gia\n- Kinh nghiệm P&L management\n- Tiếng Anh thành thạo",
    benefits: ["Gói lương top FMCG", "Annual bonus", "Bảo hiểm cao cấp", "Company car", "MBA sponsorship"],
    slots: 1,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Nhân viên Kinh doanh Kênh Phân phối (Key Account Executive)",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 28,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Key Account", "FMCG Sales", "Modern Trade", "Negotiation", "Distribution", "Trade Marketing"],
    description: "Unilever tìm Key Account Executive phụ trách kênh Modern Trade (siêu thị, chuỗi bán lẻ).\n\nYêu cầu:\n- 2+ năm kinh nghiệm key account hoặc FMCG sales\n- Kinh nghiệm với Modern Trade\n- Kỹ năng đàm phán tốt",
    benefits: ["Lương + hoa hồng", "Xăng xe", "Bảo hiểm sức khỏe", "Sản phẩm Unilever", "Đào tạo chuyên nghiệp"],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Nhân viên Phát triển Sản phẩm R&D",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "22,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["R&D", "Product Development", "Food Technology", "Consumer Insights", "Innovation", "Sensory Evaluation"],
    description: "Unilever tìm R&D Specialist để nghiên cứu và phát triển công thức sản phẩm mới.\n\nYêu cầu:\n- Bằng Kỹ sư Hóa học, Công nghệ Thực phẩm\n- 3+ năm kinh nghiệm R&D trong FMCG\n- Tiếng Anh thành thạo",
    benefits: ["Lương cạnh tranh đa quốc gia", "Bảo hiểm cao cấp", "Lab hiện đại", "Đào tạo quốc tế"],
    slots: 2,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Thực tập sinh Quản trị Kinh doanh (Management Trainee)",
    companyIndex: 15,
    location: "TP. Hồ Chí Minh",
    salary: "10,000,000 - 15,000,000 VND",
    type: "INTERNSHIP",
    level: "Intern",
    tags: ["Management Trainee", "Leadership Development", "FMCG", "Rotation Program", "Business Strategy"],
    description: "Chương trình Management Trainee 12 tháng của Unilever cho sinh viên xuất sắc mới tốt nghiệp.\n\nYêu cầu:\n- GPA 3.4+, tốt nghiệp trường top\n- IELTS 7.0+\n- Không quá 26 tuổi",
    benefits: ["Lương MT cạnh tranh", "Mentor từ Director", "Rotation 4 bộ phận", "Fast-track promotion", "MBA sponsorship sau 3 năm"],
    slots: 10,
    isHot: true,
    statusVariant: "published_near",
  },

  // ── Thế Giới Di Động (16) ────────────────────────────────────────────────────
  {
    title: "Quản lý Cửa hàng (Store Manager)",
    companyIndex: 16,
    location: "TP. Hồ Chí Minh",
    salary: "20,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Retail Management", "Team Leadership", "Sales Management", "Inventory Control", "Customer Experience", "KPI"],
    description: "TGDĐ tìm Store Manager để quản lý cửa hàng điện máy với doanh thu 2-5 tỷ/tháng.\n\nYêu cầu:\n- 3+ năm kinh nghiệm quản lý bán lẻ\n- Kinh nghiệm quản lý team 10-20 người\n- Chịu áp lực doanh số cao\n- Sẵn sàng làm việc cuối tuần",
    benefits: ["Lương cơ bản + thưởng doanh số", "KPI bonus hàng tháng", "Bảo hiểm xã hội", "Lộ trình lên ASM"],
    slots: 20,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Nhân viên Bán hàng Điện thoại",
    companyIndex: 16,
    location: "Hà Nội",
    salary: "8,000,000 - 15,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["Retail Sales", "Product Knowledge", "Customer Service", "Communication", "Upselling"],
    description: "TGDĐ tuyển Nhân viên Bán hàng cho các cửa hàng tại Hà Nội. Không yêu cầu kinh nghiệm, được đào tạo hoàn toàn.\n\nYêu cầu:\n- Tốt nghiệp THPT trở lên\n- Ngoại hình gọn gàng\n- Nhiệt tình và chăm chỉ",
    benefits: ["Lương cơ bản + hoa hồng", "Thưởng doanh số không giới hạn", "Đào tạo sản phẩm đầy đủ", "Môi trường trẻ"],
    slots: 50,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kỹ sư Phần mềm - Hệ thống ERP Nội bộ",
    companyIndex: 16,
    location: "TP. Hồ Chí Minh",
    salary: "20,000,000 - 38,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Java", "Spring Boot", "ERP", "SQL", "Microservices", "React", "Retail Tech"],
    description: "TGDĐ tìm Kỹ sư Phần mềm để phát triển hệ thống ERP nội bộ phục vụ 2.200+ cửa hàng trên toàn quốc.\n\nYêu cầu:\n- 3+ năm kinh nghiệm phần mềm\n- Thành thạo Java Spring Boot\n- Kinh nghiệm với hệ thống ERP/POS là lợi thế",
    benefits: ["Lương cạnh tranh", "Annual bonus", "Bảo hiểm sức khỏe", "MacBook hoặc PC tốt"],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Phân tích Dữ liệu Bán lẻ",
    companyIndex: 16,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 30,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["SQL", "Python", "Power BI", "Retail Analytics", "Inventory Analysis", "Sales Forecasting", "Excel"],
    description: "TGDĐ tìm Data Analyst để phân tích dữ liệu bán hàng và tối ưu hóa hoạt động chuỗi bán lẻ.\n\nYêu cầu:\n- 2+ năm kinh nghiệm phân tích dữ liệu\n- Thành thạo SQL, Excel\n- Hiểu biết về retail analytics",
    benefits: ["Lương cạnh tranh", "Annual bonus", "Bảo hiểm sức khỏe", "Môi trường phát triển nhanh"],
    slots: 2,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── PwC (17) ──────────────────────────────────────────────────────────────────
  {
    title: "Senior Associate - Dịch vụ Đảm bảo (Assurance)",
    companyIndex: 17,
    location: "TP. Hồ Chí Minh",
    salary: "22,000,000 - 38,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["Assurance", "IFRS", "VAS", "External Audit", "Financial Reporting", "Big 4", "ACCA"],
    description: "PwC tìm Senior Associate cho dịch vụ Assurance để kiểm toán các tập đoàn và doanh nghiệp niêm yết.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kiểm toán (ưu tiên Big 4)\n- ACCA/CPA đang học hoặc đã có\n- Tiếng Anh thành thạo",
    benefits: ["Lương cạnh tranh", "ACCA study support", "Annual bonus", "Bảo hiểm cao cấp", "International exposure"],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Associate - Tư vấn Giao dịch (Deals Advisory)",
    companyIndex: 17,
    location: "TP. Hồ Chí Minh",
    salary: "18,000,000 - 28,000,000 VND",
    type: "FULL_TIME",
    level: "Junior",
    tags: ["M&A", "Due Diligence", "Financial Modeling", "Valuation", "Investment Advisory", "Excel", "CFA"],
    description: "PwC Deals Advisory tuyển Associate để hỗ trợ các giao dịch M&A và đầu tư.\n\nYêu cầu:\n- Tốt nghiệp Tài chính/Kế toán\n- Hiểu biết về tài chính doanh nghiệp\n- Excel nâng cao\n- IELTS 7.0+",
    benefits: ["Lương cơ bản tốt", "CFA support", "Exposure giao dịch triệu USD", "Fast promotion", "Bảo hiểm"],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Manager - Tư vấn Thuế Doanh nghiệp",
    companyIndex: 17,
    location: "TP. Hồ Chí Minh",
    salary: "50,000,000 - 80,000,000 VND",
    type: "FULL_TIME",
    level: "Manager",
    tags: ["Tax Management", "Transfer Pricing", "CIT", "VAT", "International Tax", "Client Management", "BEPS"],
    description: "PwC Tax tìm Tax Manager để lãnh đạo nhóm tư vấn thuế doanh nghiệp và FDI.\n\nYêu cầu:\n- 7+ năm kinh nghiệm tư vấn thuế (Big 4)\n- Chuyên sâu về Transfer Pricing\n- Kinh nghiệm quản lý nhóm\n- Tiếng Anh thành thạo",
    benefits: ["Gói lương Manager Big 4", "Annual bonus lớn", "Bảo hiểm VIP", "KPMG global network", "Cơ hội lên Partner"],
    slots: 1,
    isHot: false,
    statusVariant: "published_future",
  },

  // ── Hòa Phát (18) ────────────────────────────────────────────────────────────
  {
    title: "Kỹ sư Quy trình Sản xuất Thép",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "22,000,000 - 38,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Metallurgy", "Process Engineering", "Steel Production", "Quality Control", "AutoCAD", "ISO 9001", "Lean Manufacturing"],
    description: "Hòa Phát tìm Kỹ sư Quy trình để tối ưu hóa dây chuyền sản xuất thép tại nhà máy.\n\nYêu cầu:\n- Bằng Kỹ sư Vật liệu, Cơ khí hoặc Luyện kim\n- 3+ năm kinh nghiệm sản xuất công nghiệp\n- Kiến thức về quy trình luyện thép\n- Sẵn sàng công tác tại nhà máy",
    benefits: ["Lương cạnh tranh ngành sản xuất", "Phụ cấp nhà máy", "Bảo hiểm tai nạn + sức khỏe", "Xe đưa đón"],
    slots: 5,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Kinh doanh Thép",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "18,000,000 - 30,000,000 VND + hoa hồng",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Steel Sales", "B2B Sales", "Construction Industry", "Account Management", "Negotiation", "Technical Sales"],
    description: "Hòa Phát tìm Chuyên viên Kinh doanh để phát triển thị trường thép xây dựng trên địa bàn Hà Nội và các tỉnh lân cận.\n\nYêu cầu:\n- 2+ năm kinh nghiệm bán hàng B2B\n- Kinh nghiệm ngành vật liệu xây dựng là lợi thế\n- Có xe máy và bằng lái",
    benefits: ["Lương cơ bản + hoa hồng", "Xăng xe", "Bảo hiểm sức khỏe", "Annual bonus", "Đào tạo sản phẩm"],
    slots: 8,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Kế toán Giá thành Sản xuất",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "18,000,000 - 28,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Cost Accounting", "Manufacturing Accounting", "VAS", "SAP", "Financial Reporting", "Budget Control"],
    description: "Hòa Phát tìm Kế toán Giá thành để tính toán và kiểm soát chi phí sản xuất tại các nhà máy.\n\nYêu cầu:\n- 3+ năm kinh nghiệm kế toán giá thành trong sản xuất\n- Thành thạo SAP hoặc phần mềm kế toán ERP\n- Hiểu biết về quy trình sản xuất",
    benefits: ["Lương theo năng lực", "Bảo hiểm đầy đủ", "13 tháng lương", "Môi trường ổn định lâu dài"],
    slots: 3,
    isHot: false,
    statusVariant: "closed",
  },
  {
    title: "Kỹ sư An toàn Lao động (HSE)",
    companyIndex: 18,
    location: "Hà Nội",
    salary: "18,000,000 - 28,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Health & Safety", "Risk Assessment", "ISO 45001", "Incident Investigation", "Safety Training", "Industrial Safety"],
    description: "Hòa Phát tìm Kỹ sư HSE để đảm bảo an toàn lao động tại môi trường sản xuất thép.\n\nYêu cầu:\n- Chứng chỉ an toàn lao động theo quy định\n- 3+ năm kinh nghiệm HSE trong sản xuất nặng\n- Hiểu biết về ISO 45001",
    benefits: ["Lương cạnh tranh", "Phụ cấp nhà máy", "Bảo hiểm tai nạn cao cấp", "Đào tạo HSE chuyên sâu"],
    slots: 4,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Sacombank (19) ───────────────────────────────────────────────────────────
  {
    title: "Chuyên viên Quan hệ Khách hàng Cá nhân (Personal Banker)",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "15,000,000 - 28,000,000 VND + hoa hồng",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["Retail Banking", "Financial Planning", "Wealth Management", "Insurance Cross-sell", "KYC", "Client Acquisition"],
    description: "Sacombank tuyển Personal Banker tại các chi nhánh TP.HCM. Tư vấn toàn diện sản phẩm tài chính từ tài khoản, thẻ, vay, bảo hiểm đến đầu tư.\n\nYêu cầu:\n- 2+ năm kinh nghiệm ngân hàng bán lẻ\n- Kỹ năng tư vấn và chốt sale\n- CFP là lợi thế",
    benefits: ["Lương cơ bản + hoa hồng", "KPI bonus hàng tháng", "Bảo hiểm cao cấp", "Vay ưu đãi nhân viên", "Annual award trip"],
    slots: 15,
    isHot: true,
    statusVariant: "published_future",
  },
  {
    title: "Chuyên viên Tín dụng Doanh nghiệp Vừa và Nhỏ (SME)",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "20,000,000 - 35,000,000 VND",
    type: "FULL_TIME",
    level: "Senior",
    tags: ["SME Banking", "Credit Analysis", "Relationship Management", "Loan Structuring", "Due Diligence"],
    description: "Sacombank tìm Chuyên viên Tín dụng SME để phát triển danh mục khách hàng doanh nghiệp nhỏ và vừa.\n\nYêu cầu:\n- 3+ năm kinh nghiệm tín dụng doanh nghiệp\n- Kỹ năng phân tích tài chính tốt\n- Mạng lưới khách hàng SME",
    benefits: ["Lương cơ bản cao", "Hoa hồng theo danh mục", "Bảo hiểm cao cấp", "Vay ưu đãi nhân viên", "Đào tạo chuyên sâu"],
    slots: 8,
    isHot: false,
    statusVariant: "published_near",
  },
  {
    title: "Chuyên viên Công nghệ Thông tin - Banking App",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "22,000,000 - 40,000,000 VND",
    type: "FULL_TIME",
    level: "Middle",
    tags: ["React Native", "Mobile Banking", "iOS", "Android", "REST API", "Banking Security", "Agile"],
    description: "Sacombank tìm Mobile Developer để phát triển ứng dụng ngân hàng số Sacombank Pay.\n\nYêu cầu:\n- 3+ năm kinh nghiệm mobile (React Native)\n- Hiểu biết về bảo mật ứng dụng ngân hàng\n- Kinh nghiệm với biometric authentication",
    benefits: ["Lương cạnh tranh ngân hàng", "Annual bonus", "Bảo hiểm sức khỏe", "Vay ưu đãi nhân viên", "Remote partial"],
    slots: 3,
    isHot: false,
    statusVariant: "published_future",
  },
  {
    title: "Thực tập sinh Ngân hàng (Banking Intern)",
    companyIndex: 19,
    location: "TP. Hồ Chí Minh",
    salary: "5,000,000 - 7,000,000 VND",
    type: "INTERNSHIP",
    level: "Intern",
    tags: ["Banking", "Finance", "Customer Service", "Data Entry", "Learning", "Teamwork"],
    description: "Sacombank tuyển thực tập sinh ngân hàng, phù hợp sinh viên năm 3-4 ngành Tài chính, Kinh tế.\n\nYêu cầu:\n- Sinh viên năm 3-4 ngành Tài chính/Kế toán\n- Năng động, cầu tiến\n- Tiếng Anh cơ bản",
    benefits: ["Thực tập có lương", "Đào tạo nghiệp vụ ngân hàng", "Certificate", "Cơ hội full-time", "Mạng lưới ngân hàng"],
    slots: 20,
    isHot: false,
    statusVariant: "published_near",
  },

  // ── Extra Contract/Part-time jobs ─────────────────────────────────────────────
  {
    title: "Hợp đồng: Kế toán Dự án (6 tháng)",
    companyIndex: 6,
    location: "TP. Hồ Chí Minh",
    salary: "15,000,000 - 22,000,000 VND",
    type: "CONTRACT",
    level: "Junior",
    tags: ["Accounting", "VAS", "IFRS", "Tax", "Excel", "Audit Support", "Financial Reporting"],
    description: "KPMG tuyển Kế toán hợp đồng 6 tháng để hỗ trợ mùa kiểm toán cao điểm.\n\nYêu cầu:\n- Tốt nghiệp Kế toán/Kiểm toán\n- Excel thành thạo\n- Cẩn thận, chịu khó",
    benefits: ["Lương hấp dẫn cho hợp đồng", "Trải nghiệm Big 4", "Mentor từ senior", "Certificate", "Cơ hội full-time"],
    slots: 5,
    isHot: false,
    statusVariant: "published_past",
  },
  {
    title: "Bán thời gian: Chuyên viên Truyền thông Mạng xã hội",
    companyIndex: 9,
    location: "TP. Hồ Chí Minh",
    salary: "8,000,000 - 12,000,000 VND",
    type: "PART_TIME",
    level: "Junior",
    tags: ["Social Media", "Content Creation", "TikTok", "Facebook", "Canva", "Community Management", "Copywriting"],
    description: "MoMo tuyển Part-time Social Media Specialist. Làm việc 4 tiếng/ngày, linh hoạt giờ giấc.\n\nYêu cầu:\n- Đam mê mạng xã hội, hiểu trend\n- Biết Canva, chỉnh ảnh/video cơ bản\n- Cam kết 4 tiếng/ngày",
    benefits: ["Lương theo giờ cạnh tranh", "MoMo vouchers", "Flexible hours", "Work from home option", "Cơ hội full-time"],
    slots: 3,
    isHot: false,
    statusVariant: "published_near",
  },
];

// ─── Recruiter notes templates ────────────────────────────────────────────────
const RECRUITER_NOTES = [
  "Ứng viên có profile ấn tượng, kỹ năng kỹ thuật phù hợp JD. Tuy nhiên qua vòng phỏng vấn, kinh nghiệm thực tế còn hạn chế so với yêu cầu. Đề xuất xem xét cho vị trí thấp hơn một bậc.",
  "Ứng viên trình bày tốt, thái độ chuyên nghiệp, KPI tại công ty cũ đạt 120% liên tục. Salary expectation hợp lý. Đề xuất offer và onboard sớm.",
  "CV tốt nhưng qua phỏng vấn thiếu kinh nghiệm dự án quy mô lớn. Portfolio chủ yếu là side projects cá nhân. Cần cân nhắc thêm.",
  "Salary expectation vượt budget 30%. Đã đàm phán nhưng ứng viên không linh hoạt. Tạm thời hold hồ sơ.",
  "Technical test đạt 65/100, chưa đạt ngưỡng 70 theo quy định. Ứng viên tiếp tục ôn luyện và nộp lại sau 3-6 tháng.",
  "Ứng viên xuất sắc! Vượt qua tất cả vòng phỏng vấn với điểm cao nhất batch này. Tư duy sắc bén, culture fit tốt. Đã gửi offer letter.",
  "Nền tảng kỹ thuật vững, điểm trừ là chưa có kinh nghiệm trong ngành. Team lead đánh giá cần 2-3 tháng onboard. Vẫn đề xuất proceed.",
  "Ứng viên thể hiện tốt về chuyên môn nhưng có dấu hiệu khó tiếp nhận feedback trong case interview. Cần trao đổi thêm với hiring manager.",
  "Ứng viên apply nhầm vị trí – kinh nghiệm không phù hợp. Đã liên hệ và đề xuất ứng viên apply vị trí khác phù hợp hơn.",
  "Rất tiếc phải từ chối vì vị trí đã được chuyển thành internal promotion. Ứng viên sẽ được ưu tiên cho các vị trí tương tự.",
  "Reference check có một số thông tin không khớp. Đang xác minh thêm trước khi ra quyết định cuối.",
  "Background phù hợp, tiếng Anh trôi chảy. Cần thêm 1 buổi gặp trực tiếp với CTO để final decision.",
];

// ─── Cover letter templates ───────────────────────────────────────────────────
const COVER_LETTERS = [
  {
    title: "Thư ứng tuyển – Vị trí Kỹ sư Backend",
    content: `Kính gửi Phòng Nhân sự,\n\nTôi viết thư này để ứng tuyển vào vị trí Kỹ sư Backend tại quý công ty. Với hơn 3 năm kinh nghiệm phát triển hệ thống backend sử dụng Node.js và NestJS, tôi tin rằng mình có thể đóng góp giá trị cho đội ngũ kỹ thuật.\n\nTôi đã tham gia xây dựng hệ thống microservices xử lý hàng triệu request mỗi ngày, tối ưu cơ sở dữ liệu và triển khai caching với Redis. Tôi cũng có kinh nghiệm làm việc trong môi trường Agile và mentoring junior developer.\n\nĐiều khiến tôi quan tâm đến vị trí này là cơ hội được làm việc với công nghệ hiện đại và thách thức kỹ thuật cao. Tôi hy vọng được gặp gỡ và thảo luận thêm.\n\nTrân trọng.`,
  },
  {
    title: "Thư xin việc – Chuyên viên Marketing",
    content: `Kính gửi Ban Tuyển dụng,\n\nTôi là ứng viên ứng tuyển vào vị trí Chuyên viên Digital Marketing. Với 4 năm kinh nghiệm marketing kỹ thuật số, tôi đã xây dựng nhiều chiến dịch marketing thành công với ROAS trung bình 4.5x và tăng organic traffic lên 200% trong 6 tháng.\n\nTôi đặc biệt quan tâm đến cơ hội tại quý công ty vì muốn áp dụng kinh nghiệm vào lĩnh vực mới đầy tiềm năng. Tôi tin sự kết hợp giữa kiến thức marketing kỹ thuật số và hiểu biết về hành vi người tiêu dùng sẽ giúp tôi đóng góp hiệu quả.\n\nTrân trọng.`,
  },
  {
    title: "Thư ứng tuyển – Kế toán Tổng hợp",
    content: `Kính gửi Phòng Nhân sự,\n\nTôi xin gửi hồ sơ ứng tuyển vị trí Kế toán Tổng hợp. Với 6 năm kinh nghiệm kế toán tại doanh nghiệp sản xuất và thương mại, tôi thành thạo xử lý đầy đủ nghiệp vụ kế toán theo chuẩn VAS.\n\nTôi thành thạo MISA và SAP, luôn hoàn thành công việc đúng hạn kể cả trong các kỳ quyết toán áp lực cao. Tôi tin sự cẩn thận và trách nhiệm cao của mình sẽ phù hợp với yêu cầu vị trí.\n\nKính trân trọng.`,
  },
  {
    title: "Thư ứng tuyển – Chuyên viên Phân tích Dữ liệu",
    content: `Kính gửi Phòng Nhân sự,\n\nTôi ứng tuyển vị trí Data Analyst. Với 3 năm kinh nghiệm phân tích dữ liệu trong fintech và e-commerce, tôi thành thạo Python, SQL và Power BI. Tôi đã xây dựng dashboard theo dõi KPI, phân tích cohort retention và mô hình churn prediction đạt accuracy 87%.\n\nTôi bị thu hút bởi cơ hội làm việc với quy mô dữ liệu lớn tại quý công ty để áp dụng các phương pháp phân tích nâng cao hơn.\n\nTrân trọng.`,
  },
  {
    title: "Thư ứng tuyển – Vị trí Kinh doanh",
    content: `Kính gửi Ban Tuyển dụng,\n\nTôi ứng tuyển vào vị trí Sales Executive với 5 năm kinh nghiệm bán hàng B2B trong ngành phần mềm doanh nghiệp. Tôi đã liên tục vượt KPI 3 năm liền với thành tích đàm phán các hợp đồng trị giá trên 500 triệu đồng.\n\nTôi hiểu sâu quy trình bán hàng từ prospecting đến closing và luôn đặt khách hàng làm trung tâm. Tôi mong muốn đóng góp vào sự phát triển của quý công ty.\n\nKính trân trọng.`,
  },
  {
    title: "Cover Letter – HR Business Partner",
    content: `Kính gửi Ban Tuyển dụng,\n\nTôi ứng tuyển vào vị trí HR Business Partner với 5 năm kinh nghiệm HR, trong đó 2 năm HRBP. Tôi đã phối hợp với 3 business unit thiết kế chương trình performance management mới, giúp tăng employee engagement score từ 65% lên 78%.\n\nTôi tin sự kết hợp giữa tư duy business và chuyên môn HR sẽ giúp tôi trở thành đối tác chiến lược đáng tin cậy.\n\nKính trân trọng.`,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  // ── Dọn dữ liệu cũ ──────────────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.cvAnalysis.deleteMany(),
    prisma.chatMessage.deleteMany(),
    prisma.chatSession.deleteMany(),
    prisma.application.deleteMany(),
    prisma.savedJob.deleteMany(),
    prisma.coverLetter.deleteMany(),
    prisma.cv.deleteMany(),
    prisma.job.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.revokedToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.company.deleteMany(),
  ]);
  console.log("🗑️  Đã xóa dữ liệu cũ");

  // ── 1. Tạo Companies ─────────────────────────────────────────────────────────
  const companies = [];
  for (const c of COMPANIES_DATA) {
    const company = await prisma.company.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        description: c.description,
        address: c.address,
        logoUrl: `https://storage.sra.dev/logos/${c.name.toLowerCase().replace(/\s+/g, "-")}.png`,
        coverImageUrl: `https://storage.sra.dev/covers/${c.name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        socialLinks: c.socialLinks,
        isVerified: c.isVerified,
        isActive: true,
      },
    });
    companies.push(company);
  }
  console.log(`✅ Đã tạo ${companies.length} công ty`);

  // ── 2. Tạo Admin ─────────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: "admin@sra.dev",
      password: hash("Admin@123456"),
      role: "ADMIN",
      isVerified: true,
      isActive: true,
      profile: {
        create: {
          fullName: "Quản trị viên Hệ thống",
          phone: "0800000000",
          address: "Quận 1, TP. Hồ Chí Minh",
          bio: "Quản trị viên hệ thống SRA Job Portal. Chịu trách nhiệm vận hành và giám sát toàn bộ nền tảng tuyển dụng.",
          skills: ["System Administration", "Platform Management", "User Support", "Content Moderation"],
        },
      },
    },
  });
  console.log("✅ Đã tạo Admin");

  // ── 3. Tạo Recruiters (1 per company) ────────────────────────────────────────
  const recruiters = [];
  for (let i = 0; i < RECRUITERS_DATA.length; i++) {
    const r = RECRUITERS_DATA[i];
    const company = companies[i];
    const user = await prisma.user.create({
      data: {
        email: r.email,
        password: hash("password123"),
        role: "RECRUITER",
        companyId: company.id,
        isVerified: true,
        isActive: true,
        profile: {
          create: {
            fullName: r.fullName,
            phone: r.phone,
            address: r.address,
            bio: r.bio,
            skills: r.skills,
          },
        },
      },
    });
    recruiters.push({ user, company });
  }
  console.log(`✅ Đã tạo ${recruiters.length} nhà tuyển dụng`);

  // ── 4. Tạo Candidates ─────────────────────────────────────────────────────────
  const candidates = [];
  for (const c of CANDIDATES_DATA) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        password: hash("password123"),
        role: "CANDIDATE",
        isVerified: true,
        isActive: true,
        profile: {
          create: {
            fullName: c.fullName,
            phone: c.phone,
            address: c.address,
            bio: c.bio,
            skills: c.skills,
          },
        },
      },
    });
    candidates.push(user);
  }
  console.log(`✅ Đã tạo ${candidates.length} ứng viên`);

  // ── 5. Tạo Jobs ───────────────────────────────────────────────────────────────
  const createdJobs = [];

  // Helper: xác định status + deadline dựa vào variant
  const resolveJobMeta = (variant) => {
    switch (variant) {
      case "published_future":
        return { status: "PUBLISHED", deadline: futureDeadline() };
      case "published_near":
        return { status: "PUBLISHED", deadline: nearDeadline() };
      case "published_past":
        return { status: "PUBLISHED", deadline: pastDeadline() };
      case "closed":
        return { status: "CLOSED", deadline: pastDeadline() };
      case "draft":
        return {
          status: "DRAFT",
          deadline: new Date(Date.now() + randInt(60, 120) * 86_400_000),
        };
      default:
        return { status: "PUBLISHED", deadline: futureDeadline() };
    }
  };

  for (const jt of JOBS_TEMPLATES) {
    const recruiterData = recruiters[jt.companyIndex];
    const { status, deadline } = resolveJobMeta(jt.statusVariant);

    const job = await prisma.job.create({
      data: {
        title: jt.title,
        companyId: recruiterData.company.id,
        postedById: recruiterData.user.id,
        location: jt.location,
        salary: jt.salary,
        type: jt.type,
        level: jt.level,
        tags: jt.tags,
        description: jt.description,
        benefits: jt.benefits,
        slots: jt.slots,
        deadline: deadline,
        status: status,
        isHot: jt.isHot,
      },
    });
    createdJobs.push(job);
  }
  console.log(`✅ Đã tạo ${createdJobs.length} việc làm`);

  // Cập nhật totalJobs cho mỗi company
  for (const company of companies) {
    const count = createdJobs.filter((j) => j.companyId === company.id).length;
    await prisma.company.update({
      where: { id: company.id },
      data: { totalJobs: count },
    });
  }

  // ── 6. Tạo CVs ────────────────────────────────────────────────────────────────
  const candidateCvMap = {};
  for (const candidate of candidates) {
    const cv1 = await prisma.cv.create({
      data: {
        name: "CV Chính",
        fileUrl: `https://storage.sra.dev/cvs/${candidate.id}/main-cv.pdf`,
        isDefault: true,
        userId: candidate.id,
        fileSize: randInt(200_000, 800_000),
        fileType: "pdf",
      },
    });
    const cv2 = await prisma.cv.create({
      data: {
        name: "CV Tiếng Anh",
        fileUrl: `https://storage.sra.dev/cvs/${candidate.id}/english-cv.pdf`,
        isDefault: false,
        userId: candidate.id,
        fileSize: randInt(200_000, 800_000),
        fileType: "pdf",
      },
    });
    candidateCvMap[candidate.id] = [cv1, cv2];
  }
  console.log("✅ Đã tạo CVs cho ứng viên");

  // ── 7. Tạo Cover Letters ──────────────────────────────────────────────────────
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const cl1 = COVER_LETTERS[i % COVER_LETTERS.length];
    const cl2 = COVER_LETTERS[(i + 1) % COVER_LETTERS.length];
    const cl3 = COVER_LETTERS[(i + 2) % COVER_LETTERS.length];
    await prisma.coverLetter.createMany({
      data: [
        { title: cl1.title, content: cl1.content, userId: candidate.id },
        { title: cl2.title, content: cl2.content, userId: candidate.id },
        { title: cl3.title, content: cl3.content, userId: candidate.id },
      ],
    });
  }
  console.log("✅ Đã tạo thư xin việc");

  // ── 8. Tạo Applications ───────────────────────────────────────────────────────
  // Chỉ apply vào PUBLISHED và CLOSED jobs
  const applicableJobs = createdJobs.filter((j) => j.status !== "DRAFT");
  const APP_STATUSES = ["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"];
  const usedPairs = new Set();
  let appCount = 0;

  for (const candidate of candidates) {
    // Mỗi candidate apply 4-8 jobs
    const numApps = randInt(4, 8);
    const shuffledJobs = [...applicableJobs].sort(() => Math.random() - 0.5);
    let applied = 0;

    for (const job of shuffledJobs) {
      if (applied >= numApps) break;
      const key = `${candidate.id}:${job.id}`;
      if (usedPairs.has(key)) continue;
      usedPairs.add(key);

      const status = pick(APP_STATUSES);
      const hasNote = ["REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"].includes(status);
      const cvList = candidateCvMap[candidate.id];
      const cv = pick(cvList);

      const appData = {
        userId: candidate.id,
        jobId: job.id,
        companyId: job.companyId,
        status,
        cvUrl: cv.fileUrl,
        cvId: cv.id,
        phone: "09" + String(randInt(10_000_000, 99_999_999)),
        coverLetter:
          "Kính gửi quý công ty, tôi xin ứng tuyển vào vị trí này với mong muốn đóng góp kiến thức và kinh nghiệm của mình. Tôi tin tưởng rằng bản thân có đủ năng lực để hoàn thành tốt các nhiệm vụ được giao và phát triển cùng công ty trong dài hạn.",
        note: hasNote ? pick(RECRUITER_NOTES) : null,
      };

      // Nếu status là INTERVIEW, thêm thông tin phỏng vấn
      if (status === "INTERVIEW") {
        const interviewDate = new Date(Date.now() + randInt(3, 14) * 86_400_000);
        appData.interviewDate = interviewDate;
        appData.interviewFormat = pick(["online", "offline"]);
        appData.interviewTime = `${randInt(8, 17)}:${pick(["00", "30"])}`;
        if (appData.interviewFormat === "offline") {
          appData.interviewLocation = job.companyId ? "Văn phòng công ty" : "TBD";
        }
      }

      // Nếu ACCEPTED, thêm ngày bắt đầu
      if (status === "ACCEPTED") {
        appData.startDate = new Date(Date.now() + randInt(14, 30) * 86_400_000);
        appData.startTime = `${randInt(8, 9)}:00`;
      }

      await prisma.application.create({ data: appData });
      applied++;
      appCount++;
    }
  }

  // Cập nhật totalApplications cho mỗi company
  for (const company of companies) {
    const count = await prisma.application.count({
      where: { companyId: company.id },
    });
    await prisma.company.update({
      where: { id: company.id },
      data: { totalApplications: count },
    });
  }

  console.log(`✅ Đã tạo ${appCount} đơn ứng tuyển`);

  // ── 9. Tạo Saved Jobs ─────────────────────────────────────────────────────────
  const savedPairs = new Set();
  let savedCount = 0;
  for (const candidate of candidates) {
    const numSaved = randInt(5, 10);
    const shuffled = [...createdJobs].sort(() => Math.random() - 0.5);
    let saved = 0;
    for (const job of shuffled) {
      if (saved >= numSaved) break;
      const key = `${candidate.id}:${job.id}`;
      if (savedPairs.has(key)) continue;
      savedPairs.add(key);
      await prisma.savedJob.create({
        data: { userId: candidate.id, jobId: job.id },
      });
      saved++;
      savedCount++;
    }
  }
  console.log(`✅ Đã tạo ${savedCount} việc làm đã lưu`);

  // ── 10. Tạo Chat Sessions ─────────────────────────────────────────────────────
  for (const candidate of candidates.slice(0, 8)) {
    await prisma.chatSession.create({
      data: {
        title: "Tư vấn nghề nghiệp và phân tích CV",
        userId: candidate.id,
        messages: {
          create: [
            {
              role: "USER",
              content: "Bạn có thể giúp tôi phân tích CV và tư vấn hướng phát triển nghề nghiệp không?",
              messageType: "TEXT",
            },
            {
              role: "ASSISTANT",
              content:
                "Chào bạn! Tôi rất vui được hỗ trợ. Hãy chia sẻ CV của bạn hoặc mô tả kinh nghiệm và mục tiêu nghề nghiệp, tôi sẽ đưa ra nhận xét và gợi ý phù hợp.",
              messageType: "TEXT",
            },
          ],
        },
      },
    });
  }
  console.log("✅ Đã tạo chat sessions");

  // ── Tổng kết ──────────────────────────────────────────────────────────────────
  console.log("\n🎉 Seed hoàn tất!");
  console.log("─".repeat(55));
  console.log("📊 Tóm tắt dữ liệu:");
  console.log(`   🏢 Công ty         : ${companies.length}`);
  console.log(`   👔 Nhà tuyển dụng  : ${recruiters.length}`);
  console.log(`   👤 Ứng viên        : ${candidates.length}`);
  console.log(`   💼 Việc làm        : ${createdJobs.length}`);
  console.log(`   📝 Đơn ứng tuyển   : ${appCount}`);
  console.log(`   🔖 Việc làm đã lưu : ${savedCount}`);
  console.log("─".repeat(55));
  console.log("🔑 Tài khoản mặc định:");
  console.log("   Admin   : admin@sra.dev / Admin@123456");
  console.log("   Recruiters & Candidates: password123");
  console.log("─".repeat(55));

  // In danh sách recruiter để tiện tra cứu
  console.log("\n👔 Danh sách Nhà tuyển dụng:");
  recruiters.forEach(({ user, company }, idx) => {
    console.log(`   [${idx}] ${user.email} → ${company.name}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });