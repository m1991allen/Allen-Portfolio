import sharp from "sharp";
import { isSafeBlobPath } from "@/lib/cover-path";
import { readImage } from "@/lib/storage";

/**
 * 封面圖出口（公開，不需登入）。
 *
 * 圖片本體在 Vercel Blob，這裡由伺服器讀出來，縮到 MAX_WIDTH 並轉成 WebP
 * 之後才吐給瀏覽器。路徑就是 blob 的 pathname，例如 /api/cover/works/{uuid}.jpg。
 *
 * 這層的用意是「blob 的公開網址不會出現在網頁原始碼裡」——頁面上只看得到
 * 自家網域的縮圖，而且這個路由永遠不會回原始檔，直接打它拿到的也是縮圖。
 * （store 是 public store，原始檔理論上仍在 blob 網址上，只是那串 UUID 猜不到；
 *   另外站上顯示得出來的圖一定能被截圖，這裡能做的就是不主動外流。）
 */

// @vercel/blob 與 sharp 都需要 Node runtime。
export const runtime = "nodejs";

/** 對外提供的最長邊。卡片最寬約 800px，1200 已足夠 retina。 */
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 78;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const blobPath = path.join("/");
  if (!isSafeBlobPath(blobPath)) {
    return new Response("Not found", { status: 404 });
  }

  let source: Buffer | null;
  try {
    source = await readImage(blobPath);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!source) return new Response("Not found", { status: 404 });

  const output = await sharp(source)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return new Response(new Uint8Array(output), {
    headers: {
      "Content-Type": "image/webp",
      "Content-Disposition": "inline",
      // pathname 是 UUID，內容永不改變，可以放心 immutable
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
