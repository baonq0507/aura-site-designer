import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import TranslatedRoute from "@/components/TranslatedRoute";
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
import PurchaseHistory from "./pages/PurchaseHistory";
import VipLevelsPage from "./pages/VipLevels";
import WithdrawalHistory from "./pages/WithdrawalHistory";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<TranslatedRoute titleKey="page.title.auth"><Auth /></TranslatedRoute>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<TranslatedRoute titleKey="page.title.profile"><Profile /></TranslatedRoute>} />
          <Route path="/nap-tien" element={<TranslatedRoute titleKey="page.title.topup"><NapTien /></TranslatedRoute>} />
          <Route path="/rut-tien" element={<TranslatedRoute titleKey="page.title.withdraw"><RutTien /></TranslatedRoute>} />
          <Route path="/quy-tac-dat-hang" element={<TranslatedRoute titleKey="page.title.order.rules"><QuyTacDatHang /></TranslatedRoute>} />
          <Route path="/gioi-thieu-nen-tang" element={<TranslatedRoute titleKey="page.title.platform.intro"><GioiThieuNenTang /></TranslatedRoute>} />
          <Route path="/about-us" element={<TranslatedRoute titleKey="page.title.about.us"><GioiThieuNenTang /></TranslatedRoute>} />
          <Route path="/ve-chung-toi" element={<TranslatedRoute titleKey="page.title.about.us"><GioiThieuNenTang /></TranslatedRoute>} />
          <Route path="/delivery-info" element={<TranslatedRoute titleKey="page.title.delivery.info"><DeliveryInfo /></TranslatedRoute>} />
          <Route path="/bank-linking" element={<TranslatedRoute titleKey="page.title.bank.linking"><BankLinking /></TranslatedRoute>} />
          <Route path="/task-center" element={<TranslatedRoute titleKey="page.title.task.center"><TaskCenter /></TranslatedRoute>} />
          <Route path="/vip-info" element={<TranslatedRoute titleKey="page.title.vip.info"><VipInfo /></TranslatedRoute>} />
          <Route path="/group-report" element={<TranslatedRoute titleKey="page.title.group.report"><GroupReport /></TranslatedRoute>} />
          <Route path="/language" element={<TranslatedRoute titleKey="page.title.language"><Language /></TranslatedRoute>} />
          <Route path="/history" element={<TranslatedRoute titleKey="page.title.purchase.history"><PurchaseHistory /></TranslatedRoute>} />
          <Route path="/vip-levels" element={<TranslatedRoute titleKey="page.title.vip.levels"><VipLevelsPage /></TranslatedRoute>} />
          <Route path="/withdrawal-history" element={<TranslatedRoute titleKey="page.title.withdrawal.history"><WithdrawalHistory /></TranslatedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<TranslatedRoute titleKey="page.title.not.found"><NotFound /></TranslatedRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
