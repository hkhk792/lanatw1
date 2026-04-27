import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { BrandSp2s } from "@/components/BrandSp2s";
import { sp2sPodFlavorGuideContent } from "@/data/sp2sPodFlavorGuideContent";

const Sp2sPodFlavorGuidePage = () => {
  const navigate = useNavigate();
  const d = sp2sPodFlavorGuideContent;

  useEffect(() => {
    document.title = "SP2S 煙彈口味推薦｜實測指南";
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

        <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">— 資訊內文 —</p>
        <span className="h-px w-12 bg-gold/30 mb-6 block" />
        <h1 className="font-serif text-2xl sm:text-3xl md:text-[1.7rem] text-gradient-gold leading-snug mb-2">
          {d.title}
        </h1>
        <p className="text-xs text-muted-foreground/90 mb-8">日期：{d.date}</p>

        <div className="mb-10 overflow-hidden rounded-sm border border-gold/10 bg-card/20 p-3 sm:p-4">
          <img
            src={d.heroImage}
            alt={d.imageAlt}
            className="mx-auto max-h-[min(45vh,26rem)] w-full object-contain"
          />
        </div>

        {d.intro.map((p, idx) => (
          <p
            key={idx}
            className="text-sm text-muted-foreground leading-relaxed tracking-vogue mb-4 last:mb-8"
          >
            {p}
          </p>
        ))}

        <p className="text-xs text-muted-foreground/80 border-l-2 border-gold/20 pl-4 py-1 mb-10">
          本文僅就風格與分類作分享；產品與法規以實際通路為準。本內容僅供年滿
          20 歲之非吸菸者參考。
        </p>

        <div className="space-y-8 border-t border-gold/10 pt-10">
          {d.sections.map((sec) => (
            <div key={sec.title} className="space-y-3">
              <h2 className="font-serif text-lg md:text-xl text-foreground/95 leading-snug">
                {sec.title}
              </h2>
              {sec.lead ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{sec.lead}</p>
              ) : null}
              <ul className="space-y-2.5 pl-0 list-none">
                {sec.flavors.map((f) => (
                  <li key={f.name} className="text-sm leading-relaxed text-muted-foreground">
                    <span className="text-gold/90 font-medium not-italic">{f.name}</span>
                    <span>：{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          想回到專櫃首頁瀏覽 <BrandSp2s className="text-sm" /> 其他系列，請用上方
          <span className="text-foreground/80">「返回首頁」</span>。
        </p>
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default Sp2sPodFlavorGuidePage;
