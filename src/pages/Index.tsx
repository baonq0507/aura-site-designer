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
      {/* Header */}
      <div className="bg-gradient-copper text-black p-4 shadow-luxury border-b border-accent/20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-center flex-1 md:text-left md:flex-none">
            <h1 className="text-xl md:text-2xl font-bold">Luxury Marketplace</h1>
            <p className="text-black/80 text-sm font-medium">Premium Shopping Experience</p>
          </div>
          
          {/* Top Navigation for Desktop */}
          <div className="flex-1 flex justify-center">
            <TopNavigation />
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-black/80 hidden sm:inline">
                  {user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="bg-black/10 text-black border-black/20 hover:bg-black/20"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                size="sm"
                className="bg-black/10 text-black border-black/20 hover:bg-black/20"
              >
                Đăng nhập
              </Button>
            )}
          </div>
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
