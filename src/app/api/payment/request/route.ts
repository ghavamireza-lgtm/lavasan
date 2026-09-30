// src/app/api/payment/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Plan from "@/models/plan";
import Transaction from "@/models/transaction";
import { pep } from "@/lib/pep";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();
    await connectDB();

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: "پکیج یافت نشد" }, { status: 404 });
    }

    if (plan.price === 0) {
      return NextResponse.json(
        { error: "پکیج رایگان نیازی به پرداخت ندارد" },
        { status: 400 }
      );
    }

    // شماره فاکتور یکتا
    const invoiceNumber = `INV-${Date.now()}-${session.user.id.slice(-6)}`;

    // درخواست پرداخت از پاسارگاد
    // amount: به ریال (توجه: تومان رو ضرب در 10 کن)
    const result = await pep.purchase({
      amount: plan.price * 10, // تومان به ریال
      invoice: invoiceNumber,
    });

    if (result.resultCode !== 0) {
      console.error("PEP purchase failed:", result);
      return NextResponse.json(
        { error: result.resultMessage || "خطا در ایجاد تراکنش" },
        { status: 400 }
      );
    }

    // ذخیره تراکنش
    await Transaction.create({
      userId: session.user.id,
      planId: plan._id,
      planSlug: plan.slug,
      amount: plan.price * 10,
      invoiceNumber,
      urlId: result.data.urlId,
      status: "pending",
    });

    // هدایت به درگاه
    return NextResponse.json({ paymentUrl: result.data.url });
  } catch (error) {
    console.error("POST /api/payment/request error:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}