"use client"

import { useState, useMemo } from "react"
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay } from "date-fns"
import { de } from "date-fns/locale"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { BookingDetailDrawer } from "@/components/admin/booking-detail-drawer"
import { adminBookingsData } from "@/lib/admin-data"
import { useToast } from "@/hooks/use-toast"
import { Search, CalendarIcon, FileText, X } from "lucide-react"
import type { AdminBookingDetail, AdminBookingStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

type DateRange = "7d" | "30d" | "custom"

const statusFilterOptions: { value: AdminBookingStatus | "all"; label: string }[] = [
  { value: "all", label: "Alle Status" },
  { value: "requested", label: "Angefragt" },
  { value: "needs_payment", label: "Zahlung offen" },
  { value: "paid", label: "Bezahlt" },
  { value: "scheduled", label: "Geplant" },
  { value: "in_progress", label: "In Arbeit" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "cancelled", label: "Storniert" },
  { value: "disputed", label: "Streitfall" },
]

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingDetail[]>(adminBookingsData)
  const [statusFilter, setStatusFilter] = useState<AdminBookingStatus | "all">("all")
  const [dateRange, setDateRange] = useState<DateRange>("30d")
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>()
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const filteredBookings = useMemo(() => {
    let filtered = bookings

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter)
    }

    // Date range filter
    const now = new Date()
    if (dateRange === "7d") {
      const from = startOfDay(subDays(now, 7))
      filtered = filtered.filter((b) => isAfter(b.createdAt, from))
    } else if (dateRange === "30d") {
      const from = startOfDay(subDays(now, 30))
      filtered = filtered.filter((b) => isAfter(b.createdAt, from))
    } else if (dateRange === "custom" && customDateFrom) {
      filtered = filtered.filter((b) => isAfter(b.createdAt, startOfDay(customDateFrom)))
      if (customDateTo) {
        filtered = filtered.filter((b) => isBefore(b.createdAt, endOfDay(customDateTo)))
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.jobTitle.toLowerCase().includes(query) ||
          b.customer.name.toLowerCase().includes(query) ||
          b.provider.name.toLowerCase().includes(query) ||
          b.address.plz.includes(query),
      )
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [bookings, statusFilter, dateRange, customDateFrom, customDateTo, searchQuery])

  const handleRowClick = (booking: AdminBookingDetail) => {
    setSelectedBooking(booking)
    setDrawerOpen(true)
  }

  const handleStatusChange = (id: string, newStatus: AdminBookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
    setSelectedBooking((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev))
    toast({
      title: "Status aktualisiert",
      description: `Der Buchungsstatus wurde erfolgreich geändert.`,
    })
  }

  const handleOpenDispute = (id: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "disputed" as AdminBookingStatus, adminNotes: reason } : b)),
    )
    setSelectedBooking((prev) =>
      prev?.id === id ? { ...prev, status: "disputed" as AdminBookingStatus, adminNotes: reason } : prev,
    )
    toast({
      title: "Dispute eröffnet",
      description: `Ein Streitfall wurde für diese Buchung erstellt.`,
      variant: "destructive",
    })
    setDrawerOpen(false)
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setDateRange("30d")
    setCustomDateFrom(undefined)
    setCustomDateTo(undefined)
    setSearchQuery("")
  }

  const hasActiveFilters = statusFilter !== "all" || dateRange !== "30d" || searchQuery.trim()

  return (
    <AppShell userRole="admin" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Buchungen</h1>
              <p className="text-muted-foreground">Verwalten Sie alle Buchungen auf der Plattform</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredBookings.length} von {bookings.length} Buchungen
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Zeitraum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                    <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                    <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom Date Range */}
                {dateRange === "custom" && (
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-32 justify-start text-left font-normal",
                            !customDateFrom && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateFrom ? format(customDateFrom, "dd.MM.yy") : "Von"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={customDateFrom} onSelect={setCustomDateFrom} locale={de} />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-32 justify-start text-left font-normal",
                            !customDateTo && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateTo ? format(customDateTo, "dd.MM.yy") : "Bis"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={customDateTo} onSelect={setCustomDateTo} locale={de} />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buchungs-ID, Anbieter, Kunde, PLZ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buchung</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Anbieter</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Betrag</TableHead>
                      <TableHead>Erstellt</TableHead>
                      <TableHead className="text-right">Aktion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-16 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-48">
                          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <FileText className="h-12 w-12 opacity-30" />
                            <div className="text-center">
                              <p className="font-medium">Keine Buchungen gefunden</p>
                              <p className="text-sm">Versuchen Sie, die Filter anzupassen</p>
                            </div>
                            {hasActiveFilters && (
                              <Button variant="outline" size="sm" onClick={clearFilters}>
                                Filter zurücksetzen
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(booking)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.jobTitle}</p>
                              <p className="text-xs text-muted-foreground">{booking.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{booking.customer.name}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{booking.provider.name}</p>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={booking.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <p className="font-medium">{booking.total.toFixed(2)} €</p>
                              <p className="text-xs text-muted-foreground">
                                Gebühr: {booking.platformFee.toFixed(2)} €
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(booking.createdAt, "dd.MM.yyyy", { locale: de })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowClick(booking)
                              }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingDetailDrawer
        booking={selectedBooking}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
        onOpenDispute={handleOpenDispute}
      />
    </AppShell>
  )
}
