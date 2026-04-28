import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { BrandSp2s } from "@/components/BrandSp2s";
import ProductCard from "@/components/landing/ProductCard";
import sp2sPodsCatalog from "@/assets/sp2s-gen1-pods-catalog.webp";
import disposableVapengin from "@/assets/disposable-vapengin-venus.webp";
import disposableMohoo from "@/assets/disposable-mohoo-tokyo.webp";
import disposableHebat from "@/assets/disposable-hebat-hb10000.webp";
import disposableDiya from "@/assets/disposable-diya-7500.webp";
import disposableFlare from "@/assets/disposable-flare-nimmbox-go.webp";
import disposableVaporStorm from "@/assets/disposable-vapor-storm-cf5000.webp";
import showcaseGen5Pods from "@/assets/showcase-gen5-pods.webp";
import showcaseELiquid from "@/assets/showcase-e-liquid.webp";
import showcaseVapeGear from "@/assets/showcase-vape-gear.webp";

const highlights = [
  { label: "水果系列", sub: "18 款" },
  { label: "飲品冰爽", sub: "9 款" },
  { label: "茶飲原味", sub: "5 款" },
  { label: "甜品趣味", sub: "4 款" },
];

/** 全品類一覽：與拋棄式區同用 ProductCard（＋、價格、glass） */
const showcaseProducts = [
  {
    id: "showcase-gen5",
    image: showcaseGen5Pods,
    name: "五代煙彈",
    flavor: "換彈系統 · 多口味霧化",
    price: "NT$129",
  },
  {
    id: "showcase-e-liquid",
    image: showcaseELiquid,
    name: "電子煙煙油",
    flavor: "鹽尼古丁配方 · 風味層次",
    price: "NT$350",
  },
  {
    id: "showcase-gear",
    image: showcaseVapeGear,
    name: "配件",
    flavor: "保護與收納 · 日常搭配",
    price: "NT$120",
  },
] as const;

const disposableProducts = [
  {
    image: disposableVapengin,
    name: "VENUS金星主機",
    flavor: "可充電霧化電子煙主機 · 台灣現貨 · VAPENGIN 2ml Mesh",
    price: "現貨",
    id: "disp-vapengin",
  },
  {
    image: disposableMohoo,
    name: "TOKYO MOHOO BOX東京魔盒",
    flavor: "煙彈多種口味 · 12ml · 約 10000 口",
    price: "洽門市",
    id: "disp-mohoo-box",
  },
  {
    image: disposableHebat,
    name: "HEBAT喜貝六代",
    flavor: "10000口拋棄式一次性電子煙 · 15ml",
    price: "洽門市",
    id: "disp-hebat",
  },
  {
    image: disposableDiya,
    name: "DIYA叮啞拋棄式7500口",
    flavor: "大容量可充電一次性拋棄式電子煙 · 13ml",
    price: "洽門市",
    id: "disp-diya-7500",
  },
  {
    image: disposableFlare,
    name: "JUPITER木星套裝6500口",
    flavor: "木星套裝煙彈換彈拋棄式電子煙",
    price: "NT$480",
    id: "disp-jupiter",
  },
  {
    image: disposableVaporStorm,
    name: "VAPOR STORM風暴5000口",
    flavor: "拋棄式飛霧發光一次性電子煙桿 · 10ml Mesh",
    price: "NT$290",
    id: "disp-vapor-storm",
  },
];

const Accessories = () => {
  const ref = useReveal<HTMLDivElement>();
  const cardRef = useReveal<HTMLAnchorElement>();
  const disposableHeadRef = useReveal<HTMLDivElement>();
  const showcaseHeadRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="accessories"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36"
    >
      <div className="container max-w-5xl max-sm:px-3">
        <div ref={ref} className="reveal mx-auto mb-12 max-w-3xl text-center sm:mb-20 md:mb-32">
          <p className="mb-4 flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-luxury text-gold sm:mb-6 sm:gap-3">
            <span className="h-px w-6 shrink-0 bg-gold/60 sm:w-10" />
            <span className="px-1">彈匣系統</span>
            <span className="h-px w-6 shrink-0 bg-gold/60 sm:w-10" />
          </p>
          <h2 className="text-balance px-1 font-serif text-3xl leading-[1.12] tracking-tight sm:text-4xl sm:leading-[1.08] md:text-6xl md:leading-[1.04] lg:text-7xl">
            <span className="text-gradient-gold">
              <BrandSp2s className="font-serif text-inherit" /> 煙彈通用一代，
            </span>
            <br className="max-sm:hidden" />
            <span className="mt-1 block italic text-foreground/70 sm:mt-0 sm:inline">
              陶瓷白芯 · 口味全陣容。
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl px-1 text-[13px] leading-relaxed tracking-vogue text-muted-foreground sm:mt-6 sm:text-sm md:text-base">
            思博瑞一代通用煙彈：白色陶瓷芯霧化細緻，相容多款一代主機；從水果、汽水冰感到茶飲與甜品系，一次瀏覽全口味總覽。
          </p>
        </div>

        <Link
          ref={cardRef}
          to="/product/sp2s-gen1-pods"
          className="reveal group relative block aspect-[10/11] w-full min-h-[16rem] overflow-hidden rounded-sm glass shadow-luxury sm:aspect-[16/10] sm:min-h-0 md:aspect-[16/9]"
        >
          <div className="absolute inset-0 spotlight opacity-70" />
          <img
            src={sp2sPodsCatalog}
            alt="SP2S 思博瑞一代通用煙彈口味總覽"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition-transform duration-[2000ms] ease-luxury group-hover:scale-105 sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/40 to-transparent sm:via-obsidian/30" />

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:inset-x-6 sm:bottom-6 sm:gap-8 md:inset-x-14 md:bottom-14 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 max-w-full sm:max-w-md">
              <h3 className="mb-2 font-serif text-2xl leading-tight text-gradient-gold sm:mb-4 sm:text-4xl md:text-6xl">
                三十六種風味矩陣。
              </h3>
              <p className="text-xs leading-relaxed tracking-vogue text-muted-foreground sm:text-sm md:text-base">
                水果、飲品與冰爽、茶飲與原味、甜品與趣味四大系列；常見 3%
                尼古丁鹽（以包裝為準）。點擊進入規格、分區口味與購買說明。
              </p>
            </div>

            <span className="inline-flex min-h-[48px] w-full items-center justify-center gap-3 self-stretch bg-gradient-gold px-6 py-3.5 text-[11px] font-medium uppercase tracking-luxury text-primary-foreground transition-all duration-500 group-hover:shadow-gold sm:w-auto sm:self-start sm:px-8 sm:py-4 md:self-auto">
              查看口味詳情
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:mt-16 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 md:gap-10">
          {highlights.map((h) => (
            <div key={h.label} className="flex min-w-0 flex-col items-center gap-1 text-center sm:min-w-[7rem]">
              <span className="text-[9px] uppercase leading-tight tracking-luxury text-gold sm:text-[10px]">{h.label}</span>
              <span className="font-serif text-xl text-foreground/90 sm:text-2xl">{h.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="one-time-disposables" className="container mt-32 max-sm:px-3 md:mt-44 scroll-mt-32">
        <div
          ref={disposableHeadRef}
          className="reveal mb-10 flex flex-col justify-between gap-4 sm:mb-16 sm:gap-8 md:mb-24 md:flex-row md:items-end lg:mb-36"
        >
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-luxury text-gold sm:mb-6 sm:gap-3 sm:text-[10px]">
              <span className="h-px w-6 bg-gold/60 sm:w-10" />
              拋棄式系列
            </p>
            <h2 className="font-serif text-3xl leading-[1.08] sm:text-5xl sm:leading-[1.02] md:text-6xl lg:text-7xl">
              <span className="text-gradient-gold">一次性拋棄式。</span>
              <br />
              <span className="italic text-foreground/70">對細節的一種執著。</span>
            </h2>
          </div>
          <p className="text-xs leading-relaxed tracking-vogue text-muted-foreground sm:text-sm md:max-w-sm">
            即拋即走同樣講究霧化曲線與外觀完成度；規格以包裝與實際到貨為準，價格請洽門市或客服。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-8 lg:grid-cols-3 lg:gap-12">
          {disposableProducts.map((p, i) => (
            <ProductCard key={p.id} variant="dense" {...p} index={i} />
          ))}
        </div>
      </div>

      <div id="pods-liquid-gear" className="container mt-32 max-sm:px-3 md:mt-44 scroll-mt-32">
        <div
          ref={showcaseHeadRef}
          className="reveal mx-auto mb-10 max-w-2xl text-center sm:mb-16 md:mb-24"
        >
          <p className="mb-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-luxury text-gold sm:mb-6 sm:gap-3 sm:text-[10px]">
            <span className="h-px w-6 bg-gold/60 sm:w-10" />
            全品類一覽
            <span className="h-px w-6 bg-gold/60 sm:w-10" />
          </p>
          <h2 className="font-serif text-3xl leading-[1.1] sm:text-4xl sm:leading-[1.05] md:text-5xl lg:text-6xl">
            <span className="text-gradient-gold">煙彈、煙油與周邊。</span>
            <br />
            <span className="italic text-foreground/70">同一套品質語言。</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed tracking-vogue text-muted-foreground sm:mt-6 sm:text-sm md:text-base">
            從五代換彈到鹽尼古丁煙油，再到保護與收納；門市與線上可一併諮詢現貨與規格。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-8 lg:grid-cols-3 lg:gap-12">
          {showcaseProducts.map((p, i) => (
            <ProductCard key={p.id} variant="dense" {...p} index={i + 6} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
