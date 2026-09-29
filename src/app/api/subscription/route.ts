import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Subscription from "@/models/subscription";
import Plan from "@/models/plan";

export async function GET() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    // پیدا کردن اشتراک فعال کاربر
    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    // گرفتن اطلاعات پکیج
    const plan = await Plan.findById(subscription.planId).lean();

    return NextResponse.json({
      subscription: {
        ...subscription,
        plan,
      },
    });
  } catch (error) {
    console.error("GET /api/subscription error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}