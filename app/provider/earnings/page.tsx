"use client"

import { useState } from "react"
import { Info, Download, Calendar, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { AppShell } from "@/components/baucrew/app-shell"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { EarningsKpiCards } from "@/components/provider/earnings-kpi-cards"
import { TransactionsTable } from "@/components/provider/transactions-table"
import { mockEarningsSummary, mockTransactions } from "@/lib/earnings-data"

type FilterPeriod = "30_days" | "90_days" | "this_year" | "custom"
type PayoutFilter = "all" | "pending" | "processing" | "paid"

export default function ProviderEarningsPage() {
  const [period, setPeriod] = useState<FilterPeriod>("30_days")
  const [payoutFilter, setPayoutFilter] = useState<PayoutFilter>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((txn) => {
    // Payout status filter
    if (payoutFilter !== "all" && txn.payoutStatus !== payoutFilter) {
      return false
    }

    // Date range filter (for custom period)
    if (period === "custom") {
      if (dateFrom && txn.date < dateFrom) return false
      if (dateTo && txn.date > dateTo) return false
    }

    return true
  })

  // Calculate totals for filtered transactions
  const filteredTotals = filteredTransactions.reduce(
    (acc, txn) => ({
      gross: acc.gross + txn.grossAmount,
      fees: acc.fees + txn.fee,
      net: acc.net + txn.netAmount,
    }),
    { gross: 0, fees: 0, net: 0 },
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <AppShell userRole="provider" userName="Thomas Weber">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Einnahmen</h1>
            <p className="text-muted-foreground text-sm mt-1">Übersicht deiner Umsätze und Auszahlungen</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export (CSV)
          </Button>
        </div>

        {/* Info Banner */}
        <Alert className="mb-6 border-secondary/30 bg-secondary/5">
          <Info className="h-4 w-4 text-secondary" />
          <AlertDescription className="text-sm">
            Auszahlungen erfolgen wöchentlich (MVP: manuell). Bei Fragen wende dich an unseren Support.
          </AlertDescription>
        </Alert>

        {/* KPI Cards */}
        <div className="mb-8">
          <EarningsKpiCards summary={mockEarningsSummary} />
        </div>

        {/* Transactions Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-lg">Transaktionen</CardTitle>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Period filter */}
                <Select value={period} onValueChange={(v) => setPeriod(v as FilterPeriod)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Zeitraum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30_days">30 Tage</SelectItem>
                    <SelectItem value="90_days">90 Tage</SelectItem>
                    <SelectItem value="this_year">Dieses Jahr</SelectItem>
                    <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom date range */}
                {period === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Calendar className="h-4 w-4" />
                        {dateFrom && dateTo
                          ? `${format(dateFrom, "dd.MM.", { locale: de })} - ${format(dateTo, "dd.MM.", { locale: de })}`
                          : "Zeitraum wählen"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Von</Label>
                          <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Bis</Label>
                          <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Payout status filter */}
                <Select value={payoutFilter} onValueChange={(v) => setPayoutFilter(v as PayoutFilter)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Auszahlungsstatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="processing">In Bearbeitung</SelectItem>
                    <SelectItem value="paid">Ausgezahlt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Transactions Table */}
            <TransactionsTable transactions={filteredTransactions} />

            {/* Totals Summary */}
            {filteredTransactions.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredTransactions.length} {filteredTransactions.length === 1 ? "Transaktion" : "Transaktionen"}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Brutto: </span>
                      <span className="font-medium">{formatCurrency(filteredTotals.gross)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gebühren: </span>
                      <span className="font-medium text-muted-foreground">-{formatCurrency(filteredTotals.fees)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Netto: </span>
                      <span className="font-semibold text-success-foreground">
                        {formatCurrency(filteredTotals.net)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
