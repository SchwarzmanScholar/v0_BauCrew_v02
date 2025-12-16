import { AppShell } from "@/components/baucrew/app-shell"
import { LoadingSkeletonGrid } from "@/components/baucrew/loading-skeleton-grid"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProviderJobBoardLoading() {
  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>

        {/* Info Banner Skeleton */}
        <Skeleton className="mb-6 h-16 w-full rounded-lg" />

        {/* Search Skeleton */}
        <div className="mb-6 flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24 lg:hidden" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters Skeleton */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6 rounded-lg border bg-card p-6">
              <Skeleton className="h-5 w-16" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Skeleton */}
          <div className="flex-1">
            <Skeleton className="mb-4 h-5 w-32" />
            <LoadingSkeletonGrid count={6} variant="job" />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
