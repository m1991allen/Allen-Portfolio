# 設定指南

這份文件帶你把網站從「本機能跑」變成「後台能上下架、金流能收款」。
分成三部分：**本機啟動 → Firebase 後台 → 綠界金流**。照著做即可。

---

## 0. 本機啟動（最快看到畫面）

```bash
npm install
npx playwright install chromium   # 第一次要裝截圖用的瀏覽器
npm run screenshot                # 自動幫作品截圖（可跳過，會用既有圖）
npm run dev                       # 打開 http://localhost:3000
```

> 還沒設定 Firebase 也沒關係——網站會自動使用 `src/data/works.ts` 的預設作品，
> 前台完全正常，只是後台會顯示「尚未完成設定」。

---

## 1. Firebase 後台（作品上下架 + 圖片上傳）

### 1-1. 建立專案
1. 到 [Firebase Console](https://console.firebase.google.com/) → **新增專案**。
2. 專案建立後，左側 **Build** 底下開啟三個服務：
   - **Authentication** → 開始使用 → 登入方式選 **電子郵件/密碼** → 啟用。
   - **Firestore Database** → 建立資料庫 → 選 **正式版模式**（Production）→ 選離你近的地區。
   - **Storage** → 開始使用 → 沿用預設。

### 1-2. 建立你的後台管理員帳號
Authentication → **使用者** → 新增使用者，輸入你要用來登入後台的 Email 與密碼。

### 1-3. 拿前端設定值
專案設定（齒輪）→ **一般** → 底下「你的應用程式」→ 新增 **網頁應用程式**（`</>`）→
複製 `firebaseConfig` 裡的 `apiKey`、`authDomain`、`projectId`。

### 1-4. 拿後端服務帳戶金鑰
專案設定 → **服務帳戶** → **產生新的私密金鑰** → 下載一個 JSON 檔。
把它轉成 base64（貼進環境變數比較不會有換行問題）：

```bash
base64 -i ~/Downloads/your-service-account.json | pbcopy   # 已複製到剪貼簿
```

### 1-5. 填 `.env.local`
複製範本並填值：

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=（1-3 的 apiKey）
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=（1-3 的 authDomain）
NEXT_PUBLIC_FIREBASE_PROJECT_ID=（1-3 的 projectId）
FIREBASE_SERVICE_ACCOUNT_KEY=（1-4 貼上的那串 base64）
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
```

> `FIREBASE_STORAGE_BUCKET` 在 Storage 頁面上方看得到（形如 `xxx.firebasestorage.app` 或 `xxx.appspot.com`）。

### 1-6. 套用安全規則（重要）
本專案所有資料都走伺服器端，前端一律禁止直接存取。把 `firestore.rules`、`storage.rules`
的內容貼到 Firebase Console 對應的「規則」分頁並發布，或用 CLI 部署。

### 1-7. 匯入預設作品到 Firestore
```bash
npm run seed
```
這會把 `src/data/works.ts` 的 19 筆作品寫進 Firestore。之後就都在後台管理。

### 1-8. 登入後台
重啟 `npm run dev`，打開 `http://localhost:3000/admin` → 用 1-2 的帳密登入。
現在可以新增／編輯／**上下架**作品、上傳封面了。

---

## 2. 綠界 ECPay 金流（抖內）

詳細教學與測試卡號見 [`docs/ecpay-teaching.md`](docs/ecpay-teaching.md)。

**快速版**：`.env.local` 裡的綠界三個值預設就是官方**測試環境**的公開值，
不用改就能測試（不會扣真錢）。直接：

```bash
npm run dev
```
到首頁「請我喝咖啡」區塊輸入金額 → 送出 → 會導到綠界測試付款頁 → 用測試卡號付款
→ 導回感謝頁。若已設定 Firebase，後台「抖內紀錄」會看到這筆。

> ⚠️ 綠界的 callback 需要一個**外部連得到的網址**才能通知你的伺服器。
> 本機測試時，付款成功後「畫面」會正常導回，但伺服器端的自動更新（callback）
> 需要用 ngrok 之類的工具把 localhost 暴露出去，或部署到線上後才會生效。
> 詳見教學文件。

---

## 3. 部署（Vercel）

1. 把專案推到 GitHub。
2. 到 [Vercel](https://vercel.com/) 匯入這個 repo。
3. 在 Vercel 專案設定 → **Environment Variables** 把 `.env.local` 的每一個變數都填進去，
   並把 `NEXT_PUBLIC_SITE_URL` 改成你的正式網址（例如 `https://allenliu.dev`）。
4. Deploy。之後綠界的 callback 就會正常運作。
