import ProductCard from "./ProductCard";
import { useReveal } from "@/hooks/useReveal";
import p1 from "@/assets/product-1.png";
import p2 from "@/assets/product-2.png";
import p3 from "@/assets/product-3.png";
import p4 from "@/assets/product-4.png";
import p5 from "@/assets/product-5.png";
import p6 from "@/assets/product-6.png";

const products = [
  { image: p1, name: "Ninja Limited", flavor: "Signature Craft Series", price: "$148" },
  { image: p2, name: "Lanna Premier", flavor: "Ten-Color Edition", price: "$129" },
  { image: p3, name: "SP2S Bullet", flavor: "Thirteen-Color Atelier", price: "$112" },
  { image: p4, name: "SP2S Pro", flavor: "Begonia · Chrome · Stellar", price: "$184" },
  { image: p5, name: "Aether Stick", flavor: "380mAh · Type-C Fast Charge", price: "$89" },
  { image: p6, name: "DIYA Ceramic", flavor: "2.5ml · 8W Output", price: "$136" },
];

const Collection = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="disposables" className="relative py-28 md:py-40">
      <div className="container">
        <div ref={headRef} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-luxury text-electric mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-electric/60" />
              Disposable Collection
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
              Six devices.<br />
              <span className="italic text-foreground/70">One obsession with detail.</span>
            </h2>
          </div>
          <p className="md:max-w-sm text-sm text-muted-foreground leading-relaxed">
            From flagship hardware to ceramic-core disposables, every piece in
            the AETHER catalog is selected for one quality — uncompromising craft.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.name} {...p} index={i} />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-electric transition-colors duration-500"
          >
            <span className="h-px w-12 bg-foreground/30 group-hover:bg-electric transition-colors duration-500" />
            View Full Catalog
            <span className="h-px w-12 bg-foreground/30 group-hover:bg-electric transition-colors duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Collection;
