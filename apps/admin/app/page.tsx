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
  AlertCircle
} from "lucide-react";
import { Button, Card } from "@gstforge/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground font-medium">Welcome back! Here's what's happening with your account today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Download Report</Button>
          <Button className="shadow-lg shadow-primary/20">+ Create New Invoice</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹1,25,000" 
          change="+12.5%" 
          trend="up" 
          icon={<TrendingUp className="h-5 w-5 text-green-500" />} 
        />
        <StatCard 
          title="Active Invoices" 
          value="48" 
          change="+3" 
          trend="up" 
          icon={<FileText className="h-5 w-5 text-primary" />} 
        />
        <StatCard 
          title="Active Clients" 
          value="12" 
          change="-2" 
          trend="down" 
          icon={<Users className="h-5 w-5 text-orange-500" />} 
        />
        <StatCard 
          title="Credits Remaining" 
          value="42" 
          change="84%" 
          trend="none" 
          icon={<Clock className="h-5 w-5 text-muted-foreground" />} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Invoices Table */}
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
                   <InvoiceRow id="INV-2024-001" client="Acme Corp" amount="₹12,500" status="paid" />
                   <InvoiceRow id="INV-2024-002" client="Global Tech" amount="₹8,900" status="pending" />
                   <InvoiceRow id="INV-2024-003" client="Zenith Retail" amount="₹24,000" status="paid" />
                   <InvoiceRow id="INV-2024-004" client="Nexus Soft" amount="₹15,200" status="overdue" />
                   <InvoiceRow id="INV-2024-005" client="Skyline Ltd" amount="₹5,600" status="paid" />
                </tbody>
             </table>
           </div>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-8">
           <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
              <h4 className="font-bold">Upgrade to Pro</h4>
              <p className="text-sm text-muted-foreground">Unlock unlimited invoices, custom branding, and priority CA support.</p>
              <Button className="w-full font-bold">Upgrade Now</Button>
           </Card>

           <Card className="p-6 space-y-6">
              <h4 className="font-bold border-b pb-4">Upcoming Deadlines</h4>
              <div className="space-y-4">
                 <DeadlineItem title="GST Return Filing" date="20 Apr, 2024" urgency="high" />
                 <DeadlineItem title="TDS Payment" date="07 May, 2024" urgency="medium" />
                 <DeadlineItem title="Quarterly Audit" date="15 May, 2024" urgency="low" />
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon }: any) {
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
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-2xl font-black">{value}</h3>
      </div>
    </Card>
  )
}

function InvoiceRow({ id, client, amount, status }: any) {
  const statusStyles: any = {
    paid: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    overdue: "bg-red-100 text-red-700 border-red-200"
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 font-mono font-medium text-xs">{id}</td>
      <td className="px-6 py-4 font-bold">{client}</td>
      <td className="px-6 py-4 font-black">{amount}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  )
}

function DeadlineItem({ title, date, urgency }: any) {
  const urgencyIcons: any = {
    high: <AlertCircle className="h-4 w-4 text-red-500" />,
    medium: <Clock className="h-4 w-4 text-orange-500" />,
    low: <CheckCircle2 className="h-4 w-4 text-green-500" />
  }

  return (
    <div className="flex items-center justify-between gap-4 group cursor-pointer">
      <div className="flex items-center gap-3">
        {urgencyIcons[urgency]}
        <div className="space-y-0.5">
          <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">{title}</p>
          <p className="text-[10px] text-muted-foreground font-medium">{date}</p>
        </div>
      </div>
      <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
