import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { ContentHubLinks } from "@/components/seo/ContentHubLinks";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteFaqItems } from "@/data/siteFaq";
import { SITE_WEBSITE_NAME } from "@/lib/siteConfig";

const faqQuickAnswer = {
  question: `在 ${SITE_WEBSITE_NAME} 下單要注意什麼？`,
  answer:
    "本站主打台灣現貨，支援超商取貨付款，滿 NT$1,500 免運（依活動為準）。下單前建議透過 LINE 客服確認口味與庫存，僅限 18 歲以上選購。",
};

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <span>常見問題</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-serif tracking-vogue mb-4">常見問題</h1>
        <QuickAnswer data={faqQuickAnswer} />
        <p className="text-muted-foreground my-8 leading-relaxed">
          關於訂購、配送、付款、產品使用與年齡限制的常見疑問。若未找到答案，請透過頁尾 LINE 客服聯絡我們。
        </p>
        <Accordion type="single" collapsible className="w-full">
          {siteFaqItems.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <ContentHubLinks />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default FaqPage;
