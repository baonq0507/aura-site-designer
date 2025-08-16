# Hướng dẫn sử dụng chức năng Bật/Tắt hệ thống

## Tổng quan
Chức năng này cho phép admin bật/tắt hệ thống để kiểm soát việc người dùng có thể sử dụng chức năng tìm kiếm đơn hàng trong TaskCenter hay không.

## Tính năng chính

### 1. Bật/Tắt hệ thống
- **Bật hệ thống**: Người dùng có thể sử dụng chức năng tìm kiếm đơn hàng
- **Tắt hệ thống**: Người dùng không thể sử dụng chức năng tìm kiếm đơn hàng

### 2. Tin nhắn bảo trì
- Admin có thể tùy chỉnh tin nhắn hiển thị khi hệ thống bị tắt
- Tin nhắn này sẽ được hiển thị cho người dùng khi họ cố gắng sử dụng chức năng bị khóa

## Cách sử dụng

### Đối với Admin:

1. **Truy cập trang Admin**
   - Đăng nhập với tài khoản admin
   - Vào trang `/admin`

2. **Chọn menu "Quản lý hệ thống"**
   - Click vào menu "Quản lý hệ thống" trong sidebar
   - Hoặc chọn `activeSection = "system"`

3. **Bật/Tắt hệ thống**
   - Sử dụng switch để bật/tắt hệ thống
   - Hoặc click nút "Bật hệ thống" / "Tắt hệ thống"

4. **Cập nhật tin nhắn bảo trì**
   - Nhập tin nhắn bảo trì vào textarea
   - Click "Lưu tin nhắn" để cập nhật

### Đối với người dùng:

1. **Khi hệ thống đang hoạt động**:
   - Có thể sử dụng bình thường chức năng tìm kiếm đơn hàng
   - Không có thông báo đặc biệt

2. **Khi hệ thống bị tắt**:
   - Khi click nút "Nhận đơn hàng" sẽ hiển thị thông báo lỗi
   - Thông báo sẽ hiển thị tin nhắn bảo trì đã được cấu hình

## Cấu trúc dữ liệu

### Bảng `system_settings`
```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Cấu trúc JSON cho `system_status`
```json
{
    "is_enabled": true,
    "maintenance_message": "Hệ thống đã ngừng hoạt động, vui lòng quay lại vào ngày hôm sau"
}
```

## API Endpoints

### Lấy trạng thái hệ thống
```typescript
const { data, error } = await supabase
  .from('system_settings')
  .select('value')
  .eq('key', 'system_status')
  .single();
```

### Cập nhật trạng thái hệ thống
```typescript
const { error } = await supabase
  .from('system_settings')
  .update({ 
    value: newStatus,
    updated_at: new Date().toISOString()
  })
  .eq('key', 'system_status');
```

## Bảo mật

### Row Level Security (RLS)
- Chỉ admin mới có thể đọc/ghi `system_settings`
- User thường chỉ có thể đọc `system_settings`

### Kiểm tra quyền
```typescript
// Trong SystemContext
if (!user) {
  throw new Error('Không có quyền cập nhật trạng thái hệ thống');
}
```

## Real-time Updates

- **Supabase Realtime**: Hệ thống sử dụng Supabase Realtime để cập nhật trạng thái ngay lập tức
- **Không cần refresh**: Người dùng không cần refresh trang để thấy thay đổi
- **Tức thì**: Khi admin bật/tắt hệ thống, thay đổi được áp dụng ngay lập tức cho tất cả người dùng
- **TaskCenter**: Chức năng tìm kiếm đơn hàng được khóa/mở khóa real-time
- **Visual Indicator**: Người dùng thấy trạng thái hệ thống hiện tại trong header TaskCenter

## Cách hoạt động Real-time

### 1. Admin thay đổi trạng thái
- Admin bật/tắt hệ thống trong SystemControl
- Thay đổi được lưu vào database `system_settings`

### 2. Supabase Realtime
- Database trigger gửi thông báo thay đổi
- Tất cả client đang kết nối nhận được update

### 3. Client cập nhật
- SystemContext nhận thay đổi và cập nhật state
- TaskCenter tự động khóa/mở khóa chức năng tìm kiếm
- UI hiển thị trạng thái mới ngay lập tức

### 4. Người dùng thấy thay đổi
- Không cần refresh trang
- Trạng thái hệ thống được cập nhật real-time
- Chức năng tìm kiếm đơn hàng được khóa/mở khóa tức thì

## Migration

Để sử dụng chức năng này, cần chạy migration:

```bash
# Chạy migration để tạo bảng system_settings
supabase db push
```

## Lưu ý quan trọng

1. **Backup**: Luôn backup dữ liệu trước khi thay đổi trạng thái hệ thống
2. **Thông báo**: Nên thông báo trước cho người dùng khi tắt hệ thống
3. **Monitoring**: Theo dõi log để đảm bảo hệ thống hoạt động ổn định
4. **Fallback**: Hệ thống có fallback để hiển thị trạng thái mặc định nếu có lỗi

## Troubleshooting

### Lỗi thường gặp:

1. **Không thể cập nhật trạng thái**
   - Kiểm tra quyền admin
   - Kiểm tra kết nối database

2. **Trạng thái không được cập nhật real-time**
   - Kiểm tra subscription real-time
   - Restart ứng dụng nếu cần

3. **Tin nhắn bảo trì không hiển thị**
   - Kiểm tra cấu trúc JSON
   - Kiểm tra encoding UTF-8

## Tương lai

Có thể mở rộng chức năng này để:
- Lên lịch bảo trì tự động
- Thông báo push notification
- Log lịch sử thay đổi trạng thái
- Multiple maintenance windows
- A/B testing cho tin nhắn bảo trì
