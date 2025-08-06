import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const TaskCenter = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [userVipData, setUserVipData] = useState<{
    vip_level: number;
    commission_rate: number;
    level_name: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserVipData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch user profile with VIP level
        const { data: profile } = await supabase
          .from('profiles')
          .select('vip_level')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Fetch VIP level details
          const { data: vipLevel } = await supabase
            .from('vip_levels')
            .select('level_name, commission_rate')
            .eq('id', profile.vip_level)
            .single();

          if (vipLevel) {
            setUserVipData({
              vip_level: profile.vip_level,
              commission_rate: vipLevel.commission_rate,
              level_name: vipLevel.level_name
            });
          }
        }
      }
    };

    fetchUserVipData();
  }, []);

  const stats = [
    { label: "Số dự khả dụng", value: "0.00 USD" },
    { label: "Lợi nhuận đã nhận", value: "0 USD" },
    { label: "Nhiệm vụ hôm nay", value: "60" },
    { label: "Hoàn Thành", value: "0" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* VIP Commission Rate Header */}
      <div className="bg-gradient-luxury p-4 flex items-center gap-2">
        <ArrowLeft 
          className="text-white w-6 h-6 cursor-pointer" 
          onClick={() => navigate(-1)}
        />
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src="/src/assets/vip1-icon.png" 
            alt="VIP" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-white font-semibold">
          TỶ LỆ HOA HỒNG: {userVipData ? `${(userVipData.commission_rate * 100).toFixed(2)}%` : '0.06%'}
        </span>
      </div>

      {/* Video Section */}
      <div className="relative bg-black aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <video 
          src="https://south.splamals.top/static_index/macimg/video_or.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Auto-playing indicator */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white/50 animate-[slide-in-right_30s_linear_infinite] origin-left"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className="font-semibold text-right">{stat.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Start Button */}
        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base">
          BẮT ĐẦU NHẬN ĐƠN HÀNG
        </Button>
      </div>

      {/* Promotional Section */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop"
            alt="Spring promotion"
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">Amp up Your Spring Break</h3>
            <p className="text-gray-600 text-sm">Get Started</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg overflow-hidden shadow-sm">
          <div className="p-4">
            <h3 className="font-semibold text-white">Earn Points with MOA Insiders</h3>
            <p className="text-white/80 text-sm">Get Started</p>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop"
            alt="Employment promotion"
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">Employment at Mall of America</h3>
            <p className="text-gray-600 text-sm">Apply Today</p>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=200&fit=crop"
            alt="Mall directory"
            className="w-full h-40 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCenter;