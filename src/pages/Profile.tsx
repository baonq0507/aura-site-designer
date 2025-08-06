import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MapPin, 
  CreditCard, 
  History, 
  Download, 
  Crown, 
  Users, 
  Info, 
  Globe, 
  LogOut,
  ChevronRight 
} from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  phone_number: string | null;
  invitation_code: string | null;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [vipLevel, setVipLevel] = useState(1);
  const [balance, setBalance] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [ordersReceived, setOrdersReceived] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await fetchUserData(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile including balance and VIP level
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, vip_level, balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setBalance(profileData.balance || 0);
        setVipLevel(profileData.vip_level || 0);
      }

      // Fetch user orders for statistics
      const { data: orders, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'completed');

      setOrdersReceived(count || 0);

      // Calculate total profit from completed orders
      if (orders) {
        // Get VIP commission rate for profit calculation
        let commissionRate = 0.06; // Default for VIP BASE
        if (profileData?.vip_level && profileData.vip_level > 0) {
          const { data: vipData } = await supabase
            .from('vip_levels')
            .select('commission_rate')
            .eq('id', profileData.vip_level)
            .single();
          
          if (vipData) {
            commissionRate = vipData.commission_rate;
          }
        }

        const profit = orders.reduce((sum, order) => sum + Number(order.total_amount) * commissionRate, 0);
        setTotalProfit(profit);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: t('common.logout.success'),
        description: t('common.logout.message')
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: t('common.error'),
        description: t('common.logout.error'),
        variant: "destructive"
      });
    }
  };

  const menuItems = [
    { 
      icon: MapPin, 
      label: t('profile.delivery.info'), 
      action: () => navigate("/delivery-info") 
    },
    { 
      icon: CreditCard, 
      label: t('profile.bank.linking'), 
      action: () => navigate("/bank-linking") 
    },
    { 
      icon: History, 
      label: t('profile.deposit.history'), 
      action: () => navigate("/nap-tien") 
    },
    { 
      icon: Download, 
      label: t('profile.withdraw.history'), 
      action: () => navigate("/withdrawal-history") 
    },
    { 
      icon: Crown, 
      label: t('nav.vip'), 
      action: () => navigate("/vip-info") 
    },
    { 
      icon: Crown, 
      label: t('profile.vip.levels'), 
      action: () => navigate("/vip-levels") 
    },
    { 
      icon: Users, 
      label: t('profile.group.report'), 
      action: () => navigate("/group-report") 
    },
    { 
      icon: Info, 
      label: t('profile.about.us'), 
      action: () => navigate("/gioi-thieu-nen-tang") 
    },
    { 
      icon: Globe, 
      label: t('nav.language'), 
      action: () => navigate("/language") 
    },
  ];

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
          <div className="animate-pulse text-lg">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">{/* Simplified wrapper since PageLayout handles the layout */}
      {/* Header */}
      <div className="bg-background text-foreground border-b border-border">
        {/* Main Profile Section */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            {/* Left side - Avatar and Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarFallback className="bg-muted text-foreground text-lg font-bold">
                    {profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {profile?.username || user?.email?.split('@')[0]}
                </h2>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span className="text-sm">
                    ID:{profile?.id?.slice(-6) || '------'}
                  </span>
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                    {vipLevel === 0 ? 'VIP Base' : `VIP${vipLevel}`}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Right side - Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white border-0 px-4"
                onClick={() => navigate("/rut-tien")}
              >
                {t('common.withdraw')}
              </Button>
              <Button 
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white border-0 px-4"
                onClick={() => navigate("/nap-tien")}
              >
                {t('common.topup')}
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{ordersReceived}</div>
              <div className="text-sm text-muted-foreground">{t('profile.grand.commission')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <div className="text-sm text-muted-foreground">{t('profile.available.assets')}</div>
            </div>
          </div>

          {/* Invitation Code */}
          <div className="text-left">
            <span className="text-sm font-semibold">{t('profile.invitation.code')}: </span>
            <span className="font-bold text-lg">{profile?.invitation_code || '31495'}</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div 
                className="flex items-center justify-between"
                onClick={item.action}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Logout */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div 
              className="flex items-center justify-between"
              onClick={handleLogout}
            >
              <div className="flex items-center space-x-3">
                <LogOut className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">{t('common.logout')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;