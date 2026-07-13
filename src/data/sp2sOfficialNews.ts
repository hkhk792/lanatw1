/** 參考 sp2sglobal.com BLOG & NEWS / 社群評價，繁中改寫並連結站內知識庫 */

export type Sp2sNewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: "news" | "review";
  image: string;
  /** 站內路徑優先 */
  href?: string;
  externalHref?: string;
};

export const SP2S_ONLINE_REVIEWS: Sp2sNewsItem[] = [
  {
    slug: "review-flavor",
    title: "口味真的有差！",
    excerpt: "Amazing flavors that make a difference — 調香層次清楚，換彈後仍能維持穩定風味。",
    date: "2026",
    category: "review",
    image: "/sp2s-gallery/03.webp",
  },
  {
    slug: "review-art",
    title: "像藝術品一樣精緻",
    excerpt: "It's a beautiful piece of art! 主機質感與握感都超出預期。",
    date: "2026",
    category: "review",
    image: "/sp2s-gallery/06.webp",
  },
  {
    slug: "review-experience",
    title: "前所未有的體驗",
    excerpt: "A whole new experience! 從第一口到末段都相當順喉。",
    date: "2026",
    category: "review",
    image: "/sp2s-gallery/11.webp",
  },
  {
    slug: "review-professional",
    title: "專業又驚艷",
    excerpt: "Professional and amazing! 客服與產品線都很完整。",
    date: "2026",
    category: "review",
    image: "/sp2s-gallery/14.webp",
  },
  {
    slug: "review-love",
    title: "只愛 SP2S",
    excerpt: "No other love but SP2S — 口味多、通配選擇也多。",
    date: "2026",
    category: "review",
    image: "/sp2s-gallery/08.webp",
  },
];

export const SP2S_BLOG_NEWS: Sp2sNewsItem[] = [
  {
    slug: "flavor-fatigue",
    title: "什麼是口味疲勞？為什麼電子煙越抽越沒味道？",
    excerpt:
      "多數裝置靠前幾口的極甜極涼取勝，兩三天後卻變得平淡甚至糊芯——這往往是硬體輸出與棉芯設計問題，而非單純「膩了」。",
    date: "2026-06-22",
    category: "news",
    image: "/product-photos/sp2s-gen2-pods-flavor-catalog.png",
    href: "/guide/how-to-pick-flavor",
  },
  {
    slug: "zuos-award",
    title: "SP2S ZUOS 榮獲 iGeekPhone 2026 最佳預填煙彈系統獎",
    excerpt:
      "ZUOS 以恆定輸出晶片改善電量下降時的口味衰減與慢導油問題，適合重視末段風味一致的使用者。",
    date: "2026-05-21",
    category: "news",
    image: "/sp2s-gallery/12.webp",
    externalHref: "https://www.sp2sglobal.com/article/index.html",
  },
  {
    slug: "inspection-100",
    title: "電子煙 100% 全檢有必要嗎？",
    excerpt:
      "開箱即壞、煙彈一用就漏，常與產線抽檢有關。全檢雖增加成本，卻能大幅降低 DOA 與售後率。",
    date: "2026-05-19",
    category: "news",
    image: "/sp2s-gallery/05.webp",
    href: "/guide/pod-leaking-causes",
  },
  {
    slug: "philippines-flavor",
    title: "菲律賓口味限制趨勢：裝置一致性為何更重要",
    excerpt:
      "若市場僅剩煙草類口味，裝置的穩定輸出與霧化均勻度將直接決定體驗，調香掩蓋硬體缺陷的空間變小。",
    date: "2026-05-13",
    category: "news",
    image: "/sp2s-gallery/15.webp",
    externalHref: "https://www.sp2sglobal.com/article/index.html",
  },
  {
    slug: "vaping-etiquette",
    title: "公共場合電子煙禮儀：如何尊重他人",
    excerpt:
      "即使無煙無灰，在咖啡廳對陌生人吐大團果味雲仍屬失禮。選擇低煙量、留意風向與空間。",
    date: "2026-05-09",
    category: "news",
    image: "/sp2s-gallery/02.webp",
    href: "/blog/disposable-vs-refillable",
  },
  {
    slug: "disposable-vs-pod-flavor",
    title: "拋棄式 vs 換彈式：哪種更適合追求口味？",
    excerpt:
      "同樣煙油在不同硬體上風味不同。拋棄式即開即爽；換彈式長期成本較低、口味可靈活更換。",
    date: "2026-05-01",
    category: "news",
    image: "/product-photos/disposable-diya-7500.webp",
    href: "/blog/disposable-vs-refillable",
  },
  {
    slug: "senx-award",
    title: "SP2S SEN X 榮獲最佳防漏可補充煙彈系統獎",
    excerpt:
      "口袋溫度與氣壓會讓可補充煙彈從氣流道滲油。SEN X 以物理結構降低冷凝與漏油風險。",
    date: "2026-04-18",
    category: "news",
    image: "/sp2s-gallery/09.webp",
    externalHref: "https://www.sp2sglobal.com/article/index.html",
  },
  {
    slug: "ceramic-award",
    title: "SP2S 智能霧化榮獲國際獎項：低溫陶瓷芯新體驗",
    excerpt:
      "超微低溫陶瓷技術提升霧化效率、降低糊芯機率，並強調環保包裝與 ESG 承諾。",
    date: "2026-03-10",
    category: "news",
    image: "/sp2s-gallery/07.webp",
    href: "/guide/sp2s-compatibility-guide",
  },
  {
    slug: "beginner-pod",
    title: "新手該選什麼煙彈主機？簡單才是最難的",
    excerpt:
      "功能過多反而讓入門者困惑。一代通配、口味清楚、漏油少，才是台灣新手最實用的起點。",
    date: "2026-02-20",
    category: "news",
    image: "/product-photos/product-3.webp",
    href: "/guides",
  },
  {
    slug: "leak-hot-weather",
    title: "天氣熱煙彈漏油？原因與快速處理",
    excerpt:
      "高溫使煙油變稀、氣壓升高，口袋內易滲漏。直立存放、避免曝曬，並參考漏油排查指南。",
    date: "2026-01-15",
    category: "news",
    image: "/sp2s-gallery/04.webp",
    href: "/guide/pod-leaking-causes",
  },
];
