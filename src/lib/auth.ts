// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "./db";
import Plan from "@/models/plan";
import Subscription from "@/models/subscription";

// تابع async برای دریافت auth
export async function getAuth() {
  const mongooseInstance = await connectDB();

  // اینجا client خام رو از mongoose می‌گیریم
  const client = mongooseInstance.connection.getClient();

  return betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: {
      enabled: true,
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 روز
      updateAge: 60 * 60 * 24, // هر روز تمدید
    },

    user: {
      additionalFields: {
        mobile: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            // بعد از ایجاد کاربر، می‌توانیم عملیات اضافی انجام دهیم
            const body = ctx?.body as { mobile?: string };
            return {
              data: {
                ...user,
                mobile: body?.mobile,
              },
            };
          },
          after: async (user) => {
            // فعال‌سازی پکیج رایگان
            try {
              const basicPlan = await Plan.findOne({ slug: "basic" });
              if (basicPlan) {
                const expiresAt = new Date();
                expiresAt.setDate(
                  expiresAt.getDate() + basicPlan.durationDays
                );

                await Subscription.create({
                  userId: user.id,
                  planId: basicPlan._id,
                  planSlug: basicPlan.slug,
                  status: "active",
                  startsAt: new Date(),
                  expiresAt,
                  paymentStatus: "paid",
                });
                console.log(`✅ پکیج پایه برای کاربر ${user.email} فعال شد`);
              }
            } catch (error) {
              console.error("خطا در فعال‌سازی پکیج پایه:", error);
            }
          },
        },
      },
    },
  });
}