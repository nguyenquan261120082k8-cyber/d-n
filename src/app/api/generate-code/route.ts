/**
 * API Route: POST /api/generate-code
 * Nhận description + language từ frontend, gọi AI, trả về code
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCode, type AIProvider } from "@/lib/ai-providers";

// Danh sách ngôn ngữ được phép
const ALLOWED_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
  "bash",
];

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    const body = (await req.json()) as {
      description?: string;
      language?: string;
      provider?: string;
    };

    const { description, language, provider } = body;

    // 2. Validate input
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Vui lòng nhập mô tả yêu cầu code" },
        { status: 400 }
      );
    }

    if (description.trim().length < 5) {
      return NextResponse.json(
        { error: "Mô tả quá ngắn. Hãy mô tả chi tiết hơn (ít nhất 5 ký tự)" },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { error: "Mô tả quá dài (tối đa 1000 ký tự)" },
        { status: 400 }
      );
    }

    if (!language || !ALLOWED_LANGUAGES.includes(language.toLowerCase())) {
      return NextResponse.json(
        { error: `Ngôn ngữ không hợp lệ. Chọn một trong: ${ALLOWED_LANGUAGES.join(", ")}` },
        { status: 400 }
      );
    }

    // 3. Gọi AI
    const result = await generateCode({
      description: description.trim(),
      language: language.toLowerCase(),
      provider: provider as AIProvider | undefined,
    });

    // 4. Trả về kết quả
    return NextResponse.json({
      success: true,
      code: result.code,
      explanation: result.explanation,
      language: result.language,
    });
  } catch (error) {
    // Xử lý các loại lỗi khác nhau
    const message = error instanceof Error ? error.message : "Lỗi không xác định";

    // Lỗi API key chưa cấu hình
    if (message.includes("chưa được cấu hình") || message.includes("API key")) {
      return NextResponse.json(
        {
          error: "API key chưa được cấu hình. Thêm OPENAI_API_KEY, GEMINI_API_KEY hoặc COHERE_API_KEY vào .env.local",
        },
        { status: 503 }
      );
    }

    // Lỗi rate limit từ AI provider
    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return NextResponse.json(
        { error: "Đã vượt giới hạn API. Thử lại sau vài giây" },
        { status: 429 }
      );
    }

    console.error("[generate-code]", error);
    return NextResponse.json(
      { error: `Lỗi khi gọi AI: ${message}` },
      { status: 500 }
    );
  }
}

// Chặn các method khác
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
