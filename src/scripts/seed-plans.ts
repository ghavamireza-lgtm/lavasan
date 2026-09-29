// src/scripts/seed-plans.ts
import { loadEnvConfig } from "@next/env";

async function seedPlans() {
  // 👇 اول env رو لود کن
  loadEnvConfig(process.cwd());

  // 👇 بعد importها رو داینامیک کن
  const { default: connectDB } = await import("../lib/db");
  const { default: Plan } = await import("../models/plan");

  const plans = [
    {
      name: "پایه",
      slug: "basic",
      description: "مناسب برای شروع و تست",
      price: 0,
      durationDays: 30,
      maxListings: 1,
      featuredListings: 0,
      features: ["۱ آگهی فعال", "اعتبار ۱ ماهه", "پشتیبانی ایمیل"],
      order: 1,
    },
    {
      name: "حرفه‌ای",
      slug: "pro",
      description: "مناسب برای کسب‌وکارهای در حال رشد",
      price: 299000,
      durationDays: 90,
      maxListings: 5,
      featuredListings: 1,
      features: [
        "۵ آگهی فعال",
        "۱ آگهی ویژه",
        "اعتبار ۳ ماهه",
        "پشتیبانی اولویت‌دار",
      ],
      order: 2,
    },
    {
      name: "تجاری",
      slug: "business",
      description: "مناسب برای کسب‌وکارهای بزرگ",
      price: 899000,
      durationDays: 365,
      maxListings: 20,
      featuredListings: 5,
      features: [
        "۲۰ آگهی فعال",
        "۵ آگهی ویژه",
        "اعتبار ۱ ساله",
        "اولویت در نمایش",
        "پشتیبانی اختصاصی",
      ],
      order: 3,
    },
  ];

  try {
    await connectDB();
    console.log("🔌 متصل به دیتابیس");

    for (const plan of plans) {
      await Plan.findOneAndUpdate(
        { slug: plan.slug },
        { $set: plan },
        { upsert: true, returnDocument: "after" }
      );
      console.log(`✅ پکیج "${plan.name}" ذخیره شد`);
    }

    console.log("🎉 همه پکیج‌ها با موفقیت seed شدند");
    process.exit(0);
  } catch (error) {
    console.error("❌ خطا در seed:", error);
    process.exit(1);
  }
}

seedPlans();