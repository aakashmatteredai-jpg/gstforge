import { Button } from "@gstforge/ui";
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-indigo-600">
          <Zap className="fill-current text-indigo-600" />
          <span>GSTForge</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">Features</a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">Pricing</a>
          <Button variant="outline" size="sm">Log In</Button>
          <Button size="sm">Get Started</Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 flex flex-col items-center text-center">
          <div className="container space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Professional GST Invoices <br/>
              <span className="text-indigo-600">In Seconds, Not Hours.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Smart tax optimization, real-time calculations, and professional PDF exports for your small business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 text-lg">
                Create Free Invoice <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                View Sample Invoice
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-slate-900 px-4">
          <div className="container grid gap-12 lg:grid-cols-3 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-slate-50 dark:bg-slate-950">
              <BarChart3 className="h-12 w-12 text-indigo-600" />
              <h3 className="text-xl font-bold">Smart Tax Calc</h3>
              <p className="text-gray-500 dark:text-gray-400">Auto-detect CGST/SGST vs IGST based on place of supply logic.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-slate-50 dark:bg-slate-950">
              <Shield className="h-12 w-12 text-indigo-600" />
              <h3 className="text-xl font-bold">Compliant Exports</h3>
              <p className="text-gray-500 dark:text-gray-400">Professional PDF invoices with HSN/SAC validation built-in.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-slate-50 dark:bg-slate-950">
              <Zap className="h-12 w-12 text-indigo-600" />
              <h3 className="text-xl font-bold">Credit System</h3>
              <p className="text-gray-500 dark:text-gray-400">Pay as you go. 5 free credits on signup. No monthly subscriptions.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t px-4 md:px-6 bg-white dark:bg-slate-950">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 mx-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 GSTForge Inc. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <a className="text-xs hover:underline underline-offset-4" href="#">Terms of Service</a>
            <a className="text-xs hover:underline underline-offset-4" href="#">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
