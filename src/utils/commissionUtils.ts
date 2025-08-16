/**
 * Utility functions for commission calculations
 */

/**
 * Tính commission chỉ từ đơn hàng trong ngày hôm nay
 * @param orders - Danh sách đơn hàng
 * @param commissionRate - Tỷ lệ commission (ví dụ: 0.06 = 6%)
 * @returns Tổng commission từ đơn hàng trong ngày
 */
export const calculateDailyCommission = (orders: any[], commissionRate: number): number => {
  if (!orders || orders.length === 0) return 0;
  
  // Lọc chỉ những đơn hàng trong ngày hôm nay
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startOfDay && orderDate < endOfDay && order.status === 'completed';
  });
  
  return todayOrders.reduce((sum, order) => {
    return sum + (Number(order.total_amount) * commissionRate);
  }, 0);
};

/**
 * Lấy đơn hàng trong ngày hôm nay
 * @param orders - Danh sách đơn hàng
 * @returns Đơn hàng trong ngày hôm nay
 */
export const getTodayOrders = (orders: any[]): any[] => {
  if (!orders || orders.length === 0) return [];
  
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  return orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startOfDay && orderDate < endOfDay;
  });
};

/**
 * Tính tổng chi tiêu trong ngày
 * @param orders - Danh sách đơn hàng
 * @returns Tổng chi tiêu trong ngày
 */
export const calculateDailySpent = (orders: any[]): number => {
  const todayOrders = getTodayOrders(orders);
  return todayOrders.reduce((sum, order) => {
    return sum + Number(order.total_amount);
  }, 0);
};
