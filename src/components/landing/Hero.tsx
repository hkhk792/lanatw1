import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";
import sp2sPodsCatalog from "@/assets/sp2s-gen1-pods-catalog.webp";

const GEN1_PODS_ROUTE = "/product/sp2s-gen1-pods";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center pt-32 pb-32">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src={sp2sPodsCatalog}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center scale-150 blur-3xl opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-background/95 to-background" />
        <div className="absolute inset-0 spotlight opacity-70" />
      </div>

      <div className="relative z-10 container grid lg:grid-cols-12 gap-16 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 lg:pr-8">
          <p className="inline-flex items-center gap-3 text-[10px] uppercase tracking-luxury text-gold mb-10 animate-fade-in-up">
            <span className="h-px w-10 bg-gold/60" />
            <span className="inline-flex items-center gap-2 font-serif">
              彈匣系統
              <span className="text-gold/50">·</span>
              <BrandSp2s className="text-[10px] tracking-luxury text-gold" />
            </span>
          </p>

          <h1
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-2">
              <span className="text-gradient-gold">
                <BrandSp2s className="font-serif text-inherit" /> 煙彈通用一代，
              </span>
            </div>
            <div className="italic text-foreground/70">陶瓷白芯 · 口味全陣容。</div>
          </h1>

          <p
            className="mt-8 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed font-light tracking-vogue animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            白色陶瓷芯霧化細緻，相容多款一代主機；水果、汽水冰感、茶飲與甜品系，三十六種風味一次瀏覽。
          </p>

          <div
            className="mt-14 flex flex-wrap items-center gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to={GEN1_PODS_ROUTE}
              className="group inline-flex items-center gap-3 bg-gradient-gold text-primary-foreground px-10 py-4 text-[11px] uppercase tracking-luxury font-medium hover:shadow-gold transition-all duration-500 ease-luxury"
            >
              立即選購
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link
              to={GEN1_PODS_ROUTE}
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-gold transition-colors duration-500"
            >
              <span className="h-px w-8 bg-gold/40 group-hover:bg-gold transition-colors duration-500" />
              查看口味詳情
            </Link>
            <Link
              to={GEN1_PODS_ROUTE}
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-gold transition-colors duration-500"
            >
              <span className="h-px w-8 bg-gold/40 group-hover:bg-gold transition-colors duration-500" />
              36 口味
            </Link>
          </div>
        </div>

        {/* Centerstage product */}
        <div className="lg:col-span-6 relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Gold spotlight backdrop */}
          <div className="absolute inset-0 -z-10 spotlight blur-2xl opacity-90" />
          <div className="absolute inset-0 -z-10 bg-gold/5 blur-[140px] rounded-full" />

          <div className="relative aspect-square max-w-xl mx-auto">
            <Link
              to={GEN1_PODS_ROUTE}
              className="block cursor-pointer outline-none ring-offset-background transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2"
            >
              <img
                src={sp2sPodsCatalog}
                alt="SP2S 思博瑞一代通用煙彈口味總覽"
                className="h-full w-full object-contain object-center drop-shadow-[0_50px_80px_rgba(0,0,0,0.7)]"
              />
            </Link>
            {/* Floating spec chips */}
            <div className="absolute top-10 -left-2 md:left-0 glass px-4 py-2 text-[10px] uppercase tracking-luxury text-gold animate-float-slow">
              陶瓷芯
            </div>
            <div
              className="absolute bottom-16 -right-2 md:right-0 glass px-4 py-2 text-[10px] uppercase tracking-luxury text-gold-glow animate-float-slow"
              style={{ animationDelay: "1s" }}
            >
              3% 尼古丁鹽
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-foreground/50">
        <span className="text-[9px] uppercase tracking-luxury text-gold/60">向下滾動</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/50 to-transparent animate-float-slow" />
      </div>
    </section>
  );
};

export default Hero;
