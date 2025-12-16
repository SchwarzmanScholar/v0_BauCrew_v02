"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Briefcase, Calendar, Filter, Search, Plus, ChevronDown } from "lucide-react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { ProviderJobRow } from "@/components/provider/provider-job-row"
import { mockProviderJobs } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import type { ProviderJobStatus, ProviderJob } from "@/lib/types"

type TabValue = "all" | ProviderJobStatus

const tabConfig: { value: TabValue; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "requested", label: "Anfragen" },
  { value: "payment_pending", label: "Zahlung offen" },
  { value: "scheduled", label: "Geplant" },
  { value: "in_progress", label: "In Arbeit" },
  { value: "completed", label: "Abgeschlossen" },
]

const cityOptions = [
  { value: "all", label: "Alle Städte" },
  { value: "Berlin", label: "Berlin" },
  { value: "Hamburg", label: "Hamburg" },
  { value: "München", label: "München" },
  { value: "Köln", label: "Köln" },
]

export default function ProviderJobsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [jobs, setJobs] = useState<ProviderJob[]>(mockProviderJobs)
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filtered jobs based on tab, search, city, and date range
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tab filter
      if (activeTab !== "all" && job.status !== activeTab) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          job.jobTitle.toLowerCase().includes(query) ||
          job.customerName.toLowerCase().includes(query) ||
          job.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // City filter
      if (cityFilter !== "all" && job.city !== cityFilter) return false

      // Date range filter
      if (dateFrom && job.requestedDate < dateFrom) return false
      if (dateTo && job.requestedDate > dateTo) return false

      return true
    })
  }, [jobs, activeTab, searchQuery, cityFilter, dateFrom, dateTo])

  // Count jobs per tab
  const getTabCount = (tabValue: TabValue) => {
    if (tabValue === "all") return jobs.length
    return jobs.filter((j) => j.status === tabValue).length
  }

  // Handle accept job
  const handleAccept = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: "scheduled" as ProviderJobStatus } : job)),
    )
    toast({
      title: "Auftrag angenommen",
      description: "Der Kunde wird über deine Zusage informiert.",
    })
  }

  // Handle decline job
  const handleDecline = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId))
    toast({
      title: "Auftrag abgelehnt",
      description: "Der Auftrag wurde aus deiner Liste entfernt.",
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setCityFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const hasActiveFilters = searchQuery || cityFilter !== "all" || dateFrom || dateTo

  // Filter controls component (reused for desktop and mobile)
  const FilterControls = () => (
    <div className="space-y-4">
      {/* City filter */}
      <div className="space-y-2">
        <Label>Stadt</Label>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Alle Städte" />
          </SelectTrigger>
          <SelectContent>
            {cityOptions.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date from */}
      <div className="space-y-2">
        <Label>Von Datum</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "dd.MM.yyyy", { locale: de }) : "Startdatum wählen"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date to */}
      <div className="space-y-2">
        <Label>Bis Datum</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "dd.MM.yyyy", { locale: de }) : "Enddatum wählen"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          Filter zurücksetzen
        </Button>
      )}
    </div>
  )

  // Check if user has any jobs
  const hasAnyJobs = jobs.length > 0

  return (
    <AppShell userRole="provider" userName="Thomas Weber">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meine Aufträge</h1>
            <p className="text-muted-foreground text-sm mt-1">Verwalte deine Buchungen und Kundenanfragen</p>
          </div>
          <Button asChild className="bg-secondary hover:bg-secondary/90">
            <Link href="/provider/job-board">
              <Plus className="h-4 w-4 mr-2" />
              Neuen Auftrag finden
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Auftrag, Kunde oder Kategorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-3">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Stadt" />
              </SelectTrigger>
              <SelectContent>
                {cityOptions.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  {dateFrom || dateTo ? "Zeitraum gewählt" : "Zeitraum"}
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
                  {(dateFrom || dateTo) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setDateFrom(undefined)
                        setDateTo(undefined)
                      }}
                    >
                      Zeitraum löschen
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Filter löschen
              </Button>
            )}
          </div>

          {/* Mobile filter button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <span className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    aktiv
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {!hasAnyJobs ? (
          // Empty state - no jobs at all
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Briefcase className="h-14 w-14 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Noch keine Aufträge</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Durchsuche das Job-Board, um passende Aufträge zu finden, oder warte auf direkte Buchungsanfragen von
              Kunden.
            </p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link href="/provider/job-board">
                <Search className="h-4 w-4 mr-2" />
                Job-Board durchsuchen
              </Link>
            </Button>
          </div>
        ) : (
          // Tabs with jobs
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
            <TabsList className="flex w-full overflow-x-auto lg:inline-flex lg:w-auto">
              {tabConfig.map((tab) => {
                const count = getTabCount(tab.value)
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-2 whitespace-nowrap">
                    {tab.label}
                    {count > 0 && <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{count}</span>}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {tabConfig.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {filteredJobs.length === 0 ? (
                  // Tab-specific empty state
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="rounded-full bg-muted p-5 mb-4">
                      <Briefcase className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {hasActiveFilters
                        ? "Keine Ergebnisse gefunden"
                        : `Keine ${tab.value === "all" ? "" : tab.label.toLowerCase() + "en"} Aufträge`}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      {hasActiveFilters
                        ? "Versuche andere Filtereinstellungen oder setze die Filter zurück."
                        : tab.value === "requested"
                          ? "Neue Kundenanfragen erscheinen hier."
                          : tab.value === "payment_pending"
                            ? "Aufträge mit offener Kundenzahlung werden hier angezeigt."
                            : tab.value === "scheduled"
                              ? "Bestätigte Termine erscheinen hier."
                              : tab.value === "in_progress"
                                ? "Laufende Arbeiten werden hier angezeigt."
                                : "Abgeschlossene Aufträge werden hier archiviert."}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        Filter zurücksetzen
                      </Button>
                    )}
                  </div>
                ) : (
                  // Jobs table
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Kunde</TableHead>
                            <TableHead className="w-[220px]">Auftrag</TableHead>
                            <TableHead className="w-[140px]">Termin</TableHead>
                            <TableHead className="w-[100px]">Betrag</TableHead>
                            <TableHead className="w-[130px]">Status</TableHead>
                            <TableHead className="w-[120px] text-right">Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.map((job) => (
                            <ProviderJobRow key={job.id} job={job} onAccept={handleAccept} onDecline={handleDecline} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Results count */}
        {hasAnyJobs && filteredJobs.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {filteredJobs.length} {filteredJobs.length === 1 ? "Auftrag" : "Aufträge"} gefunden
          </div>
        )}
      </div>
    </AppShell>
  )
}
