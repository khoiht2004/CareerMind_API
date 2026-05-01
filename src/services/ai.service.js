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
}

module.exports = new AIService();
