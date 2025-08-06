import { useState, useEffect } from "react";
import { ArrowLeft, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Order {
  id: string;
  product_name: string;
  total_amount: number;
  quantity: number;
  status: string;
  created_at: string;
}

interface OrderWithProfit extends Order {
  profit: number;
  product_image?: string;
}

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<OrderWithProfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: t('common.error'),
            description: t('history.login.required'),
            variant: "destructive"
          });
          navigate("/auth");
          return;
        }

        // Fetch user's orders
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Get user's VIP level and profile for commission calculation
        const { data: profile } = await supabase
          .from('profiles')
          .select('vip_level')
          .eq('user_id', user.id)
          .single();

        let commissionRate = 0.06; // Default commission rate
        if (profile && profile.vip_level > 0) {
          const { data: vipLevel } = await supabase
            .from('vip_levels')
            .select('commission_rate')
            .eq('id', profile.vip_level)
            .single();
          
          commissionRate = vipLevel?.commission_rate || 0.06;
        }

        // Get all products to match images
        const { data: products } = await supabase
          .from('products')
          .select('name, image_url');

        const productImageMap = products?.reduce((acc, product) => {
          acc[product.name] = product.image_url;
          return acc;
        }, {} as Record<string, string>) || {};

        // Process orders with profit calculation and images
        const ordersWithProfit: OrderWithProfit[] = (ordersData || []).map(order => ({
          ...order,
          profit: order.status === 'completed' ? Number(order.total_amount) * commissionRate : 0,
          product_image: productImageMap[order.product_name] || '/placeholder.svg'
        }));

        setOrders(ordersWithProfit);
        setTotalOrders(ordersWithProfit.length);
        
        // Calculate totals from completed orders
        const completedOrders = ordersWithProfit.filter(order => order.status === 'completed');
        const totalSpentAmount = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        const totalProfitAmount = completedOrders.reduce((sum, order) => sum + order.profit, 0);
        
        setTotalSpent(totalSpentAmount);
        setTotalProfit(totalProfitAmount);
        
      } catch (error) {
        console.error('Error fetching order history:', error);
        toast({
          title: t('common.error'),
          description: t('history.load.error'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, [toast, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/90 hover:bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">{t('history.status.completed')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">{t('history.status.pending')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/90 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">{t('history.status.cancelled')}</Badge>;
      default:
        return <Badge className="bg-gray-500/90 hover:bg-gray-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-luxury p-4 flex items-center gap-3">
        <ArrowLeft 
          className="text-white w-6 h-6 cursor-pointer" 
          onClick={() => navigate("/")}
        />
        <Package className="text-white w-6 h-6" />
        <h1 className="text-white font-semibold text-lg">{t('nav.history')}</h1>
      </div>

      {/* Statistics */}
      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalOrders}</div>
              <div className="text-sm text-muted-foreground">{t('history.total.orders')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{t('history.total.spent')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">${totalProfit.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{t('history.total.profit')}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">{t('common.loading')}</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <div className="text-muted-foreground">{t('history.no.orders')}</div>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex gap-3 mb-3">
                {/* Product Image */}
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{order.product_name}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.created_at)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('history.quantity')}: </span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('history.price')}: </span>
                      <span className="font-bold text-primary">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                    {order.profit > 0 && (
                      <>
                        <div>
                          <span className="text-muted-foreground">{t('history.profit')}: </span>
                          <span className="font-bold text-green-500">+${order.profit.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;