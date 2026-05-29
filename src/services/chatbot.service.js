const aiService = require("@/services/ai.service");
const chatModel = require("@/models/chat.model");
const profileModel = require("@/models/profile.model");
const authModel = require("@/models/auth.model");
const { _getMatchingJobs, _formatJobs, _formatJobsWithCandidates } = require("@/utils/chatbot.helper");
const { extractFileText } = require("../utils/chatbot.helper");

class ChatBotService {
  async chat(user, sessionId, input, attachments = []) {
    const images = attachments.filter((a) => a.category === "image");
    const files = attachments.filter((a) => a.category !== "image");

    // Extract text from attached files
    let fileContext = "";
    if (files.length) {
      const extracted = await Promise.all(files.map(extractFileText));
      const parts = files
        .map((f, i) => {
          if (extracted[i]) {
            f.extractedText = extracted[i]; // Lưu lại text vào object attachment để DB lưu luôn
            return `[File: ${f.name}]\n${extracted[i]}`;
          }
          return null;
        })
        .filter(Boolean);
      if (parts.length) {
        fileContext = `\n\n═══════\nNỘI DUNG FILE ĐÍNH KÈM\n═══════\n${parts.join("\n\n---\n\n")}`;
      }
    }

    // Always store non-empty content — placeholder for image/file-only messages
    const storedContent = input.trim() || "[Tệp đính kèm]";
    const userMessage = await chatModel.addMessage(
      sessionId,
      "USER",
      storedContent,
      attachments,
    );

    const history = await chatModel.getRecentMessages(sessionId, 10);

    const loadMoreKeywords = /thêm|nữa|tiếp|khác|more/i;
    let loadMoreCount = 0;
    history.forEach((msg) => {
      if (
        (msg.role === "USER" || msg.role === "user") &&
        loadMoreKeywords.test(msg.content)
      ) {
        loadMoreCount++;
      }
    });
    const jobLimit = 20 + loadMoreCount * 5;

    // Build AI message array
    const messages = history
      .map((msg, idx) => {
        const isCurrentMsg = msg.id === userMessage.id;

        // Xử lý ảnh: Gửi Base64 ảnh lên AI
        const msgImages = isCurrentMsg
          ? images
          : msg.attachments?.filter((a) => a.category === "image") || [];
        const hasImages = msgImages.length > 0;

        // Xử lý text từ file đính kèm cho cả tin nhắn hiện tại LẪN tin nhắn lịch sử (ĐỂ AI NHỚ ĐƯỢC CV)
        let historyFileContext = "";
        const msgFiles = isCurrentMsg
          ? files
          : msg.attachments?.filter((a) => a.category !== "image") || [];

        if (msgFiles.length) {
          const parts = msgFiles
            .map((f) =>
              f.extractedText ? `[File: ${f.name}]\n${f.extractedText}` : null,
            )
            .filter(Boolean);
          if (parts.length) {
            historyFileContext = `\n\n═══════\nNỘI DUNG FILE ĐÍNH KÈM\n═══════\n${parts.join("\n\n---\n\n")}`;
          }
        }

        const hasFileContext = historyFileContext.length > 0;

        // Nội dung text gửi lên AI = Nội dung chat + Nội dung file (nếu có)
        const baseText = isCurrentMsg ? input || "" : msg.content || "";
        const textContent = (
          baseText + (hasFileContext ? historyFileContext : "")
        ).trim();
        const safeText = textContent || "[Tệp đính kèm]";

        if (hasImages) {
          // Vision format — images + file text in ONE message
          return {
            role: msg.role === "USER" ? "user" : "assistant",
            content: [
              ...msgImages.map((img) => ({
                type: "image_url",
                image_url: { url: `data:${img.mediaType};base64,${img.data}` },
              })),
              { type: "text", text: safeText },
            ],
          };
        }

        if (hasFileContext) {
          return { role: "user", content: safeText };
        }

        // Historical / text-only messages — guard against empty content
        const content =
          msg.content || (msg.role === "USER" ? "[Tệp đính kèm]" : "");
        if (!content) return null;
        return { role: msg.role === "USER" ? "user" : "assistant", content };
      })
      .filter(Boolean);

    const systemPrompt = await this.generateSystemPrompt(user, jobLimit, input);
    const aiReply = await aiService.completions(systemPrompt, messages);

    const assistantMessage = await chatModel.addMessage(
      sessionId,
      "ASSISTANT",
      aiReply,
    );

    return { userMessage, assistantMessage: { ...assistantMessage } };
  }

  async generateSystemPrompt(user, jobLimit = 20, userInput = "") {
    const [profile, userInfor] = await Promise.all([
      profileModel.getProfile(user.id),
      authModel.getUserById(user.id),
    ]);

    const isCandidate = userInfor?.role === "CANDIDATE";
    let jobs = [];
    let companyInfo = null;
    let jobList = "";
    let isCandidateAnalysisContext = false;

    if (isCandidate) {
      jobs = await _getMatchingJobs(profile, jobLimit);
      jobList = _formatJobs(jobs);
    } else {
      if (userInfor?.companyId) {
        const companyModel = require("@/models/company.model");
        const companyData = await companyModel.getCompanyById(
          userInfor.companyId,
        );
        if (companyData) {
          companyInfo = companyData;
          
          // Phát hiện xem user có đang muốn hỏi/phân tích ứng viên hay không
          const askForCandidates = /ứng viên|candidate|ai ứng tuyển|nộp hồ sơ|phân tích|đánh giá|cv|hồ sơ/i.test(userInput);
          
          if (askForCandidates) {
            isCandidateAnalysisContext = true;
            const prisma = require("@/libs/prisma");
            jobs = await prisma.job.findMany({
              where: {
                companyId: userInfor.companyId,
                status: "PUBLISHED",
              },
              include: {
                applications: {
                  where: {
                    status: { in: ["PENDING", "REVIEWING"] },
                    isDraft: false
                  },
                  select: {
                    id: true,
                    status: true,
                    coverLetter: true,
                    phone: true,
                    cv: { select: { name: true } },
                    user: {
                      select: {
                        email: true,
                        profile: {
                          select: {
                            fullName: true,
                            skills: true,
                            bio: true,
                            address: true
                          }
                        }
                      }
                    }
                  }
                }
              },
              orderBy: { createdAt: "desc" },
              take: 10 // Giới hạn 10 job mới nhất có hoạt động để tránh overload token
            });
            jobList = _formatJobsWithCandidates(jobs);
          } else {
            jobs = (companyData.jobs || []).map((j) => ({
              ...j,
              company: { name: companyData.name },
            }));
            jobList = _formatJobs(jobs);
          }
        }
      }
    }

    let dynamicContext = "";
    if (isCandidate) {
      dynamicContext = `DỮ LIỆU CÔNG VIỆC\n━━━━━━━━━━━━━━━━━━━━\n${jobList || "Hiện chưa có dữ liệu công việc."}`;
    } else {
      if (isCandidateAnalysisContext) {
        dynamicContext = `THÔNG TIN DOANH NGHIỆP CỦA BẠN\n━━━━━━━━━━━━━━━━━━━━\n- Tên công ty: ${companyInfo?.name || "Chưa cập nhật"}\n- Địa chỉ: ${companyInfo?.address || "Chưa cập nhật"}\n- Tổng job: ${companyInfo?.totalJobs || 0}\n\nCÁC CÔNG VIỆC BẠN ĐÃ ĐĂNG VÀ DANH SÁCH ỨNG VIÊN ĐANG CHỜ DUYỆT:\n${jobList}`;
      } else {
        dynamicContext = `THÔNG TIN DOANH NGHIỆP CỦA BẠN\n━━━━━━━━━━━━━━━━━━━━\n- Tên công ty: ${companyInfo?.name || "Chưa cập nhật"}\n- Địa chỉ: ${companyInfo?.address || "Chưa cập nhật"}\n- Tổng job: ${companyInfo?.totalJobs || 0}\n\nCÁC CÔNG VIỆC BẠN ĐÃ ĐĂNG:\n${jobList || "Bạn chưa đăng công việc nào."}`;
      }
    }

    const systemPrompt = `
Bạn là AI Scout - Trợ lý tuyển dụng thông minh, hỗ trợ ${isCandidate ? "ứng viên tìm kiếm việc làm phù hợp" : "nhà tuyển dụng tìm kiếm ứng viên chất lượng"}.
════════════════════════════════
THÔNG TIN NGƯỜI DÙNG (ĐÃ XÁC THỰC)
════════════════════════════════
- Họ tên   : ${profile?.fullName || "Chưa cập nhật"}
- Vai trò  : ${isCandidate ? "Ứng viên" : "Nhà tuyển dụng"}
- Bio      : ${profile?.bio || "Chưa cập nhật"}
- Kỹ năng  : ${profile?.skills?.length ? profile?.skills?.join(", ") : "Chưa cập nhật"}
- Địa chỉ  : ${profile?.address || "Chưa cập nhật"}

════════════════════════════════
${dynamicContext}

════════════════════════════════
NGUYÊN TẮC BẤT BIẾN
════════════════════════════════
- Chỉ sử dụng thông tin có trong dữ liệu được cung cấp. Tuyệt đối không bịa đặt hoặc suy luận thông tin.
- Khi dữ liệu không đủ → thông báo rõ ràng, không ước đoán.
- Chỉ xử lý chủ đề liên quan đến tuyển dụng và tìm việc. Từ chối lịch sự các yêu cầu ngoài phạm vi.
- Nếu không chắc chắn → "Tôi không chắc về điều này, bạn vui lòng kiểm tra lại."
- Ghi nhớ ngữ cảnh hội thoại. Không hỏi lại thông tin người dùng đã cung cấp.
- Hạn chế dòng trống: chỉ xuống 1 dòng trống để ngăn cách giữa các ý CHÍNH khác nhau. Không để nhiều dòng trống liên tiếp. Không xuống dòng thừa giữa tiêu đề và nội dung của cùng một ý.

════════════════════════════════
PHÂN QUYỀN THEO VAI TRÒ
════════════════════════════════
[CANDIDATE - Ứng viên]
✅ Được hỗ trợ:
  - Tìm kiếm việc làm theo kỹ năng, kinh nghiệm, địa điểm
  - Tư vấn định hướng nghề nghiệp
  - Đánh giá CV theo vị trí / JD
  - Cung cấp thông tin doanh nghiệp (nếu có trong dữ liệu)
❌ Không hỗ trợ tìm kiếm ứng viên
  → Từ chối: "Tôi xin lỗi, chức năng này dành cho Nhà tuyển dụng."

[RECRUITER - Nhà tuyển dụng]
✅ Được hỗ trợ:
  - Tư vấn tiêu chí tuyển dụng, gợi ý cấu trúc JD hiệu quả
  - Tìm kiếm ứng viên phù hợp (dựa trên dữ liệu có sẵn)
  - Đánh giá CV ứng viên theo JD
  - Phân tích, so sánh các ứng viên đã ứng tuyển cho các job đang tuyển dụng
  - Khi được yêu cầu phân tích/đánh giá ứng viên ứng tuyển: Hãy tiến hành xếp hạng, cho điểm mức độ phù hợp từ 0-100, chỉ rõ điểm mạnh, điểm yếu, mức độ đáp ứng kỹ năng và gợi ý bước tiếp theo (phỏng vấn/từ chối) một cách trung thực, chuyên nghiệp dựa trên dữ liệu ứng viên được cung cấp.
❌ Không hỗ trợ tìm kiếm việc làm
  → Từ chối: "Tôi xin lỗi, chức năng này dành cho Ứng viên."

════════════════════════════════
NĂNG LỰC CHÍNH
════════════════════════════════
[1] TÌM KIẾM VIỆC LÀM (Candidate)
Thông tin bắt buộc trước khi tìm (ưu tiên dùng profile nếu đã có, chỉ hỏi phần còn thiếu):
  - Vị trí mong muốn
  - Số năm kinh nghiệm
  - Kỹ năng chính
  - Địa điểm làm việc
  - Loại hình (full-time / part-time / remote…)

Nếu không có kết quả phù hợp → "Hiện chưa có việc phù hợp với yêu cầu của bạn. Bạn thử điều chỉnh tiêu chí tìm kiếm nhé."
Không tự tạo việc làm không có trong dữ liệu.

[2] TƯ VẤN TUYỂN DỤNG (Recruiter)
  - Xác định tiêu chí ứng viên phù hợp
  - Gợi ý cấu trúc JD hiệu quả
  - Lọc / so sánh ứng viên từ dữ liệu có sẵn

[3] ĐÁNH GIÁ CV
Trước khi đánh giá, xác nhận đủ 3 yếu tố:
  - Vị trí ứng tuyển
  - Mô tả công việc (JD)
  - Nội dung CV hoặc file CV

Thang điểm 0-10:
  - Dưới 5     : Không khuyến khích ứng tuyển
  - 5.0 - 7.5  : Cần cải thiện trước khi ứng tuyển
  - Trên 7.5   : Phù hợp, nên ứng tuyển

Format trả lời đánh giá CV (bắt buộc):
Điểm: [X/10]
Điểm mạnh: [tóm tắt ngắn]
Điểm yếu: [tóm tắt ngắn]
Mức phù hợp: [điểm] - [nhãn mức]
Gợi ý: [1-2 hành động cụ thể để cải thiện]

Nguyên tắc đánh giá:
  - Dựa trên: vị trí, JD, kỹ năng, kinh nghiệm, địa điểm
  - Phản hồi xây dựng, ngắn gọn, không chủ quan
  - Luôn chấm điểm thẳng thắn, kỹ càng, không thiên vị, trung thực tuyệt đối
  - Nếu thiếu thông tin → hỏi theo format chuẩn trước khi đánh giá
  - Nếu người dùng yêu cầu "chấm điểm lại, đánh giá lại, ..." thì điểm số không được thay đổi, chỉ thay đổi nếu người dùng cung cấp thêm thông tin hoặc có sự thay đổi về vị trí, JD, kỹ năng, kinh nghiệm, địa điểm

════════════════════════════════
ĐỊNH DẠNG PHẢN HỒI
════════════════════════════════
GIỌNG VÀ PHONG CÁCH:
- Lịch sự, thân thiện, chuyên nghiệp — xưng "tôi", gọi người dùng là "bạn".
- Mở đầu bằng lời dẫn ngắn trước khi đưa thông tin chính.
- Kết thúc bằng câu hỏi hoặc gợi ý hành động tiếp theo khi phù hợp.

ĐỊNH DẠNG VĂN BẢN:
- Dùng thẻ **text** để in đậm: tên vị trí, kỹ năng quan trọng, điểm số, cảnh báo.
- Dùng icon phù hợp với nội dung:
    👥 người dùng (hiển thị thông tin cá nhân)
    💼 việc làm / tuyển dụng
    ✅ phù hợp / xác nhận
    ❌ không phù hợp / từ chối
    ⚠️ cảnh báo / lưu ý
    💡 gợi ý / mẹo
    🔍 tìm kiếm
- Icon luôn phải được đặt ở đầu tiên trong dòng (trước in đậm).
- Khi muốn gợi ý công việc, CHỈ CẦN ghi mã [ID:xxx] (ví dụ: [ID:123]) trên một dòng riêng biệt. Hệ thống UI sẽ tự động biến nó thành Thẻ Công Việc. TUYỆT ĐỐI KHÔNG tự viết thêm Tên công việc, Công ty, Lương... bên cạnh mã ID để tránh lặp thông tin trên UI.
- Nếu người dùng yêu cầu "tìm thêm", "gợi ý thêm", hãy thông báo rằng bạn đang tải thêm kết quả và kèm theo từ khóa đặc biệt [LOAD_MORE_JOBS] ở cuối câu trả lời.

QUI TẮC TUYỆT ĐỐI VỀ ĐỊNH DẠNG (KHÔNG ĐƯỢC VI PHẠM):
❌ NGHIÊM CẤM dùng dấu gạch ngang phân cách: "--", "---", "──", "===" hay bất kỳ dạng đường kẻ nào.
❌ NGHIÊM CẤM để 2 dòng trống liên tiếp nhau (chỉ được dùng tối đa 1 dòng trống giữa các ý chính).
❌ NGHIÊM CẤM dùng markdown heading: #, ##, ###.
❌ NGHIÊM CẤM để dòng trống giữa dòng tiêu đề (dòng kết thúc bằng dấu ":" hoặc có icon ở đầu) và nội dung/danh sách liền sau nó.
  Ví dụ SAI: "💡 Gợi ý cho bạn:\n\n1. Điều X..."
  Ví dụ ĐÚNG: "💡 Gợi ý cho bạn:\n1. Điều X..."
✅ Phân cách ý chính bằng: xuống 1 dòng trống duy nhất (chỉ giữa các ý chính, không dùng sau tiêu đề đầu mục).

ĐỊNH DẠNG HỎI THÊM THÔNG TIN (bắt buộc khi thiếu data):
Bạn có thể cho tôi biết thêm:
1. [câu hỏi 1]
2. [câu hỏi 2]
3. [câu hỏi 3]

════════════════════════════════
TỐI ƯU
════════════════════════════════
- Câu ngắn, rõ nghĩa. Không diễn giải thừa.
- Mỗi phản hồi tập trung một nhiệm vụ chính.
- Yêu cầu phức tạp → chia nhỏ, xử lý từng bước.
- Không lặp lại thông tin đã nêu trong cùng phản hồi.
    `.trim();
    return systemPrompt;
  }

  async generateCoverLetter(job, profile) {
    const reqs = (() => {
      if (Array.isArray(job.requirements)) return job.requirements;
      if (typeof job.requirements === "string") {
        try {
          return JSON.parse(job.requirements);
        } catch {
          return [];
        }
      }
      return [];
    })();

    const jobInfo = [
      `Vị trí: ${job.title}`,
      `Công ty: ${job.company?.name || "Chưa rõ"}`,
      job.description
        ? `Mô tả công việc:\n${job.description.slice(0, 1000)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const userInfo = profile
      ? [
          profile.fullName ? `Họ tên: ${profile.fullName}` : null,
          profile.bio ? `Giới thiệu: ${profile.bio}` : null,
        ]
          .filter(Boolean)
          .join("\n")
      : "Chưa có thông tin profile.";

    const systemPrompt =
      "Bạn là chuyên gia viết cover letter chuyên nghiệp. Hãy viết một cover letter ngắn gọn, thuyết phục bằng tiếng Việt (khoảng 200-300 từ). Chỉ trả về nội dung cover letter, không cần tiêu đề hay chú thích thêm.";

    const messages = [
      {
        role: "user",
        content: `THÔNG TIN CÔNG VIỆC:\n${jobInfo}\n\nTHÔNG TIN ỨNG VIÊN:\n${userInfo}\n\nHãy viết cover letter phù hợp cho ứng viên này.`,
      },
    ];

    return aiService.completions(systemPrompt, messages);
  }

  // AI phân tích đề xuất chọn ứng viên cho nhà tuyển dụng
  async analyzeRecruiterCandidates(user, { jobId, criteria }) {
    if (user.role !== "RECRUITER" && user.role !== "ADMIN") {
      const error = new Error("Chức năng này chỉ dành cho nhà tuyển dụng");
      error.statusCode = 403;
      throw error;
    }

    const jobModel = require("@/models/job.model");
    const applicationModel = require("@/models/application.model");

    const job = await jobModel.getJobSnapshotById(jobId);
    if (!job) {
      const error = new Error("Không tìm thấy công việc");
      error.statusCode = 404;
      throw error;
    }

    if (user.role === "RECRUITER" && job.postedBy?.id !== user.id) {
      const error = new Error(
        "Bạn không có quyền phân tích ứng viên của công việc này",
      );
      error.statusCode = 403;
      throw error;
    }

    const applications = await applicationModel.getScreeningApplicationsByJob(
      jobId,
      user.role === "RECRUITER" ? user.id : undefined,
    );

    if (!applications.length) {
      return {
        total: 0,
        analysis:
          "Hiện chưa có ứng viên ở trạng thái PENDING hoặc REVIEWING cho công việc này.",
      };
    }

    const normalizeJson = (value) => {
      if (!value) return "Chưa cập nhật";
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    const jobContext = [
      `ID: ${job.id}`,
      `Vị trí: ${job.title}`,
      `Công ty: ${job.company?.name || "Chưa cập nhật"}`,
      `Địa điểm: ${job.location || "Chưa cập nhật"}`,
      `Loại hình: ${job.type || "Chưa cập nhật"}`,
      `Cấp bậc: ${job.level || "Chưa cập nhật"}`,
      // `Lương: ${job.salary || "Chưa cập nhật"}`,
      // `Tags: ${normalizeJson(job.tags)}`,
      `Yêu cầu: ${normalizeJson(job.requirements)}`,
      `Mô tả công việc:\n${job.description || "Chưa cập nhật"}`,
      criteria?.trim()
        ? `Tiêu chí bổ sung từ recruiter:\n${criteria.trim()}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const candidateContext = applications
      .map((app, index) => {
        const profile = app.user?.profile || {};
        return [
          `Ứng viên ${index + 1}`,
          `Application ID: ${app.id}`,
          `Tên: ${profile.fullName || app.user?.email || "Chưa cập nhật"}`,
          `Email: ${app.user?.email || "Chưa cập nhật"}`,
          `Số điện thoại: ${app.phone || profile.phone || "Chưa cập nhật"}`,
          `Trạng thái: ${app.status}`,
          `Địa chỉ: ${profile.address || "Chưa cập nhật"}`,
          `Bio: ${profile.bio || "Chưa cập nhật"}`,
          `Kỹ năng: ${normalizeJson(profile.skills)}`,
          `Cover letter: ${app.coverLetter || "Chưa cập nhật"}`,
          `CV: ${app.cv?.name || app.cvUrl || "Chưa cập nhật"}`,
        ].join("\n");
      })
      .join("\n\n");

    const baseSystemPrompt = await this.generateSystemPrompt(user);
    const systemPrompt = `${baseSystemPrompt}

NHIỆM VỤ CHUYÊN BIỆT CHO RECRUITER
Bạn đang phân tích ứng viên đã ứng tuyển vào đúng job. Chỉ sử dụng dữ liệu trong phần THÔNG TIN JOB và DANH SÁCH ỨNG VIÊN.
Chấm điểm mức phù hợp theo thang 0-100.
Ưu tiên ứng viên đang PENDING hoặc REVIEWING có kỹ năng, kinh nghiệm, địa điểm, cover letter và profile phù hợp JD.
Không bịa kinh nghiệm, bằng cấp, kỹ năng hoặc nội dung CV nếu dữ liệu không có.
Không dùng markdown heading (#, ##, ###) và không dùng separator dạng --, ---, ===, đường kẻ.
Nếu cần viết phản hồi từ chối cho candidate, đặt nội dung phản hồi trong blockquote bắt đầu bằng ký tự > để UI hiển thị thành khối copy.

Format trả lời bắt buộc:
Tổng quan: [1-2 câu]

Bảng xếp hạng:
1. [Tên] - [Điểm]/100 - [Nên chọn/Cân nhắc/Không phù hợp]
   Lý do: [ngắn gọn]
   Thiếu dữ liệu/rủi ro: [ngắn gọn]
   Gợi ý hành động: [phỏng vấn/đưa vào reviewing/từ chối]
   Phản hồi nếu không phù hợp:
   > [chỉ viết khi điểm dưới 60]

Gợi ý tuyển chọn:
[1-3 ứng viên nên ưu tiên và lý do]`.trim();

    const messages = [
      {
        role: "user",
        content: `THÔNG TIN JOB\n${jobContext}\n\nDANH SÁCH ỨNG VIÊN\n${candidateContext}`,
      },
    ];

    const analysis = await aiService.completions(systemPrompt, messages);
    return { total: applications.length, analysis };
  }

  // AI phân tích độ phù hợp của ứng viên với công việc
  async analyzeCandidateJobFit(user, { jobId }) {
    if (user.role !== "CANDIDATE") {
      const error = new Error("Chức năng này chỉ dành cho ứng viên");
      error.statusCode = 403;
      throw error;
    }

    const jobModel = require("@/models/job.model");
    const job = await jobModel.getJobSnapshotById(jobId);
    if (!job) {
      const error = new Error("Không tìm thấy công việc");
      error.statusCode = 404;
      throw error;
    }

    const profile = await profileModel.getProfile(user.id);
    const normalizeJson = (value) => {
      if (!value) return "Chưa cập nhật";
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    const baseSystemPrompt = await this.generateSystemPrompt(user);
    const systemPrompt = `${baseSystemPrompt}

NHIỆM VỤ CHUYÊN BIỆT CHO CANDIDATE
Bạn đang phân tích nhanh mức độ phù hợp giữa hồ sơ ứng viên và job đang xem.
Chỉ dùng dữ liệu trong THÔNG TIN ỨNG VIÊN và THÔNG TIN JOB.
Không bịa kinh nghiệm, bằng cấp, kỹ năng hoặc nội dung CV nếu dữ liệu không có.
Trả lời ngắn gọn, súc tích, tối đa 6 dòng.
Không dùng markdown heading (#, ##, ###) và không dùng separator dạng --, ---, ===, đường kẻ.

Format trả lời bắt buộc:
Điểm phù hợp: [X]/100
Điểm mạnh: [1 câu]
Điểm thiếu: [1 câu]
Gợi ý: [1-2 hành động cụ thể trước khi ứng tuyển]`.trim();

    const messages = [
      {
        role: "user",
        content: `THÔNG TIN ỨNG VIÊN
Tên: ${profile?.fullName || user.email || "Chưa cập nhật"}
Bio: ${profile?.bio || "Chưa cập nhật"}
Kỹ năng: ${normalizeJson(profile?.skills)}
Địa chỉ: ${profile?.address || "Chưa cập nhật"}

THÔNG TIN JOB
Vị trí: ${job.title}
Công ty: ${job.company?.name || "Chưa cập nhật"}
Địa điểm: ${job.location || "Chưa cập nhật"}
Loại hình: ${job.type || "Chưa cập nhật"}
Cấp bậc: ${job.level || "Chưa cập nhật"}
Tags: ${normalizeJson(job.tags)}
Yêu cầu: ${normalizeJson(job.requirements)}
Mô tả công việc:
${job.description || "Chưa cập nhật"}`,
      },
    ];

    const analysis = await aiService.completions(systemPrompt, messages);
    return { analysis };
  }
}

module.exports = new ChatBotService();
