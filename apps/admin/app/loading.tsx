function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

export default function AdminLoading() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="hidden h-screen w-64 border-r bg-white md:flex md:flex-col">
        <div className="p-6">
          <SkeletonBlock className="h-8 w-40" />
        </div>
        <div className="flex-1 space-y-3 px-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full" />
          ))}
        </div>
        <div className="space-y-4 border-t p-4">
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-16 items-center justify-between border-b bg-white px-8">
          <SkeletonBlock className="h-10 w-[28rem]" />
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-10 w-10 rounded-full" />
            <SkeletonBlock className="h-10 w-36" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <SkeletonBlock className="h-9 w-72" />
                <SkeletonBlock className="h-5 w-96 max-w-full" />
              </div>
              <div className="flex gap-3">
                <SkeletonBlock className="h-10 w-36" />
                <SkeletonBlock className="h-10 w-40" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-32 w-full" />
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <SkeletonBlock className="h-[420px] w-full lg:col-span-2" />
              <div className="space-y-8">
                <SkeletonBlock className="h-40 w-full" />
                <SkeletonBlock className="h-56 w-full" />
                <SkeletonBlock className="h-52 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
