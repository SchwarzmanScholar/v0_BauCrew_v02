"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/baucrew/app-shell"
import { LoadingSkeletonGrid } from "@/components/baucrew/loading-skeleton-grid"
import { EmptyState } from "@/components/baucrew/empty-state"
import {
  JobBoardFiltersDesktop,
  JobBoardFiltersMobile,
  type JobBoardFilters,
} from "@/components/provider/job-board-filters"
import { JobBoardCard } from "@/components/provider/job-board-card"
import { mockJobBoardItems } from "@/lib/mock-data"
import { Lightbulb, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const defaultFilters: JobBoardFilters = {
  city: "all",
  category: "all",
  budgetMin: "",
  budgetMax: "",
  timeframe: "all",
  openOnly: true,
}

export default function ProviderJobBoardPage() {
  const searchParams = useSearchParams()
  const showEmpty = searchParams.get("empty") === "true"
  const showLoading = searchParams.get("loading") === "true"

  const [filters, setFilters] = useState<JobBoardFilters>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = useMemo(() => {
    if (showEmpty) return []

    return mockJobBoardItems.filter((item) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // City filter
      if (filters.city !== "all") {
        const cityMap: Record<string, string[]> = {
          berlin: ["berlin"],
          hamburg: ["hamburg"],
          muenchen: ["münchen", "munich"],
          koeln: ["köln", "koln"],
          frankfurt: ["frankfurt"],
        }
        const cityVariants = cityMap[filters.city] || []
        const matchesCity = cityVariants.some((variant) => item.location.toLowerCase().includes(variant))
        if (!matchesCity) return false
      }

      // Category filter
      if (filters.category !== "all" && item.category !== filters.category) {
        return false
      }

      // Budget filter
      if (filters.budgetMin) {
        const min = Number.parseFloat(filters.budgetMin)
        if (item.budget === null || item.budget < min) return false
      }
      if (filters.budgetMax) {
        const max = Number.parseFloat(filters.budgetMax)
        if (item.budget === null || item.budget > max) return false
      }

      // Timeframe filter
      if (filters.timeframe !== "all" && item.timeframe !== filters.timeframe) {
        return false
      }

      // Open only filter
      if (filters.openOnly && item.status !== "open") {
        return false
      }

      return true
    })
  }, [filters, searchQuery, showEmpty])

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setSearchQuery("")
  }

  const hasActiveFilters =
    filters.city !== "all" ||
    filters.category !== "all" ||
    filters.budgetMin !== "" ||
    filters.budgetMax !== "" ||
    filters.timeframe !== "all" ||
    !filters.openOnly ||
    searchQuery !== ""

  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Job-Board</h1>
          <p className="text-muted-foreground">Finde passende Kundenaufträge in deiner Nähe</p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-secondary/50 bg-secondary/10 p-4">
          <Lightbulb className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm">
            <span className="font-medium">Tipp:</span> Antworte schnell, um höhere Zuschlagschancen zu haben.
          </p>
        </div>

        {/* Search and Mobile Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Titel, Beschreibung, Kategorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <JobBoardFiltersMobile filters={filters} onFiltersChange={setFilters} onReset={handleResetFilters} />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <JobBoardFiltersDesktop filters={filters} onFiltersChange={setFilters} onReset={handleResetFilters} />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {showLoading ? (
              <LoadingSkeletonGrid count={6} variant="job" />
            ) : filteredItems.length === 0 ? (
              <div className="rounded-lg border bg-card">
                <EmptyState
                  icon={Search}
                  title="Keine passenden Aufträge"
                  description={
                    hasActiveFilters
                      ? "Versuche andere Filtereinstellungen, um mehr Aufträge zu finden."
                      : "Aktuell sind keine offenen Aufträge verfügbar. Schau später wieder vorbei."
                  }
                  actionLabel={hasActiveFilters ? "Filter zurücksetzen" : undefined}
                  onAction={hasActiveFilters ? handleResetFilters : undefined}
                />
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                  {filteredItems.length} {filteredItems.length === 1 ? "Auftrag" : "Aufträge"} gefunden
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <JobBoardCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
