"use client"

import { useState, useEffect, useCallback } from "react"
import { AppShell } from "@/components/baucrew/app-shell"
import { ListingCard } from "@/components/baucrew/listing-card"
import { LoadingSkeletonGrid } from "@/components/baucrew/loading-skeleton-grid"
import { SearchFilters, type FilterState, categories } from "@/components/search/search-filters"
import { SearchEmptyState } from "@/components/search/search-empty-state"
import { mockSearchListings } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, Search } from "lucide-react"
import type { ServiceListing } from "@/lib/types"

const defaultFilters: FilterState = {
  city: "all",
  category: "all",
  keyword: "",
  verifiedOnly: false,
  sort: "rating",
}

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<ServiceListing[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Simulate search with filtering logic
  const performSearch = useCallback((currentFilters: FilterState) => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      let filtered = [...mockSearchListings]

      // Filter by category
      if (currentFilters.category !== "all") {
        const categoryLabel = categories.find((c) => c.value === currentFilters.category)?.label
        if (categoryLabel) {
          filtered = filtered.filter((l) => l.category.toLowerCase() === categoryLabel.toLowerCase())
        }
      }

      // Filter by verified only
      if (currentFilters.verifiedOnly) {
        filtered = filtered.filter((l) => l.verified)
      }

      // Filter by keyword
      if (currentFilters.keyword.trim()) {
        const kw = currentFilters.keyword.toLowerCase()
        filtered = filtered.filter(
          (l) =>
            l.title.toLowerCase().includes(kw) ||
            l.description.toLowerCase().includes(kw) ||
            l.providerName.toLowerCase().includes(kw),
        )
      }

      // Sort results
      switch (currentFilters.sort) {
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case "price_low":
          filtered.sort((a, b) => a.priceFrom - b.priceFrom)
          break
        case "newest":
          filtered.sort((a, b) => Number(b.id) - Number(a.id))
          break
      }

      setResults(filtered)
      setIsLoading(false)
    }, 800)
  }, [])

  // Initial load
  useEffect(() => {
    performSearch(filters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    performSearch(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    performSearch(defaultFilters)
  }

  const activeFilterCount = [
    filters.city !== "all",
    filters.category !== "all",
    filters.keyword !== "",
    filters.verifiedOnly,
    filters.sort !== "rating",
  ].filter(Boolean).length

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Handwerker suchen</h1>
              <p className="text-muted-foreground">
                {isLoading
                  ? "Suche läuft..."
                  : `${results.length} Ergebnis${results.length !== 1 ? "se" : ""} gefunden`}
              </p>
            </div>

            {/* Mobile filter trigger */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-6">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isMobile
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main content layout */}
        <div className="flex gap-8">
          {/* Desktop filters sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-lg border bg-card p-5">
              <div className="flex items-center gap-2 mb-6">
                <Search className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Filter</h2>
              </div>
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Results area */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <LoadingSkeletonGrid count={9} variant="listing" />
            ) : results.length === 0 ? (
              <SearchEmptyState city={filters.city} category={filters.category} onClearFilters={handleClearFilters} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => {
                      // Navigate to listing detail
                    }}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </AppShell>
  )
}
