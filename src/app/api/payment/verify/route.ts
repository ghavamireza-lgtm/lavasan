// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/transaction";
import Subscription from "@/models/subscription";
import Plan from "@/models/plan";
import { pep } from "@/lib/pep";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const invoiceNumber = searchParams.get("invoiceId");
    const status = searchParams.get("status");

    if (!invoiceNumber) {
      return NextResponse.redirect(`${baseUrl}/dashboard/plans?error=invalid`);
    }

    await connectDB();

    const transaction = await Transaction.findOne({ invoiceNumber });
    if (!transaction) {
      return NextResponse.redirect(`${baseUrl}/dashboard/plans?error=notfound`);
    }

    if (status !== "success") {
      transaction.status = "cancelled";
      await transaction.save();
      return NextResponse.redirect(
        `${baseUrl}/dashboard/plans?error=cancelled`
      );
    }

    // تأیید تراکنش
    // confirm: درجا تأیید میشه
    // verify: زمان میبره ولی میتونی reverse بزنی
    const verifyResult = await pep.confirm({
      invoice: invoiceNumber,
      urlId: transaction.urlId,
    });

    if (verifyResult.resultCode === 0) {
      transaction.status = "paid";
      await transaction.save();

      const plan = await Plan.findById(transaction.planId);
      if (plan) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

        await Subscription.updateMany(
          { userId: transaction.userId, status: "active" },
          { $set: { status: "cancelled" } }
        );

        await Subscription.create({
          userId: transaction.userId,
          planId: plan._id,
          planSlug: plan.slug,
          status: "active",
          startsAt: new Date(),
          expiresAt,
          paymentId: searchParams.get("referenceNumber") || undefined,
          paymentAmount: transaction.amount,
          paymentStatus: "paid",
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/dashboard/plans?success=true&refId=${searchParams.get("referenceNumber")}`
      );
    }

    transaction.status = "failed";
    await transaction.save();

    return NextResponse.redirect(`${baseUrl}/dashboard/plans?error=failed`);
  } catch (error) {
    console.error("GET /api/payment/verify error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard/plans?error=server`);
  }
}