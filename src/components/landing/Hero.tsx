import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";
import sp2sPodsCatalog from "@/assets/sp2s-gen1-pods-catalog.webp";

const GEN1_PODS_ROUTE = "/product/sp2s-gen1-pods";

const Hero = () => {
  return (
    <section className="relative flex min-h-[100dvh] min-h-[100svh] w-full items-center overflow-hidden pt-[calc(6.5rem+env(safe-area-inset-top,0px))] pb-16 sm:pb-24 md:min-h-screen md:pb-28 lg:pb-32">
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

      <div className="relative z-10 container grid gap-8 sm:gap-14 lg:grid-cols-12 lg:gap-16 lg:items-center">
        {/* Copy */}
        <div className="min-w-0 lg:col-span-6 lg:pr-8">
          <p className="mb-6 inline-flex max-w-full flex-wrap items-center gap-2 text-[10px] uppercase tracking-luxury text-gold animate-fade-in-up sm:mb-10 sm:gap-3">
            <span className="h-px w-6 shrink-0 bg-gold/60 sm:w-10" />
            <span className="inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 font-serif">
              彈匣系統
              <span className="text-gold/50">·</span>
              <BrandSp2s className="text-[10px] tracking-luxury text-gold" />
            </span>
          </p>

          <h1
            className="animate-fade-in-up text-balance font-serif text-3xl leading-[1.12] tracking-tight text-foreground sm:text-4xl sm:leading-[1.07] md:text-6xl md:leading-[1.05] lg:text-7xl lg:leading-[1.05] xl:text-8xl"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-1.5 sm:mb-2">
              <span className="text-gradient-gold">
                <BrandSp2s className="font-serif text-inherit" /> 煙彈通用一代，
              </span>
            </div>
            <div className="text-[1.05rem] italic leading-snug text-foreground/70 sm:text-3xl sm:leading-[1.07] md:text-5xl md:leading-[1.05] lg:text-6xl xl:text-7xl">
              陶瓷白芯 · 口味全陣容。
            </div>
          </h1>

          <p
            className="mt-5 max-w-md text-[14px] leading-relaxed text-muted-foreground animate-fade-in-up sm:mt-8 sm:text-base md:text-lg md:tracking-vogue font-light"
            style={{ animationDelay: "0.25s" }}
          >
            白色陶瓷芯霧化細緻，相容多款一代主機；水果、汽水冰感、茶飲與甜品系，三十六種風味一次瀏覽。
          </p>

          <div
            className="mt-8 flex w-full min-w-0 flex-col gap-3 animate-fade-in-up sm:mt-14 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to={GEN1_PODS_ROUTE}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-3 bg-gradient-gold px-8 py-3.5 text-[11px] font-medium uppercase tracking-luxury text-primary-foreground transition-all duration-500 ease-luxury hover:shadow-gold sm:w-auto sm:justify-start sm:px-10 sm:py-4"
            >
              立即選購
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link
              to={GEN1_PODS_ROUTE}
              className="group inline-flex min-h-[44px] w-full items-center justify-center gap-3 py-2 text-[11px] uppercase tracking-luxury text-foreground/70 transition-colors duration-500 hover:text-gold sm:w-auto sm:justify-start sm:py-0"
            >
              <span className="hidden h-px w-8 bg-gold/40 transition-colors duration-500 group-hover:bg-gold sm:inline-block" />
              36 口味 · 查看詳情
            </Link>
          </div>
        </div>

        {/* Centerstage product */}
        <div className="relative min-w-0 lg:col-span-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Gold spotlight backdrop */}
          <div className="absolute inset-0 -z-10 spotlight blur-2xl opacity-90" />
          <div className="absolute inset-0 -z-10 bg-gold/5 blur-[140px] rounded-full" />

          <div className="relative mx-auto w-full max-w-[min(100%,22rem)] aspect-[5/4] sm:max-w-xl sm:aspect-square">
            <Link
              to={GEN1_PODS_ROUTE}
              className="block h-full cursor-pointer outline-none ring-offset-background transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2"
            >
              <img
                src={sp2sPodsCatalog}
                alt="SP2S 思博瑞一代通用煙彈口味總覽"
                className="h-full w-full object-contain object-center drop-shadow-[0_50px_80px_rgba(0,0,0,0.7)]"
              />
            </Link>
            {/* Floating spec chips — inset from edges so they stay on-screen on narrow phones */}
            <div className="absolute left-2 top-6 max-w-[calc(100%-1rem)] glass px-2.5 py-1.5 text-[9px] uppercase tracking-luxury text-gold animate-float-slow sm:left-0 sm:top-10 sm:px-4 sm:py-2 sm:text-[10px] md:left-0">
              陶瓷芯
            </div>
            <div
              className="absolute bottom-12 right-2 max-w-[calc(100%-1rem)] glass px-2.5 py-1.5 text-[9px] uppercase tracking-luxury text-gold-glow animate-float-slow sm:bottom-16 sm:right-0 sm:px-4 sm:py-2 sm:text-[10px] md:right-0"
              style={{ animationDelay: "1s" }}
            >
              3% 尼古丁鹽
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/50 safe-area-pb sm:bottom-10 sm:gap-3">
        <span className="text-[9px] uppercase tracking-luxury text-gold/60">向下滾動</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold/50 to-transparent animate-float-slow" />
      </div>
    </section>
  );
};

export default Hero;
