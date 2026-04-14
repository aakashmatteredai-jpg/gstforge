"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Invoice, BusinessDetails } from "@gstforge/types";

type SavedInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
};

interface AppState {
  userCredits: number;
  businessDetails: BusinessDetails | null;
  userProfile: {
    userId: string;
    authUserId?: string;
    email: string;
    name?: string;
  };
  currentInvoice: Partial<Invoice>;
  invoiceHistory: SavedInvoice[];
  setUserCredits: (credits: number) => void;
  setBusinessDetails: (details: BusinessDetails | null) => void;
  setUserProfile: (profile: { userId: string; authUserId?: string; email: string; name?: string }) => void;
  addInvoice: (invoice: SavedInvoice) => void;
  setCurrentInvoice: (invoice: Partial<Invoice>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userCredits: 5,
      businessDetails: null,
      userProfile: {
        userId: "",
        email: "demo@gstforge.local",
      },
      currentInvoice: {
        items: [],
      },
      invoiceHistory: [],
      setUserCredits: (credits) => set({ userCredits: credits }),
      setBusinessDetails: (details) => set({ businessDetails: details }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      addInvoice: (invoice) =>
        set((state) => ({
          invoiceHistory: [invoice, ...state.invoiceHistory],
        })),
      setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
    }),
    {
      name: "gstforge-store",
    },
  ),
);
