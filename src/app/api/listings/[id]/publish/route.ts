import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json({ error: "unauthorized"}, { status: 401 });
        }

        await connectDB();

        const listing = await Listing.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: { status: "published" } },
            { returnDocument: "after" }
        ).lean();

        if (!listing) {
            return NextResponse.json({ error: "not found" }, { status: 404 });
        }
        return NextResponse.json({ listing });
    } catch(error) {
        console.error("POST /api/listings/[id]/publish error:", error);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}
