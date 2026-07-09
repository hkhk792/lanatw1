/** 商品頁長文內容（目標 800+ 字 SEO/GEO） */

export type ProductEditorial = {
  path: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  relatedArticleRefs: string[];
};

const editorials: ProductEditorial[] = [
  {
    path: "/product/lanna",
    relatedArticleRefs: ["blog:lana-xiaomanyao-intro", "brand:lana-brand-guide", "compare:lana-vs-sp2s"],
    sections: [
      {
        heading: "LANA 皮革主機產品介紹",
        paragraphs: [
          "LANA 皮革主機是一款面向台灣市場的一代通配電子煙主機，採皮革質感機身與合金結構，提供雙檔輸出（9W / 18W）與 Type-C 快充。主機設計強調日常握持手感與外觀質感，適合已確定使用換彈式、並希望長期搭配 LANA 或相容煙彈的使用者。",
          "本站提供多種顏色款式，下單前建議透過 LINE 客服確認現貨顏色。僅限 18 歲（或當地法定年齡）以上使用者選購。",
        ],
      },
      {
        heading: "規格摘要",
        bullets: [
          "輸出：9W / 18W 雙檔",
          "充電：Type-C，約 30 分鐘充滿",
          "電池：3.7V / 400mAh",
          "機身材質：皮革 + 合金",
          "適配：一代通配煙彈規格",
        ],
        paragraphs: [],
      },
      {
        heading: "適配煙彈與主機",
        paragraphs: [
          "LANA 皮革主機可搭配本站 LANA 小蠻腰煙彈 3 顆裝，以及多數一代通配規格菸彈（如 SP2S 一代／二代通用系列，依實際規格為準）。不同品牌調香、涼度與甜度可能不同，建議先從熟悉口味或低涼果味入門。",
          "若您不確定現有主機是否相容，請參考 SP2S 通配指南或聯絡客服，避免買錯代數或規格。",
        ],
      },
      {
        heading: "誰適合購買？",
        bullets: [
          "偏好換彈式、計劃長期使用同一台主機",
          "重視主機外觀、皮革質感",
          "需要 Type-C 快充與雙檔輸出",
          "台灣本地配送與超商取貨付款",
        ],
        paragraphs: [],
      },
      {
        heading: "使用與保養建議",
        paragraphs: [
          "請使用合格 Type-C 充電線，避免過度充放。接口保持乾燥清潔，長期不用時建議存放於陰涼處。出現非人為故障請盡快聯絡客服，並保留訂單編號以便售後處理。",
        ],
      },
    ],
  },
  {
    path: "/product/lana-pods",
    relatedArticleRefs: ["flavor:lana-flavor-overview", "guide:how-to-pick-flavor", "guide:pod-storage-guide"],
    sections: [
      {
        heading: "LANA 小蠻腰煙彈介紹",
        paragraphs: [
          "LANA 小蠻腰煙彈為一代通配規格菸彈，每盒 3 顆裝，採陶瓷蜂巢式霧化晶片，旨在提供細緻順喉的霧化體驗與穩定口味表現。口味涵蓋果味、冰飲、茶系、奶系等多種選擇，適合搭配 LANA 主機或相容的一代主機使用。",
          "台灣現貨發出；口味庫存變動較快，下單前請添加 LINE 客服確認。僅限成年人選購。",
        ],
      },
      {
        heading: "規格與包裝",
        bullets: [
          "包裝：3 顆裝／盒",
          "霧化：陶瓷蜂巢式晶片",
          "規格：一代通配主機",
          "尼古丁：依包裝標示為準",
          "產地／有效期：依實際包裝",
        ],
        paragraphs: [],
      },
      {
        heading: "口味怎麼選",
        paragraphs: [
          "新手可從果味或涼感較低的口味開始，例如葡萄、水蜜桃、蘋果等；偏好清涼可選冰飲系列如深海冰泉、雪碧。茶系愛好者可嘗試烏龍、鐵觀音；喜歡甜感可選奶系如草莓牛奶。詳細分類請見 LANA 口味總覽文章。",
        ],
      },
      {
        heading: "保存與更換",
        paragraphs: [
          "未開封請置於陰涼乾燥處；開封後盡快使用並直立存放。當出現糊味、漏油或風味明顯變淡時，建議更換新煙彈。更多保存技巧請參考煙彈保存指南。",
        ],
      },
      {
        heading: "與 SP2S 煙彈的差異",
        paragraphs: [
          "LANA 與 SP2S 均多為一代通配，但調香風格不同：LANA 偏果茶與冰飲多元；SP2S 則以思博瑞大口味陣容與涼感層次著稱。可依個人偏好選擇，或兩種各購 3 顆裝嘗試。",
        ],
      },
    ],
  },
  {
    path: "/product/sp2s-universal-pods",
    relatedArticleRefs: ["guide:sp2s-compatibility-guide", "compare:lana-vs-sp2s", "guide:how-to-pick-flavor"],
    sections: [
      {
        heading: "SP2S 二代通用煙彈",
        paragraphs: [
          "SP2S（思博瑞）二代通用煙彈提供約 32 種口味選擇，採陶瓷霧化芯，設計上與常見一代規格主機相容。適合已是 SP2S 一代或 Pro 主機用戶，以及想嘗試思博瑞調香的使用者。",
        ],
      },
      {
        heading: "適配主機",
        paragraphs: [
          "請確認您的主機為 SP2S 一代、Pro 或其他標示可搭配二代通用煙彈的型號。與 LANA 煙彈同為通配思路，但口味與規格細節可能不同，選購前請閱讀通配指南。",
        ],
      },
      {
        heading: "選購建議",
        bullets: [
          "先確認主機代數",
          "從經典或低涼口味入門",
          "參考 SP2S 32 款口味評測（PodPick Guide）",
          "下單前 LINE 確認庫存",
        ],
        paragraphs: [],
      },
    ],
  },
];

export function getProductEditorial(path: string): ProductEditorial | undefined {
  return editorials.find((e) => e.path === path.split("?")[0]);
}
