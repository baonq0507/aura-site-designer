import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import ServiceCategories from "@/components/ServiceCategories";
import VIPLevels from "@/components/VIPLevels";
import ProductRecommendations from "@/components/ProductRecommendations";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { user, session, signOut } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background pb-20">{/* Keep bottom padding for mobile */}
      {/* Hero Section */}
      <HeroSection />

      {/* Running Text Banner */}
      <div className="bg-gradient-luxury text-black py-1 overflow-hidden relative border-t-2 border-b-2 border-primary/20 shadow-elegant">
        <div className="animate-[scroll_25s_linear_infinite] md:animate-[scroll_35s_linear_infinite] whitespace-nowrap">
          <span className="inline-block px-6 font-playfair font-semibold text-shadow-lg mr-[100vw] tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.4)' }}>
            ◆ WELCOME TO FARFETCH MARKETPLACE - THE PREMIER DESTINATION FOR DISTINGUISHED SHOPPING◆ EXCLUSIVE PRIVILEGES FOR VIP MEMBERS◆ COMPLIMENTARY NATIONWIDE SHIPPING◆ AUTHENTIC PRODUCTS GUARANTEED 100% ◆
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8 md:space-y-12">
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

      {/* Bottom Navigation - Always visible */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
