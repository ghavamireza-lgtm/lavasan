import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";
import { listingSchema } from "@/lib/validations/listing";
import Subscription from "@/models/subscription";
import Plan from "@/models/plan";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        await connectDB();

        const listing = await Listing.findOne({
            _id: id,
            userId: session.user.id,
        }).lean();
        if (!listing) {
            return NextResponse.json({ error: "not found" }, { status: 404 });
        }

        return NextResponse.json({ listing });
    } catch (error) {
        console.error("GET /api/listings/[id] error:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}

// PATCH: ویرایش آگهی
export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = listingSchema.safeParse(body);

        // src/app/api/listings/[id]/route.ts (بخش PATCH)
        // بعد از safeParse و قبل از findOneAndUpdate:

        if (result.data?.featured) {
            // اگه آگهی از قبل featured بوده، نیازی به چک نیست
            const currentListing = await Listing.findOne({
                _id: id,
                userId: session.user.id,
            }).lean();

            if (currentListing && !currentListing.featured) {
                // آگهی قبلاً featured نبوده، الان می‌خواد بشه
                const subscription = await Subscription.findOne({
                    userId: session.user.id,
                    status: "active",
                    expiresAt: { $gt: new Date() },
                }).lean();

                const plan = subscription
                    ? await Plan.findById(subscription.planId).lean()
                    : null;

                if (!plan) {
                    return NextResponse.json(
                        { error: "پکیج شما یافت نشد" },
                        { status: 403 }
                    );
                }

                const usedFeatured = await Listing.countDocuments({
                    userId: session.user.id,
                    featured: true,
                    status: { $in: ["draft", "pending", "published"] },
                    _id: { $ne: id },
                });

                if (usedFeatured >= (plan.featuredListings || 0)) {
                    return NextResponse.json(
                        {
                            error: `پکیج "${plan.name}" فقط ${plan.featuredListings} آگهی ویژه دارد.`,
                        },
                        { status: 403 }
                    );
                }
            }
        }
        await connectDB();

        const listing = await Listing.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: result.data },
            { returnDocument: "after" }
        ).lean();

        if (!listing) {
            return NextResponse.json({ error: "not found" }, { status: 404 });
        }

        return NextResponse.json({ listing });
    } catch (error) {
        console.error("PATCH /api/listings/[id] error:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}

// DELETE: حذف آگهی
export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        await connectDB();

        const listing = await Listing.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!listing) {
            return NextResponse.json({ error: "not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/listings/[id] error:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}