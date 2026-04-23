import ProductCard from "./ProductCard";
import { useReveal } from "@/hooks/useReveal";
import p1 from "@/assets/product-1.png";
import p2 from "@/assets/product-2.png";
import p3 from "@/assets/product-3.png";
import p4 from "@/assets/product-4.png";
import p5 from "@/assets/product-5.png";
import p6 from "@/assets/product-6.png";
import p7 from "@/assets/product-7.jpg";
import p8 from "@/assets/product-8.png";
import p9 from "@/assets/product-9.png";

const products = [
  { image: p1, name: "Ninja Edition", flavor: "Limited Artisan Series", price: "$148" },
  { image: p2, name: "Lana Premium", flavor: "Ten Hue Collection", price: "$129" },
  { image: p3, name: "SP2S Bullet", flavor: "Thirteen Color Atelier", price: "$112" },
  { image: p4, name: "SP2S Pro", flavor: "Begonia · Chrome · Star", price: "$184" },
  { image: p5, name: "Atomizing Rod", flavor: "380mAh · Type-C", price: "$89" },
  { image: p6, name: "DIYA Ceramic", flavor: "2.5ml · 8W Output", price: "$136" },
  { image: p7, name: "Lana Pods", flavor: "Peppermint · 30mg/ml", price: "$24" },
  { image: p8, name: "DIYA Mega T25", flavor: "Nine Flavor Assortment", price: "$32" },
  { image: p9, name: "SP2S Bullets", flavor: "3% Nicotine · 25 Flavors", price: "$28" },
];

const Collection = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="collection" className="relative py-28 md:py-40">
      <div className="container">
        <div ref={headRef} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-gold/60" />
              The Collection
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05]">
              Nine pieces. <br />
              <span className="italic text-foreground/70">One obsession with detail.</span>
            </h2>
          </div>
          <p className="md:max-w-sm text-sm text-muted-foreground leading-relaxed">
            From flagship devices to ceramic-core pods, every product in the NOIRE catalogue
            is selected for one quality — uncompromised craft.
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
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-gold transition-colors duration-500"
          >
            <span className="h-px w-12 bg-foreground/30 group-hover:bg-gold transition-colors duration-500" />
            View Full Catalogue
            <span className="h-px w-12 bg-foreground/30 group-hover:bg-gold transition-colors duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Collection;
