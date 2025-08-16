# Tính năng Hoa hồng Tùy chỉnh cho Admin

## Tổng quan
Tính năng này cho phép admin thiết lập khoảng hoa hồng tùy chỉnh cho từng người dùng, ghi đè lên tỷ lệ hoa hồng VIP level mặc định.

## Cách hoạt động

### 1. Hoa hồng VIP level (mặc định)
- Người dùng nhận hoa hồng theo tỷ lệ cố định dựa trên VIP level
- Ví dụ: VIP 4 có tỷ lệ 14% → đơn hàng $100 sẽ nhận $14 hoa hồng

### 2. Hoa hồng tùy chỉnh (mới)
- Admin có thể thiết lập khoảng hoa hồng trung bình cho người dùng
- Ví dụ: min $300, max $1000 → hoa hồng trung bình sẽ từ $300-$1000
- **Vẫn tìm kiếm đơn hàng theo VIP level** nhưng tính hoa hồng theo khoảng đã thiết lập
- Hệ thống sẽ tìm các đơn hàng có giá trị phù hợp để đạt được hoa hồng trung bình

## Cách sử dụng

### Bước 1: Truy cập User Management
1. Đăng nhập với tài khoản admin
2. Vào Admin Dashboard → User Management
3. Tìm người dùng cần thiết lập

### Bước 2: Thiết lập hoa hồng tùy chỉnh
1. Click vào menu "..." của người dùng
2. Chọn "Cài đặt hoa hồng"
3. Bật "Bật hoa hồng tùy chỉnh"
4. Nhập giá trị min và max (ví dụ: 300 và 1000)
5. Click "Lưu thay đổi"

### Bước 3: Kiểm tra kết quả
- Người dùng sẽ thấy trạng thái "Bật" trong cột "Hoa hồng tùy chỉnh"
- Khoảng hoa hồng sẽ hiển thị: $300 - $1000
- Mỗi đơn hàng mới sẽ nhận hoa hồng ngẫu nhiên trong khoảng này

## Ví dụ cụ thể

### Trường hợp 1: Người dùng VIP 4 (14%)
- **Trước khi bật hoa hồng tùy chỉnh:**
  - Đơn hàng $100 → hoa hồng $14
  - Đơn hàng $200 → hoa hồng $28

- **Sau khi bật hoa hồng tùy chỉnh (min $300, max $1000):**
  - Hoa hồng trung bình: $650
  - Hệ thống vẫn tìm đơn hàng theo VIP 4 (14%)
  - Nhưng sẽ tìm các đơn hàng có giá trị phù hợp để đạt được hoa hồng trung bình $650
  - Ví dụ: Tìm đơn hàng có giá trị khoảng $4,643 để đạt hoa hồng $650 (14% của $4,643)

### Trường hợp 2: Người dùng VIP Base (6%)
- **Trước khi bật hoa hồng tùy chỉnh:**
  - Đơn hàng $100 → hoa hồng $6

- **Sau khi bật hoa hồng tùy chỉnh (min $500, max $800):**
  - Hoa hồng trung bình: $650
  - Hệ thống vẫn tìm đơn hàng theo VIP Base (6%)
  - Nhưng sẽ tìm các đơn hàng có giá trị phù hợp để đạt được hoa hồng trung bình $650
  - Ví dụ: Tìm đơn hàng có giá trị khoảng $10,833 để đạt hoa hồng $650 (6% của $10,833)

## Lưu ý quan trọng

### 1. Tìm kiếm theo VIP level
- Khi bật hoa hồng tùy chỉnh, hệ thống **vẫn tìm kiếm đơn hàng theo VIP level**
- Hoa hồng được tính dựa trên khoảng min-max đã thiết lập
- Hệ thống sẽ tìm các đơn hàng có giá trị phù hợp để đạt được hoa hồng trung bình

### 2. Tính hoa hồng trung bình
- Hoa hồng trung bình sẽ nằm trong khoảng min-max đã thiết lập
- Hệ thống sẽ tìm đơn hàng có giá trị phù hợp để đạt được hoa hồng trung bình đó

### 3. Áp dụng ngay lập tức
- Thay đổi có hiệu lực ngay sau khi lưu
- Không cần restart hệ thống

### 4. Tắt hoa hồng tùy chỉnh
- Khi tắt, hệ thống sẽ tự động quay về sử dụng VIP level
- Các giá trị min/max sẽ được reset về null

## Cấu trúc Database

### Bảng `profiles` (mới thêm)
```sql
ALTER TABLE public.profiles 
ADD COLUMN custom_commission_min numeric DEFAULT NULL,
ADD COLUMN custom_commission_max numeric DEFAULT NULL,
ADD COLUMN use_custom_commission boolean DEFAULT false;
```

### Function tính hoa hồng (mới)
```sql
CREATE OR REPLACE FUNCTION public.calculate_order_commission(
  user_id_param uuid,
  order_amount numeric
)
RETURNS numeric
```

## Edge Cases và Xử lý

### 1. Giá trị không hợp lệ
- Min > Max: Hiển thị lỗi "Giá trị max phải lớn hơn giá trị min"
- Giá trị âm: Hiển thị lỗi "Giá trị hoa hồng không được âm"
- Thiếu giá trị: Hiển thị lỗi "Vui lòng nhập cả giá trị min và max"

### 2. Khi tắt hoa hồng tùy chỉnh
- Giá trị min/max tự động reset về null
- Hệ thống quay về sử dụng VIP level

### 3. Khi VIP level thay đổi
- Nếu đang bật hoa hồng tùy chỉnh: VIP level không ảnh hưởng
- Nếu tắt hoa hồng tùy chỉnh: Sử dụng VIP level mới

## Troubleshooting

### Vấn đề thường gặp

1. **Hoa hồng không thay đổi sau khi thiết lập**
   - Kiểm tra trạng thái "Bật" đã được lưu chưa
   - Refresh trang để cập nhật dữ liệu

2. **Không thể lưu cài đặt**
   - Kiểm tra giá trị min/max có hợp lệ không
   - Đảm bảo đã bật "Bật hoa hồng tùy chỉnh"

3. **Hoa hồng vẫn theo VIP level**
   - Kiểm tra `use_custom_commission` có = true không
   - Kiểm tra `custom_commission_min` và `custom_commission_max` có giá trị không

### Log và Debug
- Edge function sẽ log rõ ràng loại hoa hồng đang sử dụng
- Kiểm tra console để xem log chi tiết

## Kết luận

Tính năng hoa hồng tùy chỉnh cung cấp cho admin khả năng điều chỉnh hoa hồng trung bình cho từng người dùng, trong khi vẫn giữ nguyên logic tìm kiếm đơn hàng theo VIP level. Điều này đặc biệt hữu ích cho:

- Điều chỉnh hoa hồng trung bình cho người dùng cụ thể
- Chương trình khuyến mãi tạm thời
- Cân bằng hoa hồng giữa các VIP level khác nhau
- Quản lý chi phí hoa hồng một cách linh hoạt mà không ảnh hưởng đến logic tìm kiếm
