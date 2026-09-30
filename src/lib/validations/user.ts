// src/lib/validations/user.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
  mobile: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^09\d{9}$/.test(val),
      "شماره موبایل معتبر نیست (مثلاً 09123456789)"
    ),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
    newPassword: z
      .string()
      .min(8, "رمز جدید باید حداقل ۸ کاراکتر باشد")
      .regex(/[A-Z]/, "رمز باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/[0-9]/, "رمز باید حداقل یک عدد داشته باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز جدید و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;