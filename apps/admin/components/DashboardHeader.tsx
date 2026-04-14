import React from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@gstforge/ui";

type DashboardHeaderProps = {
  latestUser: {
    name: string | null;
    email: string;
  } | null;
  totalUsers: number;
};

export function DashboardHeader({ latestUser, totalUsers }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b bg-card px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search invoices, clients, or HSN codes..." 
            className="w-full h-10 bg-muted/50 border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-card"></span>
        </Button>
        <div className="h-8 w-[1px] bg-border mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{latestUser?.name || latestUser?.email || "Admin Console"}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{totalUsers} registered users</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <User className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
