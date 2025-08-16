# Hệ Thống Đăng Ký User Với Email Tự Động

## Tổng Quan

Hệ thống này cho phép tạo tài khoản người dùng mới với email được generate tự động từ username. Điều này giúp:

- Không cần người dùng nhập email
- Đảm bảo email duy nhất cho mỗi tài khoản
- Tích hợp với Supabase Auth system
- Tự động tạo profile trong database

## Cách Hoạt Động

### 1. Generate Email Tự Động

Khi người dùng nhập username, hệ thống sẽ:

1. Gọi function `generate_unique_email` trong database
2. Tạo email duy nhất dựa trên username
3. Hiển thị email được tạo cho người dùng xem

### 2. Tạo Tài Khoản

Sau khi có email, hệ thống sẽ:

1. Gọi edge function `signup-without-email`
2. Tạo user trong `auth.users` với email được generate
3. Tạo profile trong bảng `profiles`
4. Trả về thông tin tài khoản đã tạo

## Cấu Trúc Code

### Types (`src/types/auth.ts`)

```typescript
export interface CreateUserData {
  username: string;
  phoneNumber: string;
  password: string;
  fundPassword: string;
  invitationCode: string;
}

export interface CreateUserResponse {
  success: boolean;
  user_id: string;
  message: string;
}
```

### Utility Functions (`src/utils/authUtils.ts`)

- `generateUniqueEmail(username)`: Tạo email duy nhất
- `createUserWithGeneratedEmail(userData)`: Tạo tài khoản mới
- `getUserEmailByIdentifier(identifier)`: Lấy email từ username/phone

### React Hook (`src/hooks/useUserRegistration.ts`)

Hook quản lý state và logic đăng ký:

```typescript
const { registerUser, generateEmail, isLoading, error, success, reset } = useUserRegistration();
```

### Component (`src/components/UserRegistrationForm.tsx`)

Form đăng ký hoàn chỉnh với UI đẹp và validation.

## Cách Sử Dụng

### 1. Sử Dụng Hook

```typescript
import { useUserRegistration } from '@/hooks/useUserRegistration';

function MyComponent() {
  const { registerUser, generateEmail, isLoading, error, success } = useUserRegistration();
  
  const handleRegister = async () => {
    const result = await registerUser({
      username: 'john_doe',
      phoneNumber: '0123456789',
      password: 'password123',
      fundPassword: 'fund123',
      invitationCode: 'INVITE001'
    });
    
    if (result) {
      console.log('Đăng ký thành công:', result.user_id);
    }
  };
  
  return (
    <button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
    </button>
  );
}
```

### 2. Sử Dụng Component

```typescript
import { UserRegistrationForm } from '@/components/UserRegistrationForm';

function App() {
  return (
    <div>
      <h1>Đăng Ký Tài Khoản</h1>
      <UserRegistrationForm />
    </div>
  );
}
```

### 3. Sử Dụng Utility Functions Trực Tiếp

```typescript
import { generateUniqueEmail, createUserWithGeneratedEmail } from '@/utils/authUtils';

// Generate email
const email = await generateUniqueEmail('john_doe');

// Tạo tài khoản
const result = await createUserWithGeneratedEmail({
  username: 'john_doe',
  phoneNumber: '0123456789',
  password: 'password123',
  fundPassword: 'fund123',
  invitationCode: 'INVITE001'
});
```

## Database Functions

### `generate_unique_email(username_input)`

Function PostgreSQL tạo email duy nhất dựa trên username:

```sql
CREATE OR REPLACE FUNCTION generate_unique_email(username_input TEXT)
RETURNS TEXT AS $$
DECLARE
  base_email TEXT;
  counter INTEGER := 0;
  final_email TEXT;
BEGIN
  base_email := username_input || '@aura-site.com';
  final_email := base_email;
  
  -- Kiểm tra email đã tồn tại chưa
  WHILE EXISTS (SELECT 1 FROM auth.users WHERE email = final_email) LOOP
    counter := counter + 1;
    final_email := username_input || counter::TEXT || '@aura-site.com';
  END LOOP;
  
  RETURN final_email;
END;
$$ LANGUAGE plpgsql;
```

## Edge Functions

### `signup-without-email`

Edge function xử lý việc tạo tài khoản:

1. Kiểm tra username/phone đã tồn tại
2. Generate email duy nhất
3. Tạo user trong `auth.users`
4. Tạo profile trong `profiles`
5. Trả về kết quả

## Xử Lý Lỗi

Hệ thống xử lý các loại lỗi phổ biến:

- Username đã tồn tại
- Số điện thoại đã tồn tại
- Mã giới thiệu không hợp lệ
- Mật khẩu quá yếu
- Số điện thoại không hợp lệ

## Bảo Mật

- Sử dụng edge functions với service role key
- Validation dữ liệu đầu vào
- Kiểm tra trùng lặp trước khi tạo
- Mã hóa mật khẩu tự động

## Tích Hợp

Hệ thống tích hợp với:

- Supabase Auth
- Supabase Database
- React hooks pattern
- TypeScript types
- Tailwind CSS styling

## Lưu Ý

- Email được generate tự động và không thể thay đổi bởi user
- Username và số điện thoại phải duy nhất
- Mật khẩu quỹ được lưu riêng biệt với mật khẩu đăng nhập
- Hệ thống hỗ trợ đa ngôn ngữ (tiếng Việt)

