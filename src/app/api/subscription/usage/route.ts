import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Subscription from "@/models/subscription";
import Plan from "@/models/plan";
import Listing from "@/models/listing";

export async function GET() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    // اشتراک فعال
    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        canCreate: false,
        reason: "no_subscription",
      });
    }

    // پکیج
    const plan = await Plan.findById(subscription.planId).lean();
    if (!plan) {
      return NextResponse.json({
        hasSubscription: true,
        canCreate: false,
        reason: "plan_not_found",
      });
    }

    // تعداد آگهی‌های فعال کاربر (draft و published)
    const activeListingsCount = await Listing.countDocuments({
      userId: session.user.id,
      status: { $in: ["draft", "pending", "published"] },
    });

    const canCreate = activeListingsCount < plan.maxListings;

    return NextResponse.json({
      hasSubscription: true,
      canCreate,
      activeListingsCount,
      maxListings: plan.maxListings,
      remaining: Math.max(0, plan.maxListings - activeListingsCount),
      plan: {
        name: plan.name,
        slug: plan.slug,
      },
      expiresAt: subscription.expiresAt,
      reason: canCreate ? null : "limit_reached",
    });
  } catch (error) {
    console.error("GET /api/subscription/usage error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}