import HeroSection from "@/components/HeroSection";
import ServiceCategories from "@/components/ServiceCategories";
import VIPLevels from "@/components/VIPLevels";
import ProductRecommendations from "@/components/ProductRecommendations";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 text-center">
        <h1 className="text-xl font-bold">Luxury Marketplace</h1>
        <p className="text-white/90 text-sm">Premium Shopping Experience</p>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Service Categories */}
        <ServiceCategories />
        
        {/* VIP Levels */}
        <VIPLevels />
        
        {/* Product Recommendations */}
        <ProductRecommendations />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
