"use client";

import { useStore } from "../../hooks/use-store";
import { OnboardingWizard } from "../onboarding/wizard";
import { InvoiceBuilder } from "../invoice/builder";
import { Button } from "@gstforge/ui";
import { LayoutDashboard, FileText, CreditCard, Settings, LogOut, Zap } from "lucide-react";
import { useState } from "react";

export default function UserDashboard() {
  const { businessDetails, userCredits } = useStore();
  const [activeTab, setActiveTab] = useState("new-invoice");

  if (!businessDetails) {
    return <OnboardingWizard />;
  }

  const navItems = [
    { id: "new-invoice", label: "New Invoice", icon: FileText },
    { id: "history", label: "History", icon: LayoutDashboard },
    { id: "credits", label: "Credits", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
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
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${userCredits < 3 ? 'bg-red-50 border-red-200 text-red-600 shadow-sm animate-pulse' : 'bg-green-50 border-green-200 text-green-600'}`}>
              Credits: {userCredits}
            </div>
            <Button size="sm" className="bg-indigo-600">Buy Credits</Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {activeTab === "new-invoice" && <InvoiceBuilder />}
          {activeTab === "history" && (
            <div className="p-8 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No invoices generated yet.</p>
            </div>
          )}
          {activeTab === "credits" && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold">Credit Balance: {userCredits}</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Starter", credits: 20, price: "₹99" },
                  { title: "Business", credits: 100, price: "₹399", popular: true },
                  { title: "Enterprise", credits: 500, price: "₹1499" },
                ].map((plan) => (
                  <Card key={plan.title} className={plan.popular ? "border-indigo-500 shadow-lg scale-105" : ""}>
                    <CardHeader>
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription>{plan.credits} Invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{plan.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>Buy Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
