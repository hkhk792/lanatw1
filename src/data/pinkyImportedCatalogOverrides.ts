// Hand-edited per-item overrides for匯入產品目錄條目。
// 不會被 scripts/gen-pinky-phpstack-flavors.mjs 覆寫；如需新增覆寫請直接編輯本檔。

export type PinkyImportedCatalogOverride = {
  /** 覆寫單價（TWD）。未填則沿用 PinkyImportedCatalogDetailPage 的預設規則。 */
  priceTwd?: number;
  /**
   * 完整覆寫規格選項清單（取代 cloudways flavors）。
   * 適用於主機系列等以「顏色／款式」而非「口味」呈現的條目。
   */
  variants?: readonly string[];
  /** 規格標籤（例如「顏色：」、「款式：」）。未填則沿用「口味／規格：」。 */
  variantLabel?: string;
  /** 詳情頁主圖下方簡介（來源：Cloudways 等） */
  summary?: string;
  /** 詳情頁「產品描述」段落 */
  description?: string;
  /** 詳情頁要點列表（標題 + 條目） */
  highlights?: ReadonlyArray<{ title: string; items: readonly string[] }>;
  /** 詳情頁規格表 [標籤, 值] */
  specs?: ReadonlyArray<readonly [string, string]>;
};

export const pinkyImportedCatalogOverrides: Record<string, PinkyImportedCatalogOverride> = {
  // Luckin 一代通用系列：主機本體，以顏色／款式為選項
  "luckin-gen1": {
    priceTwd: 780,
    variantLabel: "顏色／款式：",
    variants: [
      "幻影粉",
      "魔力紫",
      "仙境綠",
      "皓月白",
      "寂靜灰",
      "夜月黑",
      "烈焰紅",
      "香檳金",
      "公主粉",
      "蒼墨綠",
      "雕刻銀",
      "雕刻金",
      "海綿寶寶",
      "蠟筆小新綠",
      "蠟筆小新黃",
      "哪吒",
      "哆啦A夢",
      "Hello Kitty",
      "史迪奇",
      "拉布布-綠葡萄",
      "拉布布-大首領",
      "拉布布-荔枝莓莓",
    ],
  },
  // LANA系列主機（Cloudways 匯入）
  "lana-series-host": {
    priceTwd: 390,
    variantLabel: "顏色／款式：",
    variants: [
      "浩瀚藍",
      "LANA通用主機-珍珠白",
      "LANA通用主機-曜石黑",
      "LANA通用主機-潘多拉紫",
      "LANA通用主機-冰川藍",
      "LANA通用主機-黑武士",
    ],
  },
  // ILIA系列主機（Cloudways 匯入）
  "ilia-series-host": {
    priceTwd: 495,
    variantLabel: "顏色／款式：",
    variants: [
      "主機櫻落金粉",
      "主機黎霧青山",
      "主機星辰銀灰",
      "主機騎士黑",
      "主機初雪白",
      "主機寶寶藍",
      "主機寶寶粉",
      "主機夢幻紫晶",
      "主機天空之境",
      "皮革主機愛馬仕橙",
      "皮革主機古馳綠",
      "皮革主機慕雪白",
      "皮革主機魅影黑",
      "皮革主機櫻花粉",
      "皮革主機銀河灰",
      "布紋主機布紋黑",
      "布紋主機布紋灰",
      "布紋主機布紋粉",
      "布紋主機布紋綠",
      "布紋主機布紋藍",
      "布紋主機奶油紫",
      "布紋主機奶油藍",
      "布紋主機牛仔藍",
    ],
  },
  // ILIA五代主機（Cloudways 匯入）
  "ilia-gen5-host": {
    priceTwd: 585,
    variantLabel: "顏色／款式：",
    variants: ["霜月白", "霞光粉", "星河藍", "魅影灰", "耀巖黑"],
  },
  // 東京魔盒主機（Cloudways 匯入）
  "tokyo-magic-box-host": {
    priceTwd: 499,
    variantLabel: "顏色／款式：",
    variants: [
      "深邃夜黑",
      "白",
      "灰石古藍",
      "碧波青藍",
      "冰川灣藍",
      "岩石蒼綠",
      "王者紫晶",
      "紫羅蘭霧",
      "夢幻粉紫",
      "淺茶微棕",
      "璀璨玫瑰紅",
      "金色深紅夕陽",
      "藍海微瀾",
      "薰衣草霜",
    ],
    summary:
      "SP2魔盒主機通配東京是專為電子菸愛好者設計的頂級電子菸產品，搭載 500mAh 大電量電池，搭配創新 MESH 鋼網棉霧化芯；搭配 12ml 大容量 MOHOO 煙彈可輕鬆吸食高達約 10,000 口。獨創小螢幕即時顯示電量，鋁合金輕巧機身、扁平吸嘴，煙霧飽滿濃郁、不漏油不燒焦；超過 20 種口味可選涼版或不涼版。",
    description:
      "SP2魔盒主機通配東京輕巧鋁合金機身握感時尚，500mAh 大電量可支撐整日使用，獨創小螢幕隨時顯示電量。搭配 12ml 超大容量 MOHOO 煙彈與 MESH 鋼網棉芯，單顆煙彈即可享有萬口級續航，煙霧飽滿順滑。超過 20 種口味從清涼水果到濃郁菸草任選，忙碌上班族或夜生活族群出門旅行、派對聚會都適合；扁平吸嘴舒適，霧化細膩一口接一口。",
    highlights: [
      {
        title: "核心規格",
        items: [
          "電池：500mAh 大電量，小螢幕即時顯示電量",
          "煙彈：12ml 大容量 MOHOO 煙彈，參攷約 10,000 口",
          "霧化：創新 MESH 鋼網棉芯，飽滿順滑、不漏油不燒焦",
          "機身：鋁合金輕巧設計，扁平吸嘴舒適唇感",
        ],
      },
      {
        title: "口味與款式",
        items: [
          "主機 14 色可選（深邃夜黑、白、灰石古藍等）",
          "煙彈超過 20 種口味，涼版／不涼版可選",
          "可搭配 MOHOO BOX 系列煙彈輪替使用",
        ],
      },
    ],
    specs: [
      ["商品名稱", "SP2魔盒主機通配東京"],
      ["產品編號", "TOKYO-DEVICE-001"],
      ["分類", "主機"],
      ["電池", "500mAh"],
      ["煙彈容量", "12ml（MOHOO 煙彈另購）"],
      ["參攷口數", "約 10,000 口（依煙彈口味與使用習慣而異）"],
      ["參攷價格", "NT$499"],
    ],
  },
  // RELX悅刻幻影五代主機
  "relx-phantom-gen5-host": {
    priceTwd: 845,
  },
  // RELX悅刻六代 Infinity Pro 2 主機
  "relx-infinity-pro2-host": {
    priceTwd: 845,
  },
  // RELX六代菸彈（Cloudways 匯入）
  "relx-gen6-pods": {
    priceTwd: 160,
    variants: [
      "極凉青提",
      "勁爽薄荷",
      "零度薄荷",
      "熱情番石榴",
      "清涼西瓜",
      "勁涼觀音",
      "勁涼龍井",
      "極涼青檸",
      "勁涼檸檬紅茶",
      "冰爽紅茶",
      "老冰棍",
      "荔枝",
      "綠豆",
      "綠茶",
      "洛神花茶",
      "蜜桃",
      "沙士汽水",
      "芒果",
      "可樂冰",
      "混合莓果",
      "葡萄",
      "蜜桃烏龍茶",
      "經典菸草",
      "藍莓",
      "覆盆子冰",
      "菠蘿",
    ],
  },
  // 哩亞四代拋棄式（Cloudways 匯入）
  "ilia-gen4-6500": {
    priceTwd: 320,
    variants: [
      "葡萄",
      "青葡萄",
      "百香果",
      "薄荷",
      "芭樂",
      "西瓜",
      "荔枝",
      "可樂",
      "芒果",
      "藍莓",
      "蜜桃",
      "蘋果",
      "老冰棍",
      "鐵觀音",
      "哈密瓜",
      "沙士",
      "龍井",
      "雪碧",
      "檸檬海鹽",
      "蘇打",
      "養樂多",
      "冬瓜檸檬",
      "烏龍綠茶",
      "冰爆葡萄柚",
    ],
  },
  // CHILL拋棄式8800口（Cloudways 匯入）
  "chill-disposable-8800": {
    priceTwd: 499,
  },
  // Kis5一代主機（Cloudways 匯入）
  "kis5-gen1": {
    priceTwd: 499,
  },
  // Kis5拋棄式6500口（Cloudways 匯入）
  "kis5-disposable-6500": {
    priceTwd: 299,
  },
  // Dot Plus 8000（Cloudways 匯入）
  "dot-plus-8000": {
    priceTwd: 330,
  },
  // MARBO 9000口（Cloudways 匯入）
  "marbo-9000": {
    priceTwd: 399,
  },
  // OBI拋棄式（Cloudways 匯入）
  "obi-disposable-8000": {
    priceTwd: 455,
    variants: [
      "葡萄冰",
      "青提",
      "葡萄百香果",
      "百香果",
      "薄荷",
      "芭樂",
      "西瓜",
      "荔枝",
      "可樂",
      "芒果",
      "藍莓",
      "蜜桃",
      "青蘋果",
      "老冰棍",
      "鐵觀音",
      "哈密瓜",
      "莓果",
      "沙士",
      "蜜桃烏龍",
      "雪碧",
      "檸檬海鹽",
      "草莓",
      "可爾必思",
      "奇異果",
      "櫻花",
      "七星",
    ],
  },
  // TISIC新版 黑騎士/萌貓派對（Cloudways 匯入）
  "tisic-black-cat": {
    priceTwd: 420,
  },
  // MISTX 鴨嘴獸拋棄式（Cloudways 匯入）
  "mistx-6500": {
    priceTwd: 495,
    variants: [
      "葡萄",
      "百香果",
      "薄荷",
      "芭樂",
      "西瓜",
      "荔枝",
      "可樂",
      "芒果",
      "藍莓",
      "蜜桃烏龍",
      "鐵觀音",
      "莓果",
      "沙士",
      "龍井",
      "草莓",
      "檸檬",
      "白葡萄",
      "寶礦力",
      "椰子水",
      "冬瓜檸檬",
    ],
  },
};

export const getPinkyImportedCatalogOverride = (
  id: string | undefined
): PinkyImportedCatalogOverride | null => {
  if (!id) return null;
  return pinkyImportedCatalogOverrides[id] ?? null;
};
