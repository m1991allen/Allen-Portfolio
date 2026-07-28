/**
 * 站台基本資料（個人作品集）。
 * 個人資訊沿用舊履歷（m1991allen.github.io/resume），可自行替換。
 */

export const site = {
  name: "Allen Liu",
  nameEn: "FRONT-END ENGINEER",
  /** 首頁大標語 */
  tagline: "把複雜的資料，變成看得懂的介面。",
  /** 個人信念 */
  motto: "成功不必在我，團隊共好。",
  // 自介一律用「媒體業」稱呼，不點名公司；工作經歷區塊才寫實際公司名。
  description:
    "Allen Liu 是一位具備多年企業級開發經驗的前端工程師，專精 React、原生 JavaScript 與大型互動式網頁實作。在媒體業主導企業級媒資管理系統開發，將複雜的影音資料結構視覺化；也產製過多款百萬流量的 COVID-19 互動專題，把數據新聞轉化為高互動性的閱讀體驗。近期投入 AI 應用實作，探索 LLM API 整合、瀏覽器擴充功能與生產力工具開發。",
  /** 預設網址。實際以環境變數 NEXT_PUBLIC_SITE_URL 為準，見下方 siteUrl。 */
  url: "https://m1991allen.dev",
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

/** 核心競爭力 */
export const skills = [
  {
    no: "01",
    title: "前端技術與架構",
    desc: "以 React 與原生 JavaScript 為主力，重視語意化、效能與可維護性；也持續研究微前端的模組拆分與獨立部署策略。",
    items: [
      "React",
      "原生 JavaScript",
      "CSS 動畫",
      "Markdown 解析",
      "Streaming 渲染",
      "Chrome Extension (MV3)",
    ],
  },
  {
    no: "02",
    title: "大型系統開發",
    desc: "企業級媒資系統的實戰經驗——把複雜的影音資料結構視覺化，並確保高併發環境下的介面流暢度與系統穩定性。",
    items: [
      "企業級媒資系統",
      "高併發介面優化",
      "複雜資料結構視覺化",
      "跨部門需求整合",
    ],
  },
  {
    no: "03",
    title: "互動內容設計",
    desc: "在媒體現場練出來的硬功夫——用資料視覺化與動畫敘事，把枯燥的數據和硬性議題變成讀得下去的體驗。",
    items: [
      "互動式新聞網頁",
      "資料視覺化敘事",
      "動畫過渡設計",
      "操作流程優化",
    ],
  },
  {
    no: "04",
    title: "AI 應用實作",
    desc: "透過 Side Project 把 LLM 真正落地成工具，處理串流回應、語法解析與對話介面這些實作細節。",
    items: ["LLM API 串接", "AI 對話介面", "AI 輔助生產力工具"],
  },
] as const;

/** 技術標籤（Hero 底下的技能雲） */
export const stack = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "HTML5",
  "CSS3 / SCSS",
  "CSS 動畫",
  "Tailwind CSS",
  "Manifest V3",
  "LLM API",
  "Firebase",
  "RWD",
] as const;

/** 工作經歷（唯一 id 作為 React key，因為同一家公司有兩段任期） */
export const experience = [
  {
    id: "ftv-it",
    period: "2022.04 – 迄今",
    company: "民間全民電視台 FTV",
    role: "前端工程師・資訊部",
    desc: "以 React 開發民視新聞與民視節目的媒資管理系統，將複雜的影音資料結構視覺化，並重新設計內部人員的操作流程，確保高併發環境下的介面流暢度與系統穩定性。服務範圍涵蓋長榮海運、台灣高鐵、法鼓山、東森片庫等外部客戶。",
  },
  {
    id: "ftv-news",
    period: "2019.04 – 2022.04",
    company: "民間全民電視台 FTV",
    role: "前端工程師・新聞部",
    desc: "以原生 JavaScript 搭配 CSS 動畫開發多款高流量新聞專題，其中 COVID-19 系列創下百萬流量。把即時新聞數據轉換為互動圖表與動畫敘事，讓硬性議題更容易被讀完。",
  },
  {
    id: "jieshilin",
    period: "接案時期",
    company: "捷士林科技",
    role: "網頁設計師・FAE",
    desc: "承接各產業客戶的形象官網與產品網站，從設計到前端一手包辦，並負責與客戶的技術溝通。",
  },
  {
    id: "studio",
    period: "接案時期",
    company: "接案工作室",
    role: "網頁設計師",
    desc: "設計與製作企業形象網站，累積跨產業的視覺與版型經驗，也是網頁實務的起點。",
  },
] as const;

/** 學歷 */
export const education = [
  { school: "世新大學", major: "資訊管理學系・網路科技組" },
  { school: "新北市立林口高級中學", major: "" },
] as const;

/** 抖內快速金額（新台幣） */
export const tipPresets = [60, 120, 250] as const;
