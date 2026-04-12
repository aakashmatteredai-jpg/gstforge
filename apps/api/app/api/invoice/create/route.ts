import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";
import { calculateInvoiceTotals } from "@gstforge/utils";
import { Invoice } from "@gstforge/types";

export async function POST(req: Request) {
  try {
    const { userId, invoiceData }: { userId: string; invoiceData: Invoice } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.credits <= 0) {
      return new NextResponse("Insufficient credits", { status: 403 });
    }

    // Deduct credit
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    const totals = calculateInvoiceTotals(invoiceData, (user.businessDetails as any)?.state || "");

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber: invoiceData.invoiceNumber,
        customerName: invoiceData.customer.name,
        total: totals.grandTotal,
        status: "saved",
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("[INVOICE_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
