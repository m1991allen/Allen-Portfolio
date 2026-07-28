import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

/**
 * 一頁式作品集：主要可索引的頁面就是首頁。
 * 抖內結果頁與後台皆為 noindex（見各頁 metadata 與 robots.ts），不列入。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
