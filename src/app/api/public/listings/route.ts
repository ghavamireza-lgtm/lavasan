import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const city = searchParams.get("city");
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const skip = (page - 1) * limit;

        // ساخت فیلتر
        const filter: any = { status: "published" };

        if (city) filter.city = city;
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // مرتب‌سازی: ویژه اول، بعد جدیدترین
        const listings = await Listing.find(filter)
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Listing.countDocuments(filter);

        return NextResponse.json({
            listings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error("GET /api/public/listings error:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}