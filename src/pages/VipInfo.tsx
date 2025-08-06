import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Gift, Star, TrendingUp } from "lucide-react";

const VipInfo = () => {
  const navigate = useNavigate();
  const [currentVip, setCurrentVip] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  const vipLevels = [
    { level: 1, name: "Đồng", orders: 0, spent: 0, benefits: ["Hoa hồng cơ bản 5%", "Hỗ trợ khách hàng"] },
    { level: 2, name: "Bạc", orders: 10, spent: 1000, benefits: ["Hoa hồng 7%", "Ưu tiên hỗ trợ", "Quà tặng hàng tháng"] },
    { level: 3, name: "Vàng", orders: 50, spent: 5000, benefits: ["Hoa hồng 10%", "Hỗ trợ VIP", "Quà tặng cao cấp", "Giảm giá đặc biệt"] },
    { level: 4, name: "Bạch Kim", orders: 100, spent: 10000, benefits: ["Hoa hồng 12%", "Chuyên viên riêng", "Sự kiện độc quyền"] },
    { level: 5, name: "Kim Cương", orders: 200, spent: 25000, benefits: ["Hoa hồng 15%", "Dịch vụ premium", "Bonus đặc biệt"] }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      await loadUserStats(session.user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (userId: string) => {
    try {
      const { data: orders, count } = await supabase
        .from('orders')
        .select('total_amount', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'completed');

      setTotalOrders(count || 0);
      
      if (orders) {
        const spent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        setTotalSpent(spent);
        
        // Calculate VIP level based on orders and spending
        let vipLevel = 1;
        for (const level of vipLevels) {
          if (count >= level.orders && spent >= level.spent) {
            vipLevel = level.level;
          }
        }
        setCurrentVip(vipLevel);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const getProgressToNextLevel = () => {
    const nextLevel = vipLevels.find(level => level.level === currentVip + 1);
    if (!nextLevel) return 100;

    const ordersProgress = (totalOrders / nextLevel.orders) * 100;
    const spentProgress = (totalSpent / nextLevel.spent) * 100;
    return Math.min(ordersProgress, spentProgress);
  };

  const getNextLevelRequirements = () => {
    const nextLevel = vipLevels.find(level => level.level === currentVip + 1);
    if (!nextLevel) return null;

    return {
      ordersNeeded: Math.max(0, nextLevel.orders - totalOrders),
      spentNeeded: Math.max(0, nextLevel.spent - totalSpent),
      levelName: nextLevel.name
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  const nextLevelReq = getNextLevelRequirements();
  const currentLevel = vipLevels.find(level => level.level === currentVip);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Thông tin VIP</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current VIP Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-amber-500" />
              <span>Cấp độ hiện tại</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full mb-4">
                <Crown className="h-6 w-6" />
                <span className="text-xl font-bold">VIP {currentVip} - {currentLevel?.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Đơn hàng hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(totalSpent)}</div>
                  <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Quyền lợi hiện tại</span>
              </h4>
              <div className="space-y-1">
                {currentLevel?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress to Next Level */}
        {nextLevelReq && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Tiến độ lên VIP {currentVip + 1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tiến độ tổng</span>
                    <span>{Math.round(getProgressToNextLevel())}%</span>
                  </div>
                  <Progress value={getProgressToNextLevel()} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{nextLevelReq.ordersNeeded}</div>
                    <div className="text-muted-foreground">đơn hàng nữa</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{formatCurrency(nextLevelReq.spentNeeded)}</div>
                    <div className="text-muted-foreground">chi tiêu nữa</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All VIP Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Tất cả cấp độ VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vipLevels.map((level) => (
                <div 
                  key={level.level} 
                  className={`p-4 rounded-lg border ${
                    level.level === currentVip 
                      ? 'border-primary bg-primary/5' 
                      : level.level < currentVip
                      ? 'border-green-500 bg-green-50'
                      : 'border-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Crown className={`h-5 w-5 ${
                        level.level <= currentVip ? 'text-amber-500' : 'text-muted-foreground'
                      }`} />
                      <span className="font-semibold">VIP {level.level} - {level.name}</span>
                    </div>
                    {level.level === currentVip && (
                      <Badge variant="default">Hiện tại</Badge>
                    )}
                    {level.level < currentVip && (
                      <Badge variant="secondary">Đã đạt</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Yêu cầu: {level.orders} đơn hàng • {formatCurrency(level.spent)} chi tiêu
                  </div>
                  
                  <div className="space-y-1">
                    {level.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VipInfo;