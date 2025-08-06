import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Grid3X3, Crown, Package, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as AuthUser } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";

const TopNavigation = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserAndRole();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAndRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await checkAdminRole(session.user.id);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      setIsAdmin(!!userRoles);
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: Grid3X3, label: t('nav.categories'), path: "/categories" },
    { icon: Crown, label: t('nav.vip'), path: "/vip" },
    { icon: Package, label: t('nav.products'), path: "/products" },
    { icon: User, label: t('nav.personal'), path: "/profile" }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          onClick={() => navigate(item.path)}
          className="flex items-center space-x-2 text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors"
        >
          <item.icon className="w-4 h-4" />
          <span className="font-medium">{item.label}</span>
        </Button>
      ))}
      
      {user && isAdmin && (
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-2 text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors border border-primary/20"
        >
          <Shield className="w-4 h-4" />
          <span className="font-medium">{t('nav.admin')}</span>
        </Button>
      )}
    </nav>
  );
};

export default TopNavigation;