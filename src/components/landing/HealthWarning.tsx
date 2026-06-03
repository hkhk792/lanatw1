import { Gift } from "lucide-react";

const HealthWarning = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-foreground text-background border-t border-gold/40">
      <div className="container max-sm:px-3 py-3 flex items-center justify-center gap-2 sm:gap-3 text-center">
        <Gift className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        <p className="text-[10px] sm:text-xs leading-relaxed font-medium text-background/95">
          <span className="text-gold">新客首單</span>
          ：結帳填寫手機即可享
          <span className="font-semibold text-background">首單超商免運</span>
          ；滿 NT$1,500 全館免運。限時折扣與贈品以結帳頁與活動說明為準。
        </p>
      </div>
    </div>
  );
};

export default HealthWarning;
