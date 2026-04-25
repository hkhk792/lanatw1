import ProductCard from "./ProductCard";
import { useReveal } from "@/hooks/useReveal";
import { BrandSp2s } from "@/components/BrandSp2s";
import p1 from "@/assets/product-1.png";
import lanaPremiumHero from "@/assets/lana-premium-device.png";
import p3 from "@/assets/product-3.png";
import p4 from "@/assets/product-4.png";
import p5 from "@/assets/atomizing-rod.jpg";
import p6 from "@/assets/product-6.png";

const products = [
  { image: p1, name: "卡通限量版", flavor: "經典工藝系列", price: "$148", id: "cartoon" },
  { image: lanaPremiumHero, name: "蘭納精裝版", flavor: "十色限定版", price: "$128", id: "lanna" },
  { image: p3, name: "SP2S 子彈版", flavor: "十三色工坊系列", price: "$118", id: "bullet" },
  { image: p4, name: "SP2S Pro", flavor: "八色旗艦 · 智慧感應", price: "NT$880", id: "pro" },
  { image: p5, name: "電子煙主機", flavor: "綠 · 霧藍 · 黑 · 曲線輸出", price: "NT$680", id: "atomizer" },
  { image: p6, name: "DIYA 陶瓷", flavor: "五色主機 · 2.5ML · 一代通用", price: "NT$320", id: "diya" },
];

const Collection = () => {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section id="disposables" className="relative py-44 md:py-60">
      <div className="container">
        <div ref={headRef} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 md:mb-36">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-gold/60" />
              主機與硬體系列
            </p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1.02]">
              <span className="text-gradient-gold">六款設備。</span><br />
              <span className="italic text-foreground/70">旗艦手感，一手掌握。</span>
            </h2>
          </div>
          <p className="md:max-w-sm text-sm text-muted-foreground leading-relaxed tracking-vogue">
            從旗艦硬體到陶瓷芯一次性產品，<BrandSp2s className="font-serif text-sm text-muted-foreground" />{" "}
            目錄中的每一項都
            因同一品質而被選中——毫不妥協的工藝。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {products.map((p, i) => (
            <ProductCard key={p.id} {...p} index={i} />
          ))}
        </div>

        <div className="mt-28 flex justify-center">
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
