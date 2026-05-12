import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import CartSheet from "@/components/CartSheet";
import FloatingLineWidget from "@/components/FloatingLineWidget";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import LannaDetail from "./pages/LannaDetail.tsx";
import BulletDetail from "./pages/BulletDetail.tsx";
import Sp2sProDetail from "./pages/Sp2sProDetail.tsx";
import AtomizerDetail from "./pages/AtomizerDetail.tsx";
import DiyaDetail from "./pages/DiyaDetail.tsx";
import LanaPodsDetail from "./pages/LanaPodsDetail.tsx";
import DiyaPodsDetail from "./pages/DiyaPodsDetail.tsx";
import Sp2sGen1PodsDetail from "./pages/Sp2sGen1PodsDetail.tsx";
import VenusHostDetail from "./pages/VenusHostDetail.tsx";
import MohooTokyoBoxDetail from "./pages/MohooTokyoBoxDetail.tsx";
import HebatGen6Detail from "./pages/HebatGen6Detail.tsx";
import Diya7500DisposableDetail from "./pages/Diya7500DisposableDetail.tsx";
import Jupiter6500SetDetail from "./pages/Jupiter6500SetDetail.tsx";
import VaporStorm5000Detail from "./pages/VaporStorm5000Detail.tsx";
import VaporStormGen5PodsDetail from "./pages/VaporStormGen5PodsDetail.tsx";
import LanaEliquid30mlDetail from "./pages/LanaEliquid30mlDetail.tsx";
import Sp2sSiliconeSleeveDetail from "./pages/Sp2sSiliconeSleeveDetail.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderComplete from "./pages/OrderComplete.tsx";
import Admin from "./pages/Admin.tsx";
import Sp2sPodFlavorGuidePage from "./pages/Sp2sPodFlavorGuidePage.tsx";
import LanavapNews10Page from "./pages/LanavapNews10Page.tsx";
import AirportVapeArticlePage from "./pages/AirportVapeArticlePage.tsx";
import PinkyImportedCatalogDetailPage from "./pages/PinkyImportedCatalogDetailPage.tsx";
import Sp2sUniversalPodsDetail from "./pages/Sp2sUniversalPodsDetail.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopOnNavigate />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/info/sp2s-pod-flavor-guide" element={<Sp2sPodFlavorGuidePage />} />
            <Route path="/info/diy-e-liquid-guide" element={<LanavapNews10Page />} />
            <Route
              path="/info/lanavap-news-10"
              element={<Navigate to="/info/diy-e-liquid-guide" replace />}
            />
            <Route path="/info/airport-vaping-guide" element={<AirportVapeArticlePage />} />
            <Route path="/catalog/:id" element={<PinkyImportedCatalogDetailPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-complete" element={<OrderComplete />} />
            <Route path="/admin2589" element={<Admin />} />
            <Route path="/product/lanna" element={<LannaDetail />} />
            <Route path="/product/bullet" element={<BulletDetail />} />
            <Route path="/product/pro" element={<Sp2sProDetail />} />
            <Route path="/product/atomizer" element={<AtomizerDetail />} />
            <Route path="/product/diya" element={<DiyaDetail />} />
            <Route path="/product/diya-7500" element={<Diya7500DisposableDetail />} />
            <Route path="/product/jupiter-6500" element={<Jupiter6500SetDetail />} />
            <Route path="/product/vapor-storm-5000" element={<VaporStorm5000Detail />} />
            <Route path="/product/vapor-storm-gen5-pods" element={<VaporStormGen5PodsDetail />} />
            <Route path="/product/lana-e-liquid-30ml" element={<LanaEliquid30mlDetail />} />
            <Route path="/product/sp2s-silicone-sleeve" element={<Sp2sSiliconeSleeveDetail />} />
            <Route path="/product/lana-pods" element={<LanaPodsDetail />} />
            <Route path="/product/diya-pods" element={<DiyaPodsDetail />} />
            <Route path="/product/sp2s-gen1-pods" element={<Sp2sGen1PodsDetail />} />
            <Route path="/product/sp2s-universal-pods" element={<Sp2sUniversalPodsDetail />} />
            <Route path="/product/venus-host" element={<VenusHostDetail />} />
            <Route path="/product/mohoo-tokyo-box" element={<MohooTokyoBoxDetail />} />
            <Route path="/product/hebat-gen6" element={<HebatGen6Detail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product" element={<ProductDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSheet />
          <FloatingLineWidget />
        </BrowserRouter>
        <Analytics />
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
