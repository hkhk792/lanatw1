import { useEffect, useLayoutEffect } from "react";
import {
  consumeHomeScrollRestore,
  getPersistedHomeScrollY,
  persistCurrentHomeScroll,
} from "@/lib/homeScrollRestore";
import AgeGate from "@/components/landing/AgeGate";
import EntryActivityPromoGate from "@/components/landing/EntryActivityPromoGate";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PinkyImportedSection from "@/components/landing/PinkyImportedSection";
import Manifesto from "@/components/landing/Manifesto";
import HuanVapeStoreSection from "@/components/landing/HuanVapeStoreSection";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import HomeSeoContent from "@/components/landing/HomeSeoContent";
import HomeFaq from "@/components/landing/HomeFaq";

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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
      <AgeGate />
      <EntryActivityPromoGate />
      <Navbar />
      <main>
        <Hero />
        <PinkyImportedSection />
        <HuanVapeStoreSection />
        <Manifesto />
        <HomeSeoContent />
        <HomeFaq />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default Index;
