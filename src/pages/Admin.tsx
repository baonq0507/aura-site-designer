import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { Loading } from "@/components/ui/loading";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Shield, 
  BarChart3,
  Package,
  CreditCard,
  MessageSquare,
  FileText,
  Calendar,
  AlertCircle
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { UserManagement } from "@/components/admin/UserManagement";
import { VIPManagement } from "@/components/admin/VIPManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { DepositHistory } from "@/components/admin/DepositHistory";
import { WithdrawalManagement } from "@/components/admin/WithdrawalManagement";
import SupportChatManagement from "@/components/admin/SupportChatManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import UserPurchaseManagement from "@/components/admin/UserPurchaseManagement";
import SystemControl from "@/components/admin/SystemControl";
import SystemDebug from "@/components/admin/SystemDebug";

const Admin = () => {
  const { user } = useAuthContext();
  const { isAdmin, loading, error, refreshAdminStatus } = useAdminStatus();
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    // Add admin layout class to body for full-width layout
    document.body.classList.add('admin-layout');
    
    return () => {
      // Remove admin layout class when leaving admin
      document.body.classList.remove('admin-layout');
    };
  }, []);

  if (loading) {
    return (
      <Loading 
        size="xl"
        text="Đang kiểm tra quyền truy cập..."
        fullScreen
      />
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">Lỗi kiểm tra quyền</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <Button onClick={refreshAdminStatus} className="w-full">
              Thử lại
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-600 mb-2">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập vào trang quản trị. 
            Vui lòng liên hệ admin để được cấp quyền.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "user-purchases":
        return <UserPurchaseManagement />;
      case "orders":
        return <OrderManagement />;
      case "vip":
        return <VIPManagement />;
      case "products":
        return <ProductManagement />;
      case "deposits":
        return <DepositHistory />;
      case "withdrawals":
        return <WithdrawalManagement />;
      case "support":
        return <SupportChatManagement />;
      case "system":
        return <SystemControl />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader user={user} />
            <main className="flex-1 bg-background p-4 lg:p-6">
              {renderActiveSection()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;