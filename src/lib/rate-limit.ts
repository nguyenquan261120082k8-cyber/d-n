/**
 * Rate Limiter - Giới hạn số lượt dùng mỗi ngày (client-side)
 * Free: 3 lượt/ngày | Pro: không giới hạn (demo)
 */

const USAGE_KEY = "aitoolbox_usage";
const FREE_DAILY_LIMIT = 3;

interface UsageData {
  date: string; // YYYY-MM-DD
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

/** Lấy số lượt đã dùng hôm nay */
export function getTodayUsage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw) as UsageData;
    // Reset nếu sang ngày mới
    if (data.date !== getTodayKey()) return 0;
    return data.count;
  } catch {
    return 0;
  }
}

/** Tăng đếm lượt dùng */
export function incrementUsage(): void {
  if (typeof window === "undefined") return;
  const count = getTodayUsage() + 1;
  const data: UsageData = { date: getTodayKey(), count };
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

/** Kiểm tra có thể dùng thêm không */
export function canUse(): boolean {
  return getTodayUsage() < FREE_DAILY_LIMIT;
}

/** Số lượt còn lại */
export function remainingUsage(): number {
  return Math.max(0, FREE_DAILY_LIMIT - getTodayUsage());
}

export const DAILY_LIMIT = FREE_DAILY_LIMIT;
