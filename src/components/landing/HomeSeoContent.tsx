import { Link } from "react-router-dom";
import { SITE_JSON_LD_BRAND, SITE_WEBSITE_NAME } from "@/lib/siteConfig";
import { QuickAnswer } from "@/components/seo/QuickAnswer";

const HOME_QUICK_ANSWER = {
  question: `${SITE_WEBSITE_NAME} 是什麼？`,
  answer: `${SITE_WEBSITE_NAME} 是面向台灣的電子煙選購站，提供 ${SITE_JSON_LD_BRAND} 主機、煙彈與拋棄式現貨，支援超商取貨付款與 LINE 客服，僅限 18 歲以上選購。`,
};

const PRODUCT_LINKS = [
  { to: "/product/lanna", label: "LANA 皮革主機" },
  { to: "/product/lana-pods", label: "LANA 小蠻腰煙彈" },
  { to: "/product/sp2s-universal-pods", label: "SP2S 二代通用煙彈" },
  { to: "/product/bullet", label: "SP2S 一代主機" },
  { to: "/product/diya-7500", label: "DIYA 7500 拋棄式" },
  { to: "/product/hebat-gen6", label: "HEBAT 喜貝六代" },
] as const;

const HomeSeoContent = () => (
  <section
    id="home-seo-content"
    className="border-t hairline bg-background/50 py-16 md:py-20 scroll-mt-24"
    aria-labelledby="home-seo-heading"
  >
    <div className="container max-w-3xl text-sm md:text-base text-muted-foreground leading-[1.85] space-y-5">
      <p className="text-[10px] uppercase tracking-luxury text-gold">品牌選購指南</p>
      <h2 id="home-seo-heading" className="text-2xl md:text-3xl font-serif text-foreground tracking-vogue">
        {SITE_WEBSITE_NAME}：{SITE_JSON_LD_BRAND} 主機、煙彈與拋棄式完整選購
      </h2>

      <QuickAnswer data={HOME_QUICK_ANSWER} />

      <p>
        歡迎來到 {SITE_WEBSITE_NAME}。我們專注於台灣現貨的電子煙主機、菸彈與一次性產品，
        涵蓋 {SITE_JSON_LD_BRAND} 小蠻腰系列、SP2S 思博瑞通用煙彈，以及多款大口數拋棄式選項。
        不論您是第一次接觸電子煙，或正在尋找相容的煙彈與主機，都可以在站內依分類瀏覽，
        並透過商品頁了解規格、口味與適配資訊。
      </p>

      <p>
        <strong className="text-foreground">主機與煙彈怎麼選？</strong>
        一代通配主機通常可搭配多品牌菸彈，適合想靈活換口味的使用者；
        若您已確定偏好 {SITE_JSON_LD_BRAND} 系列，可從
        <Link to="/product/lanna" className="text-gold hover:underline mx-1">
          LANA 皮革主機
        </Link>
        搭配
        <Link to="/product/lana-pods" className="text-gold hover:underline mx-1">
          LANA 煙彈 3 顆裝
        </Link>
        開始。偏好 SP2S 的使用者則可參考
        <Link to="/product/bullet" className="text-gold hover:underline mx-1">
          SP2S 一代主機
        </Link>
        與
        <Link to="/product/sp2s-universal-pods" className="text-gold hover:underline mx-1">
          SP2S 二代通用煙彈
        </Link>
        ，依頁面口味列表選購。
      </p>

      <p>
        <strong className="text-foreground">拋棄式與換彈式差異</strong>
        拋棄式電子煙適合不想充電、希望即開即用的情境，例如
        <Link to="/product/diya-7500" className="text-gold hover:underline mx-1">
          DIYA 7500 口
        </Link>
        或
        <Link to="/product/hebat-gen6" className="text-gold hover:underline mx-1">
          HEBAT 喜貝六代
        </Link>
        ；換彈式則長期使用成本較低，且可依心情更換不同口味煙彈。
        若不確定哪一種適合您，建議閱讀我們的
        <Link to="/guides" className="text-gold hover:underline mx-1">
          選購指南
        </Link>
        與
        <Link to="/faq" className="text-gold hover:underline mx-1">
          常見問題
        </Link>
        。
      </p>

      <p>
        <strong className="text-foreground">台灣配送與正品保障</strong>
        本站主打台灣現貨，支援超商取貨付款流程，並提供滿額免運活動（依頁面公告為準）。
        下單前可透過 LINE 客服確認口味庫存；出貨與退換貨說明請見
        <Link to="/shipping" className="text-gold hover:underline mx-1">
          配送說明
        </Link>
        、
        <Link to="/returns" className="text-gold hover:underline mx-1">
          退換貨政策
        </Link>
        。我們僅服務
        <Link to="/age-verification" className="text-gold hover:underline mx-1">
          18 歲以上
        </Link>
        使用者，並提供
        <Link to="/about" className="text-gold hover:underline mx-1">
          關於我們
        </Link>
        與
        <Link to="/privacy" className="text-gold hover:underline mx-1">
          隱私權政策
        </Link>
        以建立透明信任。
      </p>

      <p>
        <strong className="text-foreground">熱門商品快速連結</strong>
        您可直接前往下列商品頁查看圖片、價格與口味：
      </p>

      <ul className="grid sm:grid-cols-2 gap-2">
        {PRODUCT_LINKS.map((p) => (
          <li key={p.to}>
            <Link to={p.to} className="text-gold hover:underline">
              {p.label}
            </Link>
          </li>
        ))}
      </ul>

      <p>
        電子煙產品僅供成年人使用，請遵守當地法規。本站內容旨在協助消費者做出 informed 的選購決策，
        並持續更新指南與 FAQ，讓 Google 與讀者都能理解我們的產品範圍與服務承諾。
        若您需要協助，歡迎透過頁尾 LINE 客服聯絡，我們將協助確認規格、庫存與訂單進度。
      </p>
    </div>
  </section>
);

export default HomeSeoContent;
