"use client";

/**
 * 前端圖片上傳工具：先在瀏覽器把圖片壓縮成 JPEG，再送到後台 API。
 * 上傳前就降頻寬與儲存量，實際寫入由 /api/admin/upload 存到 Vercel Blob。
 */

/** 壓縮後圖片的最長邊上限（px）。 */
const MAX_EDGE = 1600;
/** JPEG 壓縮品質。 */
const JPEG_QUALITY = 0.82;

/**
 * 把圖片檔壓縮成 JPEG Blob：最長邊縮到 1600px、quality 0.82。
 */
export async function compressImage(file: File): Promise<Blob> {
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const longest = Math.max(width, height);
  if (longest > MAX_EDGE) {
    const scale = MAX_EDGE / longest;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("瀏覽器不支援畫布，無法壓縮圖片");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("圖片壓縮失敗");
  return blob;
}

/**
 * 壓縮並上傳圖片，回傳圖片網址。
 * @param prefix Blob 路徑前綴（例如 "projects"、"works"）。
 */
export async function uploadImage(file: File, prefix: string): Promise<string> {
  const blob = await compressImage(file);
  const form = new FormData();
  form.append("file", new File([blob], "image.jpg", { type: "image/jpeg" }));
  form.append("prefix", prefix);

  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "上傳失敗");
  return data.url as string;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("讀取檔案失敗"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("載入圖片失敗"));
    img.src = src;
  });
}
