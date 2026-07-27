import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { extForType, uploadImage } from "@/lib/storage";

/**
 * 圖片上傳端點（後台專用，需登入）。
 * 接收瀏覽器已壓縮的 multipart 檔案，上傳到 Vercel Blob，回傳公開 CDN 網址。
 */

// firebase-admin（getCurrentUser 驗證 session）需要 Node runtime。
export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
/** 路徑前綴白名單：只允許英數、底線、連字號、斜線，擋路徑穿越。 */
const PREFIX_RE = /^[a-z0-9/_-]+$/i;
const DEFAULT_PREFIX = "works";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "沒有收到檔案" }, { status: 400 });
  }

  const ext = extForType(file.type);
  if (!ext) {
    return NextResponse.json(
      { error: "只接受 JPG / PNG / WebP 圖片" },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "檔案太大，請壓縮到 8MB 以內" },
      { status: 413 },
    );
  }

  const rawPrefix = form.get("prefix");
  const prefix =
    typeof rawPrefix === "string" && PREFIX_RE.test(rawPrefix)
      ? rawPrefix
      : DEFAULT_PREFIX;

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const url = await uploadImage(prefix, buffer, ext);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知錯誤";
    return NextResponse.json(
      { error: `上傳失敗：${message}` },
      { status: 500 },
    );
  }
}
