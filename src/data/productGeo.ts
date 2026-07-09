import type { QuickAnswer } from "@/lib/content-geo";

export type ProductGeoData = {
  quickAnswer: QuickAnswer;
  keyTakeaways: string[];
  bestFor: string[];
  avoidFor: string[];
  faq: { question: string; answer: string }[];
};

const PRODUCT_GEO: Record<string, ProductGeoData> = {
  "/product/lanna": {
    quickAnswer: {
      question: "LANA 皮革主機是什麼？適合誰買？",
      answer:
        "LANA 皮革主機是一款一代通配電子煙主機，採皮革質感機身、雙檔輸出與 Type-C 快充，可搭配 LANA 小蠻腰煙彈及多數一代規格菸彈。台灣現貨，適合想長期使用換彈式、重視外觀質感的使用者。",
    },
    keyTakeaways: [
      "一代通配規格，可搭配 LANA 煙彈與多品牌菸彈",
      "皮革質感機身，多色可選",
      "雙檔輸出與 Type-C 快充",
      "台灣現貨，支援超商取貨付款",
      "僅限 18 歲以上選購",
    ],
    bestFor: [
      "偏好換彈式、想長期使用同一台主機",
      "重視主機外觀與手感的使用者",
      "已確定使用 LANA 或一代通配菸彈",
      "需要 Type-C 快充與雙檔輸出",
    ],
    avoidFor: ["未成年人", "只想買拋棄式、不想充電換彈", "需要二代專用規格的主機"],
    faq: [
      {
        question: "LANA 主機可以搭配哪些煙彈？",
        answer:
          "LANA 皮革主機為一代通配規格，可搭配本站 LANA 小蠻腰煙彈，以及多數一代通配菸彈。選購前建議確認商品頁規格或詢問 LINE 客服。",
      },
      {
        question: "LANA 主機如何充電？",
        answer: "採 Type-C 介面快充，請使用合格充電線與變壓器，避免過度充放以延長電池壽命。",
      },
      {
        question: "下單前需要聯絡客服嗎？",
        answer: "建議下單前透過 LINE 客服確認顏色庫存與配送方式，以便更快完成出貨。",
      },
    ],
  },
  "/product/lana-pods": {
    quickAnswer: {
      question: "LANA 小蠻腰煙彈是什麼？一盒幾顆？",
      answer:
        "LANA 小蠻腰煙彈為一代通配菸彈，每盒 3 顆裝，採陶瓷蜂巢式霧化晶片，提供冰飲、水果、茶系、奶系等多元口味。台灣現貨，可搭配 LANA 主機及多數一代通配主機使用。",
    },
    keyTakeaways: [
      "每盒 3 顆裝，一代通配規格",
      "陶瓷蜂巢霧化晶片，口感細緻",
      "30+ 口味可選（依庫存為準）",
      "台灣現貨發出",
      "下單前建議 LINE 確認口味庫存",
    ],
    bestFor: [
      "已有一代通配主機，需要替換煙彈",
      "想嘗試 LANA 調香與多元口味",
      "偏好換彈式、長期使用成本較低",
      "台灣本地配送與超商取貨付款",
    ],
    avoidFor: ["未成年人", "使用二代專用主機者", "不確定主機規格且未諮詢客服"],
    faq: [
      {
        question: "LANA 煙彈一盒有幾顆？",
        answer: "每盒 3 顆裝，口味於商品頁選擇，實際庫存請下單前透過 LINE 客服確認。",
      },
      {
        question: "LANA 煙彈可以用在 SP2S 主機嗎？",
        answer:
          "多數一代通配主機可搭配 LANA 煙彈，但不同品牌主機與菸彈規格可能略有差異，建議選購前確認主機型號或詢問客服。",
      },
      {
        question: "口味太多怎麼選？",
        answer:
          "新手可從果味或涼感較低的口味開始；偏好清涼可選冰飲系列。亦可參考本站選購指南或 PodPick Guide 口味評測文章。",
      },
    ],
  },
  "/product/sp2s-universal-pods": {
    quickAnswer: {
      question: "SP2S 二代通用煙彈是什麼？",
      answer:
        "SP2S 二代通用煙彈（思博瑞）為一代主機可通用的菸彈系列，提供約 32 種口味，採陶瓷霧化芯。適合已有一代 SP2S 或相容主機、想更換口味的使用者，台灣現貨選購。",
    },
    keyTakeaways: [
      "一代主機通用規格",
      "約 32 種口味（依庫存）",
      "陶瓷霧化芯",
      "台灣現貨配送",
      "可搭配 SP2S 一代／Pro 主機",
    ],
    bestFor: [
      "SP2S 一代或 Pro 主機使用者",
      "想嘗試多種口味輪換",
      "偏好思博瑞調香與涼感層次",
      "台灣本地現貨與超商取貨",
    ],
    avoidFor: ["未成年人", "使用不相容二代專規主機者", "從未使用過換彈式且未確認規格"],
    faq: [
      {
        question: "SP2S 二代煙彈和一代煙彈差在哪？",
        answer:
          "二代通用煙弹口味陣容與調香可能與一代系列不同，選購前請確認您的主機型號與商品頁適配說明。",
      },
      {
        question: "如何挑選 SP2S 口味？",
        answer:
          "可依涼度與甜度偏好選擇；新手可從果味或經典口味開始。詳細評測可參考 PodPick Guide 的 SP2S 32 款口味指南。",
      },
    ],
  },
  "/product/bullet": {
    quickAnswer: {
      question: "SP2S 一代主機（思博瑞）適合誰？",
      answer:
        "SP2S 一代主機是思博瑞品牌的一代通配電子煙主機，可搭配 SP2S 一代／二代通用煙彈。適合想入門換彈式、重視品牌相容性的台灣使用者，現貨配送。",
    },
    keyTakeaways: [
      "SP2S 思博瑞一代通配主機",
      "可搭配 SP2S 煙彈系列",
      "陶瓷霧化、即插即用",
      "台灣現貨",
      "僅限 18 歲以上",
    ],
    bestFor: [
      "SP2S 品牌愛用者",
      "第一次購買換彈式主機",
      "需要與 SP2S 煙彈完整相容",
      "台灣超商取貨付款",
    ],
    avoidFor: ["未成年人", "需要拋棄式免充電方案者", "已有不相容規格主機者"],
    faq: [
      {
        question: "SP2S 一代主機配哪種煙彈？",
        answer: "可搭配本站 SP2S 一代煙彈與二代通用煙彈，請依商品頁口味列表選購。",
      },
    ],
  },
  "/product/pro": {
    quickAnswer: {
      question: "SP2S Pro 二代主機有什麼特色？",
      answer:
        "SP2S Pro 為思博瑞二代旗艦主機，具智慧感應與 LED 燈效，可搭配 SP2S 二代通用煙彈。適合追求進階手感與外觀的使用者，台灣現貨。",
    },
    keyTakeaways: ["二代旗艦主機", "智慧感應", "LED 炫彩", "搭配 SP2S 煙彈", "台灣現貨"],
    bestFor: ["SP2S 進階玩家", "重視主機質感與燈效", "長期換彈式使用者"],
    avoidFor: ["未成年人", "只想買拋棄式者"],
    faq: [
      {
        question: "Pro 與一代主機差在哪？",
        answer: "Pro 為二代旗艦系列，外觀與感應功能更進階；煙彈請選 SP2S 二代通用規格並確認商品頁說明。",
      },
    ],
  },
  "/product/diya-7500": {
    quickAnswer: {
      question: "DIYA 7500 拋棄式適合什麼情境？",
      answer:
        "DIYA 叮啞 7500 口拋棄式電子煙，免充電換彈、即開即用，適合出差旅行或不想維護主機的使用者。台灣現貨，僅限 18 歲以上。",
    },
    keyTakeaways: ["7500 口大口數", "拋棄式免維護", "多口味可選", "台灣現貨", "18 歲以上"],
    bestFor: ["出差旅行攜帶", "不想充電換彈", "想先體驗不同口味"],
    avoidFor: ["未成年人", "長期大量使用想省成本者（換彈式更划算）"],
    faq: [
      {
        question: "拋棄式用完怎麼處理？",
        answer: "請依台灣電池回收規範處理，勿隨意丟棄。詳情可參考選購指南中的環保與旅行相關文章。",
      },
    ],
  },
  "/product/hebat-gen6": {
    quickAnswer: {
      question: "HEBAT 喜貝六代是什麼？",
      answer:
        "HEBAT 喜貝六代為大口數拋棄式電子煙選項，適合偏好即開即用、高口數需求的成人使用者。台灣現貨配送。",
    },
    keyTakeaways: ["喜貝六代系列", "拋棄式", "大口數", "台灣現貨", "18 歲以上"],
    bestFor: ["重度使用者", "偏好拋棄式便利", "想嘗試喜貝調香"],
    avoidFor: ["未成年人", "想長期節省煙彈成本者"],
    faq: [
      {
        question: "喜貝六代與換彈式怎麼選？",
        answer: "拋棄式免充電維護；換彈式長期成本通常較低。可依使用頻率與便利性選擇。",
      },
    ],
  },
  "/product/diya-pods": {
    quickAnswer: {
      question: "DIYA 煙彈一盒幾顆？",
      answer:
        "DIYA 叮啞電子煙彈一盒三入，一代通用規格，多口味可選。適合已有一代主機、想嘗試叮啞調香的使用者。",
    },
    keyTakeaways: ["一盒三入", "一代通用", "多口味", "台灣現貨", "18 歲以上"],
    bestFor: ["一代主機使用者", "想嘗試 DIYA 口味", "備貨替換"],
    avoidFor: ["未成年人", "二代專規主機使用者"],
    faq: [
      {
        question: "DIYA 煙彈相容哪些主機？",
        answer: "為一代通用規格，多數一代通配主機可用；選購前請確認您的主機型號。",
      },
    ],
  },
};

export function getProductGeo(path: string): ProductGeoData | undefined {
  const base = path.split("?")[0];
  return PRODUCT_GEO[base];
}
