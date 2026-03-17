"use client";

/**
 * HistoryPanel - Hiển thị lịch sử generate code
 * Lưu trong localStorage, có thể load lại kết quả cũ
 */

import { HistoryItem, formatDate, deleteHistory, clearHistory } from "@/lib/history";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

// Màu badge theo ngôn ngữ
const LANG_COLORS: Record<string, string> = {
  python: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  javascript: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  typescript: "bg-blue-400/20 text-blue-200 border-blue-400/30",
  html: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  css: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  java: "bg-red-500/20 text-red-300 border-red-500/30",
  cpp: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  go: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  rust: "bg-orange-600/20 text-orange-200 border-orange-600/30",
  default: "bg-white/10 text-white/50 border-white/20",
};

function getLangColor(lang: string): string {
  return LANG_COLORS[lang.toLowerCase()] ?? LANG_COLORS.default;
}

export default function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onClear,
  onClose,
}: HistoryPanelProps) {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteHistory(id);
    onDelete(id);
  };

  const handleClear = () => {
    if (confirm("Xóa toàn bộ lịch sử?")) {
      clearHistory();
      onClear();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel từ phải kéo ra */}
      <div className="relative ml-auto w-full max-w-md h-full bg-[#0f0f13] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="font-semibold text-white">Lịch sử</h2>
            <p className="text-xs text-white/40">{history.length} kết quả đã lưu</p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-red-400/70 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/10"
              >
                Xóa tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/30">
              <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">Chưa có lịch sử</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => { onSelect(item); onClose(); }}
                className="group p-3 rounded-lg border border-white/8 bg-white/3 hover:bg-white/8
                  hover:border-white/20 cursor-pointer transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate leading-snug">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-medium ${getLangColor(item.language)}`}>
                        {item.language}
                      </span>
                      <span className="text-[11px] text-white/25">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20
                      text-white/30 hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
