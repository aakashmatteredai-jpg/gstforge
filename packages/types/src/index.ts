import { z } from "zod";

export const BusinessDetailsSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  gstin: z.string().length(15, "GSTIN must be 15 characters").regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"),
  pan: z.string().length(10, "PAN must be 10 characters"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  logoUrl: z.string().optional(),
  bankDetails: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    ifsc: z.string(),
    bankName: z.string(),
  }).optional(),
});

export const InvoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  hsn: z.string().min(4, "HSN/SAC must be at least 4 digits"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  unitPrice: z.number().min(0.01, "Price must be positive"),
  discount: z.number().default(0),
  discountType: z.enum(["percent", "flat"]).default("percent"),
  gstRate: z.number().default(18), // 0, 5, 12, 18, 28
});

export const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  gstin: z.string().length(15).optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string(),
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
  customer: CustomerSchema,
  placeOfSupply: z.string(),
  notes: z.string().optional(),
});

export type BusinessDetails = z.infer<typeof BusinessDetailsSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;

export const HSN_SUGGESTIONS = [
  { hsn: "9983", description: "Other professional, technical and business services" },
  { hsn: "9987", description: "Maintenance, repair and installation services" },
  { hsn: "8471", description: "Automatic data processing machines (Laptops/Desktops)" },
  { hsn: "8517", description: "Telephone sets, including smartphones" },
  { hsn: "4820", description: "Registers, account books, notebooks" },
  // ... more can be added
];
