"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  LayoutDashboard, 
  HelpCircle,
  Zap,
  CreditCard,
  LogOut
} from "lucide-react";
import { cn } from "../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: CreditCard, label: "Subscriptions", href: "/subscriptions" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

const footerItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Support", href: "/support" },
];

type SidebarProps = {
  totalCredits: number;
  totalUsers: number;
};

export function Sidebar({ totalCredits, totalUsers }: SidebarProps) {
  const pathname = usePathname();
  const creditCap = Math.max(totalUsers * 5, 1);
  const creditProgress = Math.min(100, Math.round((totalCredits / creditCap) * 100));

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-primary text-primary-foreground p-1 rounded-lg">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span>GSTForge Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 space-y-4 border-t">
        <div className="space-y-1">
          {footerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Credits Pool</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black italic">{totalCredits} / {creditCap}</span>
            <Link href="/topup" className="text-[10px] font-bold underline text-primary">RELOAD</Link>
          </div>
          <div className="w-full h-1.5 bg-primary/20 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${creditProgress}%` }}></div>
          </div>
        </div>

        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
