"use client";

/**
 * AI Toolbox - Trang chủ
 * Hiển thị danh sách tools + banner quảng cáo placeholder
 */

import Link from "next/link";

// Danh sách tools - dễ mở rộng thêm tool mới
const TOOLS = [
  {
    id: "code-generator",
    href: "/tools/code-generator",
    icon: "⚡",
    name: "Code Generator",
    description: "Nhập mô tả, AI sinh code hoàn chỉnh có comment",
    badge: "FREE",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    available: true,
  },
  {
    id: "text-summarizer",
    href: "#",
    icon: "📝",
    name: "Text Summarizer",
    description: "Tóm tắt văn bản dài thành ý chính",
    badge: "SẮP RA",
    badgeColor: "bg-white/10 text-white/40 border-white/20",
    available: false,
  },
  {
    id: "translator",
    href: "#",
    icon: "🌐",
    name: "AI Translator",
    description: "Dịch nội dung đa ngôn ngữ chất lượng cao",
    badge: "SẮP RA",
    badgeColor: "bg-white/10 text-white/40 border-white/20",
    available: false,
  },
  {
    id: "essay-writer",
    href: "#",
    icon: "✍️",
    name: "Essay Writer",
    description: "Viết bài luận, email, nội dung marketing",
    badge: "SẮP RA",
    badgeColor: "bg-white/10 text-white/40 border-white/20",
    available: false,
  },
  {
    id: "image-prompt",
    href: "#",
    icon: "🎨",
    name: "Image Prompt",
    description: "Tạo prompt tối ưu cho Midjourney, DALL-E",
    badge: "SẮP RA",
    badgeColor: "bg-white/10 text-white/40 border-white/20",
    available: false,
  },
  {
    id: "sql-builder",
    href: "#",
    icon: "🗄️",
    name: "SQL Builder",
    description: "Viết query SQL phức tạp từ mô tả tự nhiên",
    badge: "SẮP RA",
    badgeColor: "bg-white/10 text-white/40 border-white/20",
    available: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ── Gradient background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* ── Header ── */}
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10
            border border-violet-500/20 text-violet-400 text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Tools
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              AI Toolbox
            </span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto">
            Bộ công cụ AI giúp bạn làm việc thông minh hơn — sinh code, dịch, tóm tắt và nhiều hơn nữa.
          </p>
        </header>

        {/* ── Banner quảng cáo ── */}
        <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-sm text-amber-400/80">
            📢 <span className="font-medium">Quảng cáo:</span> Khoảng trống dành cho banner — tích hợp Google AdSense hoặc đối tác
          </p>
        </div>

        {/* ── Tools Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* ── Pricing section ── */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-center mb-8 text-white/80">Bảng giá</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Free plan */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/3">
              <h3 className="font-semibold text-white mb-1">Free</h3>
              <p className="text-3xl font-bold text-white mb-4">$0<span className="text-base font-normal text-white/40">/tháng</span></p>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 3 lượt generate/ngày
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Tất cả ngôn ngữ lập trình
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Lưu lịch sử 50 kết quả
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white/30">✗</span> <span className="text-white/30">Không giới hạn lượt dùng</span>
                </li>
              </ul>
            </div>

            {/* Pro plan */}
            <div className="p-6 rounded-xl border border-violet-500/30 bg-violet-500/5 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-500 text-[10px] font-bold text-white">
                PHỔ BIẾN
              </div>
              <h3 className="font-semibold text-white mb-1">Pro</h3>
              <p className="text-3xl font-bold text-violet-300 mb-4">$9<span className="text-base font-normal text-white/40">/tháng</span></p>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Không giới hạn lượt dùng
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Tất cả tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> API access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Hỗ trợ ưu tiên
                </li>
              </ul>
              <button className="mt-5 w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500
                text-sm font-medium text-white transition-colors">
                Nâng cấp Pro →
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 text-center text-xs text-white/20 border-t border-white/8 pt-8">
          <p>AI Toolbox © 2025 · Powered by OpenAI / Gemini / Cohere</p>
        </footer>
      </div>
    </main>
  );
}

// ── Tool Card Component ──
function ToolCard({ tool }: { tool: typeof TOOLS[0] }) {
  const card = (
    <div className={`group p-5 rounded-xl border transition-all duration-200 h-full
      ${tool.available
        ? "border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20 cursor-pointer"
        : "border-white/6 bg-white/1 cursor-not-allowed opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tool.badgeColor}`}>
          {tool.badge}
        </span>
      </div>
      <h3 className="font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-white/45 leading-relaxed">{tool.description}</p>
      {tool.available && (
        <div className="mt-4 flex items-center gap-1 text-xs text-violet-400 font-medium">
          Dùng ngay
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );

  return tool.available ? <Link href={tool.href}>{card}</Link> : <div>{card}</div>;
}
