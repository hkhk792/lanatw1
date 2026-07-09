import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";
import {
  SP2S_BLOG_NEWS,
  SP2S_ONLINE_REVIEWS,
  type Sp2sNewsItem,
} from "@/data/sp2sOfficialNews";

type Tab = "reviews" | "news";

function NewsCard({ item }: { item: Sp2sNewsItem }) {
  const isExternal = Boolean(item.externalHref && !item.href);
  const to = item.href ?? item.externalHref ?? "/knowledge";
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-card/40">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <p className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-medium leading-snug text-white">
          {item.title}
        </p>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
      <p className="mt-2 text-xs text-gold/80">{item.date}</p>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={item.externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-2xl border border-gold/15 bg-card/20 p-3 transition-colors hover:border-gold/35"
      >
        {inner}
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-gold">
          SP2S 全球官網
          <ExternalLink className="h-3 w-3" />
        </span>
      </a>
    );
  }

  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-gold/15 bg-card/20 p-3 transition-colors hover:border-gold/35"
    >
      {inner}
      <span className="mt-2 inline-flex items-center gap-1 text-xs text-gold">
        閱讀更多
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

/** 參考 sp2sglobal.com：線上評價 + 部落格新聞 */
const Sp2sNewsSection = () => {
  const [tab, setTab] = useState<Tab>("news");
  const items = tab === "reviews" ? SP2S_ONLINE_REVIEWS : SP2S_BLOG_NEWS;

  return (
    <section
      id="sp2s-news"
      aria-labelledby="sp2s-news-heading"
      className="scroll-mt-24 border-t hairline bg-background py-16 md:py-20"
    >
      <div className="container max-w-6xl">
        <p className="text-center text-[10px] uppercase tracking-luxury text-gold">— 品牌動態 —</p>
        <h2
          id="sp2s-news-heading"
          className="mt-3 text-center font-serif text-2xl tracking-vogue text-foreground md:text-3xl"
        >
          <BrandSp2s /> 評價與新聞
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          內容參考 SP2S 全球官網社群評價與 BLOG &amp; NEWS，改寫為繁體中文並連結本站選購指南與知識庫。
          僅限 18 歲以上參考。
        </p>

        <div className="mt-10 flex justify-center gap-8 border-b border-gold/20">
          <button
            type="button"
            onClick={() => setTab("reviews")}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === "reviews"
                ? "border-b-2 border-gold text-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            線上評價
          </button>
          <button
            type="button"
            onClick={() => setTab("news")}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === "news"
                ? "border-b-2 border-gold text-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            部落格與新聞
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/blog" className="text-gold hover:underline">
            瀏覽本站部落格 →
          </Link>
          <Link to="/knowledge" className="text-gold hover:underline">
            知識中心 →
          </Link>
          <a
            href="https://www.sp2sglobal.com/article/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-gold"
          >
            SP2S 全球官網新聞
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sp2sNewsSection;
