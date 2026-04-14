"use client";

import { useStore } from "../../hooks/use-store";
import { OnboardingWizard } from "../onboarding/wizard";
import { InvoiceBuilder } from "../invoice/builder";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from "@gstforge/ui";
import { LayoutDashboard, FileText, CreditCard, Settings, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { purchaseCredits } from "../../lib/api";
import { toast } from "sonner";
import type { AuthSession } from "../../lib/auth";
import type { BusinessDetails } from "@gstforge/types";

type UserDashboardProps = {
  session: AuthSession;
  initialBusinessDetails: BusinessDetails | null;
  initialCredits: number;
};

export default function UserDashboard({ session, initialBusinessDetails, initialCredits }: UserDashboardProps) {
  const router = useRouter();
  const { businessDetails, userCredits, setUserCredits, invoiceHistory, setUserProfile, setBusinessDetails } = useStore();
  const [activeTab, setActiveTab] = useState("new-invoice");
  const [customCredits, setCustomCredits] = useState("25");
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const resolvedBusinessDetails = businessDetails ?? initialBusinessDetails;

  useEffect(() => {
    setUserProfile({
      userId: session.userId,
      authUserId: session.authUserId,
      email: session.email,
      name: session.name ?? undefined,
    });
    setUserCredits(initialCredits);
  }, [initialCredits, session, setUserCredits, setUserProfile]);

  useEffect(() => {
    if (initialBusinessDetails) {
      setBusinessDetails(initialBusinessDetails);
    }
  }, [initialBusinessDetails, setBusinessDetails]);

  if (!resolvedBusinessDetails) {
    return <OnboardingWizard />;
  }

  const navItems = [
    { id: "new-invoice", label: "New Invoice", icon: FileText },
    { id: "history", label: "History", icon: LayoutDashboard },
    { id: "credits", label: "Credits", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleBuyCredits = async (credits: number) => {
    if (!resolvedBusinessDetails) {
      toast.error("Complete onboarding before purchasing credits.");
      return;
    }

    if (!Number.isFinite(credits) || credits <= 0) {
      toast.error("Enter a valid credit amount.");
      return;
    }

    try {
      setIsAddingCredits(true);
      const result = await purchaseCredits({
        businessDetails: resolvedBusinessDetails,
        creditsAdded: credits,
        amount: credits,
      });

      setUserCredits(result.creditsRemaining);
      toast.success(`${credits} credits added successfully.`);
      setActiveTab("new-invoice");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add credits");
    } finally {
      setIsAddingCredits(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 font-bold text-xl text-indigo-600 border-b">
          <Zap className="fill-indigo-600" />
          <span>GSTForge</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{session.name ?? "GSTForge User"}</p>
              <p className="truncate text-xs text-slate-500">{session.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center px-8 justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-lg">
            {navItems.find(n => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-slate-500 md:block">
              {session.email}
            </p>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${userCredits < 3 ? 'bg-red-50 border-red-200 text-red-600 shadow-sm animate-pulse' : 'bg-green-50 border-green-200 text-green-600'}`}>
              Credits: {userCredits}
            </div>
            <Button size="sm" className="bg-indigo-600" onClick={() => setActiveTab("credits")}>Buy Credits</Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {activeTab === "new-invoice" && <InvoiceBuilder />}
          {activeTab === "history" && (
            <div className="p-8 space-y-4">
              {invoiceHistory.length === 0 ? (
                <div className="text-center text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No invoices generated yet.</p>
                </div>
              ) : (
                invoiceHistory.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <p className="font-semibold">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-slate-500">{invoice.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{invoice.total.toFixed(2)}</p>
                        <p className="text-sm capitalize text-slate-500">{invoice.status}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          {activeTab === "credits" && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold">Credit Balance: {userCredits}</h3>
              <Card className="border-indigo-200 shadow-lg shadow-indigo-100/50">
                <CardHeader>
                  <CardTitle>Add Credits</CardTitle>
                  <CardDescription>
                    Plans are removed for now. You can add as many credits as you want.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="credits">Credits to add</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      step="1"
                      value={customCredits}
                      onChange={(event) => setCustomCredits(event.target.value)}
                      placeholder="Enter any credit amount"
                    />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    New balance after adding these credits:
                    <span className="ml-2 font-bold text-slate-900">
                      {userCredits + Math.max(0, Number(customCredits) || 0)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={isAddingCredits}
                    onClick={() => handleBuyCredits(Number(customCredits))}
                  >
                    {isAddingCredits ? "Adding..." : "Add Credits"}
                  </Button>
                  <Button variant="outline" onClick={() => setCustomCredits("100")}>
                    Quick Fill 100
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
