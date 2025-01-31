//path : be/src/schemas/auth.schemas.ts
import { z } from "zod";
import { Role, RoleType } from "../constants/role";

const passwordSchema = z.string().min(6).max(255);
export const emailSchema = z.string().email().min(1).max(255);
export const verificationCodeSchema = z.string().min(1).max(24);
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    // role: z.enum(Object.values(Role) as [string, ...string[]]), // Lấy all các giá trị từ Role
    role: z.enum([Role.User, Role.Seller, Role.Admin]), // Chỉ cho phép chọn "user" hoặc "seller"
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
