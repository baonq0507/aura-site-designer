import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NapTien from "./pages/NapTien";
import RutTien from "./pages/RutTien";
import QuyTacDatHang from "./pages/QuyTacDatHang";
import GioiThieuNenTang from "./pages/GioiThieuNenTang";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/nap-tien" element={<NapTien />} />
          <Route path="/rut-tien" element={<RutTien />} />
          <Route path="/quy-tac-dat-hang" element={<QuyTacDatHang />} />
          <Route path="/gioi-thieu-nen-tang" element={<GioiThieuNenTang />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
