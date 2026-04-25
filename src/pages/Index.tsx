import { useEffect, useLayoutEffect } from "react";
import {
  consumeHomeScrollRestore,
  getPersistedHomeScrollY,
  persistCurrentHomeScroll,
} from "@/lib/homeScrollRestore";
import AgeGate from "@/components/landing/AgeGate";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Collection from "@/components/landing/Collection";
import PodsAndLiquid from "@/components/landing/PodsAndLiquid";
import Accessories from "@/components/landing/Accessories";
import Manifesto from "@/components/landing/Manifesto";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";

const Index = () => {
  useLayoutEffect(() => {
    if (consumeHomeScrollRestore()) {
      const y = getPersistedHomeScrollY();
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => persistCurrentHomeScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "SP2S — 品味精髓 | 奢華蒸氣工坊";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "SP2S — 新一代風味科技。手工精製設備、陶瓷芯彈匣和訂製配飾，為精緻生活打造。僅限18歲以上。"
    );

    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", window.location.origin + "/");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-12">
      <AgeGate />
      <Navbar />
      <main>
        <Hero />
        <Collection />
        <PodsAndLiquid />
        <Accessories />
        <Manifesto />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default Index;
