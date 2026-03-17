"use client";

/**
 * Code Generator Tool
 * - Nhập mô tả → AI sinh code hoàn chỉnh
 * - Chọn ngôn ngữ lập trình
 * - Syntax highlighting, copy, lịch sử
 * - Rate limit: 3 lượt/ngày (free)
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import để tránh SSR lỗi với localStorage
const CodeBlock = dynamic(() => import("@/components/ui/CodeBlock"), { ssr: false });
const HistoryPanel = dynamic(() => import("@/components/ui/HistoryPanel"), { ssr: false });

import {
  canUse,
  remainingUsage,
  incrementUsage,
  DAILY_LIMIT,
} from "@/lib/rate-limit";
import { getHistory, addHistory, type HistoryItem } from "@/lib/history";

// ── Danh sách ngôn ngữ ──
const LANGUAGES = [
  { value: "python", label: "Python", emoji: "🐍" },
  { value: "javascript", label: "JavaScript", emoji: "📜" },
  { value: "typescript", label: "TypeScript", emoji: "🔷" },
  { value: "java", label: "Java", emoji: "☕" },
  { value: "cpp", label: "C++", emoji: "⚙️" },
  { value: "c", label: "C", emoji: "🔩" },
  { value: "csharp", label: "C#", emoji: "💜" },
  { value: "go", label: "Go", emoji: "🐹" },
  { value: "rust", label: "Rust", emoji: "🦀" },
  { value: "php", label: "PHP", emoji: "🐘" },
  { value: "ruby", label: "Ruby", emoji: "💎" },
  { value: "swift", label: "Swift", emoji: "🍎" },
  { value: "kotlin", label: "Kotlin", emoji: "🎯" },
  { value: "html", label: "HTML", emoji: "🌐" },
  { value: "css", label: "CSS", emoji: "🎨" },
  { value: "sql", label: "SQL", emoji: "🗄️" },
  { value: "bash", label: "Bash", emoji: "💻" },
];

// ── Ví dụ prompt gợi ý ──
const EXAMPLE_PROMPTS = [
  "Viết hàm kiểm tra số nguyên tố",
  "Tạo REST API đơn giản với Express.js",
  "Đọc file CSV và tính tổng cột số",
  "Implement thuật toán sắp xếp nhanh (QuickSort)",
  "Tạo form đăng nhập với validation",
  "Viết script backup thư mục tự động",
];

interface GenerateResult {
  code: string;
  explanation: string;
  language: string;
}

export default function CodeGeneratorPage() {
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    setRemaining(remainingUsage());
    setHistory(getHistory());
  }, []);

  // Scroll xuống kết quả khi có code
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [result]);

  const handleGenerate = async () => {
    // Validation phía client
    if (!description.trim()) {
      setError("Vui lòng nhập mô tả yêu cầu");
      return;
    }

    if (!canUse()) {
      setError(`Bạn đã dùng hết ${DAILY_LIMIT} lượt miễn phí hôm nay. Quay lại ngày mai hoặc nâng cấp Pro!`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, language }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        code?: string;
        explanation?: string;
        language?: string;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Lỗi không xác định");
      }

      const generated: GenerateResult = {
        code: data.code ?? "",
        explanation: data.explanation ?? "",
        language: data.language ?? language,
      };

      setResult(generated);

      // Tăng đếm + lưu lịch sử
      incrementUsage();
      setRemaining(remainingUsage());

      const saved = addHistory({
        description,
        language: generated.language,
        code: generated.code,
        explanation: generated.explanation,
      });
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi gọi API");
    } finally {
      setLoading(false);
    }
  };

  // Load lại từ lịch sử
  const handleLoadHistory = (item: HistoryItem) => {
    setDescription(item.description);
    setLanguage(item.language);
    setResult({ code: item.code, explanation: item.explanation, language: item.language });
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter để generate
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Gradient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* ── Navbar ── */}
        <nav className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            AI Toolbox
          </Link>

          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white
              transition-colors px-3 py-1.5 rounded-lg hover:bg-white/8 border border-transparent hover:border-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lịch sử ({history.length})
          </button>
        </nav>

        {/* ── Title ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-2xl font-bold text-white">Code Generator</h1>
          </div>
          <p className="text-white/45 text-sm">
            Mô tả yêu cầu → AI sinh code hoàn chỉnh có comment. Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono">Ctrl+Enter</kbd> để generate nhanh.
          </p>
        </div>

        {/* ── Rate limit badge ── */}
        <div className={`mb-6 flex items-center justify-between p-3 rounded-lg border text-sm
          ${remaining > 0
            ? "bg-green-500/5 border-green-500/20 text-green-400/80"
            : "bg-red-500/5 border-red-500/20 text-red-400/80"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {remaining > 0
              ? `${remaining} lượt miễn phí còn lại hôm nay`
              : "Hết lượt miễn phí hôm nay"}
          </div>
          {remaining === 0 && (
            <Link href="/" className="text-violet-400 hover:text-violet-300 font-medium text-xs">
              Nâng cấp Pro →
            </Link>
          )}
        </div>

        {/* ── Input Form ── */}
        <div className="space-y-4 mb-6">
          {/* Language selector */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Ngôn ngữ lập trình
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                    ${language === lang.value
                      ? "bg-violet-600/30 border-violet-500/50 text-violet-200"
                      : "bg-white/4 border-white/10 text-white/50 hover:bg-white/8 hover:text-white/80"
                    }`}
                >
                  {lang.emoji} {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description textarea */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Mô tả yêu cầu
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ví dụ: Viết hàm Python kiểm tra số nguyên tố, trả về True/False..."
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/7
                resize-none text-sm leading-relaxed transition-all duration-150"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-white/25">{description.length}/1000 ký tự</p>
              <button
                onClick={() => setDescription("")}
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs text-white/30 mb-2">Gợi ý nhanh:</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setDescription(prompt)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/8
                    text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Generate Button ── */}
        <button
          onClick={handleGenerate}
          disabled={loading || !description.trim() || remaining === 0}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400
            text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
            flex items-center justify-center gap-2.5"
        >
          {loading ? (
            <>
              {/* Spinner */}
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              AI đang viết code...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Code
            </>
          )}
        </button>

        {/* ── Error ── */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div ref={resultRef} className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white/70">Kết quả</h2>
              <button
                onClick={() => { setResult(null); setError(null); }}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Xóa kết quả
              </button>
            </div>
            <CodeBlock
              code={result.code}
              language={result.language}
              explanation={result.explanation}
            />
          </div>
        )}

        {/* ── Banner quảng cáo cuối trang ── */}
        <div className="mt-12 p-4 rounded-xl border border-white/8 bg-white/2 text-center">
          <p className="text-xs text-white/25">
            📢 Banner quảng cáo — Tích hợp Google AdSense hoặc sponsorship
          </p>
        </div>
      </div>

      {/* ── History Panel ── */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={handleLoadHistory}
          onDelete={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
          onClear={() => setHistory([])}
          onClose={() => setShowHistory(false)}
        />
      )}
    </main>
  );
}
