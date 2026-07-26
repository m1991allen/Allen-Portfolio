import "server-only";

import { getDb } from "@/lib/firebase-admin";
import { works as seedWorks, type Work } from "@/data/works";

/**
 * 作品資料層（伺服器端）。
 *
 * 公開首頁透過這裡取得作品資料。
 * - 已設定 Firebase → 讀 Firestore 的 works 集合
 * - 尚未設定 → 回傳 src/data/works.ts 的預設 seed
 *   （讓網站在你完成 Firebase 設定前仍可正常運作）
 *
 * Firestore 中每筆作品的「文件 ID」就是它的 slug。
 */

const COLLECTION = "works";

function docToWork(data: FirebaseFirestore.DocumentData): Work {
  const rest = { ...data };
  delete rest.createdAt;
  delete rest.updatedAt;
  return rest as Work;
}

/** 取得所有作品（含未上架），依 order 排序。後台用。 */
export async function getAllWorks(): Promise<Work[]> {
  const db = getDb();
  if (!db) return [...seedWorks].sort((a, b) => a.order - b.order);

  const snap = await db.collection(COLLECTION).orderBy("order", "asc").get();
  if (snap.empty) return [...seedWorks].sort((a, b) => a.order - b.order);
  return snap.docs.map((d) => docToWork(d.data()));
}

/** 取得已上架作品。前台用。 */
export async function getPublishedWorks(): Promise<Work[]> {
  const all = await getAllWorks();
  return all.filter((w) => w.published);
}

/** 已上架且精選的作品 */
export async function getFeaturedWorks(): Promise<Work[]> {
  const all = await getPublishedWorks();
  return all.filter((w) => w.featured);
}

/** 依 slug 取得單一作品 */
export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const db = getDb();
  if (!db) return seedWorks.find((w) => w.slug === slug) ?? null;

  const doc = await db.collection(COLLECTION).doc(slug).get();
  if (!doc.exists) return null;
  return docToWork(doc.data()!);
}

/** 已上架作品的分類清單（去重、依 seed 定義順序） */
export async function getWorkCategories(): Promise<string[]> {
  const published = await getPublishedWorks();
  return Array.from(new Set(published.map((w) => w.category)));
}

// ─────────────────────────────────────────────────────────────
// 以下為後台寫入用（新增 / 編輯 / 刪除 / 上下架）。呼叫端須先驗證登入。
// ─────────────────────────────────────────────────────────────

/** Firestore 不接受 undefined，寫入前先把 undefined 欄位移除 */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** 取得目前最大的 order 值 + 1，把新作品排到最後 */
async function nextOrder(db: FirebaseFirestore.Firestore): Promise<number> {
  const snap = await db
    .collection(COLLECTION)
    .orderBy("order", "desc")
    .limit(1)
    .get();
  if (snap.empty) return 0;
  return (snap.docs[0]!.data().order ?? 0) + 1;
}

/** 新增作品。slug 重複會丟出錯誤。 */
export async function createWork(work: Work): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const ref = db.collection(COLLECTION).doc(work.slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error(`網址代稱「${work.slug}」已經有人用了，請換一個`);
  }

  await ref.set(
    stripUndefined({
      ...work,
      order: work.order ?? (await nextOrder(db)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  );
}

/** 更新作品。若 slug（文件 ID）有變動，會建立新文件並刪除舊的。 */
export async function updateWork(
  originalSlug: string,
  work: Work,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const oldRef = db.collection(COLLECTION).doc(originalSlug);
  const oldSnap = await oldRef.get();
  if (!oldSnap.exists) throw new Error("找不到要編輯的作品");

  const createdAt = oldSnap.data()!.createdAt ?? new Date().toISOString();

  const payload = stripUndefined({
    ...work,
    createdAt,
    updatedAt: new Date().toISOString(),
  });

  if (work.slug === originalSlug) {
    await oldRef.set(payload);
    return;
  }

  const newRef = db.collection(COLLECTION).doc(work.slug);
  if ((await newRef.get()).exists) {
    throw new Error(`網址代稱「${work.slug}」已經有人用了，請換一個`);
  }
  await newRef.set(payload);
  await oldRef.delete();
}

/** 上下架切換 */
export async function setWorkPublished(
  slug: string,
  published: boolean,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");
  await db.collection(COLLECTION).doc(slug).update({
    published,
    updatedAt: new Date().toISOString(),
  });
}

/** 刪除作品 */
export async function deleteWork(slug: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");
  await db.collection(COLLECTION).doc(slug).delete();
}
