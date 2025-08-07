import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, Package, DollarSign, TrendingUp, TrendingDown, Calendar, Eye, Filter, Star } from "lucide-react";

interface UserPurchaseStats {
  user_id: string;
  username: string;
  phone_number: string;
  email: string;
  vip_level: number;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_purchase_date: string | null;
  orders: OrderSummary[];
}

interface OrderSummary {
  id: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
}

interface TopProduct {
  product_name: string;
  total_quantity: number;
  total_revenue: number;
  order_count: number;
}

const UserPurchaseManagement = () => {
  const { toast } = useToast();
  const [userStats, setUserStats] = useState<UserPurchaseStats[]>([]);
  const [filteredStats, setFilteredStats] = useState<UserPurchaseStats[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"spent" | "orders" | "recent">("spent");
  const [vipFilter, setVipFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserPurchaseStats | null>(null);

  useEffect(() => {
    loadUserPurchaseData();
    loadTopProducts();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [userStats, searchTerm, sortBy, vipFilter]);

  const loadUserPurchaseData = async () => {
    try {
      setLoading(true);
      
      // Get all users with their profile data, sorted by newest first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          username,
          phone_number,
          vip_level,
          total_orders,
          total_spent,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get orders for each user and calculate stats
      const userStatsPromises = profiles?.map(async (profile) => {
        // Get auth user data for email
        const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id);
        
        // Get user's orders
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            id,
            product_name,
            quantity,
            total_amount,
            status,
            created_at
          `)
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: false });

        const completedOrders = orders?.filter(order => order.status === 'completed') || [];
        const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        const avgOrderValue = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;
        const lastPurchase = completedOrders.length > 0 ? completedOrders[0].created_at : null;

        return {
          user_id: profile.user_id,
          username: profile.username || 'Chưa có tên',
          phone_number: profile.phone_number || 'Chưa có SĐT',
          email: authUser.user?.email || 'Chưa có email',
          vip_level: profile.vip_level || 0,
          total_orders: completedOrders.length,
          total_spent: totalSpent,
          avg_order_value: avgOrderValue,
          last_purchase_date: lastPurchase,
          orders: orders?.slice(0, 5) || [] // Get last 5 orders for preview
        };
      }) || [];

      const userStatsData = await Promise.all(userStatsPromises);
      setUserStats(userStatsData);
      
    } catch (error) {
      console.error('Error loading user purchase data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu mua hàng của người dùng",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTopProducts = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('product_name, quantity, total_amount')
        .eq('status', 'completed');

      if (error) throw error;

      // Group by product and calculate stats
      const productStats = orders?.reduce((acc, order) => {
        const name = order.product_name;
        if (!acc[name]) {
          acc[name] = {
            product_name: name,
            total_quantity: 0,
            total_revenue: 0,
            order_count: 0
          };
        }
        acc[name].total_quantity += order.quantity;
        acc[name].total_revenue += Number(order.total_amount);
        acc[name].order_count += 1;
        return acc;
      }, {} as Record<string, TopProduct>) || {};

      const topProductsArray = Object.values(productStats)
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 10);

      setTopProducts(topProductsArray);
    } catch (error) {
      console.error('Error loading top products:', error);
    }
  };

  const filterUsers = () => {
    let filtered = userStats;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.includes(searchTerm)
      );
    }

    // VIP level filter
    if (vipFilter !== "all") {
      if (vipFilter === "vip") {
        filtered = filtered.filter(user => user.vip_level > 0);
      } else {
        filtered = filtered.filter(user => user.vip_level === 0);
      }
    }

    // Sort - default to newest users first (recent registration)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "spent":
          return b.total_spent - a.total_spent;
        case "orders":
          return b.total_orders - a.total_orders;
        case "recent":
          if (!a.last_purchase_date) return 1;
          if (!b.last_purchase_date) return -1;
          return new Date(b.last_purchase_date).getTime() - new Date(a.last_purchase_date).getTime();
        default:
          return b.total_spent - a.total_spent; // Default to highest spenders
      }
    });

    setFilteredStats(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getVipBadge = (level: number) => {
    if (level === 0) {
      return <Badge variant="outline">VIP BASE</Badge>;
    }
    return <Badge variant="default" className="bg-yellow-100 text-yellow-800">VIP {level}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const },
      processing: { label: 'Đang xử lý', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
        {config.label}
      </Badge>
    );
  };

  const totalRevenue = userStats.reduce((sum, user) => sum + user.total_spent, 0);
  const totalOrders = userStats.reduce((sum, user) => sum + user.total_orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const vipUsers = userStats.filter(user => user.vip_level > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý mua hàng người dùng</h2>
          <p className="text-muted-foreground">Phân tích và quản lý hoạt động mua hàng của khách hàng</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Từ {totalOrders} đơn hàng</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị trung bình</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Mỗi đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng VIP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipUsers}</div>
            <p className="text-xs text-muted-foreground">/{userStats.length} tổng khách hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm bán chạy</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topProducts.length}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đã bán</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Khách hàng</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm bán chạy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spent">Chi tiêu cao nhất</SelectItem>
                    <SelectItem value="orders">Nhiều đơn hàng nhất</SelectItem>
                    <SelectItem value="recent">Mua gần đây nhất</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={vipFilter} onValueChange={setVipFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Lọc VIP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="vip">Chỉ VIP</SelectItem>
                    <SelectItem value="regular">Khách thường</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách khách hàng ({filteredStats.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>VIP Level</TableHead>
                        <TableHead>Tổng đơn hàng</TableHead>
                        <TableHead>Tổng chi tiêu</TableHead>
                        <TableHead>Giá trị TB</TableHead>
                        <TableHead>Mua gần nhất</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStats.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.username}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                <div className="text-xs text-muted-foreground">{user.phone_number}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getVipBadge(user.vip_level)}</TableCell>
                          <TableCell className="font-medium">{user.total_orders}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(user.total_spent)}</TableCell>
                          <TableCell>{formatCurrency(user.avg_order_value)}</TableCell>
                          <TableCell>{formatDate(user.last_purchase_date)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredStats.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">
                              {searchTerm ? "Không tìm thấy khách hàng nào" : "Chưa có dữ liệu khách hàng"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Số lượng bán</TableHead>
                      <TableHead>Tổng doanh thu</TableHead>
                      <TableHead>Số đơn hàng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={product.product_name}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <span className="font-medium">{product.product_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.total_quantity}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(product.total_revenue)}</TableCell>
                        <TableCell>{product.order_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chi tiết khách hàng: {selectedUser.username}
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Đóng
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{selectedUser.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VIP Level</p>
                  {getVipBadge(selectedUser.vip_level)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                  <p className="font-medium">{selectedUser.total_orders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                  <p className="font-medium">{formatCurrency(selectedUser.total_spent)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá trị trung bình</p>
                  <p className="font-medium">{formatCurrency(selectedUser.avg_order_value)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Đơn hàng gần đây</h3>
                <div className="space-y-2">
                  {selectedUser.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {order.quantity} • {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                  {selectedUser.orders.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Chưa có đơn hàng nào</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserPurchaseManagement;