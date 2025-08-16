# Tính năng Hoa hồng Tùy chỉnh trong TaskCenter

## Tổng quan
Tính năng này cho phép TaskCenter tích hợp với hệ thống hoa hồng tùy chỉnh, giúp người dùng nhận được hoa hồng trong khoảng đã thiết lập thay vì theo tỷ lệ VIP level cố định.

## Cách hoạt động

### 1. Logic tìm kiếm sản phẩm cơ bản
- **VIP level**: Vẫn được sử dụng để tìm kiếm sản phẩm phù hợp
- **Balance**: Sản phẩm phải có giá trị ≤ balance của người dùng
- **Sản phẩm**: Chọn từ danh sách sản phẩm phù hợp với VIP level

### 2. Logic hoa hồng tùy chỉnh (mới)
Khi người dùng có hoa hồng tùy chỉnh được bật:

#### Bước 1: Tính hoa hồng trung bình
```
Hoa hồng trung bình = (Min + Max) / 2
```

#### Bước 2: Tính giá trị đơn hàng mục tiêu
```
Giá trị đơn hàng mục tiêu = Hoa hồng trung bình / Tỷ lệ VIP level
```

#### Bước 3: Tìm sản phẩm phù hợp
- Sắp xếp sản phẩm theo độ chênh lệch với giá trị mục tiêu
- Chọn sản phẩm có giá trị gần nhất với giá trị mục tiêu

## Ví dụ cụ thể

### Trường hợp 1: VIP 4 (14%) + Hoa hồng tùy chỉnh $300-$1000
```
Hoa hồng trung bình = ($300 + $1000) / 2 = $650
Giá trị đơn hàng mục tiêu = $650 / 0.14 = $4,643
```

**Kết quả:**
- Hệ thống vẫn tìm sản phẩm theo VIP 4
- Nhưng sẽ ưu tiên sản phẩm có giá trị gần $4,643
- Để đạt được hoa hồng trung bình $650

### Trường hợp 2: VIP Base (6%) + Hoa hồng tùy chỉnh $500-$800
```
Hoa hồng trung bình = ($500 + $800) / 2 = $650
Giá trị đơn hàng mục tiêu = $650 / 0.06 = $10,833
```

**Kết quả:**
- Hệ thống vẫn tìm sản phẩm theo VIP Base
- Nhưng sẽ ưu tiên sản phẩm có giá trị gần $10,833
- Để đạt được hoa hồng trung bình $650

## Cấu trúc code

### 1. Interface UserVipData
```typescript
interface UserVipData {
  vip_level: number;
  commission_rate: number;
  level_name: string;
  balance: number;
  min_orders?: number;
  image_url?: string;
  use_custom_commission?: boolean;
  custom_commission_min?: number | null;
  custom_commission_max?: number | null;
}
```

### 2. Logic tìm kiếm sản phẩm
```typescript
if (userVipData.use_custom_commission && 
    userVipData.custom_commission_min && 
    userVipData.custom_commission_max) {
  
  // Tính hoa hồng trung bình
  const avgCommission = (userVipData.custom_commission_min + userVipData.custom_commission_max) / 2;
  
  // Tính giá trị đơn hàng mục tiêu
  const targetOrderValue = avgCommission / userVipData.commission_rate;
  
  // Tìm sản phẩm gần nhất với giá trị mục tiêu
  const sortedProducts = products.sort((a, b) => {
    const diffA = Math.abs(a.price - targetOrderValue);
    const diffB = Math.abs(b.price - targetOrderValue);
    return diffA - diffB;
  });
  
  selectedProduct = sortedProducts[0];
} else {
  // Logic cũ: chọn ngẫu nhiên
  const randomIndex = Math.floor(Math.random() * products.length);
  selectedProduct = products[randomIndex];
}
```

### 3. Hiển thị commission rate
```typescript
{userVipData.use_custom_commission && userVipData.custom_commission_min && userVipData.custom_commission_max ? (
  `$${userVipData.custom_commission_min}-$${userVipData.custom_commission_max}`
) : (
  `${userVipData.commission_rate}`
)}
```

## Luồng dữ liệu

### 1. Khởi tạo
```
fetchUserVipData() → Query profiles → Set userVipData
```

### 2. Tìm kiếm sản phẩm
```
findVipProduct() → Query profiles (cập nhật) → Logic tìm kiếm → Chọn sản phẩm
```

### 3. Cập nhật sau khi đóng modal
```
handleCloseModal() → Query profiles → Cập nhật userVipData
```

## Lợi ích

### 1. Cho người dùng
- Nhận hoa hồng ổn định trong khoảng đã thiết lập
- Không bị ảnh hưởng bởi biến động giá trị đơn hàng
- Vẫn được tìm kiếm sản phẩm theo VIP level

### 2. Cho admin
- Kiểm soát hoa hồng của từng người dùng
- Linh hoạt trong việc điều chỉnh hoa hồng
- Không ảnh hưởng đến logic tìm kiếm cơ bản

### 3. Cho hệ thống
- Tích hợp mượt mà với logic hiện tại
- Không cần thay đổi cấu trúc database
- Dễ dàng mở rộng và bảo trì

## Lưu ý kỹ thuật

### 1. Performance
- Sử dụng cache cho VIP level data
- Query song song với Promise.all
- Chỉ cập nhật dữ liệu cần thiết

### 2. Error handling
- Kiểm tra null/undefined cho custom commission fields
- Fallback về logic cũ nếu có lỗi
- Log chi tiết để debug

### 3. Real-time updates
- Cập nhật userVipData sau mỗi thao tác
- Đồng bộ với database
- Hiển thị thông tin mới nhất

## Kết luận

Tính năng hoa hồng tùy chỉnh trong TaskCenter cung cấp một cách tiếp cận thông minh để:

1. **Giữ nguyên logic tìm kiếm** theo VIP level
2. **Tối ưu hóa hoa hồng** theo khoảng đã thiết lập
3. **Cải thiện trải nghiệm người dùng** với hoa hồng ổn định
4. **Tăng tính linh hoạt** cho admin trong quản lý

Tính năng này hoạt động hoàn toàn tự động và không yêu cầu can thiệp thủ công từ người dùng.
