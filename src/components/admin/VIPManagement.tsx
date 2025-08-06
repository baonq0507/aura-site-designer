import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Crown, DollarSign, Package, TrendingUp } from "lucide-react";

interface VIPStats {
  level: number;
  userCount: number;
  totalRevenue: number;
  averageOrders: number;
}

export function VIPManagement() {
  const [vipStats, setVipStats] = useState<VIPStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [commissionRates, setCommissionRates] = useState<{ [key: number]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchVIPStats();
    initializeCommissionRates();
  }, []);

  const initializeCommissionRates = () => {
    // Initialize with default commission rates
    const defaultRates: { [key: number]: string } = {
      1: "3.0",
      2: "4.0", 
      3: "5.0",
      4: "6.0",
      5: "7.0",
      6: "8.0",
      7: "9.0",
      8: "10.0",
      9: "12.0",
      10: "15.0"
    };
    setCommissionRates(defaultRates);
  };

  const fetchVIPStats = async () => {
    try {
      // This is a simplified version since we don't have VIP levels stored yet
      // In a real implementation, you'd have a proper VIP levels table
      const stats: VIPStats[] = [];
      
      for (let level = 1; level <= 10; level++) {
        // Mock data for demonstration
        // In reality, you'd query based on user balance, orders, etc.
        const userCount = Math.floor(Math.random() * 50) + 1;
        const totalRevenue = Math.floor(Math.random() * 100000);
        const averageOrders = Math.floor(Math.random() * 20) + 5;

        stats.push({
          level,
          userCount,
          totalRevenue,
          averageOrders
        });
      }

      setVipStats(stats);
    } catch (error) {
      console.error('Error fetching VIP stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch VIP statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCommissionRate = async (level: number, rate: string) => {
    try {
      // In a real implementation, you'd update this in the database
      setCommissionRates(prev => ({ ...prev, [level]: rate }));
      
      toast({
        title: "Success",
        description: `VIP ${level} commission rate updated to ${rate}%`
      });
    } catch (error) {
      console.error('Error updating commission rate:', error);
      toast({
        title: "Error",
        description: "Failed to update commission rate",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getVIPColor = (level: number) => {
    if (level <= 3) return "text-amber-600";
    if (level <= 6) return "text-purple-600";
    if (level <= 8) return "text-blue-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">VIP Management</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">VIP Level Management</h2>
        <Badge variant="outline">10 VIP Levels</Badge>
      </div>

      <div className="grid gap-4">
        {vipStats.map((stat) => (
          <Card key={stat.level}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className={`h-5 w-5 ${getVIPColor(stat.level)}`} />
                  <span>VIP Level {stat.level}</span>
                </div>
                <Badge variant="secondary">
                  {stat.userCount} Users
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Total Revenue</div>
                    <div className="text-lg font-bold">{formatCurrency(stat.totalRevenue)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Avg Orders</div>
                    <div className="text-lg font-bold">{stat.averageOrders}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor={`commission-${stat.level}`} className="text-sm font-medium">
                      Commission Rate (%)
                    </Label>
                    <Input
                      id={`commission-${stat.level}`}
                      type="number"
                      step="0.1"
                      value={commissionRates[stat.level] || "0"}
                      onChange={(e) => setCommissionRates(prev => ({ 
                        ...prev, 
                        [stat.level]: e.target.value 
                      }))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={() => updateCommissionRate(stat.level, commissionRates[stat.level])}
                    size="sm"
                  >
                    Update Rate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}