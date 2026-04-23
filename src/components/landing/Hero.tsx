import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="NOIRE flagship vapor device cinematic banner"
          className="h-full w-full object-cover object-center scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-obsidian/40" />
      </div>

      {/* Top hairline */}
      <div className="absolute top-24 left-0 right-0 mx-auto h-px w-[80%] bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

      <div className="relative z-10 h-full container flex flex-col justify-end pb-24 md:pb-32">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-3 text-[10px] uppercase tracking-luxury text-gold mb-8 animate-fade-in-up">
            <span className="h-px w-10 bg-gold/60" />
            Spring 2026 — Flagship Edition
          </p>

          <h1
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            The Pinnacle
            <br />
            of <span className="italic text-gradient-gold">Vapor</span>.
          </h1>

          <p
            className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed font-light animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            Hand-finished aluminum. Ceramic-core atomization. A symphony of
            engineering and craft — designed for those who demand more from every breath.
          </p>

          <div
            className="mt-12 flex flex-wrap items-center gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#collection"
              className="group inline-flex items-center gap-3 bg-foreground text-background px-9 py-4 text-[11px] uppercase tracking-luxury font-medium hover:bg-gold hover:text-primary-foreground transition-all duration-500 ease-luxury"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <a
              href="#technology"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-luxury text-foreground/80 hover:text-gold transition-colors duration-500"
            >
              <span className="h-px w-8 bg-foreground/40 group-hover:bg-gold transition-colors duration-500" />
              Discover the Craft
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-foreground/50">
        <span className="text-[9px] uppercase tracking-luxury">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-foreground/40 to-transparent animate-float-slow" />
      </div>
    </section>
  );
};

export default Hero;
