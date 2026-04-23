import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/product-4.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center pt-32 pb-20">
      {/* Cinematic background blur */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="AETHER VAPE flagship device"
          className="absolute inset-0 h-full w-full object-cover object-center scale-150 blur-3xl opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-radial" />
      </div>

      <div className="relative z-10 container grid lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 lg:pr-8">
          <p className="inline-flex items-center gap-3 text-[10px] uppercase tracking-luxury text-electric mb-8 animate-fade-in-up">
            <span className="h-px w-10 bg-electric/60" />
            New Collection · 2026
          </p>

          <h1
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Master the
            <br />
            <span className="italic text-foreground/90">Essence.</span>
          </h1>

          <p
            className="mt-8 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed font-light animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            Next-generation flavor technology engineered for a refined lifestyle.
            Precision ceramic coils. Hand-finished aluminum. Uncompromising craft.
          </p>

          <div
            className="mt-12 flex flex-wrap items-center gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#disposables"
              className="group inline-flex items-center gap-3 bg-electric text-accent-foreground px-9 py-4 text-[11px] uppercase tracking-luxury font-medium hover:opacity-90 transition-all duration-500 ease-luxury"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <a
              href="#pods"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-luxury text-foreground/80 hover:text-electric transition-colors duration-500"
            >
              <span className="h-px w-8 bg-foreground/40 group-hover:bg-electric transition-colors duration-500" />
              Discover Technology
            </a>
          </div>
        </div>

        {/* Centerstage product */}
        <div className="lg:col-span-6 relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="absolute inset-0 -z-10 bg-electric/10 blur-[120px] rounded-full" />
          <div className="relative aspect-square max-w-xl mx-auto">
            <img
              src={heroImage}
              alt="AETHER VAPE signature device with cinematic depth-of-field"
              className="h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
            />
            {/* Floating spec chips */}
            <div className="absolute top-10 -left-2 md:left-0 glass px-4 py-2 text-[10px] uppercase tracking-luxury text-foreground/80 animate-float-slow">
              Ceramic Coil
            </div>
            <div
              className="absolute bottom-16 -right-2 md:right-0 glass px-4 py-2 text-[10px] uppercase tracking-luxury text-electric animate-float-slow"
              style={{ animationDelay: "1s" }}
            >
              3% Salt Nic
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-foreground/50">
        <span className="text-[9px] uppercase tracking-luxury">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-foreground/40 to-transparent animate-float-slow" />
      </div>
    </section>
  );
};

export default Hero;
