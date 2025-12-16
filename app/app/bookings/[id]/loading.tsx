import { AppShell } from "@/components/baucrew/app-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BookingDetailLoading() {
  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-6">
        {/* Back button skeleton */}
        <Skeleton className="h-9 w-48 mb-6" />

        {/* Status timeline skeleton */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-5 w-20 mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-5 w-5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-px w-full" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
                <Skeleton className="h-11 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
