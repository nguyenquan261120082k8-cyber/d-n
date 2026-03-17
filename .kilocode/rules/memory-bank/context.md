# Active Context: AI Toolbox

## Current State

**Project Status**: ✅ MVP — AI Code Generator hoàn chỉnh

Đây là **AI Toolbox** — bộ công cụ AI đa chức năng. MVP hiện tại gồm tool đầu tiên: **Code Generator** (sinh code từ mô tả bằng AI). Hỗ trợ 3 AI providers: OpenAI, Gemini, Cohere.

## Recently Completed

- [x] Cấu hình layout.tsx với metadata tiếng Việt + dark mode
- [x] Trang chủ (`/`) — Grid 6 tools, pricing section, banner quảng cáo
- [x] Code Generator tool (`/tools/code-generator`) — textarea, language picker, kết quả đẹp
- [x] API route `POST /api/generate-code` — validation + gọi AI + xử lý lỗi
- [x] `src/lib/ai-providers.ts` — Multi-provider: OpenAI / Gemini / Cohere, auto-detect
- [x] `src/lib/history.ts` — Lịch sử lưu localStorage (50 mục)
- [x] `src/lib/rate-limit.ts` — Rate limit 3 lượt/ngày (free tier)
- [x] `src/components/ui/CodeBlock.tsx` — Syntax highlighting (react-syntax-highlighter)
- [x] `src/components/ui/HistoryPanel.tsx` — Slide-in panel xem lịch sử
- [x] `.env.local.example` — Hướng dẫn cấu hình API key
- [x] Build production pass ✅ | TypeCheck pass ✅ | Lint pass ✅

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Trang chủ — Tool grid + pricing | ✅ Done |
| `src/app/layout.tsx` | Root layout + metadata SEO | ✅ Done |
| `src/app/tools/code-generator/page.tsx` | Code Generator UI | ✅ Done |
| `src/app/api/generate-code/route.ts` | API endpoint POST | ✅ Done |
| `src/lib/ai-providers.ts` | OpenAI / Gemini / Cohere | ✅ Done |
| `src/lib/history.ts` | localStorage history manager | ✅ Done |
| `src/lib/rate-limit.ts` | Free tier: 3/ngày | ✅ Done |
| `src/components/ui/CodeBlock.tsx` | Syntax highlighted code display | ✅ Done |
| `src/components/ui/HistoryPanel.tsx` | Side panel lịch sử | ✅ Done |
| `.env.local.example` | Mẫu cấu hình API key | ✅ Done |

## Tech Stack Added

- `react-syntax-highlighter` + `@types/react-syntax-highlighter` — code highlighting

## Environment Variables Required

```
OPENAI_API_KEY=sk-...       # hoặc
GEMINI_API_KEY=AIza...      # hoặc
COHERE_API_KEY=...
```

Copy `.env.local.example` → `.env.local` và điền key.

## Cách mở rộng thêm Tool mới

1. Thêm tool vào array `TOOLS` trong `src/app/page.tsx`
2. Tạo `src/app/tools/[tool-name]/page.tsx` — UI của tool
3. Tạo `src/app/api/[tool-name]/route.ts` — API endpoint
4. Thêm logic AI provider vào `src/lib/ai-providers.ts`

## Pending Improvements

- [ ] Trang Tools mới: Text Summarizer, Translator, SQL Builder
- [ ] Auth system (Clerk / NextAuth)
- [ ] Database (SQLite/Drizzle) lưu history server-side
- [ ] Payment integration (Stripe) cho Pro plan
- [ ] API rate limit phía server (Redis)

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2025-03 | AI Toolbox MVP — Code Generator + multi-provider AI + history + rate-limit |
