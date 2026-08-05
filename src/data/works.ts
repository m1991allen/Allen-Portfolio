/**
 * 作品資料。
 *
 * 這是「個人作品集」的資料模型——每個作品是一個仍在線上的實際網站，
 * 卡片點擊後開新分頁連到 `url`。封面 `cover` 由 scripts/capture-screenshots.ts
 * 自動截圖產生，圖檔存在 Vercel Blob，本機不留檔。
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
  /** 封面圖路徑（/api/cover/works/{uuid}.jpg，或手動貼上的外部圖片網址） */
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
  {
    slug: "airmam5",
    title: "媒體資產管理系統",
    description: "媒體資產管理系統的前端介面，基於 TailAdmin React 模板開發。提供媒體素材的搜尋、瀏覽、調閱、系統監控等完整功能。",
    category: "客戶系統",
    cover: "https://fyqcqdqucuhbs3rk.public.blob.vercel-storage.com/works/675c160e-c5c4-42b6-87c3-4d583fb8a900.jpg",
    tags: ["React", "TypeScript", "Tailwind CSS", "React Router"],
    year: "2025",
    featured: false,
    published: true,
    order: 0,
  },
  {
    slug: "covid-19",
    title: "COVID-19 疫情專題",
    description: "民視新聞疫情主題的深度專題頁，用捲動敘事與圖表整理疫情脈絡，是這系列中流量最高的一支。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/covid-19/index.html",
    cover: "/works/covid-19.jpg",
    tags: ["Scrollytelling", "資料視覺化", "RWD", "前端切版"],
    year: "2021",
    role: "企劃・設計・前端",
    highlight: "百萬流量",
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: "vote",
    title: "投票趣味問答專題",
    description: "把嚴肅的選舉議題做成互動問答，讀者一路點選作答、即時看到結果，用趣味降低政治的距離感。",
    category: "互動專題",
    url: "https://www.ftvnews.com.tw/topics/vote/index.html",
    cover: "/works/vote.jpg",
    tags: ["互動問答", "JavaScript", "動畫", "RWD"],
    year: "2022",
    role: "設計・前端互動",
    highlight: "互動問答",
    featured: false,
    published: true,
    order: 2,
  },
  {
    slug: "dui",
    title: "酒駕法規專題",
    description: "把複雜的酒駕修法與罰則，整理成一頁看得懂的圖文專題，讓法條變成一般人也能理解的資訊。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/dui/index.html",
    cover: "/works/dui.jpg",
    tags: ["資訊設計", "圖文整合", "RWD"],
    year: "2022",
    role: "設計・前端",
    featured: false,
    published: true,
    order: 3,
  },
  {
    slug: "ghost",
    title: "鬼月民俗專題",
    description: "農曆七月的民俗主題專題頁，用視覺氛圍與捲動節奏，把傳統習俗說成一段有溫度的故事。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/ghost/index.html",
    cover: "/works/ghost.jpg",
    tags: ["Scrollytelling", "視覺氛圍", "RWD"],
    year: "2021",
    role: "設計・前端",
    featured: true,
    published: true,
    order: 4,
  },
  {
    slug: "euwar",
    title: "歐洲戰事國際專題",
    description: "國際戰事主題的新聞專題，用地圖、時間軸與圖表梳理複雜的局勢發展。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/euwar/",
    cover: "/works/euwar.jpg",
    tags: ["資料視覺化", "時間軸", "RWD"],
    year: "2022",
    role: "設計・前端",
    published: true,
    order: 5,
  },
  {
    slug: "soldier",
    title: "軍事主題新聞專題",
    description: "以軍人與國防為主題的深度專題頁，結合圖文與捲動動畫呈現。",
    category: "媒體專題",
    url: "https://www.ftvnews.com.tw/topics/soldier/",
    cover: "/works/soldier.jpg",
    tags: ["Scrollytelling", "圖文整合", "RWD"],
    year: "2021",
    role: "設計・前端",
    published: true,
    order: 6,
  },
  {
    slug: "hlmco",
    title: "HLM 工作室形象網站",
    description: "接案工作室自己的形象官網，定調品牌氣質、呈現服務與過往案例。",
    category: "企業形象",
    url: "https://hlmcoltd.com/",
    cover: "/works/hlmco.jpg",
    tags: ["形象網站", "UI 設計", "RWD", "前端切版"],
    year: "2019",
    role: "設計・前端",
    featured: false,
    published: true,
    order: 7,
  },
  {
    slug: "taiwanmayumi",
    title: "Taiwan Mayumi 品牌網站",
    description: "品牌形象官網，強調產品質感與品牌故事的視覺呈現。",
    category: "企業形象",
    url: "https://taiwanmayumi.com/tw/",
    cover: "/works/taiwanmayumi.jpg",
    tags: ["品牌網站", "UI 設計", "RWD"],
    year: "2019",
    role: "設計・前端",
    featured: false,
    published: true,
    order: 8,
  },
  {
    slug: "miu",
    title: "MIU 狗便當寵物鮮食",
    description: "寵物鮮食品牌的形象官網，首頁用影片主視覺與動態 logo 帶出品牌的溫度，並整理最新消息、品牌故事與鮮食介紹三條動線；手機版另做一組圓形圖示選單，讓小螢幕也好逛。",
    category: "企業形象",
    url: "https://m1991allen.github.io/web_miu/index.html",
    cover: "/works/miu.jpg",
    tags: ["品牌官網", "影片主視覺", "RWD", "前端切版"],
    year: "2019",
    role: "設計・前端",
    published: true,
    order: 9,
  },
  {
    slug: "fixt",
    title: "Fix You Fit 健身 App 形象網站",
    description: "健身 App 的產品形象網站，把課程推薦、體態紀錄、成就系統與社群等功能，用三顆互動圓形與捲動進場動畫一段段帶出來，把抽象的 App 功能講成看得懂的畫面。",
    category: "互動專題",
    url: "https://m1991allen.github.io/ui_fixt/",
    cover: "/works/fixt.jpg",
    tags: ["互動動畫", "捲動特效", "SVG", "RWD"],
    year: "2019",
    role: "UI 設計・前端互動",
    published: true,
    order: 10,
  },
  {
    slug: "sanmin",
    title: "三民網路書店首頁",
    description: "網路書店首頁的前端切版，要處理多層分類選單、書封輪播、分頁標籤與大量商品排列，還有會員、購物車、紅利等入口；桌機與手機各做一套導覽動線。",
    category: "客戶系統",
    url: "https://m1991allen.github.io/web_sanmin/",
    cover: "/works/sanmin.jpg",
    tags: ["電商前端", "jQuery", "Bootstrap", "RWD"],
    year: "2019",
    role: "前端切版",
    published: true,
    order: 11,
  },
  {
    slug: "cocera",
    title: "Cocera 品牌形象網站",
    description: "企業品牌官網，以俐落的版面與產品陳列建立專業信任感。",
    category: "企業形象",
    url: "https://www.cocera.com.tw/",
    cover: "/works/cocera.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2018",
    role: "設計・前端",
    published: true,
    order: 12,
  },
  {
    slug: "hanmin",
    title: "漢珉企業形象網站",
    description: "企業形象官網，整理公司介紹、產品與聯絡資訊的一站式門面。",
    category: "企業形象",
    url: "https://www.hanmin.com.tw/",
    cover: "/works/hanmin.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2018",
    role: "設計・前端",
    published: true,
    order: 13,
  },
  {
    slug: "aac-fas",
    title: "AAC 企業網站",
    description: "企業形象與產品介紹網站，兼顧品牌形象與資訊清晰度。",
    category: "企業形象",
    url: "https://www.aac-fas.com/",
    cover: "/works/aac-fas.jpg",
    tags: ["形象網站", "產品展示", "RWD"],
    year: "2018",
    role: "設計・前端",
    published: true,
    order: 14,
  },
  {
    slug: "estcorp",
    title: "EST 企業形象網站",
    description: "公司形象官網，以穩重的視覺語言呈現企業專業與服務項目。",
    category: "企業形象",
    url: "https://www.estcorp.com.tw/",
    cover: "/works/estcorp.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: true,
    order: 15,
  },
  {
    slug: "houstar",
    title: "豪星企業網站",
    description: "企業形象與產品網站，把公司的服務內容整理成好瀏覽的版面。",
    category: "企業形象",
    url: "http://www.houstar888.com/",
    cover: "/works/houstar.jpg",
    tags: ["形象網站", "產品展示", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: true,
    order: 16,
  },
  {
    slug: "lasuerte",
    title: "La Suerte 品牌網站",
    description: "品牌形象官網，以精緻的版面呈現產品與品牌調性。",
    category: "企業形象",
    url: "http://www.lasuerte.com.tw/",
    cover: "/works/lasuerte.jpg",
    tags: ["品牌網站", "UI 設計", "RWD"],
    year: "2017",
    role: "設計・前端",
    published: true,
    order: 17,
  },
  {
    slug: "baui",
    title: "BAUI 企業網站",
    description: "企業形象網站，整合公司介紹與產品服務的官方門面。",
    category: "企業形象",
    url: "http://baui.com.tw/",
    cover: "/works/baui.jpg",
    tags: ["形象網站", "UI 設計", "RWD"],
    year: "2016",
    role: "設計・前端",
    published: true,
    order: 18,
  },
  {
    slug: "camels",
    title: "Camels 企業網站",
    description: "企業形象與產品展示網站，以清楚的架構呈現品牌與商品。",
    category: "企業形象",
    url: "http://www.camels.com.tw/",
    cover: "/works/camels.jpg",
    tags: ["形象網站", "產品展示", "RWD"],
    year: "2016",
    role: "設計・前端",
    published: true,
    order: 19,
  },
];
