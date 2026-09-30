// src/app/api/user/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { z } from "zod";

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
        newPassword: z
            .string()
            .min(8, "رمز جدید باید حداقل ۸ کاراکتر باشد"),
        confirmPassword: z.string().min(1, "تکرار رمز الزامی است"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "رمز جدید و تکرار آن یکسان نیستند",
        path: ["confirmPassword"],
    });

export async function POST(req: NextRequest) {
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = changePasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "invalid data", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // تغییر رمز با Better Auth
        const changeResult = await auth.api.changePassword({
            headers: await headers(),
            body: {
                currentPassword: result.data.currentPassword,
                newPassword: result.data.newPassword,
                revokeOtherSessions: true, // همه sessionهای دیگه رو ببند
            },
        });

        if (!changeResult) {
            return NextResponse.json(
                { error: "رمز فعلی اشتباه است" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST /api/user/change-password error:", error);
        if (error?.message?.includes("password")) {
            return NextResponse.json(
                { error: "رمز فعلی اشتباه است" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}