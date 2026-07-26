# Allen Liu — 個人作品集

一頁式個人作品集網站，含可上下架作品的後台與綠界 ECPay 抖內金流。

- **前台**：一頁式（Hero / 關於 / 專長 / 經歷 / 作品 / 抖內），作品卡片連到實際線上網站。
- **後台**：Firebase 登入，作品新增／編輯／刪除／**上下架**、封面上傳、抖內紀錄。
- **金流**：綠界 ECPay「請我喝咖啡」抖內（測試環境可直接跑）。

## 技術棧

Next.js 16（App Router）・React 19・TypeScript・Tailwind CSS v4・Firebase（Auth / Firestore / Storage）・綠界 ECPay・Playwright（自動截圖）

## 快速開始

```bash
npm install
npx playwright install chromium   # 截圖用
npm run dev                       # http://localhost:3000
```

未設定 Firebase 也能跑——前台會用 `src/data/works.ts` 的預設作品。
完整設定（Firebase 後台、綠界金流）見 [SETUP.md](SETUP.md)。

## 常用指令

| 指令 | 說明 |
|---|---|
| `npm run dev` | 本機開發 |
| `npm run build` | 正式建置 |
| `npm run screenshot` | 自動幫 `src/data/works.ts` 的每個作品截圖當封面 |
| `npm run seed` | 把預設作品匯入 Firestore（需先設定 `.env.local`）|
| `npm run lint` | ESLint |

## 目錄導覽

```
src/
  app/
    page.tsx                    一頁式首頁（六個區塊）
    admin/                      後台（登入 + 作品管理 + 抖內紀錄）
    api/
      auth/session/             登入 session cookie
      admin/upload/             圖片上傳到 Storage
      tip/                      綠界金流：建單 / 伺服器回呼 / 瀏覽器導回
    tip/thanks/                 抖內感謝頁
  components/                   Header / Footer / WorkGrid / WorkCard / TipJar / Reveal
  data/                        site.ts（個人資料）・works.ts（作品 seed）
  lib/                         firebase / auth / works / donations / ecpay
scripts/
  capture-screenshots.ts       Playwright 自動截圖
  seed-firestore.ts            匯入作品到 Firestore
docs/
  ecpay-teaching.md            綠界金流逐步教學
```

## 內容維護

- 改個人資料、技能、經歷 → `src/data/site.ts`
- 改作品（未接 Firebase 時）→ `src/data/works.ts`，再 `npm run screenshot`
- 接了 Firebase 後 → 一律在 `/admin` 後台管理
