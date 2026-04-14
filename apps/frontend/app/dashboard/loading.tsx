function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden h-screen w-64 border-r bg-white md:flex md:flex-col">
        <div className="border-b p-6">
          <SkeletonBlock className="h-8 w-32" />
        </div>
        <div className="flex-1 space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full" />
          ))}
        </div>
        <div className="border-t p-4">
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </aside>

      <main className="flex-1">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-8">
          <SkeletonBlock className="h-7 w-36" />
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-8 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-28" />
          </div>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SkeletonBlock className="h-32 w-full" />
            <SkeletonBlock className="h-48 w-full" />
            <SkeletonBlock className="h-72 w-full" />
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <SkeletonBlock className="h-14 w-full rounded-none" />
              <div className="space-y-5 p-8">
                <SkeletonBlock className="h-20 w-full" />
                <SkeletonBlock className="h-16 w-2/3" />
                <SkeletonBlock className="h-48 w-full" />
                <SkeletonBlock className="h-24 w-full" />
              </div>
              <div className="border-t p-4">
                <SkeletonBlock className="h-11 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
