import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 讓 firebase-admin 用 Node 原生載入，避免打包器把相依的 jose 解析成 ESM
  // 而在 Vercel 上出現 ERR_REQUIRE_ESM。
  serverExternalPackages: ["firebase-admin"],
  images: {
    // 允許 next/image 載入上傳的圖片
    remotePatterns: [
      // Vercel Blob 公開 CDN（目前的圖片儲存後端）
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Firebase Storage（相容既有資料）
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
