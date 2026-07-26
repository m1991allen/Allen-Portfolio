import { NextResponse } from "next/server";
import { verifyCallback } from "@/lib/ecpay";
import { updateDonationStatus } from "@/lib/donations";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

/**
 * 綠界「伺服器對伺服器」的付款結果通知（ReturnURL）。
 *
 * 這是最可信的付款確認來源——綠界的伺服器會直接 POST 到這裡。
 *   1. 驗證 CheckMacValue，確認通知沒被偽造
 *   2. RtnCode === "1" 代表付款成功 → 更新訂單為 paid
 *   3. 一定要回傳純文字 "1|OK"，綠界才知道你收到了，否則會一直重送
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const body: Record<string, string> = {};
    form.forEach((v, k) => {
      body[k] = String(v);
    });

    if (!verifyCallback(body)) {
      console.warn("[tip/callback] CheckMacValue 驗證失敗", body.MerchantTradeNo);
      return new NextResponse("0|CheckMacValue Error", { status: 400 });
    }

    const orderId = body.MerchantTradeNo;
    const paid = body.RtnCode === "1";

    if (isFirebaseConfigured() && orderId) {
      await updateDonationStatus(
        orderId,
        paid ? "paid" : "failed",
        body.TradeNo,
      );
    }

    // 綠界要求收到後回傳這個字串
    return new NextResponse("1|OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("[tip/callback] 處理失敗", err);
    return new NextResponse("0|Error", { status: 500 });
  }
}
