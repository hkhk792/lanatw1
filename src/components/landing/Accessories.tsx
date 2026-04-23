import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import p9 from "@/assets/product-9.png";

const swatches = [
  { name: "Obsidian", hsl: "0 0% 4%" },
  { name: "Champagne", hsl: "43 55% 52%" },
  { name: "Ivory", hsl: "40 30% 90%" },
  { name: "Rosé", hsl: "350 60% 75%" },
  { name: "Sage", hsl: "150 20% 55%" },
  { name: "Brass", hsl: "38 45% 45%" },
];

const Accessories = () => {
  const ref = useReveal<HTMLDivElement>();
  const imgRef = useReveal<HTMLDivElement>();

  return (
    <section id="accessories" className="relative py-44 md:py-60 overflow-hidden">
      <div className="container max-w-5xl">
        <div ref={ref} className="reveal max-w-3xl mx-auto text-center mb-20 md:mb-32">
          <p className="text-[10px] uppercase tracking-luxury text-gold mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            Bespoke Accessories
            <span className="h-px w-10 bg-gold/60" />
          </p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1.02]">
            <span className="text-gradient-gold">Silicone sleeves,</span><br />
            <span className="italic text-foreground/70">tailored in colour & touch.</span>
          </h2>
        </div>

        <div
          ref={imgRef}
          className="reveal relative w-full aspect-[16/10] md:aspect-[16/9] overflow-hidden glass shadow-luxury"
        >
          <div className="absolute inset-0 spotlight opacity-70" />
          <img
            src={p9}
            alt="SP2S bespoke silicone case collection across colour palette"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-luxury hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/30 to-transparent" />

          <div className="absolute inset-x-6 bottom-6 md:inset-x-14 md:bottom-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-md">
              <h3 className="font-serif text-4xl md:text-6xl leading-tight mb-4 text-gradient-gold">
                Twenty-five hues.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-vogue">
                Soft-touch silicone sleeves, individually moulded and colour-matched
                to your daily ritual.
              </p>
            </div>

            <a
              href="#"
              className="group inline-flex items-center gap-3 self-start md:self-auto bg-gradient-gold text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-luxury font-medium hover:shadow-gold transition-all duration-500"
            >
              Configure Yours
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Swatches */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {swatches.map((s) => (
            <div key={s.name} className="flex items-center gap-3 group cursor-pointer">
              <span
                className="h-8 w-8 rounded-full border border-gold-soft transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:shadow-gold-soft"
                style={{ backgroundColor: `hsl(${s.hsl})` }}
              />
              <span className="text-[10px] uppercase tracking-luxury text-foreground/60 group-hover:text-gold transition-colors duration-500">
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
