import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
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
          <Route path="/auth" element={<PageLayout title="Đăng nhập"><Auth /></PageLayout>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<PageLayout title="Hồ sơ cá nhân"><Profile /></PageLayout>} />
          <Route path="/nap-tien" element={<PageLayout title="Nạp tiền"><NapTien /></PageLayout>} />
          <Route path="/rut-tien" element={<PageLayout title="Rút tiền"><RutTien /></PageLayout>} />
          <Route path="/quy-tac-dat-hang" element={<PageLayout title="Quy tắc đặt hàng"><QuyTacDatHang /></PageLayout>} />
          <Route path="/gioi-thieu-nen-tang" element={<PageLayout title="Giới thiệu nền tảng"><GioiThieuNenTang /></PageLayout>} />
          <Route path="/delivery-info" element={<PageLayout title="Thông tin giao hàng"><DeliveryInfo /></PageLayout>} />
          <Route path="/bank-linking" element={<PageLayout title="Liên kết ngân hàng"><BankLinking /></PageLayout>} />
          <Route path="/task-center" element={<PageLayout title="Trung tâm nhiệm vụ"><TaskCenter /></PageLayout>} />
          <Route path="/vip-info" element={<PageLayout title="Thông tin VIP"><VipInfo /></PageLayout>} />
          <Route path="/group-report" element={<PageLayout title="Báo cáo nhóm"><GroupReport /></PageLayout>} />
          <Route path="/language" element={<PageLayout title="Ngôn ngữ"><Language /></PageLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageLayout title="Không tìm thấy"><NotFound /></PageLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
