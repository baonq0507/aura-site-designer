import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import ServiceCategories from "@/components/ServiceCategories";
import VIPLevels from "@/components/VIPLevels";
import ProductRecommendations from "@/components/ProductRecommendations";
import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Running Text Banner */}
      <div className="bg-primary text-black py-2 overflow-hidden relative">
        <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          <span className="inline-block px-4 font-semibold text-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.4)' }}>
            🎉 Chào mừng đến với Luxury Marketplace - Nơi mua sắm cao cấp hàng đầu 
            ⭐ Ưu đãi đặc biệt cho thành viên VIP 
            🚚 Miễn phí vận chuyển toàn quốc 
            💎 Sản phẩm chính hãng 100% 
            🎉 Chào mừng đến với Luxury Marketplace - Nơi mua sắm cao cấp hàng đầu 
            ⭐ Ưu đãi đặc biệt cho thành viên VIP 
            🚚 Miễn phí vận chuyển toàn quốc 
            💎 Sản phẩm chính hãng 100%
          </span>
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="bg-secondary/50 p-3 border-b border-accent/20">
        <div className="max-w-7xl mx-auto flex justify-end">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-accent/20 hover:bg-accent/10"
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="sm"
              className="border-accent/20 hover:bg-accent/10"
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <HeroSection />
        </div>
        
        {/* Service Categories */}
        <div className="max-w-2xl mx-auto">
          <ServiceCategories />
        </div>
        
        {/* VIP Levels */}
        <div className="max-w-6xl mx-auto">
          <VIPLevels />
        </div>
        
        {/* Product Recommendations */}
        <div className="max-w-7xl mx-auto">
          <ProductRecommendations />
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Index;
