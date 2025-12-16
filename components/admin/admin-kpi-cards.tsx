"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Package, FileText, Calendar, Euro, TrendingUp } from "lucide-react"
import type { AdminStats } from "@/lib/types"

interface AdminKpiCardsProps {
  stats: AdminStats
}

export function AdminKpiCards({ stats }: AdminKpiCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("de-DE").format(num)
  }

  const kpis = [
    {
      title: "Users",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Providers",
      value: formatNumber(stats.totalProviders),
      icon: UserCheck,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Listings",
      value: formatNumber(stats.totalListings),
      icon: Package,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Job Requests",
      value: formatNumber(stats.totalJobRequests),
      icon: FileText,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "Bookings",
      value: formatNumber(stats.totalBookings),
      icon: Calendar,
      color: "bg-cyan-500/10 text-cyan-600",
    },
    {
      title: "Paid GMV",
      value: formatCurrency(stats.paidGmv),
      icon: Euro,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Platform Revenue",
      value: formatCurrency(stats.platformRevenue),
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      highlight: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card
            key={kpi.title}
            className={`transition-shadow hover:shadow-md ${kpi.highlight ? "ring-2 ring-primary/20" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className={`rounded-lg p-2 w-fit ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.title}</p>
                  <p className="text-lg font-bold">{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
