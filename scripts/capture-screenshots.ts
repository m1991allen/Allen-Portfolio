/**
 * 自動截圖作品封面。
 *
 * 對每個作品的 url 用無頭 Chromium 擷取首屏，直接上傳到 Vercel Blob，
 * 再把 Firestore 的 cover 欄位改成 /api/cover/{pathname}。本機不會留下任何圖檔。
 * 若網站擋掉、逾時或回傳錯誤狀態，改用品牌化的佔位圖。
 *
 * 執行：npm run screenshot                    # 全部重截
 *      npm run screenshot -- --only=miu,fixt  # 只截指定 slug（新增作品時用）
 * 需先安裝瀏覽器：npx playwright install chromium
 * 需要 .env.local 有 FIREBASE_SERVICE_ACCOUNT_KEY 與 BLOB_READ_WRITE_TOKEN。
 *
 * 跑完記得 npm run backup，把 Firestore 的最新 cover 同步回 src/data/works.ts。
 */

import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { chromium, type Browser } from "playwright";
import { blobAuth } from "../src/lib/blob-auth";
import { coverSrcFor, blobPathOf } from "../src/lib/cover-path";
import { connectFirestore } from "./firestore-admin";

const VIEWPORT = { width: 1440, height: 900 };
const NAV_TIMEOUT = 30_000;
/** Blob 路徑前綴，與後台上傳用的一致 */
const BLOB_PREFIX = "works";

type WorkRow = {
  slug: string;
  title: string;
  category: string;
  url?: string;
  cover?: string;
};

const categoryColor: Record<string, string> = {
  媒體專題: "#c2481e",
  互動專題: "#1e6f8e",
  企業形象: "#4a6b32",
  客戶系統: "#6b5832",
};

/** 品牌化佔位圖：截一張自製 HTML 當封面 */
async function placeholder(
  browser: Browser,
  title: string,
  category: string,
): Promise<Buffer> {
  const color = categoryColor[category] ?? "#16150f";
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.setContent(`
    <html><body style="margin:0">
      <div style="width:${VIEWPORT.width}px;height:${VIEWPORT.height}px;
        background:#fbfaf7;display:flex;flex-direction:column;
        align-items:center;justify-content:center;font-family:'Noto Sans TC',sans-serif;
        position:relative;overflow:hidden">
        <div style="position:absolute;top:-160px;right:-120px;width:520px;height:520px;
          border-radius:50%;background:${color};opacity:.14;filter:blur(60px)"></div>
        <div style="font-size:16px;letter-spacing:.28em;text-transform:uppercase;
          color:${color};font-weight:700">${category}</div>
        <div style="font-size:64px;font-weight:700;color:#16150f;margin-top:24px;
          font-family:'Noto Serif TC',serif;max-width:1000px;text-align:center">${title}</div>
        <div style="font-size:20px;color:#797365;margin-top:28px">預覽圖擷取中 — 可於後台自行更換封面</div>
      </div>
    </body></html>
  `);
  const buf = await page.screenshot({ type: "jpeg", quality: 82 });
  await page.close();
  return buf;
}

async function capture(browser: Browser, url: string): Promise<Buffer | null> {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    locale: "zh-TW",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  try {
    // 只等 DOM 載入即可——很多網站有持續的網路活動（廣告/分析輪詢），
    // 用 networkidle 會一直等不到而逾時。改成 domcontentloaded 後再儘量 settle。
    const res = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });
    if (res && res.status() >= 400) {
      console.warn(`   ↳ HTTP ${res.status()}，改用佔位圖`);
      await page.close();
      return null;
    }
    // 儘量等網路安靜下來，但最多等 8 秒就放行
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    // 再等一下讓字體/圖片/動畫穩定
    await page.waitForTimeout(3500);
    const buf = await page.screenshot({
      type: "jpeg",
      quality: 72,
      clip: { x: 0, y: 0, ...VIEWPORT },
    });
    await page.close();
    return buf;
  } catch (err) {
    console.warn(`   ↳ 擷取失敗：${(err as Error).message.split("\n")[0]}`);
    await page.close().catch(() => {});
    return null;
  }
}

/** --only=a,b 只處理指定 slug；沒給就全部重截 */
function filterTargets(works: WorkRow[]): WorkRow[] {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  if (!arg) return works;

  const wanted = arg.slice("--only=".length).split(",").filter(Boolean);
  const picked = works.filter((w) => wanted.includes(w.slug));
  const missing = wanted.filter((s) => !works.some((w) => w.slug === s));
  if (missing.length) {
    console.warn(`⚠ Firestore 裡找不到這些 slug：${missing.join(", ")}`);
  }
  return picked;
}

async function main() {
  const db = connectFirestore();
  const snap = await db.collection("works").orderBy("order", "asc").get();
  const works = snap.docs.map((d) => ({ slug: d.id, ...d.data() }) as WorkRow);

  const browser = await chromium.launch();

  const done: string[] = [];
  const fallback: string[] = [];

  for (const w of filterTargets(works)) {
    process.stdout.write(`▶ ${w.slug} (${w.url ?? "無公開連結"})\n`);
    let buf = w.url ? await capture(browser, w.url) : null;
    if (!buf) {
      buf = await placeholder(browser, w.title, w.category);
      fallback.push(w.slug);
    } else {
      done.push(w.slug);
    }

    const blobPath = `${BLOB_PREFIX}/${randomUUID()}.jpg`;
    await put(blobPath, buf, {
      access: "public",
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      ...blobAuth(),
    });

    const previous = w.cover ? blobPathOf(w.cover) : null;
    await db.collection("works").doc(w.slug).update({
      cover: coverSrcFor(blobPath),
      updatedAt: new Date().toISOString(),
    });
    console.log(`   ✓ 已上傳 ${blobPath} 並更新 Firestore`);

    // 舊圖等新的寫進 Firestore 才刪，中途失敗也不會留下沒有封面的作品
    if (previous) {
      await del(previous, blobAuth()).catch(() => {});
    }
  }

  await browser.close();

  console.log("\n──────── 完成 ────────");
  console.log(`✓ 真實截圖 ${done.length} 張：${done.join(", ") || "（無）"}`);
  console.log(
    `▲ 佔位圖 ${fallback.length} 張：${fallback.join(", ") || "（無）"}`,
  );
  if (fallback.length) {
    console.log("  （佔位圖的作品可日後在 /admin 後台手動上傳封面替換）");
  }
  console.log("\n記得跑 npm run backup 把 cover 同步回 src/data/works.ts。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
