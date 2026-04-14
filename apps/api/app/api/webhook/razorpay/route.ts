import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";
import type { BusinessDetails } from "@gstforge/types";
import { z } from "zod";
import { resolveOrCreateUser } from "../../../../lib/users";

const paymentRequestSchema = z.object({
  userId: z.string().optional(),
  authUserId: z.string().optional(),
  email: z.string().email().optional(),
  businessDetails: z.any().optional() as z.ZodType<BusinessDetails | undefined>,
  amount: z.number().positive(),
  razorpayPaymentId: z.string().min(1),
  creditsAdded: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const body = paymentRequestSchema.parse(await req.json());
    const { amount, razorpayPaymentId, creditsAdded } = body;
    const user = await resolveOrCreateUser({
      userId: body.userId,
      authUserId: body.authUserId,
      email: body.email,
      businessDetails: body.businessDetails,
    });

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount,
        razorpayPaymentId,
        creditsAdded,
      },
    });

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          increment: creditsAdded,
        },
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      creditsRemaining: updatedUser.credits,
    });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid payment payload", issues: error.flatten() },
        { status: 400 },
      );
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
