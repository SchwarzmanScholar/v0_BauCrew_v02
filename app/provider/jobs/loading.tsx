import { Skeleton } from "@/components/ui/skeleton"
import { AppShell } from "@/components/baucrew/app-shell"

export default function ProviderJobsLoading() {
  return (
    <AppShell userRole="provider">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>

        {/* Search and filters skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <div className="hidden lg:flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <Skeleton className="h-10 w-full max-w-xl mb-6" />

        {/* Table skeleton */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
