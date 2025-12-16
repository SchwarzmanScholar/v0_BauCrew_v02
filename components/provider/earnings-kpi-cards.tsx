"use client"

import { Euro, TrendingUp, Wallet, Clock } from "lucide-react"
import { KpiCard } from "@/components/provider/kpi-card"
import type { EarningsSummary } from "@/lib/types"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface EarningsKpiCardsProps {
  summary: EarningsSummary
}

export function EarningsKpiCards({ summary }: EarningsKpiCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Umsatz (30 Tage)"
        value={formatCurrency(summary.grossRevenue30Days)}
        icon={<Euro className="h-5 w-5" />}
        subtitle="Bruttoumsatz"
      />
      <KpiCard
        title="Gebühren (12%)"
        value={formatCurrency(summary.totalFees30Days)}
        icon={<TrendingUp className="h-5 w-5" />}
        subtitle="Plattformgebühren"
      />
      <KpiCard
        title="Netto (30 Tage)"
        value={formatCurrency(summary.netRevenue30Days)}
        icon={<Wallet className="h-5 w-5" />}
        subtitle="Nach Abzug der Gebühren"
        highlight
      />
      <KpiCard
        title="Auszahlungsstatus"
        value={formatCurrency(summary.pendingPayout)}
        icon={<Clock className="h-5 w-5" />}
        subtitle={
          summary.lastPayoutDate
            ? `Letzte Auszahlung: ${format(summary.lastPayoutDate, "dd.MM.yyyy", { locale: de })}`
            : "Noch keine Auszahlung"
        }
      />
    </div>
  )
}
