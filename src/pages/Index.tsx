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
      {/* Hero Section */}
      <HeroSection />

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

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-12 md:space-y-16">
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
