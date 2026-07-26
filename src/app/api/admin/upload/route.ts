import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getBucket } from "@/lib/firebase-admin";

/**
 * 圖片上傳端點（後台專用，需登入）。
 * 接收 multipart 檔案，上傳到 Firebase Storage 的 works/ 資料夾，
 * 設為公開後回傳可直接使用的網址。
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const bucket = getBucket();
  if (!bucket) {
    return NextResponse.json({ error: "Storage 尚未設定" }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "沒有收到檔案" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "只接受 JPG / PNG / WebP / SVG 圖片" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "檔案太大，請壓縮到 8MB 以內" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `works/${Date.now()}-${safeName}`;

  // 下載 token：讓圖片可用 Firebase 下載網址公開讀取，
  // 不受「統一儲存桶存取層級」影響，也不需開放整桶公開。
  const token = randomUUID();
  const blob = bucket.file(path);
  await blob.save(buffer, {
    metadata: {
      contentType: file.type,
      metadata: { firebaseStorageDownloadTokens: token },
    },
    resumable: false,
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    path,
  )}?alt=media&token=${token}`;
  return NextResponse.json({ url });
}
