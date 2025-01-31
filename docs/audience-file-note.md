**`audience`** là một thuộc tính của JWT (JSON Web Token) được sử dụng để xác định **đối tượng dự kiến sử dụng token**. Tuy nhiên, trong trường hợp này, `audience` **không phải là cách để gắn role vào token** hay kiểm tra quyền truy cập. Hãy cùng phân tích chi tiết hơn:

---

### **1. Vai trò của `audience` trong JWT**
- **`audience`** là một trường (claim) trong JWT, được sử dụng để chỉ định **đối tượng dự kiến sử dụng token**.
- Nó thường được dùng để đảm bảo rằng token chỉ được sử dụng bởi một ứng dụng hoặc dịch vụ cụ thể.
- Ví dụ: Nếu bạn có nhiều ứng dụng (ví dụ: web, mobile) sử dụng cùng một hệ thống xác thực, bạn có thể sử dụng `audience` để phân biệt token dành cho ứng dụng nào.

---

### **2. Cách `audience` được sử dụng trong code của bạn**
- Trong file `src/constants/jwt.ts`, `audience` được thiết lập mặc định là `[Audience.User]`:
  ```typescript
  const defaults: SignOptions = {
    audience: [Audience.User],
  };
  ```
- Khi ký token (sign token), `audience` này được thêm vào payload của token:
  ```typescript
  export const signToken = (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?: SignOptionsAndSecret
  ) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, {
      ...defaults, // audience được thêm vào đây
      ...signOpts,
    });
  };
  ```

---

### **3. `audience` có phải để gắn role vào token không?**
- **Không**, `audience` không phải để gắn role vào token.
- **Role** của người dùng (ví dụ: `admin`, `user`, `seller`) thường được lưu trữ trong database và được kiểm tra trong các middleware hoặc controller khi cần phân quyền.
- `audience` chỉ đơn giản là một cách để xác định **đối tượng sử dụng token**, không liên quan đến quyền truy cập (permissions) hay vai trò (roles).

---

### **4. Nếu không phải để gắn role, vậy `audience` dùng để làm gì?**
- **Mục đích chính**: Đảm bảo rằng token chỉ được sử dụng bởi các ứng dụng hoặc dịch vụ cụ thể.
- Ví dụ:
  - Nếu bạn có một API dành cho web và một API dành cho mobile, bạn có thể sử dụng `audience` để phân biệt token dành cho web (`Audience.User`) và token dành cho mobile (`Audience.Mobile`).
  - Khi xác thực token, bạn có thể kiểm tra `audience` để đảm bảo token được sử dụng đúng mục đích.

---

### **5. Làm thế nào để kiểm tra quyền truy cập dựa trên role?**
Để kiểm tra quyền truy cập dựa trên role, bạn cần:
1. **Lưu trữ role trong database**:
   - Trong model `User`, bạn đã có trường `role` (ví dụ: `admin`, `user`, `seller`).
2. **Kiểm tra role trong middleware**:
   - Tạo một middleware để kiểm tra role của người dùng trước khi cho phép truy cập vào một route cụ thể.

#### **Ví dụ middleware kiểm tra role**
```typescript
import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { FORBIDDEN } from "../constants/http";
import UserModel from "../models/user.model";

export const requireRole = (role: "admin" | "user" | "seller"): RequestHandler => async (req, res, next) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, FORBIDDEN, "User not found");
  appAssert(user.role === role, FORBIDDEN, "You do not have permission to access this resource");
  next();
};
```

#### **Sử dụng middleware**
```typescript
import { requireRole } from "../middleware/authenticate";

// Chỉ admin mới có thể truy cập route này
userRoutes.delete("/:id", authenticate, requireRole("admin"), deleteUserHandler);
```

---

### **6. Kết luận**
- **`audience`** trong JWT được sử dụng để xác định đối tượng dự kiến sử dụng token, **không phải để gắn role**.
- Để kiểm tra quyền truy cập dựa trên role, bạn cần lưu trữ role trong database và kiểm tra trong middleware hoặc controller.

