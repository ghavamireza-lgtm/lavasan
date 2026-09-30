// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z
        .string()
        .min(3, "نام باید حداقل ۳ کاراکتر باشد")
        .max(50, "نام نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
    mobile: z
        .string()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست")
        .optional()
        .or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "invalid data", details: result.error.flatten() },
                { status: 400 }
            );
        }

        await connectDB();

        // آپدیت کاربر با Better Auth API
        const updateResult = await auth.api.updateUser({
            headers: await headers(),
            body: {
                name: result.data.name,
                mobile: result.data.mobile || undefined,
            },
        });

        if (!updateResult) {
            return NextResponse.json(
                { error: "خطا در آپدیت پروفایل" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/user/profile error:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}