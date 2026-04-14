import type { BusinessDetails, Invoice } from "@gstforge/types";

type ApiErrorPayload = {
  message?: string;
};

type CreateInvoiceInput = {
  businessDetails: BusinessDetails;
  invoiceData: Invoice;
};

type PurchaseCreditsInput = {
  businessDetails?: BusinessDetails;
  amount: number;
  creditsAdded: number;
};

export type CreateInvoiceResponse = {
  invoice: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  };
  creditsRemaining: number;
  totals: {
    grandTotal: number;
  };
};

export type PurchaseCreditsResponse = {
  success: boolean;
  creditsRemaining: number;
};

export type SaveBusinessProfileResponse = {
  user: {
    id: string;
    credits: number;
    businessDetails: BusinessDetails;
  };
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    throw new Error(payload?.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function createInvoice(input: CreateInvoiceInput) {
  const response = await fetch("/api/invoice/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<CreateInvoiceResponse>(response);
}

export async function purchaseCredits(input: PurchaseCreditsInput) {
  const response = await fetch("/api/webhook/razorpay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...input,
      razorpayPaymentId: `demo_${Date.now()}`,
    }),
  });

  return parseResponse<PurchaseCreditsResponse>(response);
}

export async function saveBusinessProfile(businessDetails: BusinessDetails) {
  const response = await fetch("/api/account/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ businessDetails }),
  });

  return parseResponse<SaveBusinessProfileResponse>(response);
}
