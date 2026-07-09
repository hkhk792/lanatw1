/** 站内知识库文章（Guide / Blog / Compare / Flavor / Brand）— Topic Cluster 数据源 */

export type KnowledgeCategory = "guide" | "blog" | "compare" | "flavor" | "brand";

export type KnowledgeSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type KnowledgeArticle = {
  slug: string;
  category: KnowledgeCategory;
  title: string;
  description: string;
  intro: string;
  sections: KnowledgeSection[];
  updated: string;
  readTime?: string;
  quickAnswer?: { question: string; answer: string };
  keyTakeaways?: string[];
  pros?: string[];
  cons?: string[];
  faq?: { question: string; answer: string }[];
  /** 站内商品路径 */
  relatedProducts?: string[];
  /** 站内文章 slug（同 category 或跨 category 用 category:slug） */
  relatedArticles?: string[];
  /** 外链 PodPick 等 */
  externalLinks?: { label: string; href: string }[];
};

const articles: KnowledgeArticle[] = [
  {
    slug: "lana-xiaomanyao-intro",
    category: "blog",
    title: "LANA 小蠻腰是什麼？主機、煙彈與通配一次看懂",
    description: "LANA 小蠻腰系列介紹：皮革主機、3 顆裝煙彈、一代通配規格與台灣選購重點。",
    intro:
      "LANA（常見稱呼「小蠻腰」）是台灣電子煙市場上熱門的 POD 系列之一，主打皮革質感主機、陶瓷蜂巢煙彈與一代通配規格。本文整理品牌定位、產品線與適合族群，協助第一次接觸的使用者快速理解。",
    quickAnswer: {
      question: "LANA 小蠻腰是什麼？",
      answer:
        "LANA 小蠻腰是面向台灣使用者的 POD 電子煙系列，包含皮革主機、3 顆裝煙彈與一代通配產品，支援多種口味，適合日常換彈式使用，台灣現貨配送。",
    },
    keyTakeaways: [
      "小蠻腰 = LANA 系列俗稱，含主機與煙彈",
      "煙彈多為一代通配規格",
      "陶瓷蜂巢霧化，口味選擇多元",
      "可搭配 LANA 主機或相容一代主機",
      "僅限 18 歲以上選購",
    ],
    sections: [
      {
        heading: "LANA 品牌與產品線",
        paragraphs: [
          "LANA 系列在台灣以「小蠻腰」為人熟知，產品線涵蓋皮革主機、煙彈 3 顆裝，以及與一代規格相容的通配選項。主機強調質感與雙檔輸出；煙彈則以調香與霧化穩定度為賣點。",
          "若您已決定使用 LANA，建議從主機搭配煙彈入門，或若已有相容主機，可直接選購煙彈替換。",
        ],
      },
      {
        heading: "誰適合 LANA 小蠻腰？",
        paragraphs: ["以下族群通常最適合考慮 LANA 系列："],
        bullets: [
          "偏好換彈式、想長期使用同一台主機",
          "重視主機外觀與手感",
          "想嘗試多元口味（果味、茶系、冰飲等）",
          "需要台灣現貨與超商取貨付款",
        ],
      },
    ],
    relatedProducts: ["/product/lanna", "/product/lana-pods"],
    relatedArticles: ["guide:sp2s-compatibility-guide", "compare:lana-vs-sp2s"],
    externalLinks: [
      { label: "PodPick：SP2S vs LANA 怎麼選", href: "https://podpickguide.com/sp2s-vs-lana-pod-how-to-choose" },
    ],
    faq: [
      {
        question: "小蠻腰煙彈一盒幾顆？",
        answer: "LANA 小蠻腰煙彈通常為每盒 3 顆裝，口味依商品頁與庫存為準。",
      },
    ],
    updated: "2026-07-09",
    readTime: "6 分鐘",
  },
  {
    slug: "sp2s-compatibility-guide",
    category: "guide",
    title: "SP2S 通配指南：一代、二代煙彈與主機怎麼配？",
    description: "SP2S 思博瑞一代／二代煙彈與主機相容說明，避免買錯規格。",
    intro:
      "SP2S（思博瑞）是台灣常見的煙彈品牌之一。選購時最容易搞混的是「一代」與「二代」通用規格。本文說明主機與煙彈的對應關係，以及與 LANA 等通配品牌的差異。",
    quickAnswer: {
      question: "SP2S 煙彈怎麼選才不買錯？",
      answer:
        "先確認您的主機是 SP2S 一代或 Pro 二代系列，再選對應的 SP2S 一代煙彈或二代通用煙彈；不確定時請對照商品頁規格或詢問 LINE 客服。",
    },
    keyTakeaways: [
      "先確認主機代數再選煙彈",
      "二代通用煙彈口味陣容與一代不同",
      "多數一代通配主機可搭配 LANA 煙彈",
      "下單前建議 LINE 確認庫存",
    ],
    sections: [
      {
        heading: "一代 vs 二代",
        paragraphs: [
          "SP2S 一代主機通常搭配 SP2S 一代煙彈或二代通用煙彈（依商品頁標示）。Pro 二代主機則對應二代系列。買錯規格會導致無法使用或體驗不佳，選購前務必核對型號。",
        ],
      },
      {
        heading: "與 LANA 的關係",
        paragraphs: [
          "LANA 煙彈多為一代通配規格，可與 SP2S 一代主機及多數一代主機搭配，但不同品牌調香與涼感不同，建議先從熟悉口味入手。",
        ],
      },
    ],
    relatedProducts: ["/product/bullet", "/product/pro", "/product/sp2s-universal-pods", "/product/sp2s-gen1-pods"],
    relatedArticles: ["blog:lana-xiaomanyao-intro", "compare:lana-vs-sp2s"],
    externalLinks: [
      { label: "SP2S 一代 vs 二代完整比較", href: "https://podpickguide.com/sp2s-gen1-vs-gen2-pods" },
    ],
    updated: "2026-07-09",
    readTime: "5 分鐘",
  },
  {
    slug: "pod-storage-guide",
    category: "guide",
    title: "煙彈保存方式：延長口味與減少漏油",
    description: "未開封與已開封煙彈的正確保存方法，台灣潮濕氣候注意事項。",
    intro:
      "煙彈保存不當容易漏油、變味或乾燒。本文整理台灣常見氣候下的保存建議，適用 LANA、SP2S 等換彈式產品。",
    quickAnswer: {
      question: "煙彈要怎麼保存？",
      answer:
        "未開封請置於陰涼乾燥處、避免陽光直射；開封後盡快使用，直立存放並避免高溫車內。潮濕季節可搭配密封袋，但不要冷凍。",
    },
    keyTakeaways: ["陰涼乾燥、避光", "開封後盡快使用", "直立存放", "避免高溫與冷凍", "漏油先檢查密封與存放"],
    sections: [
      {
        heading: "未開封保存",
        paragraphs: [
          "未開封煙彈應放在室溫陰涼處，避免陽光直射與車內高溫。台灣夏季車內溫度極高，切勿將煙彈長時間留在車上。",
        ],
      },
      {
        heading: "已開封使用",
        paragraphs: [
          "裝上主機後若短期不用，可取下煙彈並直立存放。若出現漏油，請參考本站漏油排查文章或聯絡客服。",
        ],
      },
    ],
    relatedProducts: ["/product/lana-pods", "/product/sp2s-universal-pods"],
    externalLinks: [{ label: "漏油排查完整版", href: "https://podpickguide.com/pod-leaking-troubleshooting" }],
    updated: "2026-07-09",
    readTime: "4 分鐘",
  },
  {
    slug: "pod-leaking-causes",
    category: "guide",
    title: "煙彈漏油原因與處理方式",
    description: "換彈式電子煙漏油的常見原因：氣壓、存放、霧化芯與主機適配。",
    intro: "漏油是換彈式使用者最常遇到的問題之一。多數情況可透過調整存放方式或檢查密封改善，本文列出原因與對應處理。",
    quickAnswer: {
      question: "煙彈為什麼會漏油？",
      answer:
        "常見原因包括：氣壓變化（搭機、高溫）、存放姿勢不當、煙彈密封老化，或主機與煙彈規格不完全相容。先直立靜置，再檢查橡膠圈與接口。",
    },
    sections: [
      {
        heading: "常見原因",
        bullets: [
          "飛行或海拔變化造成氣壓差",
          "橫放或倒置存放",
          "高溫環境",
          "煙彈過期或密封老化",
          "主機與煙彈規格不匹配",
        ],
        paragraphs: [],
      },
    ],
    relatedArticles: ["guide:pod-storage-guide"],
    externalLinks: [{ label: "PodPick 漏油排查", href: "https://podpickguide.com/pod-leaking-troubleshooting" }],
    updated: "2026-07-09",
    readTime: "5 分鐘",
  },
  {
    slug: "how-to-pick-flavor",
    category: "guide",
    title: "如何挑選煙彈口味？新手入門三維度",
    description: "甜度、涼度、風味類型：第一次買煙彈怎麼選口味。",
    intro:
      "口味選擇是選購煙彈時最糾結的一環。建議從甜度、涼度、風味類型三個維度入手，新手可從果味或低涼口味開始，再依偏好調整。",
    quickAnswer: {
      question: "第一次買煙彈口味怎麼選？",
      answer:
        "建議從甜度中等、涼感較低的果味或飲品口味開始；若喜歡清涼感再選冰系列。可先購買 3 顆裝嘗試不同口味。",
    },
    keyTakeaways: ["甜度 × 涼度 × 風味類型", "新手從低涼果味開始", "3 顆裝適合嘗鮮", "參考口味評測文章"],
    relatedProducts: ["/product/lana-pods", "/product/sp2s-universal-pods"],
    externalLinks: [
      { label: "第一次買煙彈怎麼選", href: "https://podpickguide.com/how-to-pick-first-pod-flavor" },
      { label: "SP2S 32 款口味評測", href: "https://podpickguide.com/sp2s-pod-flavor-guide" },
    ],
    updated: "2026-07-09",
    readTime: "5 分鐘",
  },
  {
    slug: "diya-review",
    category: "blog",
    title: "DIYA 叮啞評價：拋棄式與換彈式怎麼選？",
    description: "DIYA 叮啞霧化桿、煙彈與 7500 拋棄式系列簡評與適合族群。",
    intro:
      "DIYA 叮啞提供換彈式霧化桿、通用煙彈與大口數拋棄式選項。適合想嘗試不同使用型態、或需要即開即用拋棄式的使用者。",
    quickAnswer: {
      question: "DIYA 適合誰？",
      answer:
        "DIYA 換彈式適合想控制長期成本的使用者；DIYA 7500 拋棄式適合出差旅行、不想充電換彈的情境。",
    },
    pros: ["口味選擇多", "拋棄式即開即用", "換彈式長期較省", "台灣現貨"],
    cons: ["需確認主機規格", "拋棄式長期成本較高", "僅限成人"],
    relatedProducts: ["/product/diya", "/product/diya-pods", "/product/diya-7500"],
    updated: "2026-07-09",
    readTime: "4 分鐘",
    sections: [
      {
        heading: "產品線概覽",
        paragraphs: [
          "DIYA 叮啞霧化桿為一代通用主機；DIYA 煙彈一盒三入；DIYA 7500 為拋棄式大口數選項。可依使用頻率與便利性選擇。",
        ],
      },
    ],
  },
  {
    slug: "lana-vs-sp2s",
    category: "compare",
    title: "LANA vs SP2S：台灣使用者怎麼選？",
    description: "LANA 小蠻腰與 SP2S 思博瑞在主機、煙彈、口味與通配上的比較。",
    intro:
      "LANA 與 SP2S 都是台灣熱門選擇，但定位略有不同：LANA 強調皮革主機與調香；SP2S 則以思博瑞品牌與大口味陣容著稱。本文幫助您在兩者之間做出選擇。",
    quickAnswer: {
      question: "LANA 還是 SP2S 比較好？",
      answer:
        "若重視主機質感與 LANA 調香，選 LANA 小蠻腰；若已是 SP2S 用戶或偏好思博瑞口味陣容，選 SP2S。兩者多為一代通配，可搭配相容主機。",
    },
    keyTakeaways: [
      "LANA：皮革主機 + 小蠻腰煙彈",
      "SP2S：思博瑞大口味陣容",
      "多為一代通配規格",
      "可先買 3 顆裝試口味",
    ],
    pros: ["兩品牌皆有台灣現貨", "口味選擇豐富", "換彈式長期成本較低"],
    cons: ["需確認主機相容", "未成年人禁止購買"],
    sections: [
      {
        heading: "選 LANA 如果…",
        bullets: ["重視主機外觀與皮革質感", "偏好 LANA 調香風格", "想從 LANA 主機 + 煙彈套組開始"],
        paragraphs: [],
      },
      {
        heading: "選 SP2S 如果…",
        bullets: ["已是 SP2S 主機用戶", "想嘗試 32 款二代口味", "偏好思博瑞品牌生態"],
        paragraphs: [],
      },
    ],
    relatedProducts: ["/product/lanna", "/product/lana-pods", "/product/bullet", "/product/sp2s-universal-pods"],
    externalLinks: [{ label: "PodPick 完整比較文", href: "https://podpickguide.com/sp2s-vs-lana-pod-how-to-choose" }],
    updated: "2026-07-09",
    readTime: "6 分鐘",
  },
  {
    slug: "lana-flavor-overview",
    category: "flavor",
    title: "LANA 煙彈口味總覽：果味、茶系與冰飲怎麼選",
    description: "LANA 小蠻腰煙彈口味分類與選購建議，依甜度與涼度挑選。",
    intro:
      "LANA 煙彈提供從果味、茶系到冰飲、奶系等多種口味。本文依風味類型分類，協助您依偏好快速縮小範圍。",
    quickAnswer: {
      question: "LANA 煙彈有哪些口味類型？",
      answer:
        "常見分類包含：水果系（葡萄、水蜜桃等）、冰飲系（可樂、雪碧、深海冰泉）、茶系（烏龍、鐵觀音）、奶系（草莓牛奶、芒奶）等，實際庫存以商品頁為準。",
    },
    relatedProducts: ["/product/lana-pods"],
    relatedArticles: ["guide:how-to-pick-flavor", "blog:lana-xiaomanyao-intro"],
    updated: "2026-07-09",
    readTime: "5 分鐘",
    sections: [
      {
        heading: "依涼度選擇",
        paragraphs: [
          "偏好清涼可選冰飲或「冰」系列；不喜涼感可選純果味或茶系。第一次購買建議從涼感中低口味開始。",
        ],
      },
    ],
  },
  {
    slug: "lana-brand-guide",
    category: "brand",
    title: "LANA 品牌指南：主機、煙彈與保養",
    description: "LANA 電子煙品牌完整指南，含產品線、通配與日常保養。",
    intro:
      "本指南整理 LANA 品牌旗下主機與煙彈產品線、一代通配概念，以及主機充電與煙彈更換的日常保養重點。",
    quickAnswer: {
      question: "LANA 品牌包含哪些產品？",
      answer: "主要包括 LANA 皮革主機（一代通配）、LANA 小蠻腰煙彈 3 顆裝，以及相容的一代通配配件；詳見各商品頁。",
    },
    relatedProducts: ["/product/lanna", "/product/lana-pods"],
    relatedArticles: ["blog:lana-xiaomanyao-intro", "flavor:lana-flavor-overview"],
    updated: "2026-07-09",
    readTime: "7 分鐘",
    sections: [
      {
        heading: "主機保養",
        paragraphs: [
          "使用 Type-C 充電，避免過充；定期清潔接口；勿讓主機長期處於高溫潮濕環境。",
        ],
      },
      {
        heading: "煙彈更換時機",
        paragraphs: [
          "當出現糊味、風味明顯變淡或漏油嚴重時，建議更換新煙彈，以維持較佳體驗。",
        ],
      },
    ],
  },
  {
    slug: "disposable-vs-refillable",
    category: "blog",
    title: "拋棄式 vs 換彈式：哪種適合你？",
    description: "台灣使用者選購電子煙：拋棄式便利與換彈式成本的比較。",
    intro:
      "拋棄式電子煙免充電、即開即用；換彈式則長期成本較低、口味可靈活更換。本文比較兩種型態的優缺點與適合情境。",
    quickAnswer: {
      question: "拋棄式還是換彈式比較好？",
      answer:
        "出差旅行、偶爾使用選拋棄式；每天使用、想省長期成本選換彈式（主機 + 煙彈）。",
    },
    relatedProducts: ["/product/diya-7500", "/product/lanna", "/product/lana-pods"],
    externalLinks: [{ label: "PodPick 完整比較", href: "https://podpickguide.com/disposable-vs-refillable-pods" }],
    updated: "2026-07-09",
    readTime: "5 分鐘",
    sections: [
      {
        heading: "拋棄式優勢",
        bullets: ["免充電換彈", "攜帶方便", "適合嘗試新口味"],
        paragraphs: [],
      },
      {
        heading: "換彈式優勢",
        bullets: ["長期成本較低", "主機可重複使用", "口味更換靈活"],
        paragraphs: [],
      },
    ],
  },
];

export const knowledgeArticles = articles;

export function getArticleBySlug(category: KnowledgeCategory, slug: string): KnowledgeArticle | undefined {
  return articles.find((a) => a.category === category && a.slug === slug);
}

export function getArticlesByCategory(category: KnowledgeCategory): KnowledgeArticle[] {
  return articles.filter((a) => a.category === category);
}

export function resolveRelatedArticle(ref: string): KnowledgeArticle | undefined {
  const [cat, slug] = ref.includes(":") ? ref.split(":") : ["guide", ref];
  return getArticleBySlug(cat as KnowledgeCategory, slug);
}

export function articlePath(article: KnowledgeArticle): string {
  const base: Record<KnowledgeCategory, string> = {
    guide: "/guide",
    blog: "/blog",
    compare: "/compare",
    flavor: "/flavors",
    brand: "/brands",
  };
  return `${base[article.category]}/${article.slug}`;
}

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  guide: "選購指南",
  blog: "部落格",
  compare: "產品比較",
  flavor: "口味專區",
  brand: "品牌介紹",
};
