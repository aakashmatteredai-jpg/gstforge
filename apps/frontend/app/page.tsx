import React from "react";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Button } from "@gstforge/ui";
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  FileText, 
  Settings, 
  Scale, 
  Download,
  Users
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-primary">
            <div className="bg-primary text-primary-foreground p-1 rounded-lg">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <span>GSTForge</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center cursor-pointer">
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="shadow-lg shadow-primary/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now Supporting HSN 2024
              </div>
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight">
                Invoicing Built for <br/>
                <span className="text-primary italic">Precision & Speed.</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
                Stop wrestling with tax calculations. GSTForge automates your compliance, 
                generates audit-ready PDFs, and keeps your finances crystal clear.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-primary/30">
                    Build Your First Invoice <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl border-2">
                  Explore Templates
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="pt-12 flex flex-col items-center space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trusted by 5,000+ CA & Small Businesses</p>
                <div className="flex items-center gap-8 grayscale opacity-50 contrast-125">
                  <div className="h-8 w-24 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                  <div className="h-8 w-24 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                  <div className="h-8 w-24 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                  <div className="h-8 w-24 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-secondary/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Engineered for Reliability</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">Every feature is designed to ensure your GST compliance is bulletproof.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={<BarChart3 />} 
                title="Smart Tax Engine" 
                description="Intelligently switches between CGST+SGST or IGST based on location protocols."
              />
              <FeatureCard 
                icon={<Shield />} 
                title="Compliance Vault" 
                description="All invoices are archived for up to 8 years, ensuring you are always audit-ready."
              />
              <FeatureCard 
                icon={<FileText />} 
                title="HSN/SAC Validation" 
                description="Built-in database for rapid and accurate goods and services categorization."
              />
              <FeatureCard 
                icon={<Zap />} 
                title="Instant PDF Generation" 
                description="One click is all it takes to generate professional, GST-compliant PDF documents."
              />
              <FeatureCard 
                icon={<Users />} 
                title="Client Management" 
                description="Save client details for rapid invoicing across multiple projects and entities."
              />
              <FeatureCard 
                icon={<Settings />} 
                title="Custom Branding" 
                description="Add your logo and choose from professional templates to match your brand identity."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl font-bold tracking-tight">Three steps to compliance.</h2>
                <div className="space-y-6">
                  <Step num="01" title="Input Business Data" desc="Fill in your and your client's GST details effortlessly." />
                  <Step num="02" title="Select HSN & Add Items" desc="Pick from our database or enter custom items with auto-calculated taxes." />
                  <Step num="03" title="Download & Send" desc="Get your professionally formatted PDF ready for your client." />
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary rounded-3xl border-4 border-muted shadow-2xl flex items-center justify-center relative overflow-hidden group">
                  <div className="bg-background w-[80%] h-[80%] rounded-xl shadow-inner border p-6 space-y-4">
                     <div className="h-4 w-[60%] bg-muted rounded animate-pulse"></div>
                     <div className="h-4 w-[40%] bg-muted rounded animate-pulse"></div>
                     <div className="h-20 w-full bg-primary/5 rounded border-2 border-dashed flex items-center justify-center text-primary/40 font-bold">
                        INVOICE PREVIEW
                     </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-slate-900 text-white">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-slate-400">Pay for what you use. No hidden fees.</p>
            </div>
            <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-8 shadow-2xl relative">
              <div className="absolute top-0 right-12 -translate-y-1/2 bg-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-bold text-slate-300">Standard Pack</h3>
                <div className="text-5xl font-black">₹999<span className="text-lg text-slate-500 font-medium">/50 credits</span></div>
                <p className="text-slate-400">Perfect for growing freelancers and small businesses.</p>
              </div>
              <ul className="space-y-4">
                <PricingItem text="50 Compliant Invoices" />
                <PricingItem text="Unlimited Client Profiles" />
                <PricingItem text="Custom Branding" />
                <PricingItem text="Priority Support" />
                <PricingItem text="HSN/SAC Validation" />
              </ul>
              <Link href="/sign-up" className="w-full">
                <Button size="lg" className="w-full h-14 text-lg font-bold bg-white text-slate-900 hover:bg-slate-200">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl text-primary">
                <Zap className="h-5 w-5 fill-current" />
                <span>GSTForge</span>
              </div>
              <p className="text-muted-foreground max-w-sm">The gold standard for small business GST compliance in India. Built for speed, accuracy, and reliability.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Product</h4>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#features" className="hover:text-primary transition-colors">Features</a>
                <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                <a href="#" className="hover:text-primary transition-colors">Roadmap</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Legal</h4>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
              </nav>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t gap-4">
            <p className="text-sm text-muted-foreground">© 2024 GSTForge Inc. All rights reserved.</p>
            <div className="flex gap-4">
               {/* Social Icons Placeholders */}
               <div className="h-5 w-5 bg-muted rounded"></div>
               <div className="h-5 w-5 bg-muted rounded"></div>
               <div className="h-5 w-5 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border bg-card hover:bg-accent/5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        {React.isValidElement<{ className?: string }>(icon)
          ? React.cloneElement(icon, { className: "h-6 w-6" })
          : icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-6 items-start">
      <span className="text-4xl font-black text-primary/20">{num}</span>
      <div className="space-y-1 pt-1">
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function PricingItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-300">
      <CheckCircle className="h-5 w-5 text-primary" />
      <span>{text}</span>
    </li>
  )
}
