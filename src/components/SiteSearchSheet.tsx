import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { flushHomeScrollPosition } from "@/lib/homeScrollRestore";
import { filterSiteSearch } from "@/lib/siteSearchIndex";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SiteSearchSheet = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const results = useMemo(() => filterSiteSearch(q), [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const go = (href: string) => {
    flushHomeScrollPosition();
    navigate(href);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="max-h-[min(88dvh,32rem)] gap-0 overflow-hidden border-b border-gold/20 bg-background p-0 sm:max-h-[min(90dvh,36rem)]"
      >
        <SheetHeader className="border-b border-gold/15 px-4 py-4 text-left sm:px-6">
          <SheetTitle className="flex items-center gap-2 font-serif text-lg text-foreground">
            <Search className="h-5 w-5 text-gold" />
            搜尋商品
          </SheetTitle>
          <p className="text-left text-xs font-normal text-muted-foreground">
            輸入品名、品牌或關鍵字；含目錄商品與常用規格頁
          </p>
        </SheetHeader>

        <div className="border-b border-gold/10 px-4 py-3 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="例如：RELX、SP2S、拋棄式、煙彈…"
              className="h-11 border-gold/25 bg-card/40 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-gold/30"
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[min(52dvh,20rem)] overflow-y-auto overscroll-contain px-2 py-2 sm:px-4">
          {q.trim().length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">請輸入至少一個字開始搜尋</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">找不到符合的商品，試試其他關鍵字</p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className={cn(
                      "flex w-full flex-col items-start rounded-md px-3 py-2.5 text-left transition-colors",
                      "hover:bg-gold/10 focus-visible:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
                    )}
                  >
                    <span className="text-sm font-medium leading-snug text-foreground">{item.title}</span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">{item.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SiteSearchSheet;
