/**
 * 作品資料。
 *
 * 這是「個人作品集」的資料模型——每個作品是一個仍在線上的實際網站，
 * 卡片點擊後開新分頁連到 `url`。封面 `cover` 由 scripts/capture-screenshots.ts
 * 自動截圖產生，存在 public/works/ 底下。
 *
 * 新增/編輯/上下架都可在後台 /admin 操作；未設定 Firebase 時，
 * 前台會 fallback 回這份 seed 資料，網站仍可正常運作。
 */

export type Work = {
  /** 文件 ID，也是截圖檔名 */
  slug: string;
  /** 作品名稱 */
  title: string;
  /** 一句話簡介 */
  description: string;
  /** 分類，見下方 workCategories */
  category: string;
  /** 外部實際網站連結。內部系統等無公開網址者可留空，卡片會渲染成不可點的區塊 */
  url?: string;
  /** 封面圖路徑（/works/{slug}.jpg 或 Storage URL） */
  cover: string;
  /** 技術 / 角色標籤 */
  tags: string[];
  /** 年份 */
  year: string;
  /** 我在此案的角色 */
  role?: string;
  /** 亮點徽章，例如「百萬流量」 */
  highlight?: string;
  /** 是否首頁精選 */
  featured?: boolean;
  /** ★ 上下架開關：false 則前台不顯示 */
  published: boolean;
  /** 排序（小到大） */
  order: number;
};

/** 分類顯示順序 */
export const workCategories = ["媒體專題", "互動專題", "企業形象", "客戶系統"] as const;

export const works: Work[] = [
  // ── 民視 FTV 時期：新聞互動專題 ──────────────────────────
  {
    slug: "covid-19",
    title: "COVID-19 疫情專題",
    description:
      "民視新聞疫情主題的深度專題頁，用捲動敘事與圖表整理疫情脈絡，是這系列中流量最高的一支。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/covid-19/index.html",
    cover: "/works/covid-19.jpg",
    tags: ["Scrollytelling", "資料視覺化", "RWD", "前端切版"],
    year: "2021",
    role: "企劃・設計・前端",
    highlight: "百萬流量",
    featured: true,
    published: true,
    order: 0,
  },
  {
    slug: "vote",
    title: "投票趣味問答專題",
    description:
      "把嚴肅的選舉議題做成互動問答，讀者一路點選作答、即時看到結果，用趣味降低政治的距離感。",
    category: "互動專題",
    url: "https://www.ftvnews.com.tw/topics/vote/index.html",
    cover: "/works/vote.jpg",
    tags: ["互動問答", "JavaScript", "動畫", "RWD"],
    year: "2022",
    role: "設計・前端互動",
    highlight: "互動問答",
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: "dui",
    title: "酒駕法規專題",
    description:
      "把複雜的酒駕修法與罰則，整理成一頁看得懂的圖文專題，讓法條變成一般人也能理解的資訊。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/dui/index.html",
    cover: "/works/dui.jpg",
    tags: ["資訊設計", "圖文整合", "RWD"],
    year: "2022",
    role: "設計・前端",
    featured: true,
    published: true,
    order: 2,
  },
  {
    slug: "ghost",
    title: "鬼月民俗專題",
    description:
      "農曆七月的民俗主題專題頁，用視覺氛圍與捲動節奏，把傳統習俗說成一段有溫度的故事。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/ghost/index.html",
    cover: "/works/ghost.jpg",
    tags: ["Scrollytelling", "視覺氛圍", "RWD"],
    year: "2021",
    role: "設計・前端",
    featured: true,
    published: true,
    order: 3,
  },
  {
    slug: "euwar",
    title: "歐洲戰事國際專題",
    description:
      "國際戰事主題的新聞專題，用地圖、時間軸與圖表梳理複雜的局勢發展。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/euwar/",
    cover: "/works/euwar.jpg",
    tags: ["資料視覺化", "時間軸", "RWD"],
    year: "2022",
    role: "設計・前端",
    published: true,
    order: 4,
  },
  {
    slug: "soldier",
    title: "軍事主題新聞專題",
    description:
      "以軍人與國防為主題的深度專題頁，結合圖文與捲動動畫呈現。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/soldier/",
    cover: "/works/soldier.jpg",
    tags: ["Scrollytelling", "圖文整合", "RWD"],
    year: "2021",
    role: "設計・前端",
    published: true,
    order: 5,
  },
  {
    slug: "freddy",
    title: "人物深度專題",
    description:
      "人物主題的新聞專題頁，用大圖與敘事版面帶出人物故事。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/freddy/",
    cover: "/works/freddy.jpg",
    tags: ["敘事版面", "大圖排版", "RWD"],
    year: "2020",
    role: "設計・前端",
    published: true,
    order: 6,
  },
  {
    slug: "bajay",
    title: "民俗文化專題",
    description:
      "台灣民俗文化主題的專題頁，用影像與動態呈現在地文化的細節。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/bajay/index.html",
    cover: "/works/bajay.jpg",
    tags: ["視覺氛圍", "影像排版", "RWD"],
    year: "2020",
    role: "設計・前端",
    published: true,
    order: 7,
  },

  // ── 接案公司時期：企業形象網站 ──────────────────────────
  {
    slug: "hlmco",
    title: "HLM 工作室形象網站",
    description:
      "接案工作室自己的形象官網，定調品牌氣質、呈現服務與過往案例。",
    category: "企業形象",
    url: "https://hlmcoltd.com/",
    cover: "/works/hlmco.jpg",
    tags: ["形象網站", "UI 設計", "RWD", "前端切版"],
    year: "2019",
    role: "設計・前端",
    featured: true,
    published: true,
    order: 8,
  },
  {
    slug: "taiwanmayumi",
    title: "Taiwan Mayumi 品牌網站",
    description:
      "品牌形象官網，強調產品質感與品牌故事的視覺呈現。",
    category: "企業形象",
    url: "https://taiwanmayumi.com/tw/",
    cover: "/works/taiwanmayumi.jpg",
    tags: ["品牌網站", "UI 設計", "RWD"],
    year: "2019",
    role: "設計・前端",
    featured: true,
    published: true,
    order: 9,
  },
  {
    slug: "cocera",
    title: "Cocera 品牌形象網站",
    description:
      "企業品牌官網，以俐落的版面與產品陳列建立專業信任感。",
    category: "企業形象",
    url: "https://www.cocera.com.tw/",
    cover: "/works/cocera.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2018",
    role: "設計・前端",
    published: true,
    order: 10,
  },
  {
    slug: "hanmin",
    title: "漢珉企業形象網站",
    description:
      "企業形象官網，整理公司介紹、產品與聯絡資訊的一站式門面。",
    category: "企業形象",
    url: "https://www.hanmin.com.tw/",
    cover: "/works/hanmin.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2018",
    role: "設計・前端",
    published: true,
    order: 11,
  },
  {
    slug: "aac-fas",
    title: "AAC 企業網站",
    description:
      "企業形象與產品介紹網站，兼顧品牌形象與資訊清晰度。",
    category: "企業形象",
    url: "https://www.aac-fas.com/",
    cover: "/works/aac-fas.jpg",
    tags: ["形象網站", "產品展示", "RWD"],
    year: "2018",
    role: "設計・前端",
    published: true,
    order: 12,
  },
  {
    slug: "estcorp",
    title: "EST 企業形象網站",
    description:
      "公司形象官網，以穩重的視覺語言呈現企業專業與服務項目。",
    category: "企業形象",
    url: "https://www.estcorp.com.tw/",
    cover: "/works/estcorp.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: true,
    order: 13,
  },
  {
    slug: "houstar",
    title: "豪星企業網站",
    description:
      "企業形象與產品網站，把公司的服務內容整理成好瀏覽的版面。",
    category: "企業形象",
    url: "http://www.houstar888.com/",
    cover: "/works/houstar.jpg",
    tags: ["形象網站", "產品展示", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: true,
    order: 14,
  },
  {
    slug: "lasuerte",
    title: "La Suerte 品牌網站",
    description:
      "品牌形象官網，以精緻的版面呈現產品與品牌調性。",
    category: "企業形象",
    url: "http://www.lasuerte.com.tw/",
    cover: "/works/lasuerte.jpg",
    tags: ["品牌網站", "UI 設計", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: true,
    order: 15,
  },
  {
    slug: "la-suerte",
    title: "La Suerte 品牌網站（二）",
    description:
      "La Suerte 品牌的另一個網站版本，延續品牌一致的視覺語言。",
    category: "企業形象",
    url: "http://www.la-suerte.com.tw/",
    cover: "/works/la-suerte.jpg",
    tags: ["品牌網站", "UI 設計", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: false,
    order: 16,
  },
  {
    slug: "baui",
    title: "BAUI 企業網站",
    description:
      "企業形象網站，整合公司介紹與產品服務的官方門面。",
    category: "企業形象",
    url: "http://baui.com.tw/",
    cover: "/works/baui.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2016",
    role: "設計・前端",
    published: true,
    order: 17,
  },
  {
    slug: "camels",
    title: "Camels 企業網站",
    description:
      "企業形象與產品展示網站，以清楚的架構呈現品牌與商品。",
    category: "企業形象",
    url: "http://www.camels.com.tw/",
    cover: "/works/camels.jpg",
    tags: ["形象網站", "產品展示", "RWD"],
    year: "2016",
    role: "設計・前端",
    published: true,
    order: 18,
  },
];

export const getPublishedWorks = () => works.filter((w) => w.published);

export const featuredWorks = () =>
  works.filter((w) => w.published && w.featured);

export const workCategoryList = () =>
  Array.from(new Set(getPublishedWorks().map((w) => w.category)));
