import ProductCard from "./ProductCard";
import { useReveal } from "@/hooks/useReveal";
import { BrandSp2s } from "@/components/BrandSp2s";
import p1 from "@/assets/product-1.webp";
import p3 from "@/assets/product-3.webp";
import p4 from "@/assets/product-4.webp";
import p6 from "@/assets/product-6.webp";
import { AtomizerHostGemini } from "@/lib/responsiveImageVariants.generated";
const products = [
  { image: p1, name: "卡通限量版一代通配主機", flavor: "經典工藝系列", price: "NT$550", id: "cartoon" },
  { image: p3, name: "SP2S 思博瑞 一代", flavor: "十三色工坊系列", price: "NT$450", id: "bullet" },
  { image: p4, name: "SP2S Pro", flavor: "八色旗艦 · 智慧感應", price: "NT$450", id: "pro" },
  {
    image: AtomizerHostGemini.src,
    name: "原子棒一代通配主機",
    flavor: "綠 · 黑 · 曲線輸出",
    price: "NT$290",
    id: "atomizer",
    responsive: AtomizerHostGemini,
  },
  {
    image: p6,
    name: "DIYA 叮啞霧化桿",
    flavor: "2.5ML 大容量兼容／一代通用",
    price: "NT$320",
    id: "diya",
  },
];

const Collection = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="disposables" className="relative py-16 sm:py-24 md:py-44 lg:py-60">
      <div className="container max-sm:px-3">
        <div
          ref={headRef}
          className="reveal flex flex-col md:flex-row md:items-end justify-between gap-4 max-sm:gap-3 mb-10 sm:mb-16 md:mb-24 lg:mb-36"
        >
          <div className="max-w-2xl">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-luxury text-gold mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <span className="h-px w-6 sm:w-10 bg-gold/60" />
              主機與硬體系列
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] sm:leading-[1.02]">
              <span className="text-gradient-gold">五款設備。</span>
              <br />
              <span className="italic text-foreground/70">旗艦手感，一手掌握。</span>
            </h2>
          </div>
          <p className="md:max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed tracking-vogue max-sm:line-clamp-3">
            從旗艦硬體到陶瓷芯一次性產品，<BrandSp2s className="font-serif text-xs sm:text-sm text-muted-foreground" />{" "}
            目錄中的每一項都
            因同一品質而被選中——毫不妥協的工藝。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-8 lg:grid-cols-3 lg:gap-12">
          {products.map((p, i) => (
            <ProductCard key={p.id} variant="dense" {...p} index={i} />
          ))}
        </div>

        <div className="mt-12 sm:mt-20 md:mt-28 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-gold transition-colors duration-500"
          >
            <span className="h-px w-12 bg-gold/30 group-hover:bg-gold transition-colors duration-500" />
            查看完整目錄
            <span className="h-px w-12 bg-gold/30 group-hover:bg-gold transition-colors duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Collection;
