// src/app/api/user/stats/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";

export async function GET() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [total, published, draft, featured] = await Promise.all([
      Listing.countDocuments({ userId: session.user.id }),
      Listing.countDocuments({
        userId: session.user.id,
        status: "published",
      }),
      Listing.countDocuments({ userId: session.user.id, status: "draft" }),
      Listing.countDocuments({
        userId: session.user.id,
        featured: true,
        status: { $ne: "rejected" },
      }),
    ]);

    // مجموع بازدید
    const viewsAgg = await Listing.aggregate([
      { $match: { userId: session.user.id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const totalViews = viewsAgg[0]?.totalViews || 0;

    return NextResponse.json({
      total,
      published,
      draft,
      featured,
      totalViews,
    });
  } catch (error) {
    console.error("GET /api/user/stats error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}