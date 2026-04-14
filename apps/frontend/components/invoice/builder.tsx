"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Label, Button } from "@gstforge/ui";
import { InvoiceSchema, type Invoice, type InvoiceItem } from "@gstforge/types";
import { calculateInvoiceTotals, formatCurrency, generateInvoicePDF } from "@gstforge/utils";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { useStore } from "../../hooks/use-store";
import { createInvoice } from "../../lib/api";
import { toast } from "sonner";

export function InvoiceBuilder() {
  const { businessDetails, currentInvoice, setCurrentInvoice, addInvoice, setUserCredits } = useStore();
  const [items, setItems] = useState<InvoiceItem[]>(currentInvoice.items || []);
  const [customer, setCustomer] = useState(currentInvoice.customer || { name: "", address: "", state: "", gstin: "" });
  const [placeOfSupply, setPlaceOfSupply] = useState(currentInvoice.placeOfSupply || "");
  const [invoiceNumber, setInvoiceNumber] = useState(currentInvoice.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const invoiceDraft: Invoice = {
    invoiceNumber,
    date: new Date().toISOString(),
    items,
    customer,
    placeOfSupply,
  };
  const totals = calculateInvoiceTotals(invoiceDraft, businessDetails?.state || "");

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      hsn: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: "percent",
      gstRate: 18,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleGenerateInvoice = async () => {
    if (!businessDetails) {
      toast.error("Complete onboarding before generating invoices.");
      return;
    }

    try {
      setIsSubmitting(true);
      const validatedInvoice = InvoiceSchema.parse(invoiceDraft);
      setCurrentInvoice(validatedInvoice);

      const result = await createInvoice({
        businessDetails,
        invoiceData: validatedInvoice,
      });

      addInvoice(result.invoice);
      setUserCredits(result.creditsRemaining);
      generateInvoicePDF(validatedInvoice, businessDetails);
      toast.success("Invoice created and PDF downloaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 p-6">
      {/* Form Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice #</Label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Place of Supply (State)</Label>
                <Input value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} placeholder="e.g. Maharashtra" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Customer Address</Label>
              <Input value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer State</Label>
                <Input value={customer.state} onChange={(e) => setCustomer({...customer, state: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Customer GSTIN (Optional)</Label>
                <Input value={customer.gstin} onChange={(e) => setCustomer({...customer, gstin: e.target.value.toUpperCase()})} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button size="sm" onClick={addItem} className="bg-indigo-600">
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3 relative group">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Service/Product name"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">HSN/SAC</Label>
                    <Input 
                      value={item.hsn} 
                      onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">GST Rate %</Label>
                    <Input 
                      type="number"
                      value={item.gstRate} 
                      onChange={(e) => updateItem(item.id, "gstRate", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input 
                      type="number"
                      value={item.quantity} 
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unit Price</Label>
                    <Input 
                      type="number"
                      value={item.unitPrice} 
                      onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Discount %</Label>
                    <Input 
                      type="number"
                      value={item.discount} 
                      onChange={(e) => updateItem(item.id, "discount", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="sticky top-24 h-fit">
        <Card className="bg-slate-900 text-white overflow-hidden border-indigo-500/50">
          <CardHeader className="bg-indigo-600 py-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Live Preview
              <FileText className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-2xl font-bold">{businessDetails?.name || "Your Business"}</h2>
                <p className="text-sm text-slate-400">GSTIN: {businessDetails?.gstin || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-400 font-semibold">{invoiceNumber}</p>
                <p className="text-sm text-slate-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Bill To</p>
              <p className="font-bold">{customer.name || "Customer Name"}</p>
              <p className="text-sm text-slate-400">{customer.address || "Customer Address"}</p>
              <p className="text-sm text-slate-400">GSTIN: {customer.gstin || "URP"}</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 text-xs font-bold text-slate-500 border-b border-slate-700 pb-2">
                <div className="col-span-6">ITEM</div>
                <div className="col-span-2 text-right">QTY</div>
                <div className="col-span-4 text-right">AMOUNT</div>
              </div>
              {totals.itemBreakdown.map((item, i) => (
                <div key={i} className="grid grid-cols-12 text-sm">
                  <div className="col-span-6">
                    <p className="font-medium">{item.description || "Untitled Item"}</p>
                    <p className="text-xs text-slate-500">HSN: {item.hsn}</p>
                  </div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-4 text-right font-semibold">{formatCurrency(item.totalAmount)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Sub-taxable Value</span>
                <span>{formatCurrency(totals.subTotal)}</span>
              </div>
              {totals.isInterState ? (
                <div className="flex justify-between text-sm text-slate-400">
                  <span>IGST Total</span>
                  <span>{formatCurrency(totals.igstTotal)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>CGST Total</span>
                    <span>{formatCurrency(totals.cgstTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>SGST Total</span>
                    <span>{formatCurrency(totals.sgstTotal)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-slate-700">
                <span>Total Amount</span>
                <span className="text-indigo-400">{formatCurrency(totals.grandTotal)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-800 p-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-11" onClick={handleGenerateInvoice} disabled={isSubmitting}>
              <Download className="w-4 h-4 mr-2" /> Generate & Download PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
