import { Button } from "@/components/ui/button";
import TopNavigation from "./TopNavigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const storeImages = [
  "/lovable-uploads/297c3d4e-9ec4-4ca1-8b36-772d5cf2e95a.png",
  "/lovable-uploads/4a11c447-5886-49ae-80f2-967de5c975a5.png", 
  "/lovable-uploads/7ef41c8c-0c34-4613-bc84-f49161e08c46.png",
  "/lovable-uploads/7a6e5118-d3d2-4cfb-9cb3-4fd864ff8538.png",
  "/lovable-uploads/ed57d622-271a-400f-ab18-e26b2094f61c.png",
  "/lovable-uploads/a2f2e06f-49c6-44b8-a5ff-4936e2b3a1c2.png",
  "/lovable-uploads/b152ee1c-8033-4a39-a947-bc86b9df7ba1.png"
];

const HeroSection = () => {
  return (
    <div className="relative">
      {/* Header with Logo and App Name */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 shadow-sm">
                <img 
                  src="/lovable-uploads/cd6c4d00-a830-4a81-8997-51e4996711f5.png" 
                  alt="Farfetch logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground font-playfair">
                  Farfetch
                </h1>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Luxury Fashion Marketplace
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <TopNavigation />
          </div>
        </div>
      </header>

      {/* Hero Swiper Section */}
      <div className="relative h-56 md:h-72 lg:h-96 rounded-none border-t-4 border-b-4 border-primary overflow-hidden shadow-classic">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/60 !w-3 !h-3',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125'
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          className="w-full h-full"
        >
          {storeImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={`Luxury Store ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSection;