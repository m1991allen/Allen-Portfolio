import {
  site,
  siteUrl,
  contact,
  profiles,
  stack,
  experience,
  education,
} from "@/data/site";

/**
 * 首頁的結構化資料（schema.org JSON-LD）。
 *
 * 履歷型網站最關鍵的一塊：讓 Google 知道這個網址代表「一個人」，
 * 而不只是一份文件。名字、職稱、任職單位、技能被獨立解析後，
 * 搜尋自己的名字時才有機會拿到人物卡與更完整的搜尋結果樣式。
 *
 * 用 @graph 把三個節點綁在一起，彼此以 @id 互相參照：
 *   WebSite      → 這個網站本身
 *   ProfilePage  → 這一頁是誰的個人檔案
 *   Person       → 主角本人
 *
 * 驗證：https://search.google.com/test/rich-results
 */

const PERSON_ID = `${siteUrl}/#person`;
const WEBSITE_ID = `${siteUrl}/#website`;

/** 目前任職的公司：經歷清單的第一筆（依站上排序，最新在前） */
const current = experience[0];

export default function JsonLd() {
  const graph = [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${siteUrl}/`,
      name: `${site.name} 前端工程師作品集`,
      inLanguage: "zh-Hant-TW",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: `${siteUrl}/`,
      name: `${site.name}｜前端工程師作品集`,
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: "zh-Hant-TW",
      mainEntity: { "@id": PERSON_ID },
      about: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.name,
      url: `${siteUrl}/`,
      // 長版自介：這裡沒有字數限制，資訊給滿
      description: site.description,
      jobTitle: "前端工程師",
      email: `mailto:${contact.email}`,
      // 把散落各處的個人身分串成同一個實體
      sameAs: [...profiles],
      knowsAbout: [...stack],
      knowsLanguage: ["zh-Hant", "en"],
      worksFor: {
        "@type": "Organization",
        name: current.company,
      },
      alumniOf: education.map((e) => ({
        "@type": "CollegeOrUniversity",
        name: e.school,
        department: e.major,
      })),
      address: {
        "@type": "PostalAddress",
        addressLocality: "台北",
        addressCountry: "TW",
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON.stringify 的輸出不含未跳脫的 </script>，此處注入是安全的
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
