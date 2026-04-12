"use client";

import { create } from "zustand";
import { Invoice, BusinessDetails } from "@gstforge/types";

interface AppState {
  userCredits: number;
  businessDetails: BusinessDetails | null;
  currentInvoice: Partial<Invoice>;
  setUserCredits: (credits: number) => void;
  setBusinessDetails: (details: BusinessDetails) => void;
  setCurrentInvoice: (invoice: Partial<Invoice>) => void;
}

export const useStore = create<AppState>((set) => ({
  userCredits: 5,
  businessDetails: null,
  currentInvoice: {
    items: [],
  },
  setUserCredits: (credits) => set({ userCredits: credits }),
  setBusinessDetails: (details) => set({ businessDetails: details }),
  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
}));
