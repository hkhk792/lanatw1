import { useEffect, useState } from "react";

const AgeGate = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem("sp2s-age-verified");
    if (!ok) setOpen(true);
  }, []);

  const accept = () => {
    sessionStorage.setItem("sp2s-age-verified", "yes");
    setOpen(false);
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/95 backdrop-blur-xl animate-fade-in p-6">
      <div className="absolute inset-0 spotlight opacity-40 pointer-events-none" />
      <div className="relative max-w-lg w-full glass-strong p-10 md:p-14 text-center animate-fade-in-up shadow-luxury">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gradient-gold font-serif text-lg">
          18
        </div>
        <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">年齡驗證</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-5 leading-tight text-gradient-gold">
          您必須達到法定吸煙年齡
        </h2>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-md mx-auto tracking-vogue">
          本站產品含有尼古丁，這是一種成癮性化學物質。
          請確認您已滿 <span className="text-gold">18 歲</span>才可進入。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-gradient-gold text-primary-foreground py-4 text-[11px] uppercase tracking-luxury font-medium hover:shadow-gold transition-all duration-500"
          >
            我已滿 18 歲
          </button>
          <button
            onClick={decline}
            className="flex-1 hairline border py-4 text-[11px] uppercase tracking-luxury text-foreground/70 hover:text-gold hover:border-gold/40 transition-all duration-500"
          >
            離開
          </button>
        </div>
        <p className="mt-8 text-[10px] text-muted-foreground/70 leading-relaxed">
          進入本站即表示您同意我們的服務條款，並確認我們的隱私政策。
        </p>
      </div>
    </div>
  );
};

export default AgeGate;
