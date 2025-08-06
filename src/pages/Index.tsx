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
      <div className="bg-primary text-black py-3 overflow-hidden relative border-t-2 border-b-2 border-primary/20">
        <div className="animate-[scroll_25s_linear_infinite] md:animate-[scroll_35s_linear_infinite] whitespace-nowrap">
          <span className="inline-block px-6 font-playfair font-semibold text-shadow-lg mr-[100vw] tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.4)' }}>
            ◆ WELCOME TO LUXURY MARKETPLACE - THE PREMIER DESTINATION FOR DISTINGUISHED SHOPPING 
            ◆ EXCLUSIVE PRIVILEGES FOR VIP MEMBERS 
            ◆ COMPLIMENTARY NATIONWIDE SHIPPING 
            ◆ AUTHENTIC PRODUCTS GUARANTEED 100% ◆
          </span>
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-7xl mx-auto flex justify-end">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-playfair font-medium text-muted-foreground hidden sm:inline tracking-wide">
                {user.email}
              </span>
              <Button
                onClick={() => navigate("/nap-tien")}
                variant="copper"
                size="sm"
                className="shadow-classic hover:shadow-classic-hover font-playfair tracking-wide border border-white/20"
              >
                NẠP TIỀN
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 hover:bg-primary/10 hover:border-primary font-playfair tracking-wide"
              >
                RÚT TIỀN
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/auth?tab=signin")}
                variant="outline"
                size="sm"
                className="border-primary/30 hover:bg-primary/10 hover:border-primary font-playfair tracking-wide"
              >
                ĐĂNG NHẬP
              </Button>
              <Button
                onClick={() => navigate("/auth?tab=signup")}
                size="sm"
                className="bg-gradient-primary hover:bg-gradient-luxury font-playfair font-semibold tracking-wide border border-white/20"
              >
                ĐĂNG KÝ
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-12 md:space-y-16">
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
