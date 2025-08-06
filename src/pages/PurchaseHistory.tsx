import { useState, useEffect } from "react";
import { ArrowLeft, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  product_name: string;
  total_amount: number;
  quantity: number;
  status: string;
  created_at: string;
}

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Lỗi",
            description: "Vui lòng đăng nhập để xem lịch sử mua hàng",
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

        setOrders(ordersData || []);
        setTotalOrders(ordersData?.length || 0);
        
        // Calculate total spent from completed orders
        const completedOrders = ordersData?.filter(order => order.status === 'completed') || [];
        const total = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        setTotalSpent(total);
        
      } catch (error) {
        console.error('Error fetching order history:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử mua hàng",
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
        return <Badge className="bg-green-500 text-white">Hoàn thành</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Đang xử lý</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
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
        <h1 className="text-white font-semibold text-lg">Lịch sử mua hàng</h1>
      </div>

      {/* Statistics */}
      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalOrders}</div>
              <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <div className="text-muted-foreground">Chưa có đơn hàng nào</div>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{order.product_name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.created_at)}
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Số lượng: {order.quantity}
                </div>
                <div className="text-lg font-bold text-primary">
                  ${Number(order.total_amount).toFixed(2)}
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