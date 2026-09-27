// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "./db";

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
        },
      },
    },
  });
}
