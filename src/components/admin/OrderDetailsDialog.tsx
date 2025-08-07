import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Package, Calendar, DollarSign, Phone, Mail } from "lucide-react";
import { Order, OrderStatus } from "@/types/order";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
}

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

export const OrderDetailsDialog = ({ 
  order, 
  open, 
  onOpenChange, 
  onStatusUpdate 
}: OrderDetailsDialogProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && order) {
      loadOrderDetails();
    }
  }, [open, order]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);

      // Load product details
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('name', order.product_name)
        .single();

      if (productData) {
        setProduct(productData);
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', order.user_id)
        .single();

      if (profileData) {
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const },
      processing: { label: 'Đang xử lý', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    onStatusUpdate(order.id, newStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Chi tiết đơn hàng #{order.id.slice(-8)}</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trạng thái đơn hàng</span>
                  {getStatusBadge(order.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <span>Cập nhật trạng thái:</span>
                  <Select value={order.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Thông tin khách hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Tên:</span>
                  <span>{userProfile?.username || 'N/A'}</span>
                </div>
                {userProfile?.phone_number && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{userProfile.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="font-medium">ID người dùng:</span>
                  <span className="font-mono text-xs">{order.user_id.slice(-8)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Thông tin sản phẩm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product?.image_url && (
                  <div className="flex justify-center">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tên sản phẩm:</span>
                    <span>{order.product_name}</span>
                  </div>
                  {product?.description && (
                    <div className="flex justify-between">
                      <span className="font-medium">Mô tả:</span>
                      <span className="text-right max-w-xs">{product.description}</span>
                    </div>
                  )}
                  {product?.category && (
                    <div className="flex justify-between">
                      <span className="font-medium">Danh mục:</span>
                      <span>{product.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Số lượng:</span>
                    <span>{order.quantity}</span>
                  </div>
                  {product?.price && (
                    <div className="flex justify-between">
                      <span className="font-medium">Giá đơn vị:</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Tóm tắt đơn hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Số lượng:</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng tiền:</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ngày tạo:</span>
                  </div>
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Cập nhật cuối:</span>
                  </div>
                  <span>{formatDate(order.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};