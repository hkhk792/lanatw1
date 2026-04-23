import { useEffect } from "react";
import AgeGate from "@/components/landing/AgeGate";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Collection from "@/components/landing/Collection";
import Manifesto from "@/components/landing/Manifesto";
import Footer from "@/components/landing/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "NOIRE — The Pinnacle of Vapor | Luxury Atomization Atelier";

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
      "NOIRE — luxury vapor devices and ceramic-core pods crafted in Tokyo. Hand-finished aluminum, signature finishes, uncompromised engineering. 21+ only."
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
    </div>
  );
};

export default Index;
