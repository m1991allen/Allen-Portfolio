import "server-only";

import { randomUUID } from "node:crypto";
import { del, get, put } from "@vercel/blob";
import { blobAuth } from "@/lib/blob-auth";
import { blobPathOf, coverSrcFor } from "@/lib/cover-path";

/**
 * 圖片儲存後端：Vercel Blob（不是 Firebase Storage）。
 * Firebase 只負責 Auth 與 Firestore。
 *
 * 檔名是隨機 UUID，且 blob 的公開網址不會外流——存進 Firestore 的 cover 欄位是
 * /api/cover/{pathname}，前台一律透過那個路由拿縮圖（見 app/api/cover）。
 * store 本身是 public store（access 是 store 建立時就固定的屬性，不能改成 private），
 * 所以原始檔理論上仍可經由 blob 網址取得，只是那串 UUID 猜不到、也列不出目錄。
 *
 * 需要 Blob 憑證：
 *   - Vercel 上由平台注入（OIDC，或 BLOB_READ_WRITE_TOKEN）。
 *   - 本機開發需在 .env.local 填 BLOB_READ_WRITE_TOKEN（Storage 頁面複製）。
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
 * 上傳圖片到 Vercel Blob，回傳可直接存進 cover 欄位的 /api/cover 路徑。
 * 檔名用隨機 UUID，避免覆蓋與列舉；快取一年。
 */
export async function uploadImage(
  prefix: string,
  buffer: Buffer,
  ext: string,
): Promise<string> {
  const blobPath = `${prefix}/${randomUUID()}.${ext}`;
  await put(blobPath, buffer, {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365, // 一年
    ...blobAuth(),
  });
  return coverSrcFor(blobPath);
}

/** 依 blob pathname 讀回圖片的原始位元組。找不到回 null。 */
export async function readImage(blobPath: string): Promise<Buffer | null> {
  const res = await get(blobPath, { access: "public", ...blobAuth() });
  if (!res || res.statusCode !== 200) return null;
  return Buffer.from(await new Response(res.stream).arrayBuffer());
}

/**
 * 依 cover 欄位刪除對應的 blob。best-effort：吞掉例外，孤兒 blob 不影響主流程。
 * 同時相容舊制的公開 Blob 網址；外部貼上的網址則略過。
 */
export async function deleteCoverImage(cover: string): Promise<void> {
  if (!cover) return;
  const target =
    blobPathOf(cover) ??
    (cover.includes(".blob.vercel-storage.com") ? cover : null);
  if (!target) return;
  try {
    await del(target, blobAuth());
  } catch {
    // 刪除失敗不阻斷主流程
  }
}
