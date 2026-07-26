import "server-only";

import { getDb } from "@/lib/firebase-admin";

/**
 * 抖內紀錄資料層（伺服器端）。
 *
 * 前台送出抖內 → 建立一筆 pending 訂單；綠界付款完成後由 callback
 * 更新為 paid。後台總覽讀取統計與最近紀錄。
 * 文件 ID = 綠界訂單編號 MerchantTradeNo（orderId）。
 */

const COLLECTION = "donations";

export type DonationStatus = "pending" | "paid" | "failed";

export type Donation = {
  orderId: string;
  amount: number;
  name?: string;
  message?: string;
  status: DonationStatus;
  /** 綠界交易編號（付款後才有） */
  tradeNo?: string;
  createdAt: string;
  paidAt?: string;
};

/** 建立一筆待付款抖內 */
export async function createDonation(data: {
  orderId: string;
  amount: number;
  name?: string;
  message?: string;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const payload = JSON.parse(
    JSON.stringify({
      orderId: data.orderId,
      amount: data.amount,
      name: data.name || "",
      message: data.message || "",
      status: "pending" as DonationStatus,
      createdAt: new Date().toISOString(),
    }),
  );
  await db.collection(COLLECTION).doc(data.orderId).set(payload);
}

/** 依訂單編號更新付款狀態 */
export async function updateDonationStatus(
  orderId: string,
  status: DonationStatus,
  tradeNo?: string,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const patch: Record<string, unknown> = { status };
  if (tradeNo) patch.tradeNo = tradeNo;
  if (status === "paid") patch.paidAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(orderId).update(patch);
}

/** 依訂單編號取得單筆 */
export async function getDonation(orderId: string): Promise<Donation | null> {
  const db = getDb();
  if (!db) return null;
  const doc = await db.collection(COLLECTION).doc(orderId).get();
  return doc.exists ? (doc.data() as Donation) : null;
}

/** 最近抖內紀錄（最新在前） */
export async function getRecentDonations(limit = 30): Promise<Donation[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await db
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as Donation);
}

/** 統計：已付款筆數與總金額 */
export async function getDonationStats(): Promise<{
  count: number;
  total: number;
}> {
  const db = getDb();
  if (!db) return { count: 0, total: 0 };
  const snap = await db
    .collection(COLLECTION)
    .where("status", "==", "paid")
    .get();
  let total = 0;
  snap.docs.forEach((d) => {
    total += (d.data().amount as number) ?? 0;
  });
  return { count: snap.size, total };
}
