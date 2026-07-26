import { NextResponse } from "next/server";
import { verifyCallback } from "@/lib/ecpay";

/**
 * 綠界付款完成後，讓「使用者的瀏覽器」導回來的網址（OrderResultURL）。
 *
 * 綠界會用使用者的瀏覽器 POST 一份結果過來（所以這裡是 POST，不是 GET）。
 * 我們驗證後，用 303 轉址到一個純顯示用的感謝頁（GET）。
 *
 * 註：真正該相信的付款狀態是伺服器對伺服器的 /api/tip/callback，
 * 這裡只負責「畫面上」告訴使用者結果。
 */
export async function POST(request: Request) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin;

  try {
    const form = await request.formData();
    const body: Record<string, string> = {};
    form.forEach((v, k) => {
      body[k] = String(v);
    });

    const ok = verifyCallback(body) && body.RtnCode === "1";
    const amount = body.TradeAmt || "";
    const target = `${base}/tip/thanks?status=${ok ? "ok" : "fail"}${
      amount ? `&amount=${encodeURIComponent(amount)}` : ""
    }`;

    // 從 POST 轉到 GET 頁面，用 303
    return NextResponse.redirect(target, 303);
  } catch (err) {
    console.error("[tip/return] 處理失敗", err);
    return NextResponse.redirect(`${base}/tip/thanks?status=fail`, 303);
  }
}
