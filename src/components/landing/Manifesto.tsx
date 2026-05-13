import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { BrandSp2s } from "@/components/BrandSp2s";
import { cn } from "@/lib/utils";
import {
  sp2sPodFlavorGuideContent,
  SP2S_POD_FLAVOR_GUIDE_ROUTE,
} from "@/data/sp2sPodFlavorGuideContent";
import {
  lanavapNews10Content,
  DIY_E_LIQUID_GUIDE_ROUTE,
  lanavapHomeTeaser,
} from "@/data/lanavapNews10Content";
import {
  airportVapeArticleContent,
  AIRPORT_VAPE_ARTICLE_ROUTE,
  airportVapeHomeTeaser,
} from "@/data/airportVapeArticleContent";

const stats = [
  { v: "2.5", u: "ml 容量" },
  { v: "380", u: "mAh 電池" },
  { v: "8W", u: "功率輸出" },
  { v: "25", u: "經典外觀" },
];

const Manifesto = () => {
  const ref = useReveal<HTMLDivElement>();
  const infoRef = useReveal<HTMLDivElement>();
  return (
    <section
      id="manifesto"
      className="relative scroll-mt-24 border-y hairline py-16 sm:scroll-mt-28 sm:py-24 md:py-44 lg:py-60"
    >
      <div className="absolute inset-0 spotlight opacity-30 pointer-events-none" />
      <div className="container relative max-sm:px-3">
        <div ref={infoRef} className="reveal mx-auto mb-12 max-w-5xl sm:mb-16 md:mb-28">
          <p className="mb-3 text-center text-[10px] uppercase tracking-luxury text-gold sm:mb-4">
            — SP2S電子煙資訊 —
          </p>
          <p className="mx-auto mb-2 max-w-2xl text-center text-[13px] leading-relaxed tracking-vogue text-muted-foreground sm:text-sm">
            三則皆為獨立讀物：煙彈實測、DIY 知識與機場旅行須知；版面一致，點入即可讀全文。
            <BrandSp2s className="font-serif text-sm text-muted-foreground" />
            僅作品牌脈絡，規定仍以現場與法規為準。
          </p>
          <p className="mb-8 text-center text-[11px] leading-snug text-muted-foreground/80 sm:mb-12 sm:text-xs md:mb-16">
            圖文僅作風格展示；實際規格與庫存以現場為準（僅供 20 歲以上使用者參考）。
          </p>

          <div className="space-y-10 sm:space-y-14 md:space-y-20">
            <Link
              to={SP2S_POD_FLAVOR_GUIDE_ROUTE}
              id="sp2s-pod-flavor-guide"
              aria-label={`閱讀：${sp2sPodFlavorGuideContent.title}`}
              className={cn(
                "group/card flex flex-col gap-6 sm:gap-8 md:gap-10 md:items-center md:flex-row",
                "rounded-sm border border-transparent -m-1 p-1 md:-m-2 md:p-2",
                "outline-none transition-colors duration-500",
                "hover:border-gold/20 hover:bg-gold/[0.02] focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-sm border border-gold/10 bg-card/20 shrink-0",
                  "w-full md:w-[min(100%,18rem)] lg:w-[20rem]",
                  "flex min-h-[160px] items-center justify-center p-2 sm:min-h-[200px] sm:p-3 md:min-h-[220px]"
                )}
              >
                <img
                  src={sp2sPodFlavorGuideContent.heroImage}
                  alt=""
                  loading="lazy"
                  className="max-h-[min(32vh,16rem)] w-full object-contain object-center sm:max-h-[min(40vh,22rem)]"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col text-left justify-center">
                <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">
                  {sp2sPodFlavorGuideContent.eyebrow}
                </p>
                <span className="h-px w-12 bg-gold/30 mb-4" aria-hidden />
                <h3 className="font-serif text-xl sm:text-2xl md:text-[1.65rem] text-gradient-gold leading-snug mb-2 group-hover/card:text-gold transition-colors">
                  {sp2sPodFlavorGuideContent.title}
                </h3>
                <p className="text-xs text-muted-foreground/90 mb-4">
                  日期：{sp2sPodFlavorGuideContent.date}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed tracking-vogue mb-6">
                  {sp2sPodFlavorGuideContent.intro[0]}
                </p>
                <span className="inline-flex w-fit items-center gap-2.5 text-[11px] uppercase tracking-luxury text-gold transition-colors group-hover/card:text-gold/95">
                  閱讀完整實測指南
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold transition-transform duration-500 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:border-gold/50"
                    aria-hidden
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            </Link>

            <Link
              to={DIY_E_LIQUID_GUIDE_ROUTE}
              id="diy-e-liquid-guide"
              aria-label={`閱讀：${lanavapHomeTeaser.title}`}
              className={cn(
                "group/card flex flex-col gap-6 sm:gap-8 md:gap-10 md:items-center md:flex-row-reverse",
                "rounded-sm border border-transparent -m-1 p-1 md:-m-2 md:p-2",
                "outline-none transition-colors duration-500",
                "hover:border-gold/20 hover:bg-gold/[0.02] focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-sm border border-gold/10 bg-card/20 shrink-0",
                  "w-full md:w-[min(100%,18rem)] lg:w-[20rem]",
                  "flex min-h-[160px] items-center justify-center p-2 sm:min-h-[200px] sm:p-3 md:min-h-[220px]"
                )}
              >
                <img
                  src={lanavapNews10Content.heroImage}
                  alt=""
                  loading="lazy"
                  className="max-h-[min(32vh,16rem)] w-full object-contain object-center sm:max-h-[min(40vh,22rem)]"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col text-left justify-center">
                <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">
                  {lanavapHomeTeaser.eyebrow}
                </p>
                <span className="h-px w-12 bg-gold/30 mb-4" aria-hidden />
                <h3 className="font-serif text-xl sm:text-2xl md:text-[1.65rem] text-gradient-gold leading-snug mb-2 group-hover/card:text-gold transition-colors">
                  {lanavapHomeTeaser.title}
                </h3>
                <p className="text-xs text-muted-foreground/90 mb-4">
                  日期：{lanavapNews10Content.date}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed tracking-vogue mb-6">
                  {lanavapHomeTeaser.teaser}
                </p>
                <span className="inline-flex w-fit items-center gap-2.5 text-[11px] uppercase tracking-luxury text-gold transition-colors group-hover/card:text-gold/95">
                  閱讀完整內文
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold transition-transform duration-500 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:border-gold/50"
                    aria-hidden
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            </Link>

            <Link
              to={AIRPORT_VAPE_ARTICLE_ROUTE}
              id="airport-vaping-guide"
              aria-label={`閱讀：${airportVapeHomeTeaser.title}`}
              className={cn(
                "group/card flex flex-col gap-6 sm:gap-8 md:gap-10 md:items-center md:flex-row",
                "rounded-sm border border-transparent -m-1 p-1 md:-m-2 md:p-2",
                "outline-none transition-colors duration-500",
                "hover:border-gold/20 hover:bg-gold/[0.02] focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-sm border border-gold/10 bg-card/20 shrink-0",
                  "w-full md:w-[min(100%,18rem)] lg:w-[20rem]",
                  "flex min-h-[160px] items-center justify-center p-2 sm:min-h-[200px] sm:p-3 md:min-h-[220px]"
                )}
              >
                <img
                  src={airportVapeArticleContent.heroImage}
                  alt=""
                  loading="lazy"
                  className="max-h-[min(32vh,16rem)] w-full object-contain object-center sm:max-h-[min(40vh,22rem)]"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col text-left justify-center">
                <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">
                  {airportVapeHomeTeaser.eyebrow}
                </p>
                <span className="h-px w-12 bg-gold/30 mb-4" aria-hidden />
                <h3 className="font-serif text-xl sm:text-2xl md:text-[1.65rem] text-gradient-gold leading-snug mb-2 group-hover/card:text-gold transition-colors">
                  {airportVapeHomeTeaser.title}
                </h3>
                <p className="text-xs text-muted-foreground/90 mb-4">
                  日期：{airportVapeArticleContent.date}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed tracking-vogue mb-6">
                  {airportVapeHomeTeaser.teaser}
                </p>
                <span className="inline-flex w-fit items-center gap-2.5 text-[11px] uppercase tracking-luxury text-gold transition-colors group-hover/card:text-gold/95">
                  閱讀完整內文
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold transition-transform duration-500 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:border-gold/50"
                    aria-hidden
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div ref={ref} className="reveal mx-auto max-w-4xl px-1 text-center sm:px-0">
          <p className="mb-6 text-[10px] uppercase tracking-luxury text-gold sm:mb-8">— 品牌宣言 —</p>
          <h2 className="font-serif text-[1.65rem] leading-[1.2] sm:text-4xl sm:leading-[1.15] md:text-6xl lg:text-7xl md:leading-[1.15]">
            <span className="text-gradient-gold">"我們不以單品堆砌標籤。</span><br />
            我們打造 <span className="italic text-foreground/70">時刻</span> — 精心構思，縝密考量，
            <span className="text-gradient-gold"> 難以忘懷。"</span>
          </h2>
          <p className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-1 text-sm uppercase tracking-luxury text-muted-foreground sm:mt-12">
            — <BrandSp2s className="font-serif text-sm tracking-luxury text-muted-foreground" /> 工坊
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px bg-gold/15 sm:mt-24 md:mt-36 lg:mt-40 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.u}
              className="bg-background p-5 text-center transition-colors duration-500 group hover:bg-card sm:p-8 md:p-14"
            >
              <p className="font-serif text-4xl text-gradient-gold transition-transform duration-500 group-hover:scale-105 sm:text-5xl md:text-6xl">
                {s.v}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-luxury text-muted-foreground sm:mt-4 sm:text-[10px]">
                {s.u}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
