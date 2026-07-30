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

    // RtnCode=1 才是付款成功。RtnCode=2 是「非信用卡取號成功」——目前只開
    // 信用卡與 Apple Pay，正常不會收到，但寧可記 log 也不要誤標成 failed
    // （取號成功之後使用者才會真的去繳錢）。
    if (body.RtnCode === "2") {
      console.info("[tip/callback] 收到取號通知，略過狀態更新", orderId);
      return new NextResponse("1|OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (isFirebaseConfigured() && orderId) {
      await updateDonationStatus(
        orderId,
        body.RtnCode === "1" ? "paid" : "failed",
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
