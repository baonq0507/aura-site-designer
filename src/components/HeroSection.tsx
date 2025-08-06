import { Button } from "@/components/ui/button";
import TopNavigation from "./TopNavigation";

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

      {/* Hero Video Section */}
      <div className="relative h-56 md:h-72 lg:h-96 rounded-none border-t-4 border-b-4 border-primary overflow-hidden shadow-classic">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://keringns.com/staticindex/storage/setting/vcl/2024.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <div className="relative h-full flex flex-col justify-center items-center p-6 md:p-8 lg:p-12 text-center z-10">
          {/* Clean fashion video display without content overlay */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;