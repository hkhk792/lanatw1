import ProductCard from "@/components/landing/ProductCard";
import type { PinkyCatalogItem } from "@/data/pinkyImportedCatalog";
import {
  getPinkyImportedCatalogImage,
  pinkyImportedCatalog,
} from "@/data/pinkyImportedCatalog";
import { getPinkyImportedCatalogOverride } from "@/data/pinkyImportedCatalogOverrides";
import { productPhoto } from "@/lib/productPhotos";
import { AtomizerHostGemini, DiyaPodsShowcase } from "@/lib/responsiveImageVariants.generated";
import type { ResponsiveImageSet } from "@/components/ResponsiveAssetImg";
import { sp2sUniversalPodHeroImage } from "@/data/sp2sUniversalPods";

const IMPORTED_LIST_PRICE = "NT$299";
/** 匯入目錄「拋棄式／大口數」列表價：約九折後取尾數 9（與購物車／詳情頁一致） */
const IMPORTED_DISPOSABLE_LIST_PRICE = "NT$269";

const BRAND_BY_ID_PREFIX: Array<[string, string]> = [
  ["relx-", "RELX"],
  ["ilia-", "ILIA"],
  ["meel-", "meeL"],
  ["max-g-", "MAX-G"],
  ["tutx-", "TUTX"],
  ["luckin-", "Luckin"],
  ["lana-series-", "LANA"],
  ["tokyo-magic-box-", "TOKYO"],
  ["sars-", "SARS"],
  ["ice-bear-", "ICE BEAR"],
  ["tisic-", "TISIC"],
  ["kis5-", "Kis5"],
  ["mehai-", "魅嗨"],
  ["infinity-", "Infinity"],
  ["marbo-", "MARBO"],
  ["obi-", "OBI"],
  ["chill-", "CHILL"],
  ["dot-plus-", "Dot Plus"],
  ["mistx-", "MistX"],
  ["meha-", "MEHA"],
];

type DisplayCard = {
  id: string;
  name: string;
  flavor: string;
  price: string;
  image: string;
  detailHref?: string;
  responsive?: ResponsiveImageSet;
};

type CatalogCategory = PinkyCatalogItem["category"];

const LEGACY_HOST_CARDS: DisplayCard[] = [
  {
    id: "cartoon",
    name: "卡通限量版一代通配主機",
    flavor: "經典工藝系列",
    price: "NT$550",
    image: productPhoto("product-1.webp"),
    detailHref: "/product/cartoon",
  },
  {
    id: "bullet",
    name: "SP2S 思博瑞 一代",
    flavor: "十三色工坊系列",
    price: "NT$450",
    image: productPhoto("product-3.webp"),
    detailHref: "/product/bullet",
  },
  {
    id: "pro",
    name: "SP2S Pro",
    flavor: "八色旗艦 · 智慧感應",
    price: "NT$450",
    image: productPhoto("product-4.webp"),
    detailHref: "/product/pro",
  },
  {
    id: "atomizer",
    name: "原子棒一代通配主機",
    flavor: "綠 · 黑 · 曲線輸出",
    price: "NT$290",
    image: AtomizerHostGemini.src,
    responsive: AtomizerHostGemini,
    detailHref: "/product/atomizer",
  },
  {
    id: "diya",
    name: "DIYA 叮啞霧化桿",
    flavor: "2.5ML 大容量兼容／一代通用",
    price: "NT$320",
    image: productPhoto("product-6.webp"),
    detailHref: "/product/diya",
  },
  {
    id: "disp-vapengin",
    name: "VENUS金星主機",
    flavor: "可充電霧化電子煙主機 · 台灣現貨 · VAPENGIN 2ml Mesh",
    price: "NT$219",
    image: productPhoto("disposable-vapengin-venus.webp"),
    detailHref: "/product/venus-host",
  },
];

const LEGACY_DISPOSABLE_CARDS: DisplayCard[] = [
  {
    id: "disp-hebat",
    name: "HEBAT喜貝六代",
    flavor: "10000口拋棄式一次性電子煙 · 15ml",
    price: "NT$269",
    image: productPhoto("disposable-hebat-hb10000.webp"),
  },
  {
    id: "disp-diya-7500",
    name: "DIYA叮啞拋棄式7500口",
    flavor: "大容量可充電一次性拋棄式電子煙 · 13ml",
    price: "NT$209",
    image: productPhoto("disposable-diya-7500.webp"),
  },
  {
    id: "disp-vapor-storm",
    name: "VAPOR STORM風暴5000口",
    flavor: "拋棄式飛霧發光一次性電子煙桿 · 10ml Mesh",
    price: "NT$229",
    image: productPhoto("disposable-vapor-storm-cf5000.webp"),
  },
];

const LEGACY_POD_CARDS: DisplayCard[] = [
  {
    id: "sp2s-universal-pods",
    name: "SP2S 煙彈",
    flavor: "一代通用 · 32 口味可選",
    price: "NT$280",
    image: sp2sUniversalPodHeroImage(),
  },
  {
    id: "lana-pods",
    name: "lana煙彈",
    flavor: "彈匣系統 · 一代通配",
    price: "NT$220",
    image: productPhoto("product-7.webp"),
    detailHref: "/product/lana-pods",
  },
  {
    id: "diya-pods",
    name: "DIYA 叮啞煙彈",
    flavor: "一盒三入 · 2.5ml／顆 · 一代通用",
    price: "NT$199",
    image: DiyaPodsShowcase.src,
    responsive: DiyaPodsShowcase,
    detailHref: "/product/diya-pods",
  },
  {
    id: "disp-mohoo-box",
    name: "TOKYO MOHOO BOX東京魔盒",
    flavor: "煙彈多種口味 · 12ml · 約 10000 口",
    price: "NT$399",
    image: productPhoto("disposable-mohoo-tokyo.webp"),
    detailHref: "/product/mohoo-tokyo-box",
  },
  {
    id: "showcase-e-liquid",
    name: "電子煙煙油",
    flavor: "鹽尼古丁配方 · 風味層次",
    price: "NT$350",
    image: productPhoto("showcase-e-liquid.webp"),
  },
  {
    id: "sp2s-empty-shell-standard",
    name: "SP2／SP2S 一代空殼（一般版白芯）",
    flavor: "空殼 · 約 2.3ml · NT$35／顆 · 100 顆起拿",
    price: "NT$35",
    image: productPhoto("standard-white-core.png"),
  },
  {
    id: "sp2s-empty-shell-pro",
    name: "SP2S 一代空殼（Pro 版盒裝殼）",
    flavor: "空殼 · 約 2.3ml · NT$35／顆 · 100 顆起拿",
    price: "NT$35",
    image: productPhoto("pro-shell.png"),
  },
  {
    id: "showcase-gear",
    name: "配件",
    flavor: "保護與收納 · 日常搭配",
    price: "NT$120",
    image: productPhoto("showcase-vape-gear.webp"),
  },
];

const SECTION_CONFIG: Array<{
  category: Extract<CatalogCategory, "主機系列" | "拋棄式／大口數系列" | "菸彈／通配系列">;
  eyebrow: string;
  titleMain: string;
  titleSub: string;
  description: string;
}> = [
  {
    category: "菸彈／通配系列",
    eyebrow: "通配與菸彈",
    titleMain: "日常補給。",
    titleSub: "相容快選，口味輪替不設限。",
    description: "通配與菸彈合併成一區，補貨、換口味、找相容型號一次完成。",
  },
  {
    category: "主機系列",
    eyebrow: "主機專區",
    titleMain: "握感即戰力。",
    titleSub: "從經典到旗艦，一上手就對味。",
    description: "老頁精選主機 + 新目錄主機合併陳列，讓你直接按手感、外觀與輸出風格挑到位。",
  },
  {
    category: "拋棄式／大口數系列",
    eyebrow: "一次性專區",
    titleMain: "一口到位。",
    titleSub: "高口數續航，風味一路在線。",
    description: "一次性系列集中展示，從 6K 到 15K 規格連續排版，口味切換更直覺。",
  },
];

function getBrandName(id: string, title: string) {
  const hit = BRAND_BY_ID_PREFIX.find(([prefix]) => id.startsWith(prefix));
  if (hit) return hit[1];
  const token = title.trim().match(/^([A-Za-z0-9-]+)/)?.[1];
  return token || "其他品牌";
}

/** 同品牌連續排列，不另設品牌區塊標題 */
function sortCatalogItemsForGrid(items: readonly PinkyCatalogItem[]): PinkyCatalogItem[] {
  const buckets = items.reduce<Record<string, PinkyCatalogItem[]>>((acc, item) => {
    const brand = getBrandName(item.id, item.title);
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(item);
    return acc;
  }, {});
  const keys = Object.keys(buckets).sort((a, b) => a.localeCompare(b, "zh-Hant"));
  const out: PinkyCatalogItem[] = [];
  for (const k of keys) {
    const arr = buckets[k]!.slice().sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));
    out.push(...arr);
  }
  return out;
}

function buildImportedCardsByCategory(category: CatalogCategory): DisplayCard[] {
  const group = pinkyImportedCatalog.filter((item) => item.category === category);
  const ordered = sortCatalogItemsForGrid(group);
  const defaultListPrice =
    category === "拋棄式／大口數系列" ? IMPORTED_DISPOSABLE_LIST_PRICE : IMPORTED_LIST_PRICE;
  return ordered.map((item) => {
    const override = getPinkyImportedCatalogOverride(item.id);
    const listPrice =
      override?.priceTwd != null ? `NT$${override.priceTwd}` : defaultListPrice;
    return {
      id: item.id,
      name: item.title,
      flavor: getBrandName(item.id, item.title),
      price: listPrice,
      image: getPinkyImportedCatalogImage(item.id),
      detailHref: `/catalog/${item.id}`,
    };
  });
}

/** 首頁「配件」精選卡固定排在該區網格最後一排 */
const LEGACY_ACCESSORY_SHOWCASE_ID = "showcase-gear";

/** 空殼等補貨款：排在匯入目錄之後、配件卡之前 */
const LEGACY_POD_TAIL_IDS = ["sp2s-empty-shell-standard", "sp2s-empty-shell-pro"] as const;

function sortPodSectionCards(legacy: DisplayCard[], imported: DisplayCard[]): DisplayCard[] {
  const tailIdSet = new Set<string>([LEGACY_ACCESSORY_SHOWCASE_ID, ...LEGACY_POD_TAIL_IDS]);
  const tailShells = LEGACY_POD_TAIL_IDS.map((id) => legacy.find((c) => c.id === id)).filter(
    (c): c is DisplayCard => Boolean(c)
  );
  const gear = legacy.filter((c) => c.id === LEGACY_ACCESSORY_SHOWCASE_ID);
  const head = legacy.filter((c) => !tailIdSet.has(c.id));
  return [...head, ...imported, ...tailShells, ...gear];
}

function catalogSectionDomId(
  category: (typeof SECTION_CONFIG)[number]["category"]
): string {
  switch (category) {
    case "主機系列":
      return "home-catalog-host";
    case "拋棄式／大口數系列":
      return "home-catalog-disposable";
    case "菸彈／通配系列":
      return "home-catalog-pods";
    default:
      return "home-catalog";
  }
}

const PinkyImportedSection = () => {
  return (
    <section
      id="home-catalog"
      className="relative scroll-mt-24 border-y hairline py-12 sm:scroll-mt-28 sm:py-24 md:py-36 lg:py-44"
    >
      <div className="container max-sm:px-3">
        <div className="space-y-14 sm:space-y-18 md:space-y-24">
          {SECTION_CONFIG.map((section) => {
            const importedCards = buildImportedCardsByCategory(section.category);
            const cards =
              section.category === "主機系列"
                ? [...LEGACY_HOST_CARDS, ...importedCards]
                : section.category === "拋棄式／大口數系列"
                  ? [...LEGACY_DISPOSABLE_CARDS, ...importedCards]
                  : sortPodSectionCards(LEGACY_POD_CARDS, importedCards);
            if (cards.length === 0) return null;

            return (
              <div
                key={section.category}
                id={catalogSectionDomId(section.category)}
                className="scroll-mt-24 sm:scroll-mt-28"
              >
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <p className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-luxury text-gold sm:text-[10px]">
                    <span className="h-px w-6 bg-gold/60 sm:w-10" />
                    {section.eyebrow}
                  </p>
                  <h3 className="font-serif text-3xl leading-[1.08] sm:text-5xl sm:leading-[1.02] md:text-6xl lg:text-7xl">
                    <span className="text-gradient-gold">{section.titleMain}</span>
                    <br />
                    <span className="italic text-foreground/70">{section.titleSub}</span>
                  </h3>
                  <p className="mt-4 max-w-2xl text-xs leading-relaxed tracking-vogue text-muted-foreground sm:text-sm">
                    {section.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-8 lg:grid-cols-3 lg:gap-12">
                  {cards.map((card, i) => (
                    <ProductCard
                      key={card.id}
                      variant="dense"
                      id={card.id}
                      index={i}
                      image={card.image}
                      name={card.name}
                      flavor={card.flavor}
                      price={card.price}
                      detailHref={card.detailHref}
                      responsive={card.responsive}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PinkyImportedSection;
