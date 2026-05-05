const aiService = require("@/services/ai.service");
const chatModel = require("@/models/chat.model");
const profileModel = require("@/models/profile.model");
const authModel = require("@/models/auth.model");
const { _getMatchingJobs, _formatJobs } = require("@/utils/chatbot.helper");
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
    const userMessage = await chatModel.addMessage(sessionId, "USER", storedContent, attachments);

    const history = await chatModel.getRecentMessages(sessionId, 10);

    const loadMoreKeywords = /thêm|nữa|tiếp|khác|more/i;
    let loadMoreCount = 0;
    history.forEach((msg) => {
      if ((msg.role === "USER" || msg.role === "user") && loadMoreKeywords.test(msg.content)) {
        loadMoreCount++;
      }
    });
    const jobLimit = 20 + loadMoreCount * 5;

    // Build AI message array
    const messages = history
      .map((msg, idx) => {
        const isCurrentMsg = msg.id === userMessage.id;

        // Xử lý ảnh: Gửi Base64 ảnh lên AI
        const msgImages = isCurrentMsg ? images : (msg.attachments?.filter(a => a.category === 'image') || []);
        const hasImages = msgImages.length > 0;

        // Xử lý text từ file đính kèm cho cả tin nhắn hiện tại LẪN tin nhắn lịch sử (ĐỂ AI NHỚ ĐƯỢC CV)
        let historyFileContext = "";
        const msgFiles = isCurrentMsg ? files : (msg.attachments?.filter(a => a.category !== 'image') || []);

        if (msgFiles.length) {
          const parts = msgFiles.map(f => f.extractedText ? `[File: ${f.name}]\n${f.extractedText}` : null).filter(Boolean);
          if (parts.length) {
            historyFileContext = `\n\n═══════\nNỘI DUNG FILE ĐÍNH KÈM\n═══════\n${parts.join("\n\n---\n\n")}`;
          }
        }

        const hasFileContext = historyFileContext.length > 0;

        // Nội dung text gửi lên AI = Nội dung chat + Nội dung file (nếu có)
        const baseText = isCurrentMsg ? (input || "") : (msg.content || "");
        const textContent = (baseText + (hasFileContext ? historyFileContext : "")).trim();
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
        const content = msg.content || (msg.role === "USER" ? "[Tệp đính kèm]" : "");
        if (!content) return null;
        return { role: msg.role === "USER" ? "user" : "assistant", content };
      })
      .filter(Boolean);

    const systemPrompt = await this.generateSystemPrompt(user, jobLimit);
    const aiReply = await aiService.completions(systemPrompt, messages);

    const assistantMessage = await chatModel.addMessage(
      sessionId,
      "ASSISTANT",
      aiReply,
    );

    return { userMessage, assistantMessage: { ...assistantMessage } };
  }

  async generateSystemPrompt(user, jobLimit = 20) {
    const [profile, userInfor] = await Promise.all([
      profileModel.getProfile(user.id),
      authModel.getUserById(user.id),
    ]);

    const isCandidate = userInfor?.role === "CANDIDATE";
    let jobs = [];
    let companyInfo = null;

    if (isCandidate) {
      jobs = await _getMatchingJobs(profile, jobLimit);
    } else {
      if (userInfor?.companyId) {
        const companyModel = require("@/models/company.model");
        const companyData = await companyModel.getCompanyById(userInfor.companyId);
        if (companyData) {
          companyInfo = companyData;
          jobs = (companyData.jobs || []).map((j) => ({
            ...j,
            company: { name: companyData.name },
          }));
        }
      }
    }

    const jobList = _formatJobs(jobs);

    let dynamicContext = "";
    if (isCandidate) {
      dynamicContext = `DỮ LIỆU CÔNG VIỆC\n━━━━━━━━━━━━━━━━━━━━\n${jobList || "Hiện chưa có dữ liệu công việc."}`;
    } else {
      dynamicContext = `THÔNG TIN DOANH NGHIỆP CỦA BẠN\n━━━━━━━━━━━━━━━━━━━━\n- Tên công ty: ${companyInfo?.name || "Chưa cập nhật"}\n- Địa chỉ: ${companyInfo?.address || "Chưa cập nhật"}\n- Tổng job: ${companyInfo?.totalJobs || 0}\n\nCÁC CÔNG VIỆC BẠN ĐÃ ĐĂNG:\n${jobList || "Bạn chưa đăng công việc nào."}`;
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
  - Tư vấn tiêu chí tuyển dụng, gợi ý cấu trúc JD
  - Tìm kiếm ứng viên phù hợp (dựa trên dữ liệu có sẵn)
  - Đánh giá CV ứng viên theo JD
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
❌ NGHIÊM CẤM dùng dấu gạch ngang phân cách: "---", "──", "===" hay bất kỳ dạng đường kẻ nào.
❌ NGHIÊM CẤM để 2 dòng trống liên tiếp nhau (chỉ được dùng tối đa 1 dòng trống giữa các ý chính).
❌ NGHIÊM CẤM dùng markdown heading: ##, ###.
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
}

module.exports = new ChatBotService();
