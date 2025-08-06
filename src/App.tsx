import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NapTien from "./pages/NapTien";
import RutTien from "./pages/RutTien";
import QuyTacDatHang from "./pages/QuyTacDatHang";
import GioiThieuNenTang from "./pages/GioiThieuNenTang";
import DeliveryInfo from "./pages/DeliveryInfo";
import BankLinking from "./pages/BankLinking";
import VipInfo from "./pages/VipInfo";
import TaskCenter from "./pages/TaskCenter";
import GroupReport from "./pages/GroupReport";
import Language from "./pages/Language";
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nap-tien" element={<NapTien />} />
          <Route path="/rut-tien" element={<RutTien />} />
          <Route path="/quy-tac-dat-hang" element={<QuyTacDatHang />} />
          <Route path="/gioi-thieu-nen-tang" element={<GioiThieuNenTang />} />
          <Route path="/delivery-info" element={<DeliveryInfo />} />
          <Route path="/bank-linking" element={<BankLinking />} />
          <Route path="/task-center" element={<TaskCenter />} />
          <Route path="/vip-info" element={<VipInfo />} />
          <Route path="/group-report" element={<GroupReport />} />
          <Route path="/language" element={<Language />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
