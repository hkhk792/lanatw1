import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import {
  airportVapeArticleContent,
  airportVapeArticleBody,
} from "@/data/airportVapeArticleContent";

const AirportVapeArticlePage = () => {
  const navigate = useNavigate();
  const d = airportVapeArticleContent;
  const b = airportVapeArticleBody;

  useEffect(() => {
    document.title = "可以在機場吸電子煙嗎？｜旅行須知";
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

        <p className="text-xs text-muted-foreground/80 mb-10 border-l-2 border-gold/20 pl-4 py-1">
          {b.disclaimer}
        </p>

        <div className="space-y-10 border-t border-gold/10 pt-10">
          {b.sections.map((sec) => (
            <section key={sec.title} className="space-y-4">
              <h2 className="font-serif text-lg md:text-xl text-foreground/95 leading-snug">
                {sec.title}
              </h2>
              {sec.paragraphs.map((para, i) => (
                <p
                  key={`${sec.title}-${i}`}
                  className="text-sm text-muted-foreground leading-relaxed tracking-vogue"
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default AirportVapeArticlePage;
