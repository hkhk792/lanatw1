import { LINE_CUSTOMER_ID } from "@/constants/lineOfficial";
import { SITE_ORG_NAME, SITE_WEBSITE_NAME } from "@/lib/siteConfig";

export type ContentSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: ContentSection[];
  updated: string;
};

export const contentPages: ContentPage[] = [
  {
    slug: "about",
    title: `關於 ${SITE_ORG_NAME}`,
    description: `${SITE_WEBSITE_NAME} 專注於 LANA、SP2S 等電子煙主機、煙彈與拋棄式產品，提供台灣現貨配送與客服支援。`,
    intro: `${SITE_WEBSITE_NAME} 是面向台灣消費者的線上選品站，主打主機、菸彈、一次性產品與相關配件，並以清楚的商品資訊與售後說明建立信任。`,
    sections: [
      {
        heading: "我們是誰",
        paragraphs: [
          `我們經營 ${SITE_WEBSITE_NAME}，聚焦於電子煙主機、煙彈與拋棄式品項的現貨銷售。網站提供完整商品規格、口味選項與配送說明，方便消費者比較後下單。`,
          "我們重視商品資訊透明度，並透過 LINE 客服協助確認口味、庫存與訂單進度。",
        ],
      },
      {
        heading: "我們的承諾",
        paragraphs: ["我們以以下原則服務每一位顧客："],
        bullets: [
          "台灣現貨為主，盡快安排出貨",
          "商品頁清楚標示規格與適配資訊",
          "僅限 18 歲以上使用者選購",
          "提供配送、退換貨與常見問題說明",
        ],
      },
      {
        heading: "聯絡我們",
        paragraphs: [
          `如需協助，請透過網站 LINE 客服聯絡（LINE ID：${LINE_CUSTOMER_ID}），我們將協助確認商品、訂單與配送相關問題。`,
        ],
      },
    ],
    updated: "2026-07-08",
  },
  {
    slug: "shipping",
    title: "配送與運費說明",
    description: `${SITE_WEBSITE_NAME} 配送方式、滿額免運、超商取貨付款與出貨時間說明。`,
    intro: "本頁說明訂單出貨流程、運費計算與配送注意事項，請於下單前閱讀。",
    sections: [
      {
        heading: "配送方式",
        paragraphs: [
          "本站支援台灣本島配送，並提供超商取貨付款等結帳選項。實際可選配送方式以結帳頁顯示為準。",
        ],
      },
      {
        heading: "運費與免運",
        paragraphs: [
          "全館滿 NT$1,500 免運（依活動為準）。未達免運門檻時，運費將於結帳頁自動計算。",
        ],
      },
      {
        heading: "出貨時間",
        paragraphs: [
          "訂單確認後，我們將依庫存狀況安排出貨。尖峰期間或促銷期可能略有延遲，建議透過 LINE 客服查詢訂單進度。",
        ],
      },
    ],
    updated: "2026-07-08",
  },
  {
    slug: "returns",
    title: "退換貨政策",
    description: `${SITE_WEBSITE_NAME} 退換貨、瑕疵品處理與客服聯絡方式說明。`,
    intro: "電子煙與煙彈屬消耗性商品，退換貨政策以商品狀態與消費者權益為依據。",
    sections: [
      {
        heading: "鑑賞期與已拆封商品",
        paragraphs: [
          "基於衛生與安全考量，已拆封、已使用或已注油的煙彈與一次性產品，通常不適用於單純改變心意之退貨。請於下單前確認口味與規格。",
        ],
      },
      {
        heading: "瑕疵或錯誤商品",
        paragraphs: [
          "若商品到貨時有明顯瑕疵、漏發或錯誤品項，請於收到後盡快聯絡客服，並提供訂單編號與照片說明，我們將協助處理。",
        ],
        bullets: [
          "保留原包裝與配件以便核對",
          "提供清晰照片或簡短說明",
          "勿自行拆解或改造商品後再申請退換",
        ],
      },
    ],
    updated: "2026-07-08",
  },
  {
    slug: "privacy",
    title: "隱私權政策",
    description: `${SITE_WEBSITE_NAME} 如何收集、使用與保護您的個人資料。`,
    intro: "我們重視您的隱私，僅在提供服務所需範圍內處理個人資料。",
    sections: [
      {
        heading: "收集的資料",
        paragraphs: [
          "為完成訂單與配送，我們可能收集姓名、聯絡電話、收件地址、訂單內容等資訊。",
        ],
      },
      {
        heading: "資料使用",
        paragraphs: [
          "資料僅用於訂單處理、客服聯絡、配送與必要的帳務或爭議處理，不會出售予第三方。",
        ],
      },
      {
        heading: "資料安全",
        paragraphs: [
          "我們採取合理技術與管理措施保護資料；若您對個資有疑問，可透過 LINE 客服聯絡。",
        ],
      },
    ],
    updated: "2026-07-08",
  },
  {
    slug: "terms",
    title: "服務條款",
    description: `使用 ${SITE_WEBSITE_NAME} 網站與下單前請閱讀的服務條款。`,
    intro: "使用本網站即表示您同意以下條款與適用法規。",
    sections: [
      {
        heading: "年齡限制",
        paragraphs: [
          "您必須年滿 18 歲（或當地法定年齡）方可使用本站服務並下單。我們保留拒絕向不符合年齡要求者出貨的權利。",
        ],
      },
      {
        heading: "商品資訊",
        paragraphs: [
          "我們盡力維持商品資訊正確，但口味、包裝或規格可能因品牌更新而調整，請以商品頁與客服確認為準。",
        ],
      },
      {
        heading: "訂單與價格",
        paragraphs: [
          "訂單成立後，價格與運費以結帳當下顯示為準；若因庫存或系統因素無法出貨，我們將主動聯絡您。",
        ],
      },
    ],
    updated: "2026-07-08",
  },
  {
    slug: "age-verification",
    title: "年齡驗證聲明",
    description: `${SITE_WEBSITE_NAME} 僅供法定年齡以上使用者，說明年齡驗證與責任聲明。`,
    intro: "電子煙相關產品僅供成年人使用，請確認您符合當地法規。",
    sections: [
      {
        heading: "法定年齡",
        paragraphs: [
          "進入本站、瀏覽商品或下單，即表示您已年滿 18 歲（或您所在地區規定之法定年齡），並了解電子煙產品僅限成人使用。",
        ],
      },
      {
        heading: "健康提醒",
        paragraphs: [
          "電子煙產品含有尼古丁（依品項而定），可能對健康造成影響。孕婦、哺乳期婦女、未成年人及非吸菸者不應使用。",
        ],
      },
    ],
    updated: "2026-07-08",
  },
];

export function getContentPageBySlug(slug: string): ContentPage | undefined {
  return contentPages.find((p) => p.slug === slug);
}

export const contentPageSlugs = contentPages.map((p) => p.slug);
