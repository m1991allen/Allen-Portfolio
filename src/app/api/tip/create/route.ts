import { NextResponse } from "next/server";
import { buildCheckoutParams, genOrderId, isPaymentMethod } from "@/lib/ecpay";
import { createDonation } from "@/lib/donations";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

/**
 * 建立一筆抖內訂單。
 *
 * 收到金額/暱稱/留言/付款方式後：
 *   1. 產生訂單編號，（若已設定 Firebase）在 donations 建一筆 pending
 *   2. 組出綠界結帳所需的表單參數 + CheckMacValue
 *   3. 回傳給前端，由前端 auto-submit 到綠界付款頁
 */

const MAX_AMOUNT = 100_000;

/** 同一個 IP 在時間窗內最多建幾筆單（避免有人灌垃圾訂單、吃掉 Firestore 用量） */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * 記在記憶體裡的簡易頻率限制。
 *
 * serverless 每個 instance 有自己的 Map，所以這不是嚴謹的全域限流，
 * 只是攔掉「同一個人狂打」這種最常見的濫用。真要嚴謹得換 Redis/KV。
 */
const hits = new Map<string, number[]>();

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/** Next 15 起 NextRequest 不再提供 .ip，改由代理層的標頭取得 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** 回傳 true 代表已超過限制 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // 順手清掉過期的 key，避免 Map 無限長大
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(clientIp(request))) {
      return NextResponse.json(
        { error: "操作太頻繁了，請稍後再試" },
        { status: 429 },
      );
    }

    const { amount, name, message, method } = await request.json();

    const amt = Math.round(Number(amount));
    if (!Number.isFinite(amt) || amt < 1 || amt > MAX_AMOUNT) {
      return NextResponse.json(
        { error: "金額不正確（1 ~ 100,000 元）" },
        { status: 400 },
      );
    }

    // 只接受後端認可的付款方式，不讓前端隨便帶值進綠界參數
    if (!isPaymentMethod(method)) {
      return NextResponse.json(
        { error: "付款方式不正確" },
        { status: 400 },
      );
    }

    const orderId = genOrderId();
    const cleanName = String(name ?? "").slice(0, 40);
    const cleanMessage = String(message ?? "").slice(0, 100);

    // 已設定 Firebase 才記錄；沒設定也能跑通付款流程（方便先測金流）
    if (isFirebaseConfigured()) {
      await createDonation({
        orderId,
        amount: amt,
        name: cleanName,
        message: cleanMessage,
      });
    }

    const base = siteUrl();
    const { action, params } = buildCheckoutParams({
      orderId,
      amount: amt,
      itemName: "請 Allen 喝咖啡",
      tradeDesc: "Allen 作品集抖內",
      returnURL: `${base}/api/tip/callback`,
      orderResultURL: `${base}/api/tip/return`,
      method,
    });

    return NextResponse.json({ action, params });
  } catch (err) {
    console.error("[tip/create] 建立訂單失敗", err);
    return NextResponse.json(
      { error: "建立訂單失敗，請稍後再試" },
      { status: 500 },
    );
  }
}
