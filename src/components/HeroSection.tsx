import { Button } from "@/components/ui/button";
import heroMall from "@/assets/hero-mall.jpg";

const HeroSection = () => {
  return (
    <div 
      className="relative h-56 md:h-72 lg:h-96 rounded-none border-t-4 border-b-4 border-primary overflow-hidden shadow-classic bg-cover bg-center"
      style={{ backgroundImage: `url(${heroMall})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-center items-center p-6 md:p-8 lg:p-12 text-center">
        <div className="max-w-3xl space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-3 tracking-wide leading-tight">
            PREMIUM SHOPPING EXPERIENCE
          </h1>
          <div className="w-24 h-0.5 bg-primary mx-auto"></div>
          <p className="text-white/90 text-base md:text-lg font-crimson italic leading-relaxed max-w-xl mx-auto">
            Discover luxury brands and exclusive deals in our distinguished marketplace
          </p>
          
          <Button variant="luxury" size="lg" className="text-base md:text-lg px-8 md:px-12 py-3 md:py-4 shadow-classic-hover font-playfair font-semibold tracking-wide border-2 border-white/20 hover:border-white/40 transition-all duration-300">
            COMMENCE SHOPPING
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;