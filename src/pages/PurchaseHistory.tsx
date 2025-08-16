import { useState, useEffect } from "react";
import { ArrowLeft, Package, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoadingOverlay, Skeleton, SkeletonCard } from "@/components/ui/loading";
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
  const [filteredOrders, setFilteredOrders] = useState<OrderWithProfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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
        
        // Calculate totals from completed orders - chỉ tính từ đơn hàng trong ngày
        const completedOrders = ordersWithProfit.filter(order => order.status === 'completed');
        
        // Lọc chỉ những đơn hàng trong ngày hôm nay
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        
        const todayCompletedOrders = completedOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= startOfDay && orderDate < endOfDay;
        });
        
        const totalSpentAmount = todayCompletedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        const totalProfitAmount = todayCompletedOrders.reduce((sum, order) => sum + order.profit, 0);
        
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

  // Filter orders based on status and time
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisMonth = new Date(today);
      thisMonth.setMonth(thisMonth.getMonth() - 1);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        switch (timeFilter) {
          case "today":
            return orderDate >= today;
          case "yesterday":
            return orderDate >= yesterday && orderDate < today;
          case "thisWeek":
            return orderDate >= thisWeek;
          case "thisMonth":
            return orderDate >= thisMonth;
          default:
            return true;
        }
      });
    }

    // Sort by created_at descending (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredOrders(filtered);
  }, [orders, statusFilter, timeFilter]);

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
  // Handler for submit button on pending orders
  const handleSubmitOrder = async (order: OrderWithProfit) => {
    setIsLoading(true);
    setSubmittingOrderId(order.id); // Hiển thị loading
    try {
      // Kiểm tra số dư tài khoản
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance, vip_level')
        .eq('user_id', user.id)
        .single();

      if (profile?.balance < order.total_amount) {
        toast({
          title: t('common.error'),
          description: t('history.submit.error.balance'),
          variant: "destructive"
        });
        setSubmittingOrderId(null);
        return;
      }

      // Lấy thông tin sản phẩm
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('name', order.product_name)
        .single();

      // Gọi edge function để xử lý đơn hàng
      const { data, error } = await supabase.functions.invoke('process-order', {
        body: {
          product_id: product.id,
          user_id: user.id
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: t('common.success'),
          description: `${t('common.submit.success.description')} ${data.commission.toFixed(2)} USD profit. ${t('common.submit.success.newBalance')} ${data.newBalance.toFixed(2)} USD`,
        });
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });


        if (error) {
          throw error;
        }
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
        const ordersWithProfit: OrderWithProfit[] = (ordersData || []).map(order => ({
          ...order,
          profit: order.status === 'completed' ? Number(order.total_amount) * commissionRate : 0,
          product_image: productImageMap[order.product_name] || '/placeholder.svg'
        }));
        setOrders(ordersWithProfit);
        // Gọi lại hàm lấy orders để cập nhật danh sách đơn hàng

      }

    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('history.submit.error'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSubmittingOrderId(null);
    }
  };

  return (
    
    <div className="min-h-screen bg-background">
      {/* <LoadingOverlay 
        isVisible={isInitialLoading || isLoading}
        text={isInitialLoading ? t("common.loading") : t("task.button.finding.product")}
      /> */}
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('history.title')}</h1>
              <p className="text-muted-foreground">{t('history.subtitle')}</p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4" />
              {/* {t('back')} */}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        {/* <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('history.total.orders')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('history.total.spent')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('history.total.profit')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${totalProfit.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div> */}

        {/* Filters */}
        {/* <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('history.filters')}</h3>
              
              <div>
                <label className="text-sm font-medium mb-2 block">{t('history.filter.status')}</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    {t('history.filter.all')}
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("completed")}
                  >
                    {t('history.status.completed')}
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    {t('history.status.pending')}
                  </Button>
                  <Button
                    variant={statusFilter === "cancelled" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("cancelled")}
                  >
                    {t('history.status.cancelled')}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t('history.filter.time')}</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={timeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter("all")}
                  >
                    {t('history.filter.allTime')}
                  </Button>
                  <Button
                    variant={timeFilter === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter("today")}
                  >
                    {t('history.filter.today')}
                  </Button>
                  <Button
                    variant={timeFilter === "yesterday" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter("yesterday")}
                  >
                    {t('history.filter.yesterday')}
                  </Button>
                  <Button
                    variant={timeFilter === "thisWeek" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter("thisWeek")}
                  >
                    {t('history.filter.thisWeek')}
                  </Button>
                  <Button
                    variant={timeFilter === "thisMonth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter("thisMonth")}
                  >
                    {t('history.filter.thisMonth')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {t('history.orders')} ({filteredOrders.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <div className="text-muted-foreground">{t('history.loading')}</div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">{t('history.no.orders')}</div>
              <div className="text-muted-foreground">{t('history.no.orders.desc')}</div>
            </div>
          ) : (
            filteredOrders.map((order) => (
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
                  
                  {/* <div className="grid grid-cols-2 gap-4 text-sm">
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
                  </div> */}
                  {/* Thêm button submit cho đơn hàng đang xử lý */}
                  {order.status === "pending" && (
                    <div className="mt-4">
                      <Button
                        variant="default"
                        disabled={submittingOrderId === order.id}
                        onClick={() => handleSubmitOrder(order)}
                      >
                        {submittingOrderId === order.id
                          ? t('common.submitting')
                          : t('common.submit')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;