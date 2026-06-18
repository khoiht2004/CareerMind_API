const { generateText } = require("ai");
const OpenAI = require("openai");
const aiConfig = require("@/config/ai.config");

const client = new OpenAI({
  apiKey: aiConfig.apiKey,
  baseURL: "https://ai-gateway.vercel.sh/v1",
});

class AIService {
  async generateText(prompt, model = "anthropic/claude-haiku-4.5") {
    const result = await generateText({
      model,
      prompt,
      stream: true,
    });
    return result;
  }

  async completions(systemPrompt, messages = []) {
    const response = await client.chat.completions.create({
      model: "anthropic/claude-haiku-4.5",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });
    return response.choices[0].message.content;
  }

  async parseCV(cvText) {
    const systemPrompt = `
Bạn là trợ lý trích xuất thông tin từ CV chuyên nghiệp. Hãy đọc đoạn văn bản CV sau và trả về thông tin dưới dạng JSON khớp với cấu trúc sau.
Tuyệt đối không thêm bất kỳ văn bản giải thích, Markdown block (như \`\`\`json) hay ký tự nào ngoài JSON thô.

JSON Schema:
{
  "fullName": "Họ và tên đầy đủ của ứng viên (ví dụ: 'Nguyễn Văn A')",
  "phone": "Số điện thoại liên lạc",
  "address": "Địa chỉ hoặc khu vực sinh sống (ví dụ: 'Hà Nội, Việt Nam')",
  "skills": ["Mảng các kỹ năng chuyên môn, ví dụ: ['React', 'NodeJS', 'CSS']"],
  "bio": "Một đoạn giới thiệu ngắn gọn (2-3 câu) tóm tắt kinh nghiệm và định hướng nghề nghiệp dựa trên CV."
}
`.trim();

    const responseText = await this.completions(systemPrompt, [
      { role: "user", content: `Văn bản CV:\n\n${cvText}` }
    ]);

    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("[ai.service] parseCV failed to parse JSON:", responseText, error);
      return null;
    }
  }

  async generateJD({ title, experience, location, keyRequirements }) {
    const systemPrompt = `
Bạn là chuyên gia tuyển dụng và viết mô tả công việc (JD) chuyên nghiệp.
Hãy viết một bản mô tả công việc chi tiết dựa trên các thông số đầu vào được cung cấp.
Trả về kết quả dưới dạng JSON khớp với cấu trúc sau.
Tuyệt đối không thêm bất kỳ văn bản giải thích, Markdown block (như \`\`\`json) hay ký tự nào ngoài JSON thô.

JSON Schema:
{
  "description": "Mô tả chi tiết công việc, nhiệm vụ hàng ngày bằng văn bản tiếng Việt định dạng Markdown hoặc văn bản rõ ràng. (Dài khoảng 150-250 từ)",
  "requirements": [
    {
      "label": "Tên yêu cầu ngắn (ví dụ: 'Kinh nghiệm')",
      "content": "Chi tiết yêu cầu (ví dụ: 'Tối thiểu 2 năm làm việc với ReactJS')"
    }
  ],
  "benefits": [
    {
      "icon": "Tên icon Lucide (ví dụ: 'DollarSign', 'Heart', 'Briefcase', 'Coffee', 'Globe', 'Calendar')",
      "label": "Tên phúc lợi ngắn (ví dụ: 'Lương thưởng')",
      "content": "Chi tiết phúc lợi (ví dụ: 'Lương cạnh tranh lên đến 2000$, thưởng tháng 13')"
    }
  ],
  "tags": ["Mảng các kỹ năng liên quan, tối đa 5 tags, ví dụ: ['React', 'NodeJS', 'CSS']"],
  "industry": ["Mảng ngành nghề, tối đa 2 ngành, ví dụ: ['IT - Phần mềm', 'Công nghệ cao']"]
}
`.trim();

    const prompt = `Tiêu đề công việc: ${title || ""}
Kinh nghiệm yêu cầu: ${experience || "Không yêu cầu"}
Địa điểm: ${location || ""}
Yêu cầu cốt lõi khác: ${keyRequirements || ""}`;

    const responseText = await this.completions(systemPrompt, [
      { role: "user", content: prompt }
    ]);

    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("[ai.service] generateJD failed to parse JSON:", responseText, error);
      return null;
    }
  }
}

module.exports = new AIService();

