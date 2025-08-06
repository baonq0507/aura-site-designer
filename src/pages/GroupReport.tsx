import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp, Award, DollarSign } from "lucide-react";

interface TeamMember {
  id: string;
  username: string;
  level: number;
  orders_count: number;
  total_commission: number;
  join_date: string;
}

const GroupReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [directTeam, setDirectTeam] = useState<TeamMember[]>([]);
  const [totalTeam, setTotalTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    directMembers: 0,
    totalCommission: 0,
    monthlyCommission: 0
  });

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
      await loadTeamData(session.user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async (userId: string) => {
    try {
      // Get user's invitation code
      const { data: profile } = await supabase
        .from('profiles')
        .select('invitation_code')
        .eq('user_id', userId)
        .single();

      if (!profile?.invitation_code) return;

      // Mock team data - in real app, you'd have referral relationships
      const mockDirectTeam: TeamMember[] = [
        {
          id: '1',
          username: 'user123',
          level: 1,
          orders_count: 15,
          total_commission: 250,
          join_date: '2024-01-15'
        },
        {
          id: '2',
          username: 'trader456',
          level: 2,
          orders_count: 32,
          total_commission: 480,
          join_date: '2024-02-03'
        },
        {
          id: '3',
          username: 'investor789',
          level: 1,
          orders_count: 8,
          total_commission: 120,
          join_date: '2024-02-20'
        }
      ];

      const mockTotalTeam: TeamMember[] = [
        ...mockDirectTeam,
        {
          id: '4',
          username: 'user111',
          level: 2,
          orders_count: 22,
          total_commission: 340,
          join_date: '2024-01-28'
        },
        {
          id: '5',
          username: 'trader222',
          level: 3,
          orders_count: 45,
          total_commission: 675,
          join_date: '2024-02-10'
        }
      ];

      setDirectTeam(mockDirectTeam);
      setTotalTeam(mockTotalTeam);

      // Calculate stats
      const totalCommission = mockTotalTeam.reduce((sum, member) => sum + member.total_commission, 0);
      const monthlyCommission = totalCommission * 0.3; // Mock 30% is from this month

      setStats({
        totalMembers: mockTotalTeam.length,
        directMembers: mockDirectTeam.length,
        totalCommission,
        monthlyCommission
      });
    } catch (error) {
      console.error('Error loading team data:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderTeamList = (team: TeamMember[]) => (
    <div className="space-y-3">
      {team.length > 0 ? (
        team.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{member.username}</div>
                    <div className="text-sm text-muted-foreground">
                      Tham gia: {formatDate(member.join_date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    Level {member.level}
                  </Badge>
                  <div className="text-sm">
                    <div>{member.orders_count} đơn hàng</div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(member.total_commission)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có thành viên</h3>
            <p className="text-muted-foreground">
              Chia sẻ mã mời của bạn để xây dựng đội nhóm
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

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
          <h1 className="text-lg font-semibold">Báo cáo nhóm</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <div className="text-sm text-muted-foreground">Tổng thành viên</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{stats.directMembers}</div>
              <div className="text-sm text-muted-foreground">Thành viên trực tiếp</div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(stats.totalCommission)}
              </div>
              <div className="text-sm text-muted-foreground">Tổng hoa hồng</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto text-amber-500 mb-2" />
              <div className="text-xl font-bold text-amber-500">
                {formatCurrency(stats.monthlyCommission)}
              </div>
              <div className="text-sm text-muted-foreground">Tháng này</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đội nhóm</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="direct" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct">
                  Trực tiếp ({stats.directMembers})
                </TabsTrigger>
                <TabsTrigger value="total">
                  Tổng ({stats.totalMembers})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct" className="mt-4">
                {renderTeamList(directTeam)}
              </TabsContent>
              
              <TabsContent value="total" className="mt-4">
                {renderTeamList(totalTeam)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Invitation Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin mời bạn bè</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Hoa hồng giới thiệu</h4>
                <ul className="text-sm space-y-1">
                  <li>• Cấp 1 (trực tiếp): 20% hoa hồng</li>
                  <li>• Cấp 2: 10% hoa hồng</li>
                  <li>• Cấp 3: 5% hoa hồng</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Mẹo xây dựng đội nhóm</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li>• Chia sẻ mã mời trên mạng xã hội</li>
                  <li>• Hướng dẫn thành viên mới sử dụng nền tảng</li>
                  <li>• Duy trì hoạt động để tăng uy tín</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupReport;