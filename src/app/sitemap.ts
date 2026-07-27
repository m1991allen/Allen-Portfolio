import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

/**
 * 一頁式作品集：主要可索引的頁面就是首頁。
 * 抖內結果頁與後台皆為 noindex（見各頁 metadata 與 robots.ts），不列入。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
