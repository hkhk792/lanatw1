import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/lanna" element={<LannaDetail />} />
            <Route path="/product/bullet" element={<BulletDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product" element={<ProductDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSheet />
          <FloatingLineWidget />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
