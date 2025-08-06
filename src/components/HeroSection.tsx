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
        {/* Clean fashion video display without content overlay */}
      </div>
    </div>
  );
};

export default HeroSection;