import { prisma } from "@gstforge/prisma";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function startOfDay(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getAdminShellData() {
  const [latestUser, creditAggregate, totalUsers] = await Promise.all([
    prisma.user.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        email: true,
      },
    }),
    prisma.user.aggregate({
      _sum: {
        credits: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    latestUser,
    totalUsers,
    totalCredits: creditAggregate._sum.credits ?? 0,
  };
}

export async function getAdminDashboardData() {
  const today = startOfDay();
  const monthStart = startOfMonth();
  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 6);

  const [users, invoices, payments] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        createdAt: true,
      },
    }),
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        amount: true,
        createdAt: true,
      },
    }),
  ]);

  const invoicesToday = invoices.filter((invoice) => invoice.createdAt >= today).length;
  const activeInvoices = invoices.filter((invoice) => invoice.status !== "paid").length;
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const activeClients = new Set(invoices.map((invoice) => invoice.customerName).filter(Boolean)).size;
  const totalCreditsRemaining = users.reduce((total, user) => total + user.credits, 0);
  const monthlyRevenueValue = payments
    .filter((payment) => payment.createdAt >= monthStart)
    .reduce((total, payment) => total + payment.amount, 0);

  const previousWeekStart = new Date(last7Days);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekCount = invoices.filter(
    (invoice) => invoice.createdAt >= previousWeekStart && invoice.createdAt < last7Days,
  ).length;
  const currentWeekCount = invoices.filter((invoice) => invoice.createdAt >= last7Days).length;
  const growthPercentage = previousWeekCount === 0
    ? currentWeekCount > 0 ? 100 : 0
    : ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100;

  const activityByDay = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(last7Days);
    day.setDate(last7Days.getDate() + offset);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    return {
      name: day.toLocaleDateString("en-US", { weekday: "short" }),
      invoices: invoices.filter((invoice) => invoice.createdAt >= day && invoice.createdAt < nextDay).length,
    };
  });

  const recentInvoices = invoices.slice(0, 5).map((invoice) => ({
    ...invoice,
    totalFormatted: formatCurrency(invoice.total),
  }));

  const systemLogs = [
    users[0]
      ? {
          title: "Latest user joined",
          subtitle: users[0].email,
          time: users[0].createdAt.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          tone: "green",
        }
      : null,
    invoices[0]
      ? {
          title: "Newest invoice created",
          subtitle: invoices[0].invoiceNumber,
          time: invoices[0].createdAt.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          tone: "indigo",
        }
      : null,
    payments[0]
      ? {
          title: "Latest payment recorded",
          subtitle: formatCurrency(payments[0].amount),
          time: payments[0].createdAt.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          tone: "amber",
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; subtitle: string; time: string; tone: string }>;

  const upcomingDeadlines = [
    {
      title: "GST Return Filing",
      date: "20 Apr, 2026",
      urgency: "high" as const,
      note: `${paidInvoices.length} paid invoices to reconcile`,
    },
    {
      title: "Monthly Revenue Review",
      date: "30 Apr, 2026",
      urgency: "medium" as const,
      note: `${formatCurrency(monthlyRevenueValue)} collected this month`,
    },
    {
      title: "Credit Balance Check",
      date: "01 May, 2026",
      urgency: "low" as const,
      note: `${totalCreditsRemaining} credits left across all users`,
    },
  ];

  return {
    stats: {
      totalRevenue: formatCurrency(monthlyRevenueValue),
      invoicesToday,
      activeInvoices,
      activeClients,
      creditsRemaining: totalCreditsRemaining,
      growthPercentage,
      totalUsers: users.length,
    },
    activityByDay,
    recentInvoices,
    users,
    systemLogs,
    upcomingDeadlines,
  };
}
