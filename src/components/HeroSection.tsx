import { Button } from "@/components/ui/button";
import heroMall from "@/assets/hero-mall.jpg";
const HeroSection = () => {
  return <div className="relative h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-luxury bg-cover bg-center" style={{
    backgroundImage: `url(${heroMall})`
  }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-end p-4 md:p-6 lg:p-8">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
            Premium Shopping Experience
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-4 md:mb-6">
            Discover luxury brands and exclusive deals
          </p>
          
          <Button variant="luxury" size="lg" className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 shadow-glow">hiệ</Button>
        </div>
      </div>
    </div>;
};
export default HeroSection;