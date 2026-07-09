import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, Search, ShoppingBag, X } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";
import { useCart } from "@/contexts/CartContext";
import SiteSearchSheet from "@/components/SiteSearchSheet";

/** 首頁錨點：點選平滑捲動（自子頁回首頁後再捲） */
const HOME_NAV_ITEMS = [
  { id: "hero", label: "精選首屏", hint: "主視覺" },
  { id: "home-catalog-pods", label: "菸彈", hint: "菸彈／通配" },
  { id: "home-catalog-host", label: "主機", hint: "主機專區・目錄" },
  { id: "home-catalog-disposable", label: "拋棄式", hint: "一次性／大口數" },
  { id: "taiwan-vape-store", label: "專賣店", hint: "配送與正品" },
  { id: "manifesto", label: "品牌日誌", hint: "資訊與指南" },
  { id: "contact", label: "聯絡我們", hint: "頁尾與社群" },
] as const;

const CONTENT_NAV_ITEMS = [
  { to: "/knowledge", label: "知識中心", hint: "指南・部落格・比較" },
  { to: "/guides", label: "選購指南", hint: "保存・通配・口味" },
  { to: "/blog", label: "部落格", hint: "品牌介紹・心得" },
] as const;

const Navbar = () => {
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollToId = useCallback((id: string) => {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const goToHomeSection = useCallback(
    (id: string) => {
      setOpen(false);
      setSearchOpen(false);
      if (location.pathname === "/") {
        scrollToId(id);
        return;
      }
      void navigate("/");
      window.setTimeout(() => scrollToId(id), 200);
    },
    [location.pathname, navigate, scrollToId]
  );
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-luxury ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="safe-area-pt">
        <div className="container flex items-center gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 group">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-soft text-gradient-gold font-serif text-sm transition-all duration-500 group-hover:border-gold">
                S
              </span>
              <BrandSp2s className="min-w-0 truncate font-serif text-lg tracking-vogue text-gradient-gold sm:text-xl md:text-2xl" />
            </Link>
          </div>

          <p className="pointer-events-none shrink-0 text-center text-xs font-medium tracking-wide text-gold sm:text-sm md:text-base">
            货到付款
          </p>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4 md:gap-8">
            <nav className="hidden min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:gap-x-8 md:flex">
              <Link
                to="/knowledge"
                className="inline-flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-luxury text-gold transition-colors duration-500 hover:text-gradient-gold lg:text-[11px]"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                知識中心
              </Link>
              {HOME_NAV_ITEMS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToHomeSection(s.id)}
                  className="shrink-0 text-left text-[10px] uppercase tracking-luxury text-foreground/60 transition-colors duration-500 hover:text-gradient-gold hover:text-gold lg:text-[11px]"
                >
                  {s.label}
                </button>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <button
                type="button"
                aria-label="搜尋商品"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
                className="grid h-11 min-h-[44px] min-w-[44px] w-11 place-items-center rounded-full hairline border hover:border-gold transition-colors duration-500"
              >
                <Search className="h-4 w-4 text-gold" />
              </button>
              <button
                type="button"
                aria-label="購物車"
                onClick={() => {
                  setSearchOpen(false);
                  openCart();
                }}
                className="relative grid h-11 min-h-[44px] min-w-[44px] w-11 place-items-center rounded-full hairline border hover:border-gold transition-colors duration-500"
              >
                <ShoppingBag className="h-4 w-4 text-gold" />
                {itemCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-gold px-0.5 text-[10px] font-medium leading-none text-primary-foreground">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                aria-label="菸彈・主機・拋棄式選單"
                aria-expanded={open}
                className="md:hidden grid h-11 min-h-[44px] min-w-[44px] w-11 place-items-center rounded-full hairline border"
                onClick={() => {
                  setSearchOpen(false);
                  setOpen(!open);
                }}
              >
                {open ? <X className="h-4 w-4 text-gold" /> : <Menu className="h-4 w-4 text-gold" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <nav
            className="md:hidden glass-strong border-t hairline mt-2 sm:mt-3"
            aria-label="首頁區塊（菸彈・主機・拋棄式）"
          >
            <div className="container grid grid-cols-1 gap-2 py-4 sm:grid-cols-2 sm:gap-3 sm:py-5">
              {CONTENT_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-start rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-left transition-colors hover:border-gold/50 hover:bg-gold/10"
                >
                  <span className="text-sm font-medium tracking-wide text-gold">{item.label}</span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">{item.hint}</span>
                </Link>
              ))}
              {HOME_NAV_ITEMS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToHomeSection(s.id)}
                  className="flex flex-col items-start rounded-lg border border-gold/15 bg-card/30 px-4 py-3 text-left transition-colors hover:border-gold/35 hover:bg-card/50 active:bg-card/60"
                >
                  <span className="text-sm font-medium tracking-wide text-foreground">{s.label}</span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">{s.hint}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
      <SiteSearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Navbar;
