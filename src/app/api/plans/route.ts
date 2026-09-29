import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/models/plan";

export async function GET() {
  try {
    await connectDB();

    const plans = await Plan.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("GET /api/plans error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}