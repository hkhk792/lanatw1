import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SITE_JSON_LD_BRAND, SITE_WEBSITE_NAME } from "@/lib/siteConfig";

const WHY_LANA = [
  "台灣現貨，盡快安排出貨",
  "一代通配煙彈，選擇多元",
  "30+ 種口味（依庫存）",
  "超商取貨付款",
  "滿額免運（依活動）",
  "LINE 客服確認庫存",
] as const;

const SERIES = [
  {
    name: "LANA 小蠻腰",
    desc: "皮革主機搭配 3 顆裝煙彈，陶瓷蜂巢霧化，調香層次豐富。適合重視質感與換彈式日常使用的台灣消費者。",
    to: "/product/lanna",
    guide: "/blog/lana-xiaomanyao-intro",
  },
  {
    name: "SP2S 思博瑞",
    desc: "一代／二代主機與通用煙彈，口味陣容大，涼感與甜度選擇多。適合已是 SP2S 生態或想嘗試思博瑞調香的使用者。",
    to: "/product/sp2s-universal-pods",
    guide: "/guide/sp2s-compatibility-guide",
  },
  {
    name: "DIYA 叮啞",
    desc: "提供換彈式霧化桿、通用煙彈與 7500 口拋棄式。適合想比較拋棄式便利與換彈式成本的使用者。",
    to: "/product/diya-7500",
    guide: "/blog/diya-review",
  },
  {
    name: "一代通配",
    desc: "多品牌主機與煙彈採相近規格，可靈活搭配。選購前請確認商品頁適配說明或詢問客服，避免買錯代數。",
    to: "/product/lana-pods",
    guide: "/guide/sp2s-compatibility-guide",
  },
  {
    name: "二代通用",
    desc: "SP2S 二代通用煙彈提供約 32 種口味，需搭配相容主機。與一代系列在口味與規格上可能不同，請仔細核對。",
    to: "/product/sp2s-universal-pods",
    guide: "/compare/lana-vs-sp2s",
  },
] as const;

/** 首屏下方：品牌與系列介紹（內容 SEO + GEO） */
const HomeBrandIntro = () => (
  <section
    id="home-brand-intro"
    className="border-t hairline py-16 md:py-20 bg-background scroll-mt-24"
    aria-labelledby="lana-intro-heading"
  >
    <div className="container max-w-4xl space-y-14">
      <div>
        <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">關於 LANA</p>
        <h2 id="lana-intro-heading" className="text-2xl md:text-3xl font-serif tracking-vogue text-foreground">
          LANA 是什麼？
        </h2>
        <p className="mt-4 text-muted-foreground leading-[1.85] text-sm md:text-base">
          <strong className="text-foreground">LANA</strong>（台灣常稱「小蠻腰」）是熱門 POD
          電子煙系列之一，提供皮革質感主機、3 顆裝煙彈與一代通配產品。系列強調台灣現貨、多元口味與換彈式日常使用體驗，可搭配
          {SITE_JSON_LD_BRAND} 主機或相容的一代規格主機。{SITE_WEBSITE_NAME}{" "}
          整理完整商品規格、選購指南與常見問題，協助您在購買前了解產品差異。
          更多說明請見
          <Link to="/blog/lana-xiaomanyao-intro" className="text-gold hover:underline mx-1">
            LANA 小蠻腰介紹
          </Link>
          與
          <Link to="/knowledge" className="text-gold hover:underline mx-1">
            知識中心
          </Link>
          。
        </p>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-serif tracking-vogue text-foreground">為什麼選 LANA？</h2>
        <ul className="mt-5 grid sm:grid-cols-2 gap-3">
          {WHY_LANA.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 text-gold shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-serif tracking-vogue text-foreground">熱門系列</h2>
        <div className="mt-6 space-y-6">
          {SERIES.map((s) => (
            <article key={s.name} className="rounded-2xl border border-gold/15 bg-card/30 p-5 md:p-6">
              <h3 className="text-lg font-semibold text-foreground">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <Link to={s.to} className="text-gold hover:underline">
                  查看商品 →
                </Link>
                <Link to={s.guide} className="text-foreground/70 hover:text-gold">
                  閱讀指南 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HomeBrandIntro;
