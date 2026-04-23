import { useEffect, useState } from "react";

const AgeGate = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem("noire-age-verified");
    if (!ok) setOpen(true);
  }, []);

  const accept = () => {
    sessionStorage.setItem("noire-age-verified", "yes");
    setOpen(false);
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/95 backdrop-blur-xl animate-fade-in p-6">
      <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
      <div className="relative max-w-lg w-full glass-strong p-10 md:p-14 text-center animate-fade-in-up">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold font-serif text-lg">
          18
        </div>
        <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">年齡驗證</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-5 leading-tight">
          您必須達到法定吸菸年齡
        </h2>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-md mx-auto">
          本網站上的產品含有尼古丁。尼古丁是一種成癮性化學物質。
          請確認您至少年滿 <span className="text-foreground">18歲</span> 才能進入。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-gradient-gold text-primary-foreground py-4 text-[11px] uppercase tracking-luxury font-medium hover:shadow-gold transition-all duration-500"
          >
            我已年滿18歲
          </button>
          <button
            onClick={decline}
            className="flex-1 hairline border py-4 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-all duration-500"
          >
            離開
          </button>
        </div>
        <p className="mt-8 text-[10px] text-muted-foreground/70 leading-relaxed">
          進入即表示您同意我們的服務條款並認可我們的隱私政策。
        </p>
      </div>
    </div>
  );
};

export default AgeGate;
