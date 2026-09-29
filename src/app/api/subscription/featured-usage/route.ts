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

    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!subscription) {
      return NextResponse.json({
        canFeature: false,
        maxFeatured: 0,
        usedFeatured: 0,
      });
    }

    const plan = await Plan.findById(subscription.planId).lean();
    if (!plan) {
      return NextResponse.json({
        canFeature: false,
        maxFeatured: 0,
        usedFeatured: 0,
      });
    }

    const usedFeatured = await Listing.countDocuments({
      userId: session.user.id,
      featured: true,
      status: { $in: ["draft", "pending", "published"] },
    });

    const maxFeatured = plan.featuredListings || 0;
    const canFeature = usedFeatured < maxFeatured;

    return NextResponse.json({
      canFeature,
      maxFeatured,
      usedFeatured,
      remaining: Math.max(0, maxFeatured - usedFeatured),
    });
  } catch (error) {
    console.error("GET /api/subscription/featured-usage error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}