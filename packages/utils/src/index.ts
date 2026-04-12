import { Invoice, InvoiceItem } from "@gstforge/types";

export function calculateItemTotals(item: InvoiceItem) {
  const taxableValue = item.quantity * item.unitPrice;
  let discountAmount = 0;
  
  if (item.discountType === "percent") {
    discountAmount = (taxableValue * item.discount) / 100;
  } else {
    discountAmount = item.discount;
  }

  const netTaxableValue = taxableValue - discountAmount;
  const gstAmount = (netTaxableValue * item.gstRate) / 100;
  
  return {
    netTaxableValue,
    gstAmount,
    totalAmount: netTaxableValue + gstAmount,
  };
}

export function calculateInvoiceTotals(invoice: Invoice, supplierState: string) {
  let subTotal = 0;
  let totalGst = 0;
  const isInterState = invoice.placeOfSupply !== supplierState;

  const itemBreakdown = invoice.items.map((item) => {
    const totals = calculateItemTotals(item);
    subTotal += totals.netTaxableValue;
    totalGst += totals.gstAmount;
    
    return {
      ...item,
      ...totals,
      cgst: isInterState ? 0 : totals.gstAmount / 2,
      sgst: isInterState ? 0 : totals.gstAmount / 2,
      igst: isInterState ? totals.gstAmount : 0,
    };
  });

  return {
    itemBreakdown,
    subTotal,
    totalGst,
    grandTotal: subTotal + totalGst,
    isInterState,
    cgstTotal: isInterState ? 0 : totalGst / 2,
    sgstTotal: isInterState ? 0 : totalGst / 2,
    igstTotal: isInterState ? totalGst : 0,
  };
}

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (invoice: any, businessDetails: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text("INVOICE", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(businessDetails.name, 15, 40);
  doc.setFontSize(10);
  doc.text(`GSTIN: ${businessDetails.gstin}`, 15, 45);
  doc.text(businessDetails.address, 15, 50);

  doc.text("Bill To:", 15, 70);
  doc.setFontSize(12);
  doc.text(invoice.customer.name, 15, 75);
  doc.setFontSize(10);
  doc.text(`GSTIN: ${invoice.customer.gstin || "URP"}`, 15, 80);
  doc.text(invoice.customer.address, 15, 85);

  doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 15, 40, { align: "right" });
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, pageWidth - 15, 45, { align: "right" });

  const totals = calculateInvoiceTotals(invoice, businessDetails.state);

  const tableData = totals.itemBreakdown.map((item: any) => [
    item.description,
    item.hsn,
    item.quantity,
    formatCurrency(item.unitPrice),
    `${item.gstRate}%`,
    formatCurrency(item.totalAmount),
  ]);

  autoTable(doc, {
    startY: 95,
    head: [["Description", "HSN/SAC", "Qty", "Price", "GST", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.text("Sub-total:", pageWidth - 60, finalY);
  doc.text(formatCurrency(totals.subTotal), pageWidth - 15, finalY, { align: "right" });

  let currentY = finalY + 7;
  if (totals.isInterState) {
    doc.text("IGST Total:", pageWidth - 60, currentY);
    doc.text(formatCurrency(totals.igstTotal), pageWidth - 15, currentY, { align: "right" });
    currentY += 7;
  } else {
    doc.text("CGST Total:", pageWidth - 60, currentY);
    doc.text(formatCurrency(totals.cgstTotal), pageWidth - 15, currentY, { align: "right" });
    currentY += 7;
    doc.text("SGST Total:", pageWidth - 60, currentY);
    doc.text(formatCurrency(totals.sgstTotal), pageWidth - 15, currentY, { align: "right" });
    currentY += 7;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", pageWidth - 60, currentY + 5);
  doc.text(formatCurrency(totals.grandTotal), pageWidth - 15, currentY + 5, { align: "right" });

  doc.save(`${invoice.invoiceNumber}.pdf`);
};
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};
