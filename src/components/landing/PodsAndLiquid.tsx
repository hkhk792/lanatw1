import type { ReactNode, Ref } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { BrandSp2s } from "@/components/BrandSp2s";
import p7 from "@/assets/product-7.webp";
import p8 from "@/assets/product-8.webp";

interface Feature {
  image: string;
  eyebrow: string;
  title: string;
  desc: ReactNode;
  specs: string[];
  /** 內部路由，例如 /product/lana-pods；未設定則為 # */
  to?: string;
}

const cardClassName =
  "reveal group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden glass transition-shadow duration-700 hover:shadow-gold";

const FeatureCard = ({ f, i }: { f: Feature; i: number }) => {
  const cardRef = useReveal<HTMLAnchorElement>();
  const inner = (
    <>
      <div className="absolute inset-0 spotlight opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <img
        src={f.image}
        alt={`${f.title} — ${f.eyebrow}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-luxury group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

      <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-luxury text-gold">
          0{i + 1} · {f.eyebrow}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full glass-strong text-gold/80 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10">
        <h3 className="font-serif text-4xl md:text-6xl leading-tight mb-4 text-gradient-gold">{f.title}</h3>
        <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-6 tracking-vogue">
          {f.desc}
        </p>
        <ul className="flex flex-wrap gap-2">
          {f.specs.map((s) => (
            <li
              key={s}
              className="text-[10px] uppercase tracking-luxury px-3 py-2 hairline border text-foreground/80"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  if (f.to) {
    return (
      <Link
        ref={cardRef as Ref<HTMLAnchorElement>}
        to={f.to}
        className={cardClassName}
        style={{ transitionDelay: `${i * 120}ms` }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      ref={cardRef}
      href="#"
      className={cardClassName}
      style={{ transitionDelay: `${i * 120}ms` }}
    >
      {inner}
    </a>
  );
};

const features: Feature[] = [
  {
    image: p7,
    eyebrow: "彈匣系統",
    title: "全適配芯",
    desc: (
      <>
        為穩定蒸氣一致性而設計的彈匣。與所有 <BrandSp2s className="font-serif text-sm md:text-base text-muted-foreground" />{" "}
        陶瓷芯硬體相容。
      </>
    ),
    specs: ["LANA 3 顆裝", "一代通用", "NT$220"],
    to: "/product/lana-pods",
  },
  {
    image: p8,
    eyebrow: "叮啞系列",
    title: "DIYA 叮啞煙彈",
    desc: "一代通用、一盒三入；每顆 2.5ml，相容 RELX 一代、SP2S、LANA 等多款主機，口味陣容完整。",
    specs: ["一盒三入", "NT$199", "2.5ml／顆", "一代通用"],
    to: "/product/diya-pods",
  },
];

const PodsAndLiquid = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="pods" className="relative py-44 md:py-60 border-y hairline">
      <div className="container">
        <div ref={headRef} className="reveal max-w-3xl mb-24 md:mb-36">
          <p className="text-[10px] uppercase tracking-luxury text-gold mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            彈匣與電子煙油
          </p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1.02]">
            <span className="text-gradient-gold">精工消耗品。</span><br />
            <span className="italic text-foreground/70">品嘗至完美。</span>
          </h2>
        </div>

        {/* Split-screen with vertical gold divider */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px gold-divider -translate-x-1/2" />
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodsAndLiquid;
