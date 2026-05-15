import { pinkyImportedCatalog } from "@/data/pinkyImportedCatalog";

export type SiteSearchEntry = {
  id: string;
  title: string;
  href: string;
  category: string;
  /** 小寫關鍵字（品名＋分類）供模糊搜尋 */
  keywords: string;
};

function makeEntry(id: string, title: string, href: string, category: string): SiteSearchEntry {
  return {
    id,
    title,
    href,
    category,
    keywords: `${title} ${category}`.toLowerCase(),
  };
}

/** 首頁精選／常用商品頁（與購物車可下單品項對齊） */
const SITE_EXTRA_ENTRIES: readonly { id: string; title: string; href: string; category: string }[] = [
  { id: "sp2s-universal-pods", title: "SP2S 煙彈（一代通用·多口味）", href: "/product/sp2s-universal-pods", category: "菸彈" },
  { id: "lana-pods", title: "LANA／lana 煙彈", href: "/product/lana-pods", category: "菸彈" },
  { id: "diya-pods", title: "DIYA 叮啞煙彈", href: "/product/diya-pods", category: "菸彈" },
  { id: "sp2s-gen1-pods", title: "SP2S 一代煙彈", href: "/product/sp2s-gen1-pods", category: "菸彈" },
  { id: "bullet", title: "SP2S 思博瑞一代主機", href: "/product/bullet", category: "主機" },
  { id: "pro", title: "SP2S Pro 主機", href: "/product/pro", category: "主機" },
  { id: "cartoon", title: "卡通限量一代通配主機", href: "/product/cartoon", category: "主機" },
  { id: "atomizer", title: "原子棒一代通配主機", href: "/product/atomizer", category: "主機" },
  { id: "diya", title: "DIYA 叮啞霧化桿", href: "/product/diya", category: "主機" },
  { id: "disp-vapengin", title: "VENUS 金星主機", href: "/product/venus-host", category: "主機" },
  { id: "disp-mohoo-box", title: "TOKYO MOHOO BOX 東京魔盒", href: "/product/mohoo-tokyo-box", category: "拋棄式" },
  { id: "disp-hebat", title: "HEBAT 喜貝六代", href: "/product/hebat-gen6", category: "拋棄式" },
  { id: "disp-diya-7500", title: "DIYA 拋棄式 7500 口", href: "/product/diya-7500", category: "拋棄式" },
  { id: "disp-vapor-storm", title: "VAPOR STORM 風暴 5000 口", href: "/product/vapor-storm-5000", category: "拋棄式" },
  { id: "showcase-e-liquid", title: "LANA 煙油 30ml", href: "/product/lana-e-liquid-30ml", category: "煙油" },
  { id: "showcase-gear", title: "SP2S 矽膠保護套／掛繩", href: "/product/sp2s-silicone-sleeve", category: "配件" },
  {
    id: "sp2s-empty-shell-standard",
    title: "SP2／SP2S 一代空殼（一般版白芯）",
    href: "/product/sp2s-empty-shell-standard",
    category: "空殼",
  },
  { id: "sp2s-empty-shell-pro", title: "SP2S 一代空殼（Pro 版盒裝殼）", href: "/product/sp2s-empty-shell-pro", category: "空殼" },
];

let cached: SiteSearchEntry[] | null = null;

export function getSiteSearchEntries(): SiteSearchEntry[] {
  if (!cached) {
    cached = [
      ...SITE_EXTRA_ENTRIES.map((e) => makeEntry(`site-${e.id}`, e.title, e.href, e.category)),
      ...pinkyImportedCatalog.map((p) =>
        makeEntry(`pinky-${p.id}`, p.title, `/catalog/${p.id}`, p.category)
      ),
    ];
  }
  return cached;
}

const MAX_RESULTS = 40;

export function filterSiteSearch(query: string): SiteSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = getSiteSearchEntries();
  const hits = all.filter((e) => e.keywords.includes(q));
  return hits.slice(0, MAX_RESULTS);
}
