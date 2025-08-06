import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative h-56 md:h-72 lg:h-96 rounded-none border-t-4 border-b-4 border-primary overflow-hidden shadow-classic">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://videos.pexels.com/video-files/6775357/6775357-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/8135732/8135732-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      
      <div className="relative h-full flex flex-col justify-center items-center p-6 md:p-8 lg:p-12 text-center z-10">
        <div className="max-w-3xl space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-3 tracking-wide leading-tight drop-shadow-lg">
            PREMIUM FASHION EXPERIENCE
          </h1>
          <div className="w-24 h-0.5 bg-primary mx-auto drop-shadow-md"></div>
          <p className="text-white/95 text-base md:text-lg font-crimson italic leading-relaxed max-w-xl mx-auto drop-shadow-md">
            Witness the elegance of haute couture in our distinguished fashion showcase
          </p>
          
          <Button variant="luxury" size="lg" className="text-base md:text-lg px-8 md:px-12 py-3 md:py-4 shadow-classic-hover font-playfair font-semibold tracking-wide border-2 border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
            EXPLORE COLLECTION
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;