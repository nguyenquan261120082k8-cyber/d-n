/**
 * History Manager - Lưu lịch sử generate code vào localStorage (client-side)
 * Dữ liệu lưu trên browser của user, không cần database
 */

export interface HistoryItem {
  id: string;
  description: string;
  language: string;
  code: string;
  explanation: string;
  createdAt: string; // ISO string
}

const STORAGE_KEY = "aitoolbox_history";
const MAX_HISTORY = 50; // Giới hạn 50 mục để tránh tràn localStorage

/** Lấy toàn bộ lịch sử */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

/** Thêm một mục vào lịch sử */
export function addHistory(item: Omit<HistoryItem, "id" | "createdAt">): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const history = getHistory();
  const updated = [newItem, ...history].slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage đầy - xóa bớt
    const trimmed = updated.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  return newItem;
}

/** Xóa một mục khỏi lịch sử */
export function deleteHistory(id: string): void {
  const updated = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** Xóa toàn bộ lịch sử */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Format thời gian hiển thị */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
