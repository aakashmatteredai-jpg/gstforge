import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, razorpayPaymentId, creditsAdded } = body;

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        razorpayPaymentId,
        creditsAdded,
      },
    });

    // Update user credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: creditsAdded,
        },
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
