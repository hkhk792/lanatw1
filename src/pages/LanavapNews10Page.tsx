import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { lanavapNews10Content, lanavapNews10Body } from "@/data/lanavapNews10Content";

const LanavapNews10Page = () => {
  const navigate = useNavigate();
  const d = lanavapNews10Content;
  const b = lanavapNews10Body;

  useEffect(() => {
    document.title = "如何自製電子煙油？新手簡易DIY指南";
  }, []);

  const goHome = () => {
    requestHomeScrollRestore();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-12">
      <Navbar />
      <main className="container max-w-3xl pt-28 md:pt-32 pb-16">
        <button
          type="button"
          onClick={goHome}
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
        >
          <ChevronLeft className="h-4 w-4" />
          返回首頁
        </button>

        <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">— 讀物 —</p>
        <span className="h-px w-12 bg-gold/30 mb-5 block" />
        <h1 className="font-serif text-2xl sm:text-3xl text-gradient-gold leading-snug mb-2">
          {d.title}
        </h1>
        <p className="text-xs text-muted-foreground/90 mb-8">日期：{d.date}</p>

        <div className="mb-10 overflow-hidden rounded-sm border border-gold/10 bg-card/20 p-3 sm:p-4">
          <img
            src={d.heroImage}
            alt={d.imageAlt}
            className="mx-auto max-h-[min(40vh,24rem)] w-full object-contain"
          />
        </div>

        {d.intro.map((p, idx) => (
          <p
            key={idx}
            className="text-sm text-muted-foreground leading-relaxed tracking-vogue mb-4 last:mb-10"
          >
            {p}
          </p>
        ))}

        <p className="text-xs text-muted-foreground/90 mb-10 border-l-2 border-gold/20 pl-4">
          {b.materialsIntro}
        </p>

        <section className="mb-10 space-y-4">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95">
            {b.toolsAndIngredients.title}
          </h2>
          <h3 className="text-sm font-medium text-gold/90">{b.toolsAndIngredients.materials.heading}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {b.toolsAndIngredients.materials.lines.map((line, i) => (
              <li key={`m-${i}`}>{line}</li>
            ))}
          </ul>
          <h3 className="text-sm font-medium text-gold/90 pt-1">{b.toolsAndIngredients.tools.heading}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {b.toolsAndIngredients.tools.lines.map((line, i) => (
              <li key={`t-${i}`}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95 mb-3">{b.steps.title}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {b.steps.lines.map((line, i) => (
              <li key={`s-${i}`}>{line}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{b.steps.outro}</p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95 mb-3">
            {b.freshUse.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{b.freshUse.lead}</p>
          {b.freshUse.body.map((p, i) => (
            <p
              key={`fu-${i}`}
              className="text-sm text-muted-foreground leading-relaxed mb-4 last:mb-0"
            >
              {p}
            </p>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95 mb-3">
            {b.diyVsRetail.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{b.diyVsRetail.p1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{b.diyVsRetail.p2}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{b.diyVsRetail.p3}</p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95 mb-3">
            {b.shelfLife.title}
          </h2>
          {b.shelfLife.leadBeforeList.map((p, i) => (
            <p
              key={`sl-${i}`}
              className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-4"
            >
              {p}
            </p>
          ))}
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground mb-3">
            {b.shelfLife.tips.map((t, i) => (
              <li key={`st-${i}`}>{t}</li>
            ))}
          </ol>
          <p className="text-sm text-muted-foreground leading-relaxed">{b.shelfLife.outro}</p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95 mb-3">{b.safety.title}</h2>
          {b.safety.body.map((p, i) => (
            <p
              key={`sf-${i}`}
              className="text-sm text-muted-foreground leading-relaxed mb-4 last:mb-0"
            >
              {p}
            </p>
          ))}
        </section>

        <section className="border-t border-gold/10 pt-10">
          <h2 className="font-serif text-lg md:text-xl text-foreground/95 mb-5">
            {b.faq.title}
          </h2>
          <dl className="space-y-5">
            {b.faq.items.map((it) => (
              <div key={it.q}>
                <dt className="text-sm text-gold/90 font-medium mb-1.5">{it.q}</dt>
                <dd className="text-sm text-muted-foreground leading-relaxed pl-0">{it.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default LanavapNews10Page;
