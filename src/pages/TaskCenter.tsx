import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingOverlay, Skeleton, SkeletonCard } from "@/components/ui/loading";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import ProductModal from "@/components/ProductModal";
import vipBaseIcon from "@/assets/vip-base-icon.png";
import vip1Icon from "@/assets/vip1-icon.png";
import vip2Icon from "@/assets/vip2-icon.png";
import vip3Icon from "@/assets/vip3-icon.png";
import vip4Icon from "@/assets/vip4-icon.png";
import vip5Icon from "@/assets/vip5-icon.png";
import vip6Icon from "@/assets/vip6-icon.png";
import vip7Icon from "@/assets/vip7-icon.png";
import vip8Icon from "@/assets/vip8-icon.png";
import vip9Icon from "@/assets/vip9-icon.png";
import vip10Icon from "@/assets/vip10-icon.png";
import { endOfDay, startOfDay } from "date-fns";
import { calculateDailyCommission } from "@/utils/commissionUtils";
import moment from "moment-timezone";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  vip_level_id: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface UserVipData {
  vip_level: number;
  commission_rate: number;
  level_name: string;
  balance: number;
  min_orders?: number;
  image_url?: string;
}

const vipIcons: Record<number | 'base', string> = {
  base: vipBaseIcon,
  1: vip1Icon,
  2: vip2Icon,
  3: vip3Icon,
  4: vip4Icon,
  5: vip5Icon,
  6: vip6Icon,
  7: vip7Icon,
  8: vip8Icon,
  9: vip9Icon,
  10: vip10Icon,
};

const getVipIconSrc = (level?: number) => {
  if (level && level > 0 && vipIcons[level]) return vipIcons[level];
  return vipIcons["base"];
};

// Cache để lưu trữ dữ liệu VIP level
const vipLevelCache = new Map<number, any>();

const TaskCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuthContext();
  const [userVipData, setUserVipData] = useState<UserVipData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [minSpent, setMinSpent] = useState(0);

  // Tối ưu: Gộp tất cả queries thành một function duy nhất
  const fetchUserVipData = useCallback(async () => {
    if (!user) return;

    try {
      setIsInitialLoading(true);
      
      // Tạo date range cho today orders một lần
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      const todayStartISO = startOfToday.toISOString();
      const todayEndISO = endOfToday.toISOString();

      // Chạy tất cả queries song song với Promise.all
      const [profileResult, ordersResult, todayOrdersResult] = await Promise.all([
        // Query 1: User profile
        supabase
          .from("profiles")
          .select("vip_level, balance, bonus_order_count, bonus_amount")
          .eq("user_id", user.id)
          .single(),
        
        // Query 2: Completed orders cho profit calculation
        supabase
          .from("orders")
          .select("id, total_amount, profit")
          .eq("user_id", user.id)
          .eq("status", "completed"),
        
        // Query 3: Today's orders count
        supabase
          .from("orders")
          .select("id, total_amount, profit")
          .eq("user_id", user.id)
          .gte("created_at", todayStartISO)
          .lt("created_at", todayEndISO)
          .eq("status", "completed")
      ]);

      // Xử lý profile data
      if (profileResult.error) {
        console.error('Error fetching profile:', profileResult.error);
        return;
      }

      const profile = profileResult.data;
      if (!profile) return;

      // Kiểm tra và khôi phục VIP level nếu bị reset về 0 một cách không mong muốn
      if (profile.vip_level === 0 && ordersResult.data && ordersResult.data.length > 0) {
        console.log('VIP level bị reset về 0, đang khôi phục...');
        
        // Sử dụng function database để khôi phục VIP level một cách an toàn
        const { data: recoveredVipLevel, error: recoveryError } = await supabase.rpc('recover_user_vip_level', {
          user_id_param: user.id
        });
        
        if (!recoveryError && recoveredVipLevel && recoveredVipLevel > 0) {
          profile.vip_level = recoveredVipLevel;
          console.log('VIP level đã được khôi phục về:', recoveredVipLevel);
        } else {
          console.error('Lỗi khôi phục VIP level:', recoveryError);
        }
      }

      // Tối ưu: Kiểm tra cache trước khi query VIP level
      let vipLevelData = vipLevelCache.get(profile.vip_level);
      
      if (!vipLevelData && profile.vip_level > 0) {
        const { data: vipLevel, error: vipError } = await supabase
          .from("vip_levels")
          .select("level_name, commission_rate, min_orders, image_url, min_spent")
          .eq("id", profile.vip_level)
          .maybeSingle();

        setMinSpent(vipLevel?.min_spent || 0);

        if (vipError) {
          console.error('Error fetching VIP level:', vipError);
        } else if (vipLevel) {
          // Cache VIP level data
          vipLevelCache.set(profile.vip_level, vipLevel);
          vipLevelData = vipLevel;
        }
      }

      // Resolve image URL từ storage nếu cần
      let resolvedImageUrl: string | undefined = vipLevelData?.image_url || undefined;
      if (resolvedImageUrl && !resolvedImageUrl.startsWith("http")) {
        try {
          const { data: publicData } = supabase.storage
            .from("vip-images")
            .getPublicUrl(resolvedImageUrl);
          resolvedImageUrl = publicData?.publicUrl;
        } catch (storageError) {
          console.error('Error resolving image URL:', storageError);
        }
      }

      // Set user VIP data
      setUserVipData({
        vip_level: profile.vip_level,
        commission_rate: vipLevelData?.commission_rate || 0.06,
        level_name: vipLevelData?.level_name || `VIP ${profile.vip_level}`,
        balance: profile.balance || 0,
        min_orders: vipLevelData?.min_orders || 0,
        image_url: resolvedImageUrl,
      });


      // Set today orders count
      if (todayOrdersResult.data) {
        setTodayOrders(todayOrdersResult.data.length);
        setTotalProfit(todayOrdersResult.data.reduce((sum: number, order: any) => {
          return sum + Number(order.profit);
        }, 0));

      }

    } catch (error) {
      console.error('Error in fetchUserVipData:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserVipData();
  }, [fetchUserVipData]);
  // const dailyTotalCommission = dailyTotalProfit + (product.price * commissionRate / 100);
  // const availableBalance = minSpent + dailyTotalCommission; // Use actual user balance


  // Tối ưu: Sử dụng useMemo cho stats để tránh tính toán lại
  const stats = useMemo(() => [
    {
      label: t("task.stats.available.balance"),
      value: `${(minSpent + totalProfit).toFixed(2) || "0.00"} USD`,
    },
    {
      label: t("task.stats.profit.received"),
      value: `${totalProfit.toFixed(2)} USD`,
    },
    {
      label: t("task.stats.current.vip.orders"),
      value: `${userVipData?.min_orders || 0}`,
    },
    {
      label: t("task.stats.orders.today"),
      value: `${todayOrders}/${userVipData?.min_orders || 0}`,
    },
  ], [userVipData, totalProfit, todayOrders, t]);

  const findVipProduct = async () => {
    if (!userVipData) {
      toast({
        title: t("common.error"),
        description: t("task.error.load.user.info"),
        variant: "destructive",
      });
      return;
    }

    //  thời gian có thể quay đơn là từ 10 giờ Los Angeles đến 11 giờ đêm Los Angeles là đóng app không quay được đơn hệ thống ngưng hoạt động
    // Sửa lại logic kiểm tra giờ Los Angeles: chỉ cho phép từ 10:00 sáng đến trước 23:00 (tức là 10:00 <= giờ hiện tại < 23:00)
    const losAngelesTime = moment().tz('America/Los_Angeles');
    const hour = losAngelesTime.hour();
    const isLosAngelesOpen = hour >= 9 && hour < 22;
    if (!isLosAngelesOpen) {
      toast({
        title: t("common.error"),
        description: t("task.error.los.angeles.closed"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!user) {
        toast({
          title: t("common.error"),
          description: t("task.error.login.required"),
          variant: "destructive",
        });
        return;
      }

      if(userVipData.min_orders >= todayOrders) {
        toast({
          title: t("common.error"),
          description: t("task.error.completed.orders"),
          variant: "destructive", // màu đỏ
          className: "bg-red-500 text-white"
        })
        return;
      }

      // Tối ưu: Gộp profile query với userVipData đã có
      const { data: profile } = await supabase
        .from("profiles")
        .select("bonus_order_count, bonus_amount, balance")
        .eq("user_id", user.id)
        .single();

      //tìm sản phẩm peding trước

      const { data: pendingOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();
      // get product from id

      if(pendingOrder) {
        // const { data: product } = await supabase
        //   .from("products")
        //   .select("*")
        //   .eq("name", pendingOrder.product_name)
        //   .single();

        // if (product) {
        //   setSelectedProduct(product);
        //   setIsModalOpen(true);
        //   return;
        // }
        toast({
          title: t("common.error"),
          description: t("task.error.pending.order"),
          variant: "destructive", // màu đỏ
          className: "bg-red-500 text-white"
        });
        return;
      }

      // Check bonus order logic
      if (profile && profile.bonus_order_count && profile.bonus_amount) {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);

        const { data: todayOrdersData } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .gte("created_at", startOfToday.toISOString())
          .lt("created_at", endOfToday.toISOString())
          .eq("status", "completed");

        const todayOrderCount = todayOrdersData?.length || 0;

        if (todayOrderCount === profile.bonus_order_count) {
          const { data: allProducts, error: productsError } = await supabase
            .from("products")
            .select("*");

          if (productsError) {
            throw productsError;
          }

          if (allProducts && allProducts.length > 0) {
            const closestProduct = allProducts.reduce((closest: Product, product: Product) => {
              const currentDiff = Math.abs(product.price - profile.bonus_amount);
              const closestDiff = Math.abs(closest.price - profile.bonus_amount);
              return currentDiff < closestDiff ? product : closest;
            });

            setSelectedProduct(closestProduct as Product);
            setIsModalOpen(true);
            return;
          }
        }
      }

      // Tối ưu: Sử dụng query builder hiệu quả hơn
      let query = supabase
        .from("products")
        .select("*")
        .lte("price", userVipData.balance);

      if (userVipData.vip_level === 0) {
        query = query.eq("vip_level_id", 1);
      } else {
        query = query.eq("vip_level_id", userVipData.vip_level);
      }

      const { data: products, error } = await query;

      if (error) {
        throw error;
      }

      if (!products || products.length === 0) {
        toast({
          title: t("task.error.no.products"),
          description: t("task.error.no.suitable.products"),
          variant: "destructive",
        });
        return;
      }

      const randomIndex = Math.floor(Math.random() * products.length);
      const randomProduct = products[randomIndex] as Product;

      //insert order
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        product_name: randomProduct.name,
        total_amount: randomProduct.price,
        quantity: 1,
        status: "pending",
      });

      if (orderError) {
        throw orderError;
      }

      setSelectedProduct(randomProduct);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error finding VIP product:", error);
      toast({
        title: t("common.error"),
        description: t("task.error.find.vip.product"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    
    // Tối ưu: Chỉ refresh today orders thay vì toàn bộ data
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const { data: todayOrders } = await supabase
      .from('orders')
      .select('id, total_amount, profit')
      .eq('user_id', user.id)
      .gte('created_at', startOfToday.toISOString())
      .lt('created_at', endOfToday.toISOString())
      .eq('status', 'completed');

    setTodayOrders(todayOrders?.length || 0);
    setTotalProfit(todayOrders?.reduce((sum: number, order: any) => {
      return sum + Number(order.profit || 0);
    }, 0));

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    setUserVipData({
      ...userVipData,
      balance: profile?.balance || 0,
    });
  };

  const handleOrder = async (product: Product) => {
    try {
      if (!user) {
        toast({
          title: t("common.error"),
          description: t("task.error.login.to.order"),
          variant: "destructive",
        });
        return;
      }

      // const { error } = await supabase.from("orders").insert({
      //   user_id: user.id,
      //   product_name: product.name,
      //   total_amount: product.price,
      //   quantity: 1,
      //   status: "pending",
      // });

      // if (error) {
      //   throw error;
      // }

      toast({
        title: t("task.success.title"),
        description: `${t("task.success.order.received")}: ${product.name}`,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: t("common.error"),
        description: t("task.error.create.order"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Global Overlay */}
      <LoadingOverlay 
        isVisible={isInitialLoading || isLoading}
        text={isInitialLoading ? t("common.loading") : t("task.button.finding.product")}
      />

      {/* VIP Commission Rate Header */}
      <div className="bg-gradient-luxury p-4 flex items-center gap-2">
        <ArrowLeft
          className="text-white w-6 h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="w-10 h-10 flex items-center justify-center">
          {isInitialLoading ? (
            <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
          ) : userVipData ? (
            <img
              src={userVipData.image_url || getVipIconSrc(userVipData.vip_level)}
              alt={`${userVipData.level_name} icon`}
              className="w-full h-full object-contain"
              loading="eager"
            />
          ) : (
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          )}
        </div>
        <div className="flex flex-col">
          {isInitialLoading ? (
            <>
              <div className="h-4 bg-white/20 rounded w-20 mb-1 animate-pulse"></div>
              <div className="h-3 bg-white/20 rounded w-24 animate-pulse"></div>
            </>
          ) : (
            <>
              <span className="text-white font-semibold text-sm">
                {userVipData?.level_name || "VIP BASE"}
              </span>
              <span className="text-white/80 text-xs">
                {t("task.commission.rate")}:{" "}
                {userVipData ? `${userVipData.commission_rate}` : "0.2"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Video Section */}
      <div className="relative bg-black aspect-video overflow-hidden">
        {isInitialLoading ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading video...</div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <video
              src="https://keringns.com/video.mp4"
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
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="space-y-3">
            {isInitialLoading ? (
              // Skeleton loading cho stats
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Skeleton className="w-24" />
                  <Skeleton className="w-20" />
                </div>
              ))
            ) : (
              stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">{stat.label}</span>
                  <span className="font-semibold text-right">{stat.value}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Start Button */}
        <Button
          onClick={findVipProduct}
          disabled={isLoading || isInitialLoading}
          className="w-full h-12 bg-blue hover:bg-blue/90 text-blue-foreground font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t("task.button.finding.product")}</span>
              </div>
            )
            : t("task.button.take.order")
          }
        </Button>
      </div>

      {/* Promotional Section */}
      <div className="p-4 space-y-4">
        {isInitialLoading ? (
          // Skeleton loading cho promotional section
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop"
                alt="Spring promotion"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  Amp up Your Spring Break
                </h3>
                <p className="text-gray-600 text-sm">Get Started</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg overflow-hidden shadow-sm">
              <div className="p-4">
                <h3 className="font-semibold text-white">
                  Earn Points with MOA Insiders
                </h3>
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
                <h3 className="font-semibold text-gray-900">
                  Employment at Mall of America
                </h3>
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
          </>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrder={handleOrder}
      />
    </div>
  );
};

export default TaskCenter;