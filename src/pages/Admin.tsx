import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { UserManagement } from "@/components/admin/UserManagement";
import { VIPManagement } from "@/components/admin/VIPManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { DepositHistory } from "@/components/admin/DepositHistory";
import { WithdrawalManagement } from "@/components/admin/WithdrawalManagement";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    checkAdminAccess();
    // Add admin layout class to body for full-width layout
    document.body.classList.add('admin-layout');
    
    return () => {
      // Remove admin layout class when leaving admin
      document.body.classList.remove('admin-layout');
    };
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Check if user has admin role
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!userRoles);
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Checking permissions...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "vip":
        return <VIPManagement />;
      case "products":
        return <ProductManagement />;
      case "deposits":
        return <DepositHistory />;
      case "withdrawals":
        return <WithdrawalManagement />;
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