import "server-only";

import crypto from "node:crypto";

import { tipMethods, type TipMethod } from "@/data/site";

/**
 * 綠界 ECPay 全方位金流（AIO）串接工具。
 *
 * 核心是 CheckMacValue——綠界用它來確認「這筆請求真的是你送的、
 * 沒有被中途竄改」。產生方式（官方規定）：
 *   1. 把所有參數依「參數名稱」英文字母排序
 *   2. 前後接上 HashKey 與 HashIV，組成一長串 query 字串
 *   3. 整串做 URL encode 後轉小寫
 *   4. 用 SHA256 雜湊，最後轉大寫
 * 綠界收到後會用同樣方法自己算一次，兩邊一致才算通過。
 *
 * 測試環境的 MerchantID / HashKey / HashIV 是綠界公開的，
 * 直接用不會扣到真錢；上線時換成自己的正式值即可。
 */

type EcpayEnv = "stage" | "production";

/** 綠界公開的測試環境金鑰，只在 stage 當預設值用 */
const STAGE_KEYS = {
  merchantId: "2000132",
  hashKey: "5294y06JbISpM5x9",
  hashIV: "v77hoKGq4kWxNNIS",
} as const;

/**
 * 可開放的付款方式沿用 data/site 的 tipMethods（前後端同一份清單），
 * 其 value 就是綠界的 ChoosePayment 值。
 */
export type PaymentMethod = TipMethod;

/** 只接受清單內的值，避免前端把任意字串塞進綠界參數 */
export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return tipMethods.some((m) => m.value === value);
}

function config() {
  const env = (process.env.ECPAY_ENV as EcpayEnv) || "stage";
  const merchantId = process.env.ECPAY_MERCHANT_ID;
  const hashKey = process.env.ECPAY_HASH_KEY;
  const hashIV = process.env.ECPAY_HASH_IV;

  // 正式環境不允許 fallback：少填一組就會拿「測試金鑰」去簽正式站的單，
  // 綠界只會回一句 CheckMacValue Error，幾乎查不出原因。
  // 寧可在建單時就明確炸掉。
  if (env === "production") {
    if (!merchantId || !hashKey || !hashIV) {
      throw new Error(
        "ECPAY_ENV=production 但 ECPAY_MERCHANT_ID / ECPAY_HASH_KEY / ECPAY_HASH_IV 未全部設定",
      );
    }
    return { merchantId, hashKey, hashIV, env };
  }

  return {
    merchantId: merchantId || STAGE_KEYS.merchantId,
    hashKey: hashKey || STAGE_KEYS.hashKey,
    hashIV: hashIV || STAGE_KEYS.hashIV,
    env,
  };
}

/** 依環境回傳綠界結帳頁網址 */
export function checkoutAction(): string {
  return config().env === "production"
    ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
    : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
}

/** 模仿 .NET HttpUtility.UrlEncode 的編碼結果（綠界的驗證是照這個算的） */
function dotNetUrlEncode(raw: string): string {
  return encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%21/g, "!")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2a/g, "*")
    .replace(/%2d/g, "-")
    .replace(/%2e/g, ".")
    .replace(/%5f/g, "_");
}

/** 產生 CheckMacValue（SHA256、大寫） */
export function genCheckMacValue(params: Record<string, string>): string {
  const { hashKey, hashIV } = config();

  // 1. 依參數名稱（不分大小寫）排序
  const sortedKeys = Object.keys(params).sort((a, b) =>
    a.toLowerCase() < b.toLowerCase() ? -1 : 1,
  );

  // 2. 組字串：HashKey=...&參數...&HashIV=...
  let raw = `HashKey=${hashKey}`;
  for (const k of sortedKeys) raw += `&${k}=${params[k]}`;
  raw += `&HashIV=${hashIV}`;

  // 3. URL encode → 小寫
  const encoded = dotNetUrlEncode(raw);

  // 4. SHA256 → 大寫
  return crypto.createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

/** yyyy/MM/dd HH:mm:ss（綠界規定的日期格式） */
function tradeDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(
    d.getHours(),
  )}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** 產生一個 ≤20 碼、只有英數的訂單編號 */
export function genOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 1e6)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0")
    .slice(0, 4);
  return `AL${ts}${rand}`.slice(0, 20);
}

/**
 * 組出送往綠界結帳頁所需的完整表單參數（含 CheckMacValue）。
 * 前端拿到後動態組 form auto-submit 到 checkoutAction()。
 */
export function buildCheckoutParams(opts: {
  orderId: string;
  amount: number;
  itemName: string;
  tradeDesc: string;
  returnURL: string;
  orderResultURL: string;
  /** 由使用者在自家頁面選好，直接跳到該付款方式 */
  method: PaymentMethod;
}): { action: string; params: Record<string, string> } {
  const { merchantId } = config();

  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: opts.orderId,
    MerchantTradeDate: tradeDate(new Date()),
    PaymentType: "aio",
    TotalAmount: String(opts.amount),
    TradeDesc: opts.tradeDesc,
    ItemName: opts.itemName,
    ReturnURL: opts.returnURL,
    OrderResultURL: opts.orderResultURL,
    ChoosePayment: opts.method,
    EncryptType: "1",
  };

  params.CheckMacValue = genCheckMacValue(params);
  return { action: checkoutAction(), params };
}

/**
 * 驗證綠界回傳的 CheckMacValue 是否正確（防止偽造付款通知）。
 */
export function verifyCallback(body: Record<string, string>): boolean {
  const received = body.CheckMacValue;
  if (!received) return false;

  const rest: Record<string, string> = { ...body };
  delete rest.CheckMacValue;

  const expected = genCheckMacValue(rest);
  return expected === received.toUpperCase();
}
