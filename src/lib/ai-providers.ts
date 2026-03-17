/**
 * AI Providers - Hỗ trợ nhiều AI API (OpenAI, Gemini, Cohere)
 * Thêm provider mới dễ dàng bằng cách implement interface AIProvider
 */

export type AIProvider = "openai" | "gemini" | "cohere";

export interface GenerateCodeParams {
  description: string;
  language: string;
  provider?: AIProvider;
}

export interface GenerateCodeResult {
  code: string;
  explanation: string;
  language: string;
}

// ──────────────────────────────────────────────
// OpenAI (GPT-4o-mini) - Mặc định nếu có key
// ──────────────────────────────────────────────
async function generateWithOpenAI(params: GenerateCodeParams): Promise<GenerateCodeResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY chưa được cấu hình");

  const prompt = buildPrompt(params);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Bạn là chuyên gia lập trình. Trả về JSON hợp lệ với 2 trường: code (chuỗi code hoàn chỉnh có comment) và explanation (giải thích ngắn bằng tiếng Việt). KHÔNG bọc trong markdown hay backtick.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI lỗi: ${(err as { error?: { message?: string } }).error?.message ?? response.statusText}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices[0]?.message?.content ?? "{}";
  return parseAIResponse(content, params.language);
}

// ──────────────────────────────────────────────
// Google Gemini (gemini-1.5-flash)
// ──────────────────────────────────────────────
async function generateWithGemini(params: GenerateCodeParams): Promise<GenerateCodeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY chưa được cấu hình");

  const prompt = buildPrompt(params);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      systemInstruction: {
        parts: [
          {
            text: "Bạn là chuyên gia lập trình. Trả về JSON hợp lệ với 2 trường: code (chuỗi code hoàn chỉnh có comment) và explanation (giải thích ngắn bằng tiếng Việt). KHÔNG bọc trong markdown hay backtick.",
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini lỗi: ${JSON.stringify(err)}`);
  }

  const data = (await response.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  const content = data.candidates[0]?.content?.parts[0]?.text ?? "{}";
  return parseAIResponse(content, params.language);
}

// ──────────────────────────────────────────────
// Cohere (command-r)
// ──────────────────────────────────────────────
async function generateWithCohere(params: GenerateCodeParams): Promise<GenerateCodeResult> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error("COHERE_API_KEY chưa được cấu hình");

  const prompt = buildPrompt(params);

  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "command-r",
      messages: [
        {
          role: "system",
          content:
            "Bạn là chuyên gia lập trình. Trả về JSON hợp lệ với 2 trường: code (chuỗi code hoàn chỉnh có comment) và explanation (giải thích ngắn bằng tiếng Việt). KHÔNG bọc trong markdown hay backtick.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Cohere lỗi: ${JSON.stringify(err)}`);
  }

  const data = (await response.json()) as {
    message: { content: { text: string }[] };
  };
  const content = data.message?.content?.[0]?.text ?? "{}";
  return parseAIResponse(content, params.language);
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function buildPrompt({ description, language }: GenerateCodeParams): string {
  return `Viết code ${language} cho yêu cầu sau:

"${description}"

Yêu cầu:
- Code hoàn chỉnh, có thể chạy ngay
- Comment giải thích từng phần bằng tiếng Việt
- Xử lý edge case cơ bản nếu cần
- Trả về JSON: {"code": "...", "explanation": "..."}`;
}

function parseAIResponse(raw: string, language: string): GenerateCodeResult {
  // Loại bỏ markdown code block nếu AI vẫn bọc JSON
  const cleaned = raw
    .replace(/^```(?:json)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as { code?: string; explanation?: string };
    return {
      code: parsed.code ?? cleaned,
      explanation: parsed.explanation ?? "",
      language,
    };
  } catch {
    // Nếu parse JSON lỗi, trả nguyên text
    return { code: cleaned, explanation: "", language };
  }
}

// ──────────────────────────────────────────────
// Entry point - tự chọn provider theo env vars
// ──────────────────────────────────────────────
export async function generateCode(params: GenerateCodeParams): Promise<GenerateCodeResult> {
  const provider = params.provider ?? detectProvider();

  switch (provider) {
    case "openai":
      return generateWithOpenAI(params);
    case "gemini":
      return generateWithGemini(params);
    case "cohere":
      return generateWithCohere(params);
    default:
      throw new Error(`Provider "${provider}" không được hỗ trợ`);
  }
}

/** Tự detect provider nào có API key */
function detectProvider(): AIProvider {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.COHERE_API_KEY) return "cohere";
  throw new Error(
    "Chưa cấu hình API key. Thêm OPENAI_API_KEY, GEMINI_API_KEY hoặc COHERE_API_KEY vào file .env.local"
  );
}
