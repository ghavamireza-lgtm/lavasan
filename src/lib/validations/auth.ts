import { email, z } from "zod";

export const signUpSchema = z.object({
    name: z
        .string()
        .min(3, "نام باید حداقل ۳ کاراکتر باشد")
        .max(50, "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
    email: z
        .email("ایمیل معتبر نیست")
        .min(1, "ایمیل الزامی است"),
    password: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z
        .string()
        .min(1, "تکرار رمز عبور الزامی است"),
    mobile: z
        .string()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثلاً 09123456789)"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "رمز عبور و تکرار آن مطابقت ندارند",
        path: ["confirmPassword"],
    });


export const signInSchema = z.object({
    email: z
        .email("ایمیل معتبر نیست")
        .min(1, "ایمیل الزامی است"),
    password: z
        .string()
        .min(1, "رمز عبور الزامی است")
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

