import { AppShell } from "@/components/baucrew/app-shell"
import { KpiCard } from "@/components/provider/kpi-card"
import { OnboardingChecklist } from "@/components/provider/onboarding-checklist"
import { BookingRequestsTable } from "@/components/provider/booking-requests-table"
import { JobBoardTable } from "@/components/provider/job-board-table"
import { QuickActions } from "@/components/provider/quick-actions"
import {
  mockProviderStats,
  mockProviderBookingRequests,
  mockJobBoardListings,
  mockOnboardingTasks,
} from "@/lib/mock-data"
import { Inbox, Calendar, Euro, Star, Briefcase } from "lucide-react"

export default function ProviderDashboardPage() {
  const stats = mockProviderStats

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Willkommen zurück, Klaus</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard
            title="Neue Anfragen"
            value={stats.newRequests}
            icon={<Inbox className="h-5 w-5" />}
            highlight={stats.newRequests > 0}
          />
          <KpiCard
            title="Jobs diese Woche"
            value={stats.jobsThisWeek}
            icon={<Calendar className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <KpiCard
            title="Umsatz (30 Tage)"
            value={formatCurrency(stats.revenue30Days)}
            icon={<Euro className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <KpiCard
            title="Bewertung"
            value={stats.rating.toFixed(1)}
            subtitle={`${stats.reviewCount} Bewertungen`}
            icon={<Star className="h-5 w-5" />}
          />
          <KpiCard
            title="Neue Aufträge"
            value={stats.newJobBoardListings}
            subtitle="im Job-Board"
            icon={<Briefcase className="h-5 w-5" />}
            highlight={stats.newJobBoardListings > 10}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Requests Table */}
            <BookingRequestsTable requests={mockProviderBookingRequests} />

            {/* Job Board Table */}
            <JobBoardTable listings={mockJobBoardListings} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Onboarding Checklist */}
            <OnboardingChecklist tasks={mockOnboardingTasks} />

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
