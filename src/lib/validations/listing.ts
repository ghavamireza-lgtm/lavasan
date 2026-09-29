// src/lib/validations/listing.ts
import { z } from "zod";

export const listingSchema = z.object({
  title: z
    .string()
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(100, "عنوان نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"),
  description: z
    .string()
    .min(20, "توضیحات باید حداقل ۲۰ کاراکتر باشد")
    .max(5000, "توضیحات نمی‌تواند بیش از ۵۰۰۰ کاراکتر باشد"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .regex(/^0\d{10}$/, "شماره تماس معتبر نیست (مثلاً 02112345678)"),
  whatsapp: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^09\d{9}$/.test(val),
      "شماره واتساپ معتبر نیست"
    ),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "وب‌سایت معتبر نیست (با http:// یا https:// شروع شود)"
    ),
  address: z
    .string()
    .min(5, "آدرس باید حداقل ۵ کاراکتر باشد")
    .max(500, "آدرس نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"),
  city: z.string().min(2, "شهر الزامی است"),
  province: z.string().min(2, "استان الزامی است"),
  logo: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export type ListingFormData = z.infer<typeof listingSchema>;