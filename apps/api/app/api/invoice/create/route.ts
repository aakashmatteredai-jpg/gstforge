import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";
import { InvoiceSchema, type BusinessDetails } from "@gstforge/types";
import { calculateInvoiceTotals } from "@gstforge/utils";
import { z } from "zod";
import { resolveOrCreateUser } from "../../../../lib/users";

const createInvoiceRequestSchema = z.object({
  userId: z.string().optional(),
  authUserId: z.string().optional(),
  email: z.string().email().optional(),
  businessDetails: z.any().optional() as z.ZodType<BusinessDetails | undefined>,
  invoiceData: InvoiceSchema,
});

export async function POST(req: Request) {
  try {
    const payload = createInvoiceRequestSchema.parse(await req.json());
    const { invoiceData } = payload;
    const user = await resolveOrCreateUser({
      userId: payload.userId,
      authUserId: payload.authUserId,
      email: payload.email,
      businessDetails: payload.businessDetails,
    });

    if (!user || user.credits <= 0) {
      return new NextResponse("Insufficient credits", { status: 403 });
    }

    // Deduct credit
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    const totals = calculateInvoiceTotals(invoiceData, (user.businessDetails as any)?.state || "");

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        invoiceNumber: invoiceData.invoiceNumber,
        customerName: invoiceData.customer.name,
        total: totals.grandTotal,
        status: "saved",
      },
    });

    return NextResponse.json({
      invoice,
      creditsRemaining: updatedUser.credits,
      totals,
    });
  } catch (error) {
    console.error("[INVOICE_CREATE_ERROR]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid invoice payload", issues: error.flatten() },
        { status: 400 },
      );
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
