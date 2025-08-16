# Hệ Thống Audio Thông Báo Chat Hỗ Trợ

## Tổng Quan
Hệ thống đã được cập nhật để phát audio thông báo khi có tin nhắn mới trong chat hỗ trợ.

## Cách Hoạt Động

### 1. Khi Người Dùng Gửi Tin Nhắn Đến Admin
- **File**: `src/components/SupportChat.tsx`
- **Logic**: Khi người dùng gửi tin nhắn, hệ thống sẽ tự động phát âm thanh thông báo cho admin
- **Âm thanh**: Sử dụng hàm `playSupportChatSound()` từ `src/utils/notifications.ts`

### 2. Khi Admin Gửi Tin Nhắn Đến Người Dùng
- **File**: `src/components/SupportChat.tsx`
- **Logic**: Khi admin gửi tin nhắn, hệ thống sẽ phát âm thanh thông báo cho người dùng
- **Âm thanh**: Sử dụng hàm `playSupportChatSound()` từ `src/utils/notifications.ts`

### 3. Khi Admin Nhận Tin Nhắn Mới
- **File**: `src/components/admin/SupportChatManagement.tsx`
- **Logic**: Khi có tin nhắn mới từ người dùng, admin sẽ nghe thấy âm thanh thông báo
- **Âm thanh**: Sử dụng hàm `playSupportChatSound()` từ `src/utils/notifications.ts`

## Cấu Trúc Âm Thanh

### Hàm `playSupportChatSound()`
- **Âm thanh chính**: "ding" ngắn gọn (1000Hz → 1200Hz → 800Hz)
- **Âm thanh phụ**: "ping" thứ hai (1200Hz → 1000Hz) sau 350ms
- **Độ dài**: Tổng cộng khoảng 550ms
- **Âm lượng**: Được điều chỉnh để rõ ràng nhưng không quá to

### Fallback
- Nếu không thể phát âm thanh mới, hệ thống sẽ tự động chuyển về âm thanh cũ (`playNotificationSound()`)
- Đảm bảo luôn có thông báo âm thanh cho người dùng

## Cài Đặt

### 1. Quyền Thông Báo
- Hệ thống sẽ tự động yêu cầu quyền thông báo khi người dùng truy cập
- Người dùng cần cho phép để nhận thông báo và âm thanh

### 2. Tương Thích Trình Duyệt
- Hỗ trợ tất cả trình duyệt hiện đại
- Sử dụng Web Audio API với fallback cho các trình duyệt cũ

## Tùy Chỉnh

### Thay Đổi Âm Thanh
Để thay đổi âm thanh thông báo, chỉnh sửa file `src/utils/notifications.ts`:

```typescript
// Thay đổi tần số âm thanh
oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);

// Thay đổi độ dài âm thanh
oscillator.stop(audioContext.currentTime + 0.3);

// Thay đổi âm lượng
gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
```

### Thêm Âm Thanh Mới
Tạo hàm mới trong `notifications.ts`:

```typescript
export const playCustomSound = () => {
  // Logic âm thanh tùy chỉnh
};
```

## Xử Lý Lỗi

### Các Trường Hợp Lỗi
1. **Trình duyệt không hỗ trợ Web Audio API**
2. **Người dùng chặn quyền thông báo**
3. **Lỗi âm thanh hệ thống**

### Giải Pháp
- Tự động fallback về âm thanh cũ
- Log lỗi vào console để debug
- Không làm gián đoạn chức năng chat

## Kiểm Tra

### Test Âm Thanh
1. Mở chat hỗ trợ
2. Gửi tin nhắn từ người dùng
3. Kiểm tra âm thanh thông báo ở admin
4. Gửi tin nhắn từ admin
5. Kiểm tra âm thanh thông báo ở người dùng

### Debug
- Mở Developer Tools (F12)
- Kiểm tra Console để xem log âm thanh
- Kiểm tra Network để đảm bảo không có lỗi tải tài nguyên

## Lưu Ý

- Âm thanh chỉ phát khi có tin nhắn mới thực sự
- Không phát âm thanh khi tải lại trang hoặc mở lại chat
- Âm thanh được tối ưu để không gây khó chịu cho người dùng
- Hỗ trợ đa ngôn ngữ thông qua context LanguageContext
