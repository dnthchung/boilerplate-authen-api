// src/constants/role.ts
/**
 * TypeScript enum được transpile thành một object JavaScript phức tạp, có thể dẫn đến bundle size lớn hơn
Enum cho phép reverse mapping (không cần thiết trong trường hợp này)
Có thể gặp vấn đề với type inference trong một số trường hợp
 */
// enum Role {
//   User = "user",
//   Admin = "admin",
//   Seller = "seller",
// }

// export default Role;

// src/constants/role.ts
export const Role = {
  User: "user",
  Admin: "admin",
  Seller: "seller",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
