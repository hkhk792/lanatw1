import { useEffect } from "react";
import AgeGate from "@/components/landing/AgeGate";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Collection from "@/components/landing/Collection";
import Manifesto from "@/components/landing/Manifesto";
import Footer from "@/components/landing/Footer";
import WeChatIcon from "@/components/WeChatIcon";

const Index = () => {
  useEffect(() => {
    document.title = "NOIRE — 蒸氣藝術巔峰 | 奢華霧化工坊";

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
      "NOIRE — 東京工藝打造的奢華蒸氣裝置與陶瓷芯煙彈。手工精加工鋁合金，獨特外觀，毫不妥協的工程設計。僅限18歲以上。"
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AgeGate />
      <Navbar />
      <main>
        <Hero />
        <Collection />
        <Manifesto />
      </main>
      <Footer />
      <WeChatIcon />
    </div>
  );
};

export default Index;
