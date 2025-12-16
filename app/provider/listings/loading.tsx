import { AppShell } from "@/components/baucrew/app-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProviderListingsLoading() {
  return (
    <AppShell userRole="provider" userName="Thomas Weber">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Stats skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-full sm:w-44" />
          <Skeleton className="h-10 w-full sm:w-36" />
        </div>

        {/* Cards skeleton */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <Skeleton className="w-full sm:w-40 h-32" />
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Skeleton className="h-4 w-28" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
