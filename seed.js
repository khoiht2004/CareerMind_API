/**
 * ============================================================
 * SEED FILE — Smart Recruit Assistant
 * ============================================================
 * Accounts được tạo sẵn:
 *
 * ADMIN
 *   admin@sra.dev          | Admin@123456
 *
 * RECRUITERS
 *   recruiter1@techcorp.vn | Recruiter@123
 *   recruiter2@fintech.vn  | Recruiter@123
 *
 * CANDIDATES
 *   candidate1@gmail.com   | Candidate@123
 *   candidate2@gmail.com   | Candidate@123
 *   candidate3@gmail.com   | Candidate@123
 * ============================================================
 */

require("dotenv").config();
const { PrismaClient } = require("./generated/prisma");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const bcrypt = require("bcrypt");

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

// ─── Helpers ─────────────────────────────────────────────────────────────────

const hash = (password) => bcrypt.hash(password, 10);

const uuid = () => crypto.randomUUID();

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days) {
  return daysFromNow(-days);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── 1. USERS ──────────────────────────────────────────────────────────────

  console.log("👤 Creating users...");

  const [
    adminUser,
    recruiter1,
    recruiter2,
    candidate1,
    candidate2,
    candidate3,
  ] = await Promise.all([
    // Admin
    prisma.user.create({
      data: {
        id: uuid(),
        email: "admin@sra.dev",
        password: await hash("Admin@123456"),
        role: "ADMIN",
        isVerified: true,
        isActive: true,
      },
    }),

    // Recruiters
    prisma.user.create({
      data: {
        id: uuid(),
        email: "recruiter1@techcorp.vn",
        password: await hash("Recruiter@123"),
        role: "RECRUITER",
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: uuid(),
        email: "recruiter2@fintech.vn",
        password: await hash("Recruiter@123"),
        role: "RECRUITER",
        isVerified: true,
        isActive: true,
      },
    }),

    // Candidates
    prisma.user.create({
      data: {
        id: uuid(),
        email: "candidate1@gmail.com",
        password: await hash("Candidate@123"),
        role: "CANDIDATE",
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: uuid(),
        email: "candidate2@gmail.com",
        password: await hash("Candidate@123"),
        role: "CANDIDATE",
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: uuid(),
        email: "candidate3@gmail.com",
        password: await hash("Candidate@123"),
        role: "CANDIDATE",
        isVerified: false, // chưa verify để test flow
        isActive: true,
        verificationCode: "482931",
        verificationCodeExpAt: daysFromNow(1),
      },
    }),
  ]);

  console.log("  ✓ 6 users created");

  // ── 2. PROFILES ───────────────────────────────────────────────────────────

  console.log("📋 Creating profiles...");

  await Promise.all([
    prisma.profile.create({
      data: {
        userId: adminUser.id,
        fullName: "System Administrator",
        phone: "0900000000",
        bio: "Quản trị hệ thống Smart Recruit Assistant.",
        address: "Ho Chi Minh City, Vietnam",
      },
    }),
    prisma.profile.create({
      data: {
        userId: recruiter1.id,
        fullName: "Nguyễn Văn Hùng",
        phone: "0901234567",
        bio: "HR Manager tại TechCorp Vietnam với 6 năm kinh nghiệm tuyển dụng ngành công nghệ.",
        address: "Quận 1, TP. Hồ Chí Minh",
        avatarUrl: "https://i.pravatar.cc/150?u=recruiter1",
      },
    }),
    prisma.profile.create({
      data: {
        userId: recruiter2.id,
        fullName: "Trần Thị Lan",
        phone: "0912345678",
        bio: "Talent Acquisition Lead tại FinTech Solutions, chuyên tuyển dụng vị trí kỹ thuật và sản phẩm.",
        address: "Quận 7, TP. Hồ Chí Minh",
        avatarUrl: "https://i.pravatar.cc/150?u=recruiter2",
      },
    }),
    prisma.profile.create({
      data: {
        userId: candidate1.id,
        fullName: "Lê Minh Khôi",
        phone: "0987654321",
        bio: "Backend Developer với 3 năm kinh nghiệm. Thành thạo Node.js, TypeScript, PostgreSQL. Đam mê xây dựng hệ thống scalable.",
        address: "Bình Thạnh, TP. Hồ Chí Minh",
        avatarUrl: "https://i.pravatar.cc/150?u=candidate1",
        skills:
          "Node.js, TypeScript, NestJS, PostgreSQL, MySQL, Redis, Docker, AWS, RESTful API, GraphQL",
      },
    }),
    prisma.profile.create({
      data: {
        userId: candidate2.id,
        fullName: "Phạm Thị Thu",
        phone: "0976543210",
        bio: "Frontend Developer 2 năm kinh nghiệm với React và Next.js. Quan tâm đến UI/UX và performance.",
        address: "Gò Vấp, TP. Hồ Chí Minh",
        avatarUrl: "https://i.pravatar.cc/150?u=candidate2",
        skills:
          "React, Next.js, TypeScript, TailwindCSS, Redux, React Query, Figma, Jest",
      },
    }),
    prisma.profile.create({
      data: {
        userId: candidate3.id,
        fullName: "Hoàng Đức Nam",
        phone: "0965432109",
        bio: "Fresh graduate ngành CNTT, tìm kiếm vị trí Intern/Junior Developer để phát triển kỹ năng.",
        address: "Thủ Đức, TP. Hồ Chí Minh",
        skills: "Java, Spring Boot, MySQL, HTML, CSS, JavaScript cơ bản",
      },
    }),
  ]);

  console.log("  ✓ 6 profiles created");

  // ── 3. JOBS ───────────────────────────────────────────────────────────────

  console.log("💼 Creating jobs...");

  const [
    jobBackend,
    jobFrontend,
    jobFullstack,
    jobDevOps,
    jobDataEngineer,
    jobMobileAndroid,
    jobFintech1,
    jobFintech2,
  ] = await Promise.all([
    // TechCorp jobs (recruiter1)
    prisma.job.create({
      data: {
        title: "Senior Backend Developer (Node.js)",
        company: "TechCorp Vietnam",
        location: "Quận 1, TP. Hồ Chí Minh",
        salary: "25,000,000 - 40,000,000 VNĐ",
        type: "FULL_TIME",
        level: "Senior",
        tags: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
        description: `## Mô tả công việc

Chúng tôi đang tìm kiếm Senior Backend Developer tài năng để tham gia phát triển nền tảng SaaS quy mô lớn phục vụ hàng triệu người dùng.

### Trách nhiệm chính
- Thiết kế và phát triển các microservices hiệu năng cao
- Tối ưu hóa database queries và hệ thống cache
- Code review và mentor Junior developers
- Tham gia vào quá trình thiết kế hệ thống
- Đảm bảo coverage test tối thiểu 80%

### Yêu cầu kỹ thuật
- 4+ năm kinh nghiệm với Node.js / TypeScript
- Thành thạo PostgreSQL, có kinh nghiệm với Redis
- Hiểu biết về microservices và event-driven architecture
- Kinh nghiệm với Docker, CI/CD
- Tiếng Anh đọc hiểu tốt`,
        benefits: [
          "Lương cạnh tranh + thưởng hiệu suất",
          "Laptop MacBook Pro",
          "Bảo hiểm sức khỏe cao cấp",
          "15 ngày phép/năm",
          "Budget học tập $500/năm",
          "Flexible working hours",
          "Team building hàng quý",
        ],
        slots: 2,
        deadline: daysFromNow(30),
        status: "PUBLISHED",
        isHot: true,
        postedById: recruiter1.id,
      },
    }),

    prisma.job.create({
      data: {
        title: "Frontend Developer (React/Next.js)",
        company: "TechCorp Vietnam",
        location: "Quận 1, TP. Hồ Chí Minh",
        salary: "18,000,000 - 28,000,000 VNĐ",
        type: "FULL_TIME",
        level: "Middle",
        tags: ["React", "Next.js", "TypeScript", "TailwindCSS"],
        description: `## Mô tả công việc

TechCorp Vietnam tìm kiếm Frontend Developer để xây dựng giao diện người dùng cho sản phẩm chính.

### Trách nhiệm
- Phát triển UI components với React và Next.js
- Tối ưu performance web (Core Web Vitals)
- Làm việc chặt chẽ với team Design và Backend
- Viết unit test với Jest/Testing Library

### Yêu cầu
- 2+ năm kinh nghiệm React
- Thành thạo TypeScript
- Có kinh nghiệm với TailwindCSS
- Hiểu biết về SSR/SSG với Next.js`,
        benefits: [
          "Lương hấp dẫn",
          "MacBook cấp phát",
          "Làm việc hybrid (3 ngày remote)",
          "Bảo hiểm sức khỏe",
          "Môi trường làm việc trẻ trung",
        ],
        slots: 1,
        deadline: daysFromNow(21),
        status: "PUBLISHED",
        isHot: false,
        postedById: recruiter1.id,
      },
    }),

    prisma.job.create({
      data: {
        title: "Fullstack Developer (NestJS + React)",
        company: "TechCorp Vietnam",
        location: "Remote",
        salary: "20,000,000 - 35,000,000 VNĐ",
        type: "REMOTE",
        level: "Middle/Senior",
        tags: ["NestJS", "React", "TypeScript", "MySQL", "Redis"],
        description: `## Fullstack Developer

Vị trí làm việc 100% remote, phù hợp với developer có khả năng tự quản lý công việc tốt.

### Yêu cầu
- Thành thạo NestJS và React/TypeScript
- Kinh nghiệm với MySQL và Redis
- Có khả năng làm việc độc lập
- Kỹ năng giao tiếp tốt`,
        benefits: [
          "100% Remote",
          "Thời gian làm việc linh hoạt",
          "Thiết bị hỗ trợ",
          "Môi trường international",
        ],
        slots: 3,
        deadline: daysFromNow(45),
        status: "PUBLISHED",
        isHot: true,
        postedById: recruiter1.id,
      },
    }),

    prisma.job.create({
      data: {
        title: "DevOps Engineer",
        company: "TechCorp Vietnam",
        location: "Quận 1, TP. Hồ Chí Minh",
        salary: "28,000,000 - 45,000,000 VNĐ",
        type: "FULL_TIME",
        level: "Senior",
        tags: ["Kubernetes", "AWS", "Terraform", "CI/CD", "Docker"],
        description: `## DevOps Engineer

Xây dựng và vận hành hạ tầng cloud cho hệ thống phục vụ 1M+ users.

### Yêu cầu
- 3+ năm kinh nghiệm DevOps
- Thành thạo AWS (EKS, RDS, S3, CloudFront)
- Kinh nghiệm với Kubernetes và Terraform
- Kiến thức về security và monitoring`,
        benefits: [
          "Lương top-of-market",
          "Stock options",
          "Full remote option",
          "Conference budget",
        ],
        slots: 1,
        deadline: daysFromNow(60),
        status: "PUBLISHED",
        isHot: false,
        postedById: recruiter1.id,
      },
    }),

    prisma.job.create({
      data: {
        title: "Data Engineer",
        company: "TechCorp Vietnam",
        location: "Quận 1, TP. Hồ Chí Minh",
        salary: "22,000,000 - 38,000,000 VNĐ",
        type: "FULL_TIME",
        level: "Middle",
        tags: ["Python", "Spark", "Airflow", "dbt", "BigQuery"],
        description: `## Data Engineer

Xây dựng data pipeline và data warehouse cho hệ thống phân tích kinh doanh.

### Yêu cầu
- Thành thạo Python và SQL
- Kinh nghiệm với Airflow hoặc Prefect
- Hiểu biết về data modeling (Star schema, dimensional modeling)
- Kinh nghiệm với cloud data warehouse`,
        benefits: [
          "Dự án dữ liệu quy mô lớn",
          "Đào tạo chuyên sâu",
          "Lương thưởng hấp dẫn",
        ],
        slots: 2,
        deadline: daysFromNow(30),
        status: "PUBLISHED",
        isHot: false,
        postedById: recruiter1.id,
      },
    }),

    prisma.job.create({
      data: {
        title: "Android Developer (Kotlin)",
        company: "TechCorp Vietnam",
        location: "Quận 1, TP. Hồ Chí Minh",
        salary: "20,000,000 - 30,000,000 VNĐ",
        type: "FULL_TIME",
        level: "Middle",
        tags: ["Kotlin", "Android", "Jetpack Compose", "MVVM"],
        description: `## Android Developer

Phát triển ứng dụng Android cho sản phẩm với 500K+ downloads.

### Yêu cầu
- 2+ năm kinh nghiệm Android với Kotlin
- Thành thạo Jetpack Compose
- Kinh nghiệm MVVM/Clean Architecture
- Publish ít nhất 1 app lên Play Store`,
        benefits: [
          "Sản phẩm thực tế, tác động lớn",
          "Thiết bị test cấp phát",
          "Môi trường agile",
        ],
        slots: 1,
        deadline: daysFromNow(25),
        status: "DRAFT", // chưa publish
        isHot: false,
        postedById: recruiter1.id,
      },
    }),

    // FinTech jobs (recruiter2)
    prisma.job.create({
      data: {
        title: "Backend Developer (Java/Spring Boot)",
        company: "FinTech Solutions",
        location: "Quận 7, TP. Hồ Chí Minh",
        salary: "20,000,000 - 35,000,000 VNĐ",
        type: "FULL_TIME",
        level: "Middle",
        tags: ["Java", "Spring Boot", "MySQL", "Kafka", "Microservices"],
        description: `## Backend Developer - Core Banking

Tham gia phát triển hệ thống Core Banking xử lý hàng triệu giao dịch mỗi ngày.

### Yêu cầu
- 2+ năm kinh nghiệm Java Spring Boot
- Kinh nghiệm với MySQL, hiểu biết transaction isolation
- Kiến thức về messaging (Kafka/RabbitMQ)
- Ưu tiên có kinh nghiệm fintech hoặc banking`,
        benefits: [
          "Lương + thưởng KPI",
          "Bảo hiểm sức khỏe gia đình",
          "18 ngày phép",
          "Cổ phần nhân viên",
          "Lộ trình thăng tiến rõ ràng",
        ],
        slots: 3,
        deadline: daysFromNow(35),
        status: "PUBLISHED",
        isHot: true,
        postedById: recruiter2.id,
      },
    }),

    prisma.job.create({
      data: {
        title: "Intern Frontend Developer",
        company: "FinTech Solutions",
        location: "Quận 7, TP. Hồ Chí Minh",
        salary: "4,000,000 - 6,000,000 VNĐ",
        type: "INTERNSHIP",
        level: "Intern",
        tags: ["React", "JavaScript", "HTML", "CSS"],
        description: `## Intern Frontend Developer

Cơ hội thực tập tại công ty Fintech hàng đầu Việt Nam.

### Yêu cầu
- Sinh viên năm 3/4 ngành CNTT
- Biết HTML, CSS, JavaScript cơ bản
- Biết React là lợi thế
- Chăm chỉ, ham học hỏi`,
        benefits: [
          "Hỗ trợ 4-6 triệu/tháng",
          "Mentorship 1-1",
          "Xét tuyển dụng sau thực tập",
          "Môi trường thân thiện",
        ],
        slots: 5,
        deadline: daysFromNow(14),
        status: "PUBLISHED",
        isHot: false,
        postedById: recruiter2.id,
      },
    }),
  ]);

  // 1 job đã CLOSED (hết hạn)
  await prisma.job.create({
    data: {
      title: "Product Manager (Tech)",
      company: "FinTech Solutions",
      location: "Quận 7, TP. Hồ Chí Minh",
      salary: "35,000,000 - 55,000,000 VNĐ",
      type: "FULL_TIME",
      level: "Senior",
      tags: ["Product Management", "Agile", "Fintech"],
      description: "Vị trí đã đóng tuyển dụng.",
      benefits: [],
      slots: 1,
      deadline: daysAgo(10),
      status: "CLOSED",
      isHot: false,
      postedById: recruiter2.id,
    },
  });

  console.log("  ✓ 9 jobs created (6 PUBLISHED, 1 DRAFT, 1 CLOSED, 1 HOT)");

  // ── 4. CVs ────────────────────────────────────────────────────────────────

  console.log("📄 Creating CVs...");

  const [cv1Default, cv1Alt, cv2Default] = await Promise.all([
    prisma.cv.create({
      data: {
        name: "CV_LeMinhKhoi_Backend_2024.pdf",
        fileUrl: "https://storage.sra.dev/cvs/candidate1/cv_backend_2024.pdf",
        isDefault: true,
        userId: candidate1.id,
      },
    }),
    prisma.cv.create({
      data: {
        name: "CV_LeMinhKhoi_Fullstack_2024.pdf",
        fileUrl: "https://storage.sra.dev/cvs/candidate1/cv_fullstack_2024.pdf",
        isDefault: false,
        userId: candidate1.id,
      },
    }),
    prisma.cv.create({
      data: {
        name: "CV_PhamThiThu_Frontend_2024.pdf",
        fileUrl: "https://storage.sra.dev/cvs/candidate2/cv_frontend_2024.pdf",
        isDefault: true,
        userId: candidate2.id,
      },
    }),
  ]);

  console.log("  ✓ 3 CVs created");

  // ── 5. COVER LETTERS ──────────────────────────────────────────────────────

  console.log("✉️  Creating cover letters...");

  await Promise.all([
    prisma.coverLetter.create({
      data: {
        title: "Cover Letter - Senior Backend TechCorp",
        content: `Kính gửi Phòng nhân sự TechCorp Vietnam,

Tôi tên là Lê Minh Khôi, có 3 năm kinh nghiệm phát triển backend với Node.js và TypeScript. Qua tìm hiểu về văn hóa kỹ thuật tại TechCorp, tôi tin mình phù hợp với vị trí Senior Backend Developer.

Trong 3 năm qua, tôi đã:
- Xây dựng hệ thống xử lý 100K requests/giờ với NestJS + PostgreSQL
- Thiết kế và triển khai microservices architecture
- Tối ưu query giảm 60% latency cho hệ thống legacy

Tôi mong có cơ hội được gặp gỡ và trao đổi thêm.

Trân trọng,
Lê Minh Khôi`,
        userId: candidate1.id,
      },
    }),
    prisma.coverLetter.create({
      data: {
        title: "Cover Letter - Fullstack Remote",
        content: `Kính gửi team tuyển dụng,

Tôi rất quan tâm đến vị trí Fullstack Developer (NestJS + React) làm việc remote. Với kinh nghiệm cả backend lẫn frontend, tôi tự tin đóng góp hiệu quả ngay từ tuần đầu.

Trân trọng,
Lê Minh Khôi`,
        userId: candidate1.id,
      },
    }),
    prisma.coverLetter.create({
      data: {
        title: "Cover Letter - Frontend TechCorp",
        content: `Kính gửi TechCorp Vietnam,

Tôi là Phạm Thị Thu, Frontend Developer với 2 năm kinh nghiệm React và Next.js. Tôi rất hứng thú với vị trí Frontend Developer tại quý công ty.

Điểm mạnh của tôi là khả năng tối ưu performance và xây dựng UI/UX thân thiện với người dùng. Tôi đã cải thiện Lighthouse score từ 65 lên 94 cho một dự án e-commerce lớn.

Mong được trao đổi thêm.

Phạm Thị Thu`,
        userId: candidate2.id,
      },
    }),
  ]);

  console.log("  ✓ 3 cover letters created");

  // ── 6. APPLICATIONS ───────────────────────────────────────────────────────

  console.log("📝 Creating applications...");

  await Promise.all([
    // candidate1 apply 3 jobs
    prisma.application.create({
      data: {
        userId: candidate1.id,
        jobId: jobBackend.id,
        cvUrl: cv1Default.fileUrl,
        phone: "0987654321",
        coverLetter:
          "Tôi rất muốn ứng tuyển vị trí Senior Backend tại TechCorp. Với 3 năm kinh nghiệm Node.js, tôi tin mình đáp ứng tốt yêu cầu.",
        status: "INTERVIEW",
        note: "Candidate có kỹ năng tốt, cần kiểm tra thêm system design",
      },
    }),
    prisma.application.create({
      data: {
        userId: candidate1.id,
        jobId: jobFullstack.id,
        cvUrl: cv1Alt.fileUrl,
        phone: "0987654321",
        coverLetter:
          "Tôi quan tâm đến vị trí Fullstack remote vì phù hợp với định hướng phát triển của tôi.",
        status: "REVIEWING",
      },
    }),
    prisma.application.create({
      data: {
        userId: candidate1.id,
        jobId: jobFintech1.id,
        cvUrl: cv1Default.fileUrl,
        phone: "0987654321",
        coverLetter:
          "Tôi muốn thử thách bản thân trong môi trường fintech với hệ thống core banking.",
        status: "PENDING",
      },
    }),

    // candidate2 apply 2 jobs
    prisma.application.create({
      data: {
        userId: candidate2.id,
        jobId: jobFrontend.id,
        cvUrl: cv2Default.fileUrl,
        phone: "0976543210",
        coverLetter:
          "Tôi có 2 năm kinh nghiệm React và Next.js, rất phù hợp với yêu cầu vị trí này.",
        status: "ACCEPTED",
        note: "Candidate xuất sắc, đã offer 26 triệu",
      },
    }),
    prisma.application.create({
      data: {
        userId: candidate2.id,
        jobId: jobFullstack.id,
        cvUrl: cv2Default.fileUrl,
        phone: "0976543210",
        coverLetter: "Tôi muốn phát triển thêm kỹ năng backend với NestJS.",
        status: "REJECTED",
        note: "Backend skill chưa đủ mạnh cho vị trí này",
      },
    }),

    // candidate3 apply 2 jobs (intern)
    prisma.application.create({
      data: {
        userId: candidate3.id,
        jobId: jobFintech2.id,
        phone: "0965432109",
        coverLetter:
          "Em là sinh viên năm 4 ngành CNTT, mong muốn được thực tập tại FinTech Solutions để tích lũy kinh nghiệm thực tế.",
        status: "PENDING",
      },
    }),
    prisma.application.create({
      data: {
        userId: candidate3.id,
        jobId: jobFrontend.id,
        phone: "0965432109",
        coverLetter:
          "Em muốn ứng tuyển vị trí Frontend Developer để học hỏi thêm về React.",
        status: "PENDING",
      },
    }),
  ]);

  console.log(
    "  ✓ 7 applications created (PENDING/REVIEWING/INTERVIEW/ACCEPTED/REJECTED)",
  );

  // ── 7. SAVED JOBS ─────────────────────────────────────────────────────────

  console.log("🔖 Creating saved jobs...");

  await Promise.all([
    prisma.savedJob.create({
      data: { userId: candidate1.id, jobId: jobDevOps.id },
    }),
    prisma.savedJob.create({
      data: { userId: candidate1.id, jobId: jobDataEngineer.id },
    }),
    prisma.savedJob.create({
      data: { userId: candidate2.id, jobId: jobFullstack.id },
    }),
    prisma.savedJob.create({
      data: { userId: candidate3.id, jobId: jobFintech1.id },
    }),
    prisma.savedJob.create({
      data: { userId: candidate3.id, jobId: jobFintech2.id },
    }),
  ]);

  console.log("  ✓ 5 saved jobs created");

  // ── 8. CHAT SESSIONS & MESSAGES ───────────────────────────────────────────

  console.log("💬 Creating chat sessions & messages...");

  // Session 1: candidate1 - chat thường về career
  const session1 = await prisma.chatSession.create({
    data: {
      title: "Tư vấn định hướng Backend Developer",
      userId: candidate1.id,
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session1.id,
        role: "USER",
        messageType: "TEXT",
        content:
          "Mình đang là Backend Developer 3 năm kinh nghiệm với Node.js. Mình nên học thêm gì để lên Senior?",
      },
      {
        sessionId: session1.id,
        role: "ASSISTANT",
        messageType: "TEXT",
        content: `Với 3 năm kinh nghiệm Node.js, để lên Senior bạn cần tập trung vào các nhóm kỹ năng sau:

**1. System Design**
- Học cách thiết kế distributed systems
- Hiểu sâu về CAP theorem, eventual consistency
- Luyện tập với bài toán như thiết kế URL shortener, chat system

**2. Database chuyên sâu**
- Query optimization, execution plan
- Database indexing strategies
- Sharding và replication

**3. Observability**
- Distributed tracing (Jaeger, Zipkin)
- Structured logging, metrics
- Alerting strategy

**4. Leadership**
- Code review skills
- Kỹ năng mentor junior
- Technical writing (ADR, RFC)

Bạn đang yếu nhất ở mảng nào trong số này?`,
      },
      {
        sessionId: session1.id,
        role: "USER",
        messageType: "TEXT",
        content:
          "Mình thấy System Design là điểm yếu nhất. Có tài nguyên nào để học không?",
      },
      {
        sessionId: session1.id,
        role: "ASSISTANT",
        messageType: "TEXT",
        content: `Đây là lộ trình học System Design mình recommend:

**Sách**
- "Designing Data-Intensive Applications" - Martin Kleppmann (must-read)
- "System Design Interview" - Alex Xu (Vol 1 & 2)

**Online**
- ByteByteGo (YouTube + newsletter)
- High Scalability blog
- engineering blogs của Netflix, Uber, Airbnb

**Luyện tập**
- Tham gia mock interview trên Pramp hoặc interviewing.io
- Tự thiết kế lại các hệ thống bạn đang dùng hàng ngày

Mỗi tuần chọn 1 hệ thống để thiết kế, viết ra document, sau đó so sánh với cách các công ty lớn làm thực tế. Đây là cách hiệu quả nhất.`,
      },
    ],
  });

  // Session 2: candidate1 - CV analysis session
  const session2 = await prisma.chatSession.create({
    data: {
      title: "Phân tích CV - Backend Developer",
      userId: candidate1.id,
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session2.id,
        role: "USER",
        messageType: "TEXT",
        content:
          "Mình muốn nhờ bạn phân tích CV của mình cho vị trí Senior Backend tại TechCorp.",
      },
      {
        sessionId: session2.id,
        role: "ASSISTANT",
        messageType: "TEXT",
        content:
          "Được, bạn hãy upload file CV (PDF) lên để mình phân tích nhé. Mình sẽ đánh giá theo yêu cầu của vị trí Senior Backend Developer tại TechCorp.",
      },
      {
        sessionId: session2.id,
        role: "USER",
        messageType: "TEXT",
        content: "[Uploaded: CV_LeMinhKhoi_Backend_2024.pdf]",
      },
    ],
  });

  // Message CV_ANALYSIS từ assistant
  const cvAnalysisMessage = await prisma.chatMessage.create({
    data: {
      sessionId: session2.id,
      role: "ASSISTANT",
      messageType: "CV_ANALYSIS",
      content: "Mình đã phân tích xong CV của bạn. Đây là kết quả chi tiết:",
    },
  });

  // Tạo CvAnalysis liên kết với message trên
  await prisma.cvAnalysis.create({
    data: {
      messageId: cvAnalysisMessage.id,
      jobId: jobBackend.id,
      cvId: cv1Default.id,
      score: 72,
      strengths: [
        "Kinh nghiệm 3 năm với Node.js và TypeScript - phù hợp yêu cầu",
        "Đã làm việc với PostgreSQL và Redis trong production",
        "Có kinh nghiệm Docker và CI/CD cơ bản",
        "Project thực tế xử lý 100K requests/giờ - minh chứng rõ ràng",
      ],
      weaknesses: [
        "Chưa có kinh nghiệm microservices rõ ràng (JD yêu cầu bắt buộc)",
        "Thiếu kinh nghiệm AWS (JD yêu cầu)",
        "Không đề cập đến kinh nghiệm code review hoặc mentoring",
        "Mô tả các dự án còn chung chung, thiếu số liệu cụ thể",
      ],
      improvements: [
        "Bổ sung section về AWS experience, dù chỉ là side project",
        "Thêm số liệu cụ thể: giảm latency bao nhiêu %, uptime đạt bao nhiêu",
        "Đề cập kinh nghiệm với distributed systems hoặc event-driven",
        "Nêu bật kỹ năng leadership nếu đã từng lead nhóm nhỏ",
        "Thêm link GitHub với các repo có code chất lượng",
      ],
      summary:
        "CV có nền tảng tốt với kinh nghiệm thực tế phù hợp. Tuy nhiên còn thiếu một số kỹ năng bắt buộc trong JD (microservices, AWS). Với điểm 72/100, bạn vẫn có cơ hội được phỏng vấn nếu bổ sung thêm trong Cover Letter và chuẩn bị kỹ cho technical interview về system design.",
      rawCvText:
        "LÊ MINH KHÔI | Backend Developer | leminkhoi@gmail.com | 0987654321\n\nKINH NGHIỆM\nTechStartup ABC (2021-nay) - Backend Developer\n- Phát triển REST API với Node.js + TypeScript + NestJS\n- Tối ưu PostgreSQL queries, giảm response time 60%\n- Triển khai Redis cache cho session management\n- Sử dụng Docker trong môi trường development\n\nKỸ NĂNG\nNode.js, TypeScript, NestJS, PostgreSQL, MySQL, Redis, Docker, Git\n\nHỌC VẤN\nĐại học Công nghệ Thông tin - 2018-2022",
    },
  });

  // Tiếp tục chat sau analysis
  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session2.id,
        role: "USER",
        messageType: "TEXT",
        content:
          "Score 72 thì có được phỏng vấn không? Mình cần cải thiện gì gấp nhất?",
      },
      {
        sessionId: session2.id,
        role: "ASSISTANT",
        messageType: "TEXT",
        content: `72/100 là **borderline** — bạn vẫn có cơ hội được vào vòng phỏng vấn, đặc biệt nếu CV của các ứng viên khác không quá mạnh.

**Cần làm ngay (trước khi submit):**

1. **Bổ sung AWS vào CV** — Dù chỉ là tự học, hãy deploy một side project lên EC2/S3/RDS và đề cập. TechCorp coi đây là điểm quan trọng.

2. **Rewrite phần mô tả kinh nghiệm** theo format: *Action + Technology + Result*
   - ❌ "Phát triển REST API với Node.js"
   - ✅ "Thiết kế và triển khai 15 REST API endpoints xử lý 100K req/giờ với Node.js + TypeScript, đạt p99 latency < 200ms"

3. **Cover Letter là cứu cánh** — Giải thích trực tiếp rằng bạn đang học microservices và có kế hoạch cụ thể.

Bạn có muốn mình giúp viết lại phần Experience không?`,
      },
    ],
  });

  // Session 3: candidate2 - chat về Frontend interview
  const session3 = await prisma.chatSession.create({
    data: {
      title: "Chuẩn bị phỏng vấn Frontend",
      userId: candidate2.id,
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session3.id,
        role: "USER",
        messageType: "TEXT",
        content:
          "Mình được nhận vào TechCorp rồi! Có tips gì cho ngày đầu đi làm không?",
      },
      {
        sessionId: session3.id,
        role: "ASSISTANT",
        messageType: "TEXT",
        content: `Chúc mừng bạn! 🎉 Đây là một số tips cho ngày đầu:

**Tuần 1 — Observe & Learn**
- Đừng vội commit code, hãy đọc hiểu codebase trước
- Hỏi về coding conventions, git flow của team
- Setup local environment, hiểu deployment pipeline

**Về con người**
- Ghi nhớ tên và role của từng người trong team
- Chủ động trong các cuộc họp, hỏi khi không hiểu
- Nhờ ai đó "buddy" để hỏi các câu nhỏ

**Về kỹ thuật**
- Review open PRs để hiểu code style
- Hỏi về tech debt và các vấn đề đang tồn đọng
- Đừng ngại đề xuất cải tiến nhỏ sau khi đã hiểu context

Chúc bạn có khởi đầu tốt đẹp!`,
      },
    ],
  });

  console.log("  ✓ 3 chat sessions created (TEXT + CV_ANALYSIS mixed)");

  // ── 9. QUEUE (sample jobs) ────────────────────────────────────────────────

  console.log("⚙️  Creating queue entries...");

  await prisma.queue.createMany({
    data: [
      {
        type: "EMAIL_VERIFICATION",
        payload: JSON.stringify({
          userId: candidate3.id,
          email: "candidate3@gmail.com",
          code: "482931",
        }),
        status: "pending",
        isPriority: 1,
      },
      {
        type: "EMAIL_APPLICATION_NOTIFY",
        payload: JSON.stringify({
          applicationId: "sample-app-id",
          candidateEmail: "candidate1@gmail.com",
          jobTitle: "Senior Backend Developer",
          status: "INTERVIEW",
        }),
        status: "completed",
        isPriority: 0,
        info: "Sent successfully at " + new Date().toISOString(),
      },
      {
        type: "CV_ANALYSIS_ASYNC",
        payload: JSON.stringify({
          cvId: cv1Default.id,
          jobId: jobBackend.id,
          userId: candidate1.id,
        }),
        status: "completed",
        isPriority: 0,
        info: "Analysis completed, score: 72",
      },
    ],
  });

  console.log("  ✓ 3 queue entries created");

  // ── SUMMARY ───────────────────────────────────────────────────────────────

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  SEED COMPLETED SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Data summary:
   Users         : 6 (1 admin, 2 recruiters, 3 candidates)
   Profiles      : 6
   Jobs          : 9 (6 published, 1 draft, 1 closed, 1 hot)
   CVs           : 3
   Cover Letters : 3
   Applications  : 7
   Saved Jobs    : 5
   Chat Sessions : 3
   Chat Messages : 14 (TEXT + CV_ANALYSIS)
   CV Analyses   : 1
   Queue entries : 3

🔑 Test accounts:
   admin@sra.dev           Admin@123456   (ADMIN)
   recruiter1@techcorp.vn  Recruiter@123  (RECRUITER)
   recruiter2@fintech.vn   Recruiter@123  (RECRUITER)
   candidate1@gmail.com    Candidate@123  (CANDIDATE - verified)
   candidate2@gmail.com    Candidate@123  (CANDIDATE - verified, accepted)
   candidate3@gmail.com    Candidate@123  (CANDIDATE - unverified)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

// ─── Run ─────────────────────────────────────────────────────────────────────

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
