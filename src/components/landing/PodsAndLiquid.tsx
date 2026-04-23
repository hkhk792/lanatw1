import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import p7 from "@/assets/product-7.jpg";
import p8 from "@/assets/product-8.png";

interface Feature {
  image: string;
  eyebrow: string;
  title: string;
  desc: string;
  specs: string[];
}

const FeatureCard = ({ f, i }: { f: Feature; i: number }) => {
  const cardRef = useReveal<HTMLAnchorElement>();
  return (
    <a
      ref={cardRef}
      href="#"
      className="reveal group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden glass"
      style={{ transitionDelay: `${i * 120}ms` }}
    >
      <img
        src={f.image}
        alt={`${f.title} — ${f.eyebrow}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-luxury group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

      <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-luxury text-electric">
          0{i + 1} · {f.eyebrow}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full glass-strong text-foreground/80 group-hover:text-electric group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10">
        <h3 className="font-serif text-3xl md:text-5xl leading-tight mb-4">{f.title}</h3>
        <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-6">
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
    </a>
  );
};

const features: Feature[] = [
  {
    image: p7,
    eyebrow: "Pods System",
    title: "Universal Pods",
    desc: "Cross-platform pod cartridges engineered for unwavering vapor consistency. Compatible with all AETHER ceramic-coil hardware.",
    specs: ["3% Nicotine Salt", "Ceramic Coil Compatible", "2.5ml Capacity"],
  },
  {
    image: p8,
    eyebrow: "E-Liquid",
    title: "Premium E-Liquids",
    desc: "Master-blended liquids drawn from rare botanical sources. Layered profiles refined through hundreds of tasting iterations.",
    specs: ["Nine Signature Flavors", "Pharmaceutical Grade", "Salt Nicotine Base"],
  },
];

const PodsAndLiquid = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="pods" className="relative py-28 md:py-40 border-y hairline">
      <div className="container">
        <div ref={headRef} className="reveal max-w-3xl mb-16 md:mb-24">
          <p className="text-[10px] uppercase tracking-luxury text-electric mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-electric/60" />
            Pods & E-Liquid
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
            Engineered consumables.<br />
            <span className="italic text-foreground/70">Tasted to perfection.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodsAndLiquid;
