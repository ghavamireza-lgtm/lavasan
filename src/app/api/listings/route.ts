import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";
import Subscription from "@/models/subscription";
import Plan from "@/models/plan";
import { listingSchema } from "@/lib/validations/listing";

// GET: دریافت آگهی‌های کاربر جاری
export async function GET() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    const listings = await Listing.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

// POST: ایجاد آگهی جدید
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    // چک اشتراک
    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!subscription) {
      return NextResponse.json(
        { error: "شما پکیج فعالی ندارید" },
        { status: 403 }
      );
    }

    const plan = await Plan.findById(subscription.planId).lean();
    if (!plan) {
      return NextResponse.json(
        { error: "پکیج شما یافت نشد" },
        { status: 403 }
      );
    }

    // چک محدودیت آگهی
    const activeListingsCount = await Listing.countDocuments({
      userId: session.user.id,
      status: { $in: ["draft", "pending", "published"] },
    });

    if (activeListingsCount >= plan.maxListings) {
      return NextResponse.json(
        {
          error: `شما به سقف آگهی پکیج "${plan.name}" رسیده‌اید (${plan.maxListings} آگهی)`,
        },
        { status: 403 }
      );
    }

    // اعتبارسنجی داده
    const body = await req.json();
    const result = listingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "invalid data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // 👇 چک محدودیت آگهی ویژه
    if (result.data.featured) {
      const usedFeatured = await Listing.countDocuments({
        userId: session.user.id,
        featured: true,
        status: { $in: ["draft", "pending", "published"] },
      });

      if (usedFeatured >= (plan.featuredListings || 0)) {
        return NextResponse.json(
          {
            error: `پکیج "${plan.name}" فقط ${plan.featuredListings} آگهی ویژه دارد. شما ${usedFeatured} آگهی ویژه دارید.`,
          },
          { status: 403 }
        );
      }
    }

    const listing = await Listing.create({
      ...result.data,
      userId: session.user.id,
      status: "draft",
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}