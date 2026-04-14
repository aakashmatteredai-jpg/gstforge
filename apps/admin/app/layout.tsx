import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { getAdminShellData } from "../lib/admin-data";

export const metadata: Metadata = {
  title: "GSTForge Admin",
  description: "Admin panel for GSTForge",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shellData = await getAdminShellData();

  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
          <Sidebar totalCredits={shellData.totalCredits} totalUsers={shellData.totalUsers} />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <DashboardHeader latestUser={shellData.latestUser} totalUsers={shellData.totalUsers} />
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
