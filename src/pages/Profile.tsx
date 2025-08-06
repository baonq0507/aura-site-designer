import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user orders for statistics
      const { data: orders, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'completed');

      setOrdersReceived(count || 0);

      // Calculate total profit (mock calculation)
      if (orders) {
        const profit = orders.reduce((sum, order) => sum + Number(order.total_amount) * 0.1, 0);
        setTotalProfit(profit);
      }

      // Mock balance - in real app, you'd have a separate balance table
      setBalance(Math.random() * 1000);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!"
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng xuất",
        variant: "destructive"
      });
    }
  };

  const menuItems = [
    { 
      icon: MapPin, 
      label: "Thông tin nhận hàng", 
      action: () => navigate("/delivery-info") 
    },
    { 
      icon: CreditCard, 
      label: "Liên kết ngân hàng", 
      action: () => navigate("/bank-linking") 
    },
    { 
      icon: History, 
      label: "Lịch sử nạp tiền", 
      action: () => navigate("/nap-tien") 
    },
    { 
      icon: Download, 
      label: "Lịch sử rút tiền", 
      action: () => navigate("/rut-tien") 
    },
    { 
      icon: Crown, 
      label: "VIP", 
      action: () => navigate("/vip-info") 
    },
    { 
      icon: Users, 
      label: "Báo cáo nhóm", 
      action: () => navigate("/group-report") 
    },
    { 
      icon: Info, 
      label: "Về chúng tôi", 
      action: () => navigate("/gioi-thieu-nen-tang") 
    },
    { 
      icon: Globe, 
      label: "Ngôn ngữ", 
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
          <div className="animate-pulse text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 border-2 border-white/20">
              <AvatarFallback className="bg-white/10 text-white">
                {profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">
                {profile?.username || user?.email?.split('@')[0]}
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-amber-500 text-white">
                  VIP{vipLevel}
                </Badge>
                <span className="text-sm opacity-80">
                  ID: {profile?.id?.slice(-6) || '------'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate("/rut-tien")}
            >
              Rút tiền
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate("/nap-tien")}
            >
              Nạp tiền
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{ordersReceived}</div>
            <div className="text-sm opacity-80">Lợi nhuận đã nhận</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <div className="text-sm opacity-80">Số dư khả dụng</div>
          </div>
        </div>

        {/* Invitation Code */}
        <div className="mt-4 text-center">
          <span className="text-sm">Mã mời: </span>
          <span className="font-bold">{profile?.invitation_code || '31495'}</span>
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
                <span className="font-medium text-destructive">Đăng xuất</span>
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