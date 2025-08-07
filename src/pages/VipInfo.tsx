import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Gift, Star, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VipLevel {
  id: number;
  level_name: string;
  commission_rate: number;
  min_orders: number;
  min_spent: number;
  image_url: string | null;
  created_at: string;
}

const VipInfo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentVip, setCurrentVip] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await loadVipLevels();
    await checkAuth();
  };

  const loadVipLevels = async () => {
    try {
      const { data: vipData, error } = await supabase
        .from('vip_levels')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching VIP levels:', error);
        return;
      }

      setVipLevels(vipData || []);
    } catch (error) {
      console.error('Error loading VIP levels:', error);
    }
  };

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
      // Fetch user profile to get current VIP level
      const { data: profile } = await supabase
        .from('profiles')
        .select('vip_level, total_orders, total_spent')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile) {
        setCurrentVip(profile.vip_level || 1);
        setTotalOrders(profile.total_orders || 0);
        setTotalSpent(profile.total_spent || 0);
      } else {
        // Fallback: calculate from orders
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
            if (count >= level.min_orders && spent >= level.min_spent) {
              vipLevel = level.id;
            }
          }
          setCurrentVip(vipLevel);
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const getProgressToNextLevel = () => {
    const nextLevel = vipLevels.find(level => level.id === currentVip + 1);
    if (!nextLevel) return 100;

    const ordersProgress = (totalOrders / nextLevel.min_orders) * 100;
    const spentProgress = (totalSpent / nextLevel.min_spent) * 100;
    return Math.min(ordersProgress, spentProgress);
  };

  const getNextLevelRequirements = () => {
    const nextLevel = vipLevels.find(level => level.id === currentVip + 1);
    if (!nextLevel) return null;

    return {
      ordersNeeded: Math.max(0, nextLevel.min_orders - totalOrders),
      spentNeeded: Math.max(0, nextLevel.min_spent - totalSpent),
      levelName: nextLevel.level_name
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const nextLevelReq = getNextLevelRequirements();
  const currentLevel = vipLevels.find(level => level.id === currentVip);

  const getBenefits = (level: VipLevel) => [
    `${t('vip.commission')} ${level.commission_rate}%`,
    t('vip.support'),
    ...(level.id >= 2 ? [t('vip.priority.support')] : []),
    ...(level.id >= 3 ? [t('vip.premium.gifts')] : []),
    ...(level.id >= 4 ? [t('vip.dedicated.manager')] : []),
    ...(level.id >= 5 ? [t('vip.premium.service')] : [])
  ];

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
          <h1 className="text-lg font-semibold">{t('vip.title')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current VIP Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-accent" />
              <span>{t('vip.current.level')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-full mb-4">
                <Crown className="h-6 w-6" />
                <span className="text-xl font-bold">VIP {currentVip} - {currentLevel?.level_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                  <div className="text-sm text-muted-foreground">{t('vip.orders.completed')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(totalSpent)}</div>
                  <div className="text-sm text-muted-foreground">{t('vip.total.spent')}</div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>{t('vip.benefits.current')}</span>
              </h4>
              <div className="space-y-1">
                {currentLevel && getBenefits(currentLevel).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-accent" />
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
                <span>{t('vip.progress')} {currentVip + 1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getProgressToNextLevel())}%</span>
                  </div>
                  <Progress value={getProgressToNextLevel()} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{nextLevelReq.ordersNeeded}</div>
                    <div className="text-muted-foreground">{t('vip.orders.needed')}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{formatCurrency(nextLevelReq.spentNeeded)}</div>
                    <div className="text-muted-foreground">{t('vip.spending.needed')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All VIP Levels */}
        <Card>
          <CardHeader>
            <CardTitle>{t('vip.all.levels')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vipLevels.map((level) => (
                <div 
                  key={level.id} 
                  className={`p-4 rounded-lg border ${
                    level.id === currentVip 
                      ? 'border-primary bg-primary/5' 
                      : level.id < currentVip
                      ? 'border-green-500 bg-green-50'
                      : 'border-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {level.image_url && (
                        <img 
                          src={level.image_url} 
                          alt={`VIP ${level.id}`}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                      <span className="font-semibold">{level.level_name}</span>
                    </div>
                    {level.id === currentVip && (
                      <Badge variant="default">{t('vip.current.badge')}</Badge>
                    )}
                    {level.id < currentVip && (
                      <Badge variant="secondary">{t('vip.achieved.badge')}</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {level.min_orders} {t('vip.per.day')} • {formatCurrency(level.min_spent)} {t('vip.min.balance')}
                  </div>
                  
                  <div className="space-y-1">
                    {getBenefits(level).map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-accent" />
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