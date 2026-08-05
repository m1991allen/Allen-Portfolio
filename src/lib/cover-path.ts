/**
 * 封面圖網址的共用轉換。
 *
 * 圖片本體存在 Vercel Blob，但 blob 的公開網址不會出現在頁面上；
 * 前台看到的 cover 一律是 `/api/cover/{blob pathname}`，
 * 由自家路由讀出來、縮圖後才吐出去（見 src/app/api/cover/[...path]/route.ts）。
 *
 * 這支刻意不相依伺服器模組，App 與 scripts/ 兩邊都能 import。
 */

/** 封面路由前綴。cover 欄位以此開頭者即為新制圖片。 */
export const COVER_ROUTE = "/api/cover/";

/** Blob pathname（例：works/xxx.jpg）→ 可直接放進 <Image src> 的路徑 */
export function coverSrcFor(blobPath: string): string {
  return COVER_ROUTE + blobPath;
}

/**
 * cover 欄位 → Blob pathname。
 * 舊制的公開網址（Vercel Blob public / Firebase Storage）回 null。
 */
export function blobPathOf(cover: string): string | null {
  if (!cover.startsWith(COVER_ROUTE)) return null;
  return cover.slice(COVER_ROUTE.length);
}

/**
 * blob pathname 白名單：只允許英數、底線、連字號、斜線，且副檔名為支援的圖片格式。
 * 用來擋路徑穿越與亂猜——路由收到不合格的路徑就直接 404。
 */
const SAFE_BLOB_PATH = /^[a-z0-9][a-z0-9/_-]*\.(jpg|jpeg|png|webp)$/i;

export function isSafeBlobPath(blobPath: string): boolean {
  return (
    SAFE_BLOB_PATH.test(blobPath) &&
    !blobPath.includes("..") &&
    !blobPath.includes("//")
  );
}
