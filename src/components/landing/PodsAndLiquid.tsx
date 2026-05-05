import type { ReactNode, Ref } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { BrandSp2s } from "@/components/BrandSp2s";
import type { ResponsiveImageSet } from "@/components/ResponsiveAssetImg";
import { ResponsiveAssetImg } from "@/components/ResponsiveAssetImg";
import { cn } from "@/lib/utils";
import p7 from "@/assets/product-7.webp";
import { DiyaPodsShowcase } from "@/lib/responsiveImageVariants.generated";

interface Feature {
  image: string;
  eyebrow: string;
  title: string;
  desc: ReactNode;
  /** 首頁卡片上醒目顯示的售價 */
  price: string;
  specs: string[];
  /** 內部路由，例如 /product/lana-pods；未設定則為 # */
  to?: string;
  responsive?: ResponsiveImageSet;
  responsiveSizes?: string;
}

const cardShell = cn(
  "reveal group relative block cursor-pointer overflow-hidden glass transition-shadow duration-700 hover:shadow-gold",
  "max-lg:flex max-lg:h-auto max-lg:min-h-0 max-lg:flex-col max-lg:aspect-auto",
  "lg:aspect-[5/6]"
);

const FeatureCard = ({ f, i }: { f: Feature; i: number }) => {
  const cardRef = useReveal<HTMLAnchorElement>();

  /** 金色價格：錨定在圖片容器內，避免手機版整卡 absolute 右下角壓到下方規格標籤 */
  const priceCorner = (
    <span
      className={cn(
        "pointer-events-none absolute z-[12] rounded-sm border border-gold/30",
        "bg-obsidian/80 px-2 py-1 font-sans text-sm font-medium tabular-nums text-gold shadow-sm backdrop-blur-sm",
        "bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 sm:px-2.5 sm:py-1 sm:text-base",
        "lg:bottom-6 lg:right-6 lg:px-3 lg:py-1.5 lg:text-lg"
      )}
    >
      {f.price}
    </span>
  );

  const imageBlock = (
    <div
      className={cn(
        "relative w-full max-lg:aspect-[3/4] max-lg:shrink-0 overflow-hidden",
        "lg:absolute lg:inset-0"
      )}
    >
      <div className="absolute inset-0 opacity-50 transition-opacity duration-700 spotlight group-hover:opacity-100" />
      {f.responsive ? (
        <ResponsiveAssetImg
          set={f.responsive}
          sizes={f.responsiveSizes ?? "(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 50vw"}
          alt={`${f.title} — ${f.eyebrow}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-luxury group-hover:scale-105"
        />
      ) : (
        <img
          src={f.image}
          alt={`${f.title} — ${f.eyebrow}`}
          loading="lazy"
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-luxury group-hover:scale-105"
        />
      )}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent transition-opacity",
          "max-lg:opacity-0",
          "lg:opacity-100"
        )}
      />

      <div className="absolute right-3 top-3 z-10 flex w-[calc(100%-1.5rem)] max-lg:items-start max-lg:justify-end lg:top-6 lg:right-6 lg:left-6 lg:justify-between">
        <span
          className={cn(
            "max-lg:hidden",
            "text-[10px] font-normal uppercase tracking-luxury text-gold"
          )}
        >
          0{i + 1} · {f.eyebrow}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full text-gold/80 shadow-sm transition-all duration-500 max-lg:glass-strong max-lg:h-8 max-lg:w-8 lg:glass-strong lg:h-10 lg:w-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold">
          <ArrowUpRight className="h-3.5 w-3.5 max-lg:h-3 max-lg:w-3 lg:h-4 lg:w-4" />
        </span>
      </div>

      {/** 價格錨定在圖片區內：避免手機版下圖文區與 absolute 右下角重疊 */}
      {priceCorner}
    </div>
  );

  const textBlockLg = (
    <div className="max-lg:hidden absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10 z-[1] pr-24 md:pr-28">
      <h3 className="mb-3 whitespace-nowrap font-serif text-3xl leading-tight tracking-tight text-gradient-gold md:mb-4 md:text-4xl lg:text-5xl">
        {f.title}
      </h3>
      <p className="mb-4 max-w-md text-sm leading-relaxed tracking-vogue text-muted-foreground md:mb-6 md:text-base">
        {f.desc}
      </p>
      <ul className="flex flex-wrap gap-2">
        {f.specs.map((s) => (
          <li
            key={s}
            className="hairline border px-3 py-2 text-[10px] font-normal uppercase tracking-luxury text-foreground/80"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );

  const textBlockSm = (
    <div className="z-[2] border-t border-gold/10 bg-card/50 p-2.5 max-lg:block lg:hidden">
      <p className="mb-1.5 text-[8px] font-normal uppercase tracking-luxury text-gold/90">
        0{i + 1} · {f.eyebrow}
      </p>
      <h3 className="mb-1.5 whitespace-nowrap font-serif text-xs leading-tight tracking-tight text-gradient-gold min-[400px]:text-sm sm:text-base">
        {f.title}
      </h3>
      <p className="mb-2 line-clamp-3 text-[10px] leading-snug text-muted-foreground min-[400px]:text-[11px] min-[400px]:leading-relaxed sm:line-clamp-4 sm:text-xs">
        {f.desc}
      </p>
      <ul className="flex flex-wrap gap-1">
        {f.specs.map((s) => (
          <li
            key={s}
            className="border border-gold/15 hairline bg-background/20 px-1.5 py-0.5 text-[7px] font-normal uppercase tracking-luxury text-foreground/85 min-[400px]:px-2 min-[400px]:py-1 min-[400px]:text-[8px]"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );

  const children = (
    <>
      {imageBlock}
      {textBlockLg}
      {textBlockSm}
    </>
  );

  if (f.to) {
    return (
      <Link
        ref={cardRef as Ref<HTMLAnchorElement>}
        to={f.to}
        className={cardShell}
        style={{ transitionDelay: `${i * 120}ms` }}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      ref={cardRef}
      href="#"
      className={cardShell}
      style={{ transitionDelay: `${i * 120}ms` }}
    >
      {children}
    </a>
  );
};

const features: Feature[] = [
  {
    image: p7,
    eyebrow: "彈匣系統",
    title: "lana煙彈",
    desc: (
      <>
        為穩定蒸氣一致性而設計的彈匣。與所有 <BrandSp2s className="inline font-serif text-inherit" /> 陶瓷芯硬體相容。
      </>
    ),
    price: "NT$220",
    specs: ["lana 3 顆裝", "一代通配"],
    to: "/product/lana-pods",
  },
  {
    image: DiyaPodsShowcase.src,
    eyebrow: "叮啞系列",
    title: "DIYA 叮啞煙彈",
    desc: "一代通用、一盒三入；每顆 2.5ml，相容 RELX 一代、SP2S、LANA 等多款主機，口味陣容完整。",
    price: "NT$199",
    specs: ["一盒三入", "2.5ml／顆", "一代通用"],
    to: "/product/diya-pods",
    responsive: DiyaPodsShowcase,
    responsiveSizes: "(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 50vw",
  },
];

const PodsAndLiquid = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="pods"
      className="relative border-y hairline py-16 sm:py-24 md:py-36 lg:py-44 xl:py-60"
    >
      <div className="container max-sm:px-3">
        <div ref={headRef} className="reveal mb-10 max-w-3xl sm:mb-16 md:mb-20 lg:mb-32 xl:mb-36">
          <p className="mb-3 flex items-center gap-2 text-[9px] font-normal uppercase tracking-luxury text-gold sm:mb-6 sm:gap-3 sm:text-[10px]">
            <span className="h-px w-6 bg-gold/60 sm:w-10" />
            彈匣與電子煙油
          </p>
          <h2 className="font-serif text-3xl leading-[1.1] sm:text-5xl sm:leading-[1.02] md:text-6xl lg:text-7xl">
            <span className="text-gradient-gold">精工消耗品。</span>
            <br />
            <span className="italic text-foreground/70">品嘗至完美。</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 gold-divider lg:block"
            aria-hidden
          />
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodsAndLiquid;
