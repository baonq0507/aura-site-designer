import { Button } from "@/components/ui/button";
import heroMall from "@/assets/hero-mall.jpg";

const HeroSection = () => {
  return (
    <div 
      className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-luxury bg-cover bg-center"
      style={{ backgroundImage: `url(${heroMall})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Premium Shopping Experience
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-6">
            Discover luxury brands and exclusive deals
          </p>
          
          <Button variant="luxury" size="lg" className="text-lg px-8 py-3">
            Start Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;