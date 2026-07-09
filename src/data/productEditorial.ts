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
  {
    path: "/product/bullet",
    relatedArticleRefs: ["guide:sp2s-compatibility-guide", "compare:lana-vs-sp2s", "blog:lana-xiaomanyao-intro"],
    sections: [
      {
        heading: "SP2S 一代主機（思博瑞）介紹",
        paragraphs: [
          "SP2S 一代主機是思博瑞（SP2S）品牌面向台灣市場的換彈式電子煙入門主機，採一代通配規格，可搭配 SP2S 一代煙彈與二代通用煙彈。機身設計簡潔、即插即用，適合第一次接觸換彈式、或已確定使用 SP2S 生態的使用者。",
          "相較於拋棄式電子煙，換彈式主機可重複充電使用，長期只需更換煙彈，整體成本通常更划算。若您尚未擁有主機、想從 SP2S 品牌開始，一代主機是常見的入門選擇之一。",
          "本站提供台灣現貨配送，支援超商取貨付款。僅限 18 歲（或當地法定年齡）以上使用者選購；下單前建議透過 LINE 客服確認顏色與庫存。",
        ],
      },
      {
        heading: "規格與功能",
        bullets: [
          "品牌：SP2S 思博瑞",
          "規格：一代通配主機",
          "霧化：陶瓷霧化芯（搭配煙彈）",
          "充電：Type-C（依實際包裝標示）",
          "適配：SP2S 一代／二代通用煙彈",
        ],
        paragraphs: [],
      },
      {
        heading: "適配煙彈怎麼選",
        paragraphs: [
          "SP2S 一代主機可搭配本站 SP2S 一代煙彈與 SP2S 二代通用煙彈。二代通用系列口味陣容較大（約 32 種），調香與涼感層次豐富，適合想輪換口味的使用者；一代煙彈則有經典口味可選。",
          "LANA 小蠻腰煙彈同為一代通配規格，多數情況下也可搭配使用，但調香風格與 SP2S 不同。若不確定相容性，請參考 SP2S 通配指南或聯絡客服，避免買錯代數。",
        ],
      },
      {
        heading: "與 LANA 主機的差異",
        paragraphs: [
          "LANA 皮革主機強調質感外觀與皮革機身；SP2S 一代主機則以思博瑞品牌生態與口味陣容為賣點。兩者均為一代通配思路，選購時可依您偏好的煙彈品牌與口味決定主機，而非只看主機外觀。",
          "若您已在 LANA 與 SP2S 之間猶豫，可閱讀 LANA vs SP2S 比較文章，了解調香、通配與長期成本差異。",
        ],
      },
      {
        heading: "誰適合購買？",
        bullets: [
          "第一次購買換彈式主機的入門者",
          "已確定偏好 SP2S 調香與口味",
          "需要與 SP2S 煙彈完整相容",
          "台灣本地配送、超商取貨付款",
        ],
        paragraphs: [],
      },
      {
        heading: "使用與保養",
        paragraphs: [
          "請使用合格充電設備，接口保持乾燥清潔。長期不用時建議存放於陰涼處，避免高溫曝曬。煙彈出現漏油、糊味或風味明顯變淡時應及時更換。更多保存與漏油排查請見選購指南。",
        ],
      },
    ],
  },
  {
    path: "/product/pro",
    relatedArticleRefs: ["guide:sp2s-compatibility-guide", "compare:lana-vs-sp2s", "guide:how-to-pick-flavor"],
    sections: [
      {
        heading: "SP2S Pro 二代旗艦主機介紹",
        paragraphs: [
          "SP2S Pro 是思博瑞（SP2S）品牌的二代旗艦電子煙主機，在一代通配基礎上加入智慧感應、LED 炫彩燈效等進階功能，外觀與手感更偏向進階玩家。可搭配 SP2S 二代通用煙彈，享受約 32 種口味的調香選擇。",
          "若您已使用 SP2S 一代主機一段時間、想升級質感與功能，或一開始就希望入手旗艦款，Pro 是站內 SP2S 主機線的進階選項。台灣現貨配送，僅限成年人選購。",
        ],
      },
      {
        heading: "規格與特色",
        bullets: [
          "系列：SP2S Pro 二代旗艦",
          "功能：智慧感應、LED 燈效",
          "充電：Type-C 快充（依包裝標示）",
          "適配：SP2S 二代通用煙彈",
          "定位：進階換彈式使用者",
        ],
        paragraphs: [],
      },
      {
        heading: "Pro 與一代主機怎麼選",
        paragraphs: [
          "一代主機價格通常較親民，適合入門；Pro 則在感應、燈效與整體質感上更進階。若預算允許且重視使用體驗，Pro 值得考慮；若剛入門換彈式、想先試水溫，一代主機搭配煙彈同樣能滿足日常需求。",
          "無論一代或 Pro，煙彈請選 SP2S 二代通用規格，並於商品頁確認口味庫存。選購前可透過 LINE 客服確認主機顏色與煙彈口味是否有貨。",
        ],
      },
      {
        heading: "適配煙彈與口味",
        paragraphs: [
          "SP2S Pro 建議搭配本站 SP2S 二代通用煙彈，口味涵蓋果味、冰飲、茶系等多種風格。新手可從經典果味或低涼口味入門；偏好清涼者可選冰飲系列。詳細口味挑選可參考如何挑選煙彈口味指南。",
          "請勿強行使用不相容規格的煙彈，以免漏油或霧化不良。不確定時請先詢問客服或閱讀 SP2S 通配指南。",
        ],
      },
      {
        heading: "誰適合購買？",
        bullets: [
          "SP2S 品牌進階玩家、想升級主機",
          "重視 LED 燈效與智慧感應功能",
          "長期換彈式、計劃搭配 SP2S 煙彈",
          "台灣現貨、超商取貨付款",
        ],
        paragraphs: [],
      },
      {
        heading: "保養與售後",
        paragraphs: [
          "請使用合格 Type-C 充電線，避免接口進水。LED 與感應功能若異常，請保留訂單編號聯絡客服。主機與煙彈請分開存放於陰涼乾燥處，延長使用壽命。",
        ],
      },
    ],
  },
  {
    path: "/product/diya-7500",
    relatedArticleRefs: ["blog:diya-review", "blog:disposable-vs-refillable", "guide:how-to-pick-flavor"],
    sections: [
      {
        heading: "DIYA 叮啞 7500 拋棄式介紹",
        paragraphs: [
          "DIYA 叮啞 7500 口拋棄式電子煙是一款免充電、免換彈的一次性產品，標稱約 7500 口大口數，適合出差旅行、短期使用或不想維護主機與煙彈的使用者。開箱即可使用，無需額外配件。",
          "拋棄式與換彈式的核心差異在於便利性與長期成本：拋棄式即開即用、攜帶輕便；換彈式則適合每天使用、希望長期節省煙彈開支的族群。若您不確定哪種適合，可閱讀拋棄式 vs 換彈式比較文章。",
          "本站提供台灣現貨與多種口味選擇（依庫存為準）。僅限 18 歲以上選購；用完請依當地電池回收規範處理，勿隨意丟棄。",
        ],
      },
      {
        heading: "規格摘要",
        bullets: [
          "類型：拋棄式電子煙",
          "標稱口數：約 7500 口（依實際使用而異）",
          "使用方式：即開即用，免充電換彈",
          "口味：多種可選（依庫存）",
          "適合：旅行、偶爾使用、入門體驗",
        ],
        paragraphs: [],
      },
      {
        heading: "什麼情境適合買拋棄式",
        paragraphs: [
          "出差、露營或短期外出時，不想攜帶充電線與備用煙彈；想先體驗不同品牌調香再決定是否入門換彈式；或已有主機但想備一支即開即用的備用機。DIYA 7500 在這些情境下都相當實用。",
          "若您每天大量使用，長期而言換彈式（主機 + 煙彈）通常更經濟。可同時參考 DIYA 評價文章與本站 LANA、SP2S 換彈式商品。",
        ],
      },
      {
        heading: "口味怎麼選",
        paragraphs: [
          "DIYA 系列口味涵蓋果味、冰飲等風格，新手可從熟悉水果味或低涼口味開始。偏好清涼感可選冰飲系；不確定時建議下單前透過 LINE 確認當期庫存與推薦口味。",
          "拋棄式口味選定後無法更換，建議先從小量或單支嘗試，再決定是否回購同系列。",
        ],
      },
      {
        heading: "與 DIYA 換彈式產品的關係",
        paragraphs: [
          "DIYA 品牌除 7500 拋棄式外，本站亦提供 DIYA 霧化桿與 DIYA 通用煙彈等換彈式選項。若您喜歡 DIYA 調香、且使用頻率高，可考慮日後轉換彈式以節省長期成本。",
        ],
      },
      {
        heading: "注意事項",
        bullets: [
          "僅限 18 歲以上成年人",
          "用完請依規範回收電池",
          "避免高溫、擠壓與兒童接觸",
          "口數為標稱值，實際因使用習慣而異",
        ],
        paragraphs: [],
      },
    ],
  },
  {
    path: "/product/hebat-gen6",
    relatedArticleRefs: ["blog:disposable-vs-refillable", "guide:how-to-pick-flavor", "blog:diya-review"],
    sections: [
      {
        heading: "HEBAT 喜貝六代拋棄式介紹",
        paragraphs: [
          "HEBAT 喜貝六代是面向台灣市場的大口數拋棄式電子煙選項，主打即開即用、無需充電與換彈的便利體驗。適合偏好拋棄式、使用頻率較高、或想嘗試喜貝調香的成人使用者。",
          "喜貝系列在口味與霧化表現上各有擁護者；六代為站內拋棄式分類中的主力款式之一。若您已在換彈式與拋棄式之間比較，建議先了解兩者在長期成本與維護上的差異，再依使用習慣選購。",
          "台灣現貨配送，支援超商取貨付款。僅限 18 歲以上選購。",
        ],
      },
      {
        heading: "規格與定位",
        bullets: [
          "品牌：HEBAT 喜貝",
          "系列：六代拋棄式",
          "類型：一次性、免維護",
          "口味：依商品頁與庫存為準",
          "配送：台灣現貨",
        ],
        paragraphs: [],
      },
      {
        heading: "誰適合購買喜貝六代",
        paragraphs: [
          "每天使用、希望一支用到完、不想管理充電與煙彈的使用者；出差旅行需要輕便方案；或想比較喜貝與 DIYA 等不同品牌拋棄式調香。若您使用頻率中等、重視長期成本，換彈式主機搭配煙彈可能更划算。",
          "本站同時提供 LANA、SP2S 換彈式與多款拋棄式，可依情境搭配選購。",
        ],
      },
      {
        heading: "口味與選購建議",
        paragraphs: [
          "選購前請於商品頁確認可選口味，並透過 LINE 客服確認庫存。新手建議從果味或您日常偏好的飲品風味入門；若曾使用其他品牌，可選相近風格降低踩雷機率。",
          "更多口味挑選邏輯請見煙彈口味入門指南（換彈式與拋棄式選味思路相通）。",
        ],
      },
      {
        heading: "使用、保存與回收",
        paragraphs: [
          "請存放於陰涼乾燥處，避免陽光直射與高溫車內長時間放置。使用完畢後請依台灣電池回收規範處理，勿丟入一般垃圾。若出現漏油或異味，應停止使用並聯絡客服。",
        ],
      },
      {
        heading: "與換彈式怎麼選",
        bullets: [
          "拋棄式：便利、免維護、適合旅行或高頻短期使用",
          "換彈式：長期成本較低、口味可靈活更換",
          "可先買拋棄式體驗，再決定是否入門 LANA／SP2S 主機",
        ],
        paragraphs: [],
      },
    ],
  },
  {
    path: "/product/diya-pods",
    relatedArticleRefs: ["blog:diya-review", "guide:sp2s-compatibility-guide", "guide:pod-storage-guide"],
    sections: [
      {
        heading: "DIYA 叮啞通用煙彈介紹",
        paragraphs: [
          "DIYA 叮啞電子煙彈為一代通用規格菸彈，每盒三入裝，可搭配多數一代通配主機使用。口味選擇多元，調香風格與 LANA、SP2S 有所不同，適合已有一代主機、想嘗試叮啞系列或需要備貨替換的使用者。",
          "換彈式使用者的日常開銷主要在煙彈；若您已擁有 LANA 或 SP2S 主機，亦可評估 DIYA 煙彈是否相容，以擴展口味選擇。選購前請確認主機代數與規格，必要時詢問 LINE 客服。",
          "台灣現貨發出，僅限 18 歲以上選購。",
        ],
      },
      {
        heading: "規格與包裝",
        bullets: [
          "包裝：一盒三入",
          "規格：一代通用菸彈",
          "適配：多數一代通配主機",
          "口味：依商品頁選擇（依庫存）",
          "品牌：DIYA 叮啞",
        ],
        paragraphs: [],
      },
      {
        heading: "適配哪些主機",
        paragraphs: [
          "DIYA 煙彈採一代通用規格，可搭配本站 LANA 皮革主機、SP2S 一代主機及多數標示一代通配的主機。不同主機與煙彈組合的緊密度、霧化感受可能略有差異，屬正常現象。",
          "若您使用 SP2S Pro 或其他二代旗艦主機，請優先選購 SP2S 二代通用煙彈，並參考通配指南確認 DIYA 是否適合您的機型。",
        ],
      },
      {
        heading: "與 LANA、SP2S 煙彈的差異",
        paragraphs: [
          "三大品牌均為一代通配思路，但調香、涼度與甜度層次不同：LANA 偏果茶冰飲多元；SP2S 口味陣容大、涼感層次豐富；DIYA 則有自身調香風格。建議可先購一盒三入嘗試，再決定日常備貨品牌。",
          "可閱讀 DIYA 評價與 LANA vs SP2S 比較，建立選購參考。",
        ],
      },
      {
        heading: "保存與更換時機",
        paragraphs: [
          "未開封請置於陰涼乾燥處；開封後盡快使用並直立存放，減少漏油風險。出現糊味、風味明顯變淡、或漏油嚴重時應更換新煙彈。詳細保存技巧請見煙彈保存指南與漏油原因說明。",
        ],
      },
      {
        heading: "誰適合購買",
        bullets: [
          "已有一代通配主機，想嘗試 DIYA 口味",
          "需要備用煙彈、輪換不同品牌調香",
          "台灣現貨、超商取貨付款",
          "成年人、已確認主機相容",
        ],
        paragraphs: [],
      },
    ],
  },
];

export function getProductEditorial(path: string): ProductEditorial | undefined {
  return editorials.find((e) => e.path === path.split("?")[0]);
}
