import { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";
import { listingSchema } from "@/lib/validations/listing";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        await connectDB();

        const listings = await Listing.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

        return NextResponse.json({ listings });
    } catch(error) {
        console.error("GET /api/listings error:", error);
        return NextResponse.json({ error: "Server error"}, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = listingSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid data", details: result.error.flatten() },
                { status: 400 }
            );
        }
        
        await connectDB();

        const listing = await Listing.create({
            ...result.data,
            userId: session.user.id,
            status: "draft",
        });

        return NextResponse.json({ listing }, { status: 201 });
    } catch(error) {
        console.error("POST /api/listings error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
