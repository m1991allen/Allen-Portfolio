import { NextResponse } from "next/server";
import { buildCheckoutParams, genOrderId } from "@/lib/ecpay";
import { createDonation } from "@/lib/donations";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

/**
 * 建立一筆抖內訂單。
 *
 * 收到金額/暱稱/留言後：
 *   1. 產生訂單編號，（若已設定 Firebase）在 donations 建一筆 pending
 *   2. 組出綠界結帳所需的表單參數 + CheckMacValue
 *   3. 回傳給前端，由前端 auto-submit 到綠界付款頁
 */

const MAX_AMOUNT = 100_000;

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  try {
    const { amount, name, message } = await request.json();

    const amt = Math.round(Number(amount));
    if (!Number.isFinite(amt) || amt < 1 || amt > MAX_AMOUNT) {
      return NextResponse.json(
        { error: "金額不正確（1 ~ 100,000 元）" },
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
