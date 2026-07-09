import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { PODPICK_GUIDE_TAIWAN_URL, PODPICK_GUIDE_URL } from "@/data/site";

const HUB_LINKS = [
  { label: "知識中心", to: "/knowledge", description: "指南、部落格、比較、口味、品牌" },
  { label: "選購指南", to: "/guides", description: "保存、漏油、通配、口味入門" },
  { label: "部落格", to: "/blog", description: "LANA、DIYA 介紹與使用心得" },
  { label: "產品比較", to: "/compare", description: "LANA vs SP2S 等對比" },
  { label: "口味專區", to: "/flavors", description: "煙彈口味分類與選購" },
  { label: "品牌介紹", to: "/brands", description: "LANA 品牌完整指南" },
  { label: "LANA 主機", to: "/product/lanna", description: "皮革主機一代通配" },
  { label: "LANA 煙彈", to: "/product/lana-pods", description: "小蠻腰 3 顆裝多口味" },
  { label: "SP2S 煙彈", to: "/product/sp2s-universal-pods", description: "二代通用菸彈" },
  { label: "常見問題", to: "/faq", description: "配送、付款與使用" },
  { label: "配送說明", to: "/shipping", description: "超商取貨與免運" },
  { label: "關於我們", to: "/about", description: "品牌與客服資訊" },
  {
    label: "PodPick 台灣專區",
    href: PODPICK_GUIDE_TAIWAN_URL,
    external: true,
    description: "SP2S／LANA 深度評測",
  },
  {
    label: "PodPick Guide",
    href: PODPICK_GUIDE_URL,
    external: true,
    description: "獨立口味評測知識庫",
  },
] as const;

/** Internal linking hub surfaced at the end of knowledge articles. */
export function ContentHubLinks() {
  return (
    <nav aria-label="延伸閱讀" className="mt-14 rounded-2xl border border-gold/20 bg-card/40 p-5 sm:p-6">
      <h2 className="text-lg font-bold mb-4">延伸探索</h2>
      <ul className="grid sm:grid-cols-2 gap-3">
        {HUB_LINKS.map((link) => (
          <li key={"to" in link ? link.to : link.href}>
            {"to" in link ? (
              <Link
                to={link.to}
                className="group block rounded-xl border border-gold/15 bg-background/50 p-3 hover:border-gold/40 transition-colors"
              >
                <span className="text-sm font-semibold text-primary group-hover:text-gold">{link.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
              </Link>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-gold/15 bg-background/50 p-3 hover:border-gold/40 transition-colors"
              >
                <span className="text-sm font-semibold text-primary group-hover:text-gold inline-flex items-center gap-1">
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
