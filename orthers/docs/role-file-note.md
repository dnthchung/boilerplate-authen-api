một số gợi ý để làm cho code tốt hơn và type-safe hơn:

**1. Cách hiện tại của bạn:**
```typescript
// src/constants/role.ts
enum Role {
  User = "user",
  Admin = "admin",
  Seller = "seller"
}
export default Role;
```

**2. Vấn đề tiềm ẩn với cách hiện tại:**
- TypeScript enum được transpile thành một object JavaScript phức tạp, có thể dẫn đến bundle size lớn hơn
- Enum cho phép reverse mapping (không cần thiết trong trường hợp này)
- Có thể gặp vấn đề với type inference trong một số trường hợp

**3. Cách cải thiện (推荐 Approach):**
```typescript
// src/constants/role.ts
export const Role = {
  User: "user",
  Admin: "admin",
  Seller: "seller"
} as const;

// Tạo union type từ values của Role
export type RoleType = typeof Role[keyof typeof Role];
```

**4. Update lại UserDocument interface:**
```typescript
export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  role: RoleType; // Thay vì Role
  // ... rest of the interface
}
```

**5. Update lại schema:**
```typescript
const userSchema = new mongoose.Schema<UserDocument>(
  {
    // ... other fields
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
    // ... other fields
  },
  {
    timestamps: true,
  }
);
```

**Lợi ích của cách cải thiện:**

1. **Type Safety tốt hơn:**
   - Union type `RoleType` sẽ chỉ chấp nhận chính xác các giá trị được định nghĩa
   - IDE sẽ cung cấp auto-completion tốt hơn

2. **Bundle Size nhỏ hơn:**
   - Transpiled code đơn giản hơn
   - Không có reverse mapping không cần thiết

3. **Runtime Performance:**
   - Đơn giản hóa việc truy cập giá trị
   - Không có overhead của enum

4. **Dễ mở rộng:**
   - Dễ dàng thêm/sửa/xóa roles
   - Dễ dàng thêm metadata cho mỗi role nếu cần

**Ví dụ sử dụng:**
```typescript
// Validation
function isValidRole(role: string): role is RoleType {
  return Object.values(Role).includes(role as RoleType);
}

// Usage
const user = {
  email: "test@example.com",
  role: Role.User, // IDE sẽ gợi ý các giá trị hợp lệ
};
```

**Type Guard Example:**
```typescript
function handleUserByRole(user: UserDocument) {
  switch (user.role) {
    case Role.Admin:
      // TypeScript biết chắc chắn đây là admin
      return handleAdmin(user);
    case Role.Seller:
      // TypeScript biết chắc chắn đây là seller
      return handleSeller(user);
    case Role.User:
      // TypeScript biết chắc chắn đây là user
      return handleNormalUser(user);
    default:
      // Exhaustive check - TypeScript sẽ báo lỗi nếu thiếu case
      const _exhaustiveCheck: never = user.role;
      return _exhaustiveCheck;
  }
}
```
---

Tôi sẽ giúp bạn sửa lại phần role trong schema để đảm bảo type-safety và tái sử dụng với Role constant.

```typescript
// src/schemas/auth.schemas.ts
import { z } from "zod";
import { Role } from "../constants/role"; // Import Role constant

export const emailSchema = z.string().email().min(1).max(255);

const passwordSchema = z.string().min(6).max(255);

export const verificationCodeSchema = z.string().min(1).max(24);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

// Cách 1: Sử dụng Role object
export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    role: z.enum(Object.values(Role) as [string, ...string[]]), // Type-safe enum với Zod
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// HOẶC Cách 2: Nếu bạn chỉ muốn cho phép user và seller (không cho admin)
export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    role: z.enum([Role.User, Role.Seller]), // Chỉ cho phép user và seller
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
```

**Giải thích:**

1. **Cách 1 - Sử dụng tất cả giá trị từ Role:**
   ```typescript
   role: z.enum(Object.values(Role) as [string, ...string[]])
   ```
   - Lấy tất cả giá trị từ Role object
   - Type assertion đảm bảo Zod hiểu đây là một tuple không rỗng
   - Tự động cập nhật khi thêm role mới

2. **Cách 2 - Chỉ định cụ thể các role cho phép:**
   ```typescript
   role: z.enum([Role.User, Role.Seller])
   ```
   - Chỉ cho phép đăng ký với role User hoặc Seller
   - An toàn hơn vì kiểm soát được chính xác role nào được phép
   - Cần cập nhật thủ công nếu muốn thêm role mới

**Ưu điểm của cách tiếp cận này:**
- Type-safe: TypeScript sẽ báo lỗi nếu sử dụng role không hợp lệ
- Single source of truth: Sử dụng cùng Role constant trong toàn bộ ứng dụng
- Dễ bảo trì: Thay đổi Role constant sẽ được phản ánh trong schema validation

Bạn nên chọn Cách 1 nếu muốn schema tự động hỗ trợ tất cả role, hoặc Cách 2 nếu muốn kiểm soát chặt chẽ role nào được phép đăng ký.
