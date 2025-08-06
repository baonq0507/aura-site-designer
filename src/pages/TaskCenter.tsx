import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProductModal from "@/components/ProductModal";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  vip_level_id: number;
}

const TaskCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [userVipData, setUserVipData] = useState<{
    vip_level: number;
    commission_rate: number;
    level_name: string;
    balance: number;
  } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserVipData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch user profile with VIP level and balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('vip_level, balance')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Handle VIP level 0 (base level) separately
          if (profile.vip_level === 0) {
            setUserVipData({
              vip_level: 0,
              commission_rate: 0.06, // Default commission rate for base level
              level_name: 'VIP BASE',
              balance: profile.balance || 0
            });
          } else {
            // Fetch VIP level details for levels > 0
            const { data: vipLevel } = await supabase
              .from('vip_levels')
              .select('level_name, commission_rate')
              .eq('id', profile.vip_level)
              .maybeSingle();

            setUserVipData({
              vip_level: profile.vip_level,
              commission_rate: vipLevel?.commission_rate || 0.06,
              level_name: vipLevel?.level_name || `VIP ${profile.vip_level}`,
              balance: profile.balance || 0
            });
          }
        }
      }
    };

    fetchUserVipData();
  }, []);

  const findVipProduct = async () => {
    if (!userVipData) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin người dùng",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // For VIP level 0, we need to look for products that don't require a specific VIP level
      // or find the lowest VIP level products available
      let query = supabase
        .from('products')
        .select('*')
        .lte('price', userVipData.balance)
        .gt('stock', 0);

      if (userVipData.vip_level === 0) {
        // For base level users, find products with VIP level 1 or any available products
        query = query.eq('vip_level_id', 1);
      } else {
        // For VIP users, find products matching their level
        query = query.eq('vip_level_id', userVipData.vip_level);
      }

      const { data: products, error } = await query.limit(1);

      if (error) {
        throw error;
      }

      if (!products || products.length === 0) {
        toast({
          title: "Không tìm thấy sản phẩm",
          description: "Không có sản phẩm VIP phù hợp với số dư hiện tại của bạn",
          variant: "destructive"
        });
        return;
      }

      setSelectedProduct(products[0] as Product);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error finding VIP product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tìm sản phẩm VIP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrder = async (product: Product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để đặt hàng",
          variant: "destructive"
        });
        return;
      }

      // Create order
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          product_name: product.name,
          total_amount: product.price,
          quantity: 1,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Thành công",
        description: `Đã nhận đơn hàng: ${product.name}`,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo đơn hàng",
        variant: "destructive"
      });
    }
  };

  const stats = [
    { label: "Số dự khả dụng", value: `${userVipData?.balance?.toFixed(2) || '0.00'} USD` },
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
          onClick={() => navigate("/")}
        />
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src={`/src/assets/vip${userVipData?.vip_level || 'base'}-icon.png`}
            alt="VIP" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm">
            {userVipData?.level_name || 'VIP BASE'}
          </span>
          <span className="text-white/80 text-xs">
            TỶ LỆ HOA HỒNG: {userVipData ? `${(userVipData.commission_rate * 100).toFixed(2)}%` : '0.06%'}
          </span>
        </div>
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
        <Button 
          onClick={findVipProduct}
          disabled={isLoading}
          className="w-full h-12 bg-blue hover:bg-blue/90 text-blue-foreground font-semibold text-base"
        >
          {isLoading ? "ĐANG TÌM SẢN PHẨM..." : "BẮT ĐẦU NHẬN ĐƠN HÀNG"}
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

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrder={handleOrder}
      />
    </div>
  );
};

export default TaskCenter;