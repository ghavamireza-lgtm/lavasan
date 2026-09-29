import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Plan from "@/models/plan";
import Subscription from "@/models/subscription";

export async function POST() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    // چک: آیا کاربر از قبل اشتراک فعال داره؟
    const existing = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "شما از قبل یک پکیج فعال دارید" },
        { status: 400 }
      );
    }

    // پیدا کردن پکیج پایه
    const basicPlan = await Plan.findOne({ slug: "basic", isActive: true });
    if (!basicPlan) {
      return NextResponse.json(
        { error: "پکیج پایه یافت نشد" },
        { status: 404 }
      );
    }

    // محاسبه تاریخ انقضا
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + basicPlan.durationDays);

    // ساخت اشتراک
    const subscription = await Subscription.create({
      userId: session.user.id,
      planId: basicPlan._id,
      planSlug: basicPlan.slug,
      status: "active",
      startsAt: new Date(),
      expiresAt,
      paymentStatus: "paid",
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscription/activate-free error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}