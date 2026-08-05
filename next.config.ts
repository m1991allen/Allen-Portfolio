import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 讓 firebase-admin 用 Node 原生載入，避免打包器把相依的 jose 解析成 ESM
  // 而在 Vercel 上出現 ERR_REQUIRE_ESM。
  serverExternalPackages: ["firebase-admin"],
  images: {
    // 封面圖一律走自家的 /api/cover 出口（後面接 Vercel Blob），
    // 鎖成只允許這個路徑，避免最佳化器被拿去當任意本機路徑的代理。
    localPatterns: [{ pathname: "/api/cover/**", search: "" }],
    // 保留給手動貼上的外部圖片網址
    remotePatterns: [
      // Vercel Blob 公開 CDN（舊制直連網址，已全數改走 /api/cover）
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Firebase Storage（相容既有資料）
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
