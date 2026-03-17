"use client";

/**
 * CodeBlock - Hiển thị code với syntax highlighting đẹp
 * Sử dụng react-syntax-highlighter với theme VS Code Dark
 */

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language: string;
  explanation?: string;
}

// Map tên ngôn ngữ sang prism language key
const LANGUAGE_MAP: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  html: "html",
  css: "css",
  sql: "sql",
  bash: "bash",
};

export default function CodeBlock({ code, language, explanation }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const prismLang = LANGUAGE_MAP[language.toLowerCase()] ?? "text";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback cho trình duyệt cũ / Termux WebView
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl">
      {/* Header thanh trên cùng */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Dot decorations giống macOS */}
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-white/40 font-mono uppercase tracking-wider">
            {language}
          </span>
        </div>

        {/* Nút Copy */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
            bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 hover:border-white/25"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Đã copy!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className="max-h-[500px] overflow-auto text-sm">
        <SyntaxHighlighter
          language={prismLang}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "0.8125rem",
            lineHeight: "1.6",
          }}
          showLineNumbers
          lineNumberStyle={{ color: "#555", minWidth: "2.5em" }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Giải thích (nếu có) */}
      {explanation && (
        <div className="px-4 py-3 bg-blue-950/40 border-t border-blue-500/20">
          <p className="text-xs text-blue-300/80 leading-relaxed">
            <span className="font-semibold text-blue-400">Giải thích: </span>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
