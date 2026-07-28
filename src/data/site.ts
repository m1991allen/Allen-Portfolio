/**
 * 站台基本資料（個人作品集）。
 * 個人資訊沿用舊履歷（m1991allen.github.io/resume），可自行替換。
 */

export const site = {
  name: "Allen Liu",
  nameEn: "WEB DESIGNER / FRONT-END",
  /** 首頁大標語 */
  tagline: "用設計與程式，把想法變成會說話的網站。",
  /** 個人信念（取自舊履歷） */
  motto: "「自信」，是通往成功的必要因子。",
  description:
    "劉 Allen 是一位網頁設計師與前端工程師，橫跨媒體與接案兩種節奏——在民間全民電視台打造百萬流量的新聞互動專題，也為各行各業的企業做出俐落好用的形象官網。這裡收錄他這些年做過、且仍然在線上的作品。",
  /** 預設網址。實際以環境變數 NEXT_PUBLIC_SITE_URL 為準，見下方 siteUrl。 */
  url: "https://m1991allen-portfolio.vercel.app",
  startYear: 2015,
} as const;

/**
 * 網站正式網址（單一來源）。
 * metadataBase、canonical、og:url、sitemap、robots 全部用這個，
 * 避免各處各自解析而分岔。之後買到自己的網域，改 NEXT_PUBLIC_SITE_URL 即可。
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(
  /\/$/,
  "",
);

/** 聯絡資訊（沿用舊履歷） */
export const contact = {
  email: "m1991allen@gmail.com",
  phone: "0919-133-442",
  phoneHref: "tel:+886919133442",
  resumeUrl: "https://m1991allen.github.io/resume/",
  location: "台灣・台北",
} as const;

/** 一頁式錨點導覽 */
export const nav = [
  { label: "關於", href: "#about" },
  { label: "專長", href: "#skills" },
  { label: "經歷", href: "#experience" },
  { label: "作品", href: "#works" },
  { label: "抖內", href: "#tip" },
] as const;

/** 專長領域 */
export const skills = [
  {
    no: "01",
    title: "網頁設計",
    desc: "從版面、色彩到動態細節，做出兼顧美感與易用性的介面。擅長把品牌調性轉譯成畫面。",
    items: ["UI 視覺設計", "版面編排", "RWD 響應式", "設計規範"],
  },
  {
    no: "02",
    title: "前端工程",
    desc: "把設計稿變成真正跑得動的網站，重視語意化、效能與可維護性。",
    items: ["HTML / CSS", "JavaScript", "React / Next.js", "動畫互動"],
  },
  {
    no: "03",
    title: "互動專題",
    desc: "在媒體現場練出來的硬功夫——用捲動敘事、資料視覺化與趣味互動，把一則新聞說成一個體驗。",
    items: ["Scrollytelling", "資料視覺化", "問答互動", "SVG / Canvas"],
  },
  {
    no: "04",
    title: "網站整合",
    desc: "串接後台、金流與第三方服務，讓網站不只是好看，而是能實際運作的工具。",
    items: ["Firebase", "CMS 後台", "金流串接", "SEO / 成效追蹤"],
  },
] as const;

/** 技術標籤（Hero 底下的技能雲） */
export const stack = [
  "HTML5",
  "CSS3 / SCSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "jQuery",
  "GSAP",
  "Tailwind CSS",
  "Firebase",
  "RWD",
  "UI / UX",
] as const;

/** 經歷（沿用舊履歷） */
export const experience = [
  {
    period: "媒體業",
    company: "民間全民電視台 FTV",
    role: "網站編輯・前端工程師",
    desc: "製作新聞互動專題與活動網頁，代表作 COVID-19 專題創下百萬流量。專長於捲動敘事與趣味互動，把硬性議題變得好讀好玩。",
  },
  {
    period: "接案業",
    company: "捷士林科技",
    role: "網頁設計師・FAE",
    desc: "承接各產業客戶的形象官網與產品網站，從設計到前端一手包辦，並負責與客戶的技術溝通。",
  },
  {
    period: "接案業",
    company: "華麟行銷",
    role: "網頁設計師",
    desc: "設計與製作企業形象網站，累積跨產業的視覺與版型經驗。",
  },
] as const;

/** 學歷 */
export const education = [
  { school: "世新大學", major: "資訊管理學系・網路科技組" },
  { school: "國立林口高級中學", major: "" },
] as const;

/** 抖內快速金額（新台幣） */
export const tipPresets = [60, 120, 250] as const;
