import { Gift } from "lucide-react";

const HealthWarning = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-foreground text-background border-t border-gold/40">
      <div className="container max-sm:px-3 py-3 flex items-center justify-center gap-2 sm:gap-3 text-center">
        <Gift className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        <p className="text-[10px] sm:text-xs leading-relaxed font-medium text-background/95">
          <span className="text-gold">新客首單</span>
          ：首次下單先加 LINE 客服，解鎖
          <span className="font-semibold text-background">到貨免運費</span>
          ；同享限時折扣、套組加碼優惠。實際內容與名額以客服即時回覆為準。
        </p>
      </div>
    </div>
  );
};

export default HealthWarning;
