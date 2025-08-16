# Khắc phục vấn đề "Unknown User" trong Quản lý Rút tiền

## Vấn đề
Trong bảng quản lý rút tiền, một số user hiển thị "Unknown User" thay vì tên thật của họ.

## Nguyên nhân
1. **User profile bị thiếu**: User ID tồn tại trong bảng `withdrawal_transactions` nhưng không có trong bảng `profiles`
2. **Username bị null**: Trong bảng `profiles`, trường `username` có thể bị `null`
3. **Lỗi trong quá trình join dữ liệu**: Logic fetch dữ liệu không xử lý tốt trường hợp profile bị thiếu

## Giải pháp đã triển khai

### 1. Cải thiện logic fetch dữ liệu
- Thêm logging để debug vấn đề
- Xử lý tốt hơn trường hợp `profiles` bị null
- Thêm error handling cho việc fetch profiles

### 2. Function tự động tạo profile
- `ensureUserProfile()`: Kiểm tra và tạo profile cho user nếu cần thiết
- Tự động tạo username dựa trên User ID nếu không có
- Set các giá trị mặc định cho VIP level, balance, etc.

### 3. Button "Fix Missing Profiles"
- Admin có thể click để tự động fix tất cả user profile bị thiếu
- Hiển thị số lượng profile đã được fix
- Tự động refresh danh sách sau khi fix

### 4. Cải thiện hiển thị UI
- Thay vì hiển thị "Unknown User", hiển thị "User ID: abc123..."
- Sử dụng màu muted để phân biệt với username thật
- Cải thiện hiển thị trong dialog chi tiết

## Cách sử dụng

### Để fix một user cụ thể:
1. Mở Developer Console (F12)
2. Xem logs để tìm user_id bị thiếu profile
3. Function `ensureUserProfile()` sẽ tự động chạy khi fetch dữ liệu

### Để fix tất cả user bị thiếu profile:
1. Click button "Fix Missing Profiles" trong header
2. Đợi quá trình hoàn thành
3. Danh sách sẽ tự động refresh

## Cấu trúc database

### Bảng `profiles`:
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES auth.users(id),
  username text,  -- Có thể null
  phone_number text,
  vip_level integer DEFAULT 1,
  total_orders integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  balance numeric DEFAULT 0,
  -- ... các trường khác
);
```

### Bảng `withdrawal_transactions`:
```sql
CREATE TABLE withdrawal_transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  amount numeric,
  status text,
  created_at timestamp,
  -- ... các trường khác
);
```

## Monitoring và Debug

### Console logs:
- `Fetching profiles for user IDs: [...]`
- `Fetched profiles: [...]`
- `Withdrawal [id]: user_id=[...], profile= [...]`
- `User profile not found for user_id: [...], attempting to create...`
- `Enriched withdrawals: [...]`

### Warning logs:
- `User profile not found for user_id: [...]`

## Lưu ý quan trọng

1. **Quyền admin**: Function `ensureUserProfile()` cần quyền admin để tạo profile
2. **Performance**: Fix tất cả profile có thể mất thời gian nếu có nhiều user
3. **Data integrity**: Chỉ tạo profile cơ bản, không thay đổi dữ liệu hiện có
4. **Backup**: Nên backup database trước khi chạy fix hàng loạt

## Troubleshooting

### Nếu vẫn còn "Unknown User":
1. Kiểm tra console logs để xem user_id nào bị thiếu
2. Kiểm tra quyền admin trong Supabase
3. Kiểm tra RLS policies cho bảng `profiles`
4. Kiểm tra trigger `handle_new_user_with_profile` có hoạt động không

### Nếu button "Fix Missing Profiles" không hoạt động:
1. Kiểm tra quyền admin
2. Kiểm tra console errors
3. Kiểm tra network requests trong DevTools
4. Kiểm tra Supabase logs
