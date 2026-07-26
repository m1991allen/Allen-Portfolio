import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 允許 next/image 載入 Firebase Storage 上傳的圖片
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
