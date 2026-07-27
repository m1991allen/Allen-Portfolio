import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 後台、API 與抖內結果頁不需要被索引
      disallow: ["/admin", "/api", "/tip/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
