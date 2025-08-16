import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import NapTien from "@/pages/NapTien";
import RutTien from "@/pages/RutTien";
import QuyTacDatHang from "@/pages/QuyTacDatHang";
import GioiThieuNenTang from "@/pages/GioiThieuNenTang";
import DeliveryInfo from "@/pages/DeliveryInfo";
import BankLinking from "@/pages/BankLinking";
import TaskCenter from "@/pages/TaskCenter";
import VipInfo from "@/pages/VipInfo";
import GroupReport from "@/pages/GroupReport";
import Language from "@/pages/Language";
import PurchaseHistory from "@/pages/PurchaseHistory";
import VipLevelsPage from "@/pages/VipLevels";
import WithdrawalHistory from "@/pages/WithdrawalHistory";
import DepositHistory from "@/pages/DepositHistory";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import TranslatedRoute from "@/components/TranslatedRoute";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<TranslatedRoute titleKey="page.title.auth"><Auth /></TranslatedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.profile"><Profile /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/nap-tien" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.topup"><NapTien /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/rut-tien" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.withdraw"><RutTien /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/quy-tac-dat-hang" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.order.rules"><QuyTacDatHang /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/gioi-thieu-nen-tang" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.platform.intro"><GioiThieuNenTang /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/about-us" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.about.us"><GioiThieuNenTang /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/ve-chung-toi" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.about.us"><GioiThieuNenTang /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/delivery-info" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.delivery.info"><DeliveryInfo /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/bank-linking" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.bank.linking"><BankLinking /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/task-center" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.task.center"><TaskCenter /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/vip-info" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.vip.info"><VipInfo /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/group-report" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.group.report"><GroupReport /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/language" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.language"><Language /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.purchase.history"><PurchaseHistory /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/vip-levels" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.vip.levels"><VipLevelsPage /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/withdrawal-history" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.withdrawal.history"><WithdrawalHistory /></TranslatedRoute></ProtectedRoute>} />
          <Route path="/deposit-history" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.deposit.history"><DepositHistory /></TranslatedRoute></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<ProtectedRoute><TranslatedRoute titleKey="page.title.not.found"><NotFound /></TranslatedRoute></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
