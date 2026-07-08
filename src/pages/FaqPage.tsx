import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteFaqItems } from "@/data/siteFaq";

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
        <p className="text-muted-foreground mb-8 leading-relaxed">
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
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default FaqPage;
