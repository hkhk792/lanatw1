import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import p9 from "@/assets/product-9.png";

const swatches = [
  { name: "Obsidian", hsl: "220 18% 8%" },
  { name: "Electric", hsl: "210 100% 60%" },
  { name: "Ivory", hsl: "40 30% 90%" },
  { name: "Rosé", hsl: "350 60% 75%" },
  { name: "Sage", hsl: "150 20% 55%" },
  { name: "Amber", hsl: "35 80% 60%" },
];

const Accessories = () => {
  const ref = useReveal<HTMLDivElement>();
  const imgRef = useReveal<HTMLDivElement>();

  return (
    <section id="accessories" className="relative py-28 md:py-40 overflow-hidden">
      <div className="container">
        <div ref={ref} className="reveal max-w-3xl mb-16 md:mb-24">
          <p className="text-[10px] uppercase tracking-luxury text-electric mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-electric/60" />
            Bespoke Accessories
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
            Silicone sleeves,<br />
            <span className="italic text-foreground/70">tailored in colour & touch.</span>
          </h2>
        </div>

        <div
          ref={imgRef}
          className="reveal relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden glass"
        >
          <img
            src={p9}
            alt="AETHER bespoke silicone case collection across colour palette"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-luxury hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />

          <div className="absolute inset-x-6 bottom-6 md:inset-x-12 md:bottom-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-md">
              <h3 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
                Twenty-five hues.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Soft-touch silicone sleeves, individually moulded and colour-matched
                to your daily ritual.
              </p>
            </div>

            <a
              href="#"
              className="group inline-flex items-center gap-3 self-start md:self-auto bg-foreground text-background px-7 py-4 text-[11px] uppercase tracking-luxury font-medium hover:bg-electric hover:text-accent-foreground transition-all duration-500"
            >
              Configure Yours
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Swatches */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {swatches.map((s) => (
            <div key={s.name} className="flex items-center gap-3 group cursor-pointer">
              <span
                className="h-8 w-8 rounded-full border hairline transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: `hsl(${s.hsl})` }}
              />
              <span className="text-[10px] uppercase tracking-luxury text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
