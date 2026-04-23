import { useEffect } from "react";
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
  useEffect(() => {
    document.title = "AETHER VAPE — Master the Essence | Luxury Vapor Atelier";

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
      "AETHER VAPE — next-generation flavor technology. Hand-finished devices, ceramic-coil pods and bespoke accessories crafted for a refined lifestyle. 21+ only."
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
