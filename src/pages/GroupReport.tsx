import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp, Award, DollarSign } from "lucide-react";

interface TeamMember {
  id: string;
  username: string;
  vip_level: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

const GroupReport = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

      if (!profile?.invitation_code) {
        setStats({
          totalMembers: 0,
          directMembers: 0,
          totalCommission: 0,
          monthlyCommission: 0
        });
        return;
      }

      // Fetch users invited by this user's invitation code
      const { data: invitedUsers, error } = await supabase
        .from('profiles')
        .select('id, username, vip_level, total_orders, total_spent, created_at')
        .eq('invited_by_code', profile.invitation_code)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invited users:', error);
        return;
      }

      const directTeamData: TeamMember[] = invitedUsers || [];
      
      // For now, we'll consider all invited users as direct team
      // In a more complex system, you might have multiple levels
      setDirectTeam(directTeamData);
      setTotalTeam(directTeamData);

      // Calculate commission (mock calculation based on user spending)
      const totalCommission = directTeamData.reduce((sum, member) => sum + (member.total_spent * 0.05), 0);
      const monthlyCommission = totalCommission * 0.3; // Mock 30% is from this month

      setStats({
        totalMembers: directTeamData.length,
        directMembers: directTeamData.length,
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
                    <div className="font-semibold">{member.username || t('common.user')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('group.report.join.date')}: {formatDate(member.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    VIP {member.vip_level}
                  </Badge>
                  <div className="text-sm">
                    <div>{member.total_orders} {t('group.report.orders')}</div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(member.total_spent * 0.05)}
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
            <h3 className="text-lg font-semibold mb-2">{t('group.report.no.invites')}</h3>
            <p className="text-muted-foreground">
              {t('group.report.no.invites.desc')}
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
          <div className="animate-pulse text-lg">{t('common.loading')}</div>
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
          <h1 className="text-lg font-semibold">{t('group.report.title')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <div className="text-sm text-muted-foreground">{t('group.report.total.members')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{stats.directMembers}</div>
              <div className="text-sm text-muted-foreground">{t('group.report.direct.members')}</div>
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
              <div className="text-sm text-muted-foreground">{t('group.report.total.commission')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto text-amber-500 mb-2" />
              <div className="text-xl font-bold text-amber-500">
                {formatCurrency(stats.monthlyCommission)}
              </div>
              <div className="text-sm text-muted-foreground">{t('group.report.monthly.commission')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Lists */}
        <Card>
          <CardHeader>
            <CardTitle>{t('group.report.team.list')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="direct" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct">
                  {t('group.report.direct')} ({stats.directMembers})
                </TabsTrigger>
                <TabsTrigger value="total">
                  {t('group.report.total')} ({stats.totalMembers})
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
            <CardTitle>{t('group.report.invitation.info')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{t('group.report.commission.structure')}</h4>
                <ul className="text-sm space-y-1">
                  <li>• {t('group.report.commission.level1')}</li>
                  <li>• {t('group.report.commission.level2')}</li>
                  <li>• {t('group.report.commission.level3')}</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">{t('group.report.team.tips')}</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li>• {t('group.report.tip1')}</li>
                  <li>• {t('group.report.tip2')}</li>
                  <li>• {t('group.report.tip3')}</li>
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