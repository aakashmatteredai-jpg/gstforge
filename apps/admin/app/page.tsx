import React from "react";
import {
  FileText,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button, Card } from "@gstforge/ui";
import { getAdminDashboardData } from "../lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground font-medium">
            Live workspace activity from your actual GSTForge users, invoices, and payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Download Report</Button>
          <Button className="shadow-lg shadow-primary/20">+ Create New Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={dashboard.stats.totalRevenue}
          change={`${dashboard.stats.growthPercentage >= 0 ? "+" : ""}${dashboard.stats.growthPercentage.toFixed(1)}%`}
          trend={dashboard.stats.growthPercentage >= 0 ? "up" : "down"}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          title="Active Invoices"
          value={String(dashboard.stats.activeInvoices)}
          change={`+${dashboard.stats.invoicesToday}`}
          trend="up"
          icon={<FileText className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Active Clients"
          value={String(dashboard.stats.activeClients)}
          change={`${dashboard.stats.totalUsers} users`}
          trend="none"
          icon={<Users className="h-5 w-5 text-orange-500" />}
        />
        <StatCard
          title="Credits Remaining"
          value={String(dashboard.stats.creditsRemaining)}
          change={`${dashboard.stats.totalUsers} accounts`}
          trend="none"
          icon={<Clock className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
          <div className="p-6 border-b flex items-center justify-between bg-card/50">
            <h3 className="font-bold text-lg">Recent Invoices</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b">
                <tr className="text-left text-muted-foreground font-bold italic">
                  <th className="px-6 py-4">INVOICE ID</th>
                  <th className="px-6 py-4">CLIENT</th>
                  <th className="px-6 py-4">AMOUNT</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dashboard.recentInvoices.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-muted-foreground" colSpan={5}>
                      No invoices found yet. Create one from the frontend app and it will appear here.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentInvoices.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      id={invoice.invoiceNumber}
                      client={invoice.customerName}
                      amount={invoice.totalFormatted}
                      status={invoice.status}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
            <h4 className="font-bold">Users Snapshot</h4>
            <p className="text-sm text-muted-foreground">
              {dashboard.stats.totalUsers} users are registered and {dashboard.stats.creditsRemaining} credits are still available across accounts.
            </p>
            <Button className="w-full font-bold">Open User Management</Button>
          </Card>

          <Card className="p-6 space-y-6">
            <h4 className="font-bold border-b pb-4">Upcoming Deadlines</h4>
            <div className="space-y-4">
              {dashboard.upcomingDeadlines.map((item) => (
                <DeadlineItem key={item.title} title={item.title} date={item.date} urgency={item.urgency} note={item.note} />
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h4 className="font-bold border-b pb-4">System Logs</h4>
            <div className="space-y-4">
              {dashboard.systemLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">System activity will appear here once users start using the app.</p>
              ) : (
                dashboard.systemLogs.map((log) => (
                  <div key={`${log.title}-${log.time}`} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full ${log.tone === "green" ? "bg-green-500" : log.tone === "amber" ? "bg-amber-500" : "bg-indigo-500"}`} />
                    <div className="flex-1">
                      <p className="font-medium">{log.title}</p>
                      <p className="text-slate-500 text-xs">{log.subtitle}</p>
                    </div>
                    <div className="text-slate-400 text-xs text-right">{log.time}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon }: { title: string; value: string; change: string; trend: "up" | "down" | "none"; icon: React.ReactNode }) {
  return (
    <Card className="p-6 border-none shadow-lg shadow-slate-200/50 space-y-4 hover:translate-y-[-4px] transition-transform cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          {icon}
        </div>
        {trend !== "none" && (
          <div className={`flex items-center text-xs font-bold gap-0.5 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {change}
          </div>
        )}
        {trend === "none" ? (
          <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{change}</div>
        ) : null}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-2xl font-black">{value}</h3>
      </div>
    </Card>
  );
}

function InvoiceRow({ id, client, amount, status }: { id: string; client: string; amount: string; status: string }) {
  const normalizedStatus = status.toLowerCase();
  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    overdue: "bg-red-100 text-red-700 border-red-200",
    saved: "bg-blue-100 text-blue-700 border-blue-200",
    draft: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 font-mono font-medium text-xs">{id}</td>
      <td className="px-6 py-4 font-bold">{client}</td>
      <td className="px-6 py-4 font-black">{amount}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[normalizedStatus] || statusStyles.saved}`}>
          {normalizedStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

function DeadlineItem({ title, date, urgency, note }: { title: string; date: string; urgency: "high" | "medium" | "low"; note: string }) {
  const urgencyIcons = {
    high: <AlertCircle className="h-4 w-4 text-red-500" />,
    medium: <Clock className="h-4 w-4 text-orange-500" />,
    low: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  };

  return (
    <div className="flex items-center justify-between gap-4 group cursor-pointer">
      <div className="flex items-center gap-3">
        {urgencyIcons[urgency]}
        <div className="space-y-0.5">
          <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">{title}</p>
          <p className="text-[10px] text-muted-foreground font-medium">{date}</p>
          <p className="text-[11px] text-slate-500">{note}</p>
        </div>
      </div>
      <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
