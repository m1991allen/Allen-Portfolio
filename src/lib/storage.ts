import "server-only";

import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";

/**
 * 圖片儲存後端：Vercel Blob（不是 Firebase Storage）。
 * Firebase 只負責 Auth 與 Firestore；圖片走 Vercel Blob 的公開 CDN。
 *
 * 需要環境變數 BLOB_READ_WRITE_TOKEN：
 *   - 在 Vercel 上把 Blob store 連到專案後會自動注入。
 *   - 本機開發需在 .env.local 填入（vercel env pull 或 Storage 頁面複製）。
 */

/** 允許的 MIME → 副檔名對照，也當作型別白名單使用。 */
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** 回傳該 MIME 對應的副檔名，不支援則回 null。 */
export function extForType(type: string): string | null {
  return EXT_BY_TYPE[type] ?? null;
}

/**
 * 上傳圖片到 Vercel Blob，回傳可直接使用的公開網址。
 * 檔名用隨機 UUID，避免覆蓋與列舉；快取一年。
 */
export async function uploadImage(
  prefix: string,
  buffer: Buffer,
  ext: string,
): Promise<string> {
  const { url } = await put(`${prefix}/${randomUUID()}.${ext}`, buffer, {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365, // 一年
  });
  return url;
}

/**
 * 依網址刪除 Blob。best-effort：吞掉例外，孤兒 blob 不影響主流程。
 * 只處理 Vercel Blob 的網址，外部貼上的網址略過。
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url || !url.includes(".blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {
    // 刪除失敗不阻斷主流程
  }
}
