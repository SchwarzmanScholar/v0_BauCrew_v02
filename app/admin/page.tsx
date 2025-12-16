import { AppShell } from "@/components/baucrew/app-shell"
import { AdminKpiCards } from "@/components/admin/admin-kpi-cards"
import { RecentBookingsTable } from "@/components/admin/recent-bookings-table"
import { PendingVerificationsTable } from "@/components/admin/pending-verifications-table"
import { RecentJobRequestsTable } from "@/components/admin/recent-job-requests-table"
import { adminStats, recentBookings, pendingVerifications, recentJobRequests } from "@/lib/admin-data"

export default function AdminDashboardPage() {
  return (
    <AppShell userRole="admin" userName="Admin User">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <AdminKpiCards stats={adminStats} />
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pending Verifications */}
          <PendingVerificationsTable verifications={pendingVerifications} />

          {/* Recent Job Requests */}
          <RecentJobRequestsTable jobRequests={recentJobRequests} />
        </div>

        {/* Recent Bookings - Full Width */}
        <RecentBookingsTable bookings={recentBookings} />
      </div>
    </AppShell>
  )
}
