# Thay đổi Commission Calculation - Chỉ tính theo ngày

## Tổng quan
Đã thay đổi logic tính commission từ việc tính tổng tất cả sản phẩm đã mua sang chỉ tính commission từ sản phẩm đã mua **trong ngày hôm nay**.

## Thay đổi chính

### 1. Utility Functions (`src/utils/commissionUtils.ts`)
- `calculateDailyCommission()`: Tính commission chỉ từ đơn hàng trong ngày
- `getTodayOrders()`: Lọc đơn hàng trong ngày
- `calculateDailySpent()`: Tính tổng chi tiêu trong ngày

### 2. TaskCenter (`src/pages/TaskCenter.tsx`)
- Thay đổi logic tính `totalProfit` để chỉ tính từ đơn hàng trong ngày
- Sử dụng utility function `calculateDailyCommission()`

### 3. Profile (`src/pages/Profile.tsx`)
- Thay đổi logic tính `totalProfit` để chỉ tính từ đơn hàng trong ngày
- Sử dụng utility function `calculateDailyCommission()`

### 4. PurchaseHistory (`src/pages/PurchaseHistory.tsx`)
- Thay đổi logic tính `totalSpent` và `totalProfit` để chỉ tính từ đơn hàng trong ngày
- Sử dụng utility functions `calculateDailySpent()` và `calculateDailyCommission()`

### 5. GroupReport (`src/pages/GroupReport.tsx`)
- Thay đổi logic tính commission team để chỉ tính từ đơn hàng trong ngày
- Sử dụng utility function `calculateDailySpent()`

### 6. ProductModal (`src/components/ProductModal.tsx`)
- Thay đổi `grandCommission` từ "Product price + commission" thành "Tổng lợi nhuận của các đơn hàng đã mua trong ngày"
- Cập nhật label thành "Tổng Lợi Nhuận Hôm Nay"
- Thêm ghi chú giải thích rõ ràng về ý nghĩa của grandCommission

### 7. Edge Function (`supabase/functions/process-order/index.ts`)
- Thêm ghi chú log về commission tính theo ngày

## Lợi ích của thay đổi

1. **Công bằng hơn**: Commission chỉ tính từ hoạt động trong ngày, không tích lũy từ quá khứ
2. **Khuyến khích hoạt động hàng ngày**: Người dùng cần mua hàng mỗi ngày để nhận commission
3. **Dễ quản lý**: Commission reset mỗi ngày, dễ theo dõi và kiểm soát
4. **Tránh lạm dụng**: Ngăn chặn việc tích lũy commission từ các đơn hàng cũ

## Cách hoạt động

- **Trước đây**: 
  - Commission = Tổng tất cả sản phẩm đã mua × Tỷ lệ commission
  - Grand Commission = Giá sản phẩm + Commission của sản phẩm hiện tại
- **Bây giờ**: 
  - Commission = Tổng sản phẩm đã mua trong ngày × Tỷ lệ commission
  - Grand Commission = Tổng lợi nhuận của tất cả đơn hàng đã mua trong ngày

## Lưu ý kỹ thuật

- Sử dụng `Date` object để xác định ngày hiện tại
- `startOfDay`: 00:00:00 của ngày hôm nay
- `endOfDay`: 00:00:00 của ngày mai
- Chỉ tính commission từ đơn hàng có status = 'completed'
- Tất cả các trang liên quan đều được cập nhật để nhất quán

## Testing

Để test thay đổi này:
1. Mua sản phẩm trong ngày hôm nay
2. Kiểm tra commission hiển thị đúng
3. Đợi sang ngày mai, commission sẽ reset về 0
4. Mua sản phẩm mới để nhận commission mới
