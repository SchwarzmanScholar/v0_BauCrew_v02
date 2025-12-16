"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export interface FilterState {
  city: string
  category: string
  keyword: string
  verifiedOnly: boolean
  sort: string
}

interface SearchFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearFilters: () => void
  isMobile?: boolean
  onClose?: () => void
}

const cities = [
  { value: "all", label: "Alle Städte" },
  { value: "berlin", label: "Berlin" },
  { value: "hamburg", label: "Hamburg" },
  { value: "munich", label: "München" },
  { value: "cologne", label: "Köln" },
  { value: "frankfurt", label: "Frankfurt" },
  { value: "stuttgart", label: "Stuttgart" },
  { value: "dusseldorf", label: "Düsseldorf" },
]

const categories = [
  { value: "all", label: "Alle Kategorien" },
  { value: "handwerker", label: "Handwerker" },
  { value: "maler", label: "Maler" },
  { value: "elektrik", label: "Elektriker" },
  { value: "sanitaer", label: "Sanitär" },
  { value: "trockenbau", label: "Trockenbau" },
  { value: "fliesen", label: "Fliesen" },
]

const sortOptions = [
  { value: "rating", label: "Best bewertet" },
  { value: "price_low", label: "Preis: niedrig" },
  { value: "newest", label: "Neu" },
]

export function SearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  onClose,
}: SearchFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.city !== "all" ||
    filters.category !== "all" ||
    filters.keyword !== "" ||
    filters.verifiedOnly ||
    filters.sort !== "rating"

  return (
    <div className="flex flex-col gap-6">
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Filter</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Schließen</span>
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="city-select">Stadt</Label>
        <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
          <SelectTrigger id="city-select">
            <SelectValue placeholder="Stadt auswählen" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-select">Kategorie</Label>
        <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
          <SelectTrigger id="category-select">
            <SelectValue placeholder="Kategorie auswählen" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyword-input">Suchbegriff</Label>
        <Input
          id="keyword-input"
          placeholder="z.B. Bad renovieren"
          value={filters.keyword}
          onChange={(e) => updateFilter("keyword", e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="verified-toggle" className="cursor-pointer">
          Nur verifizierte Anbieter
        </Label>
        <Switch
          id="verified-toggle"
          checked={filters.verifiedOnly}
          onCheckedChange={(v) => updateFilter("verifiedOnly", v)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort-select">Sortieren nach</Label>
        <Select value={filters.sort} onValueChange={(v) => updateFilter("sort", v)}>
          <SelectTrigger id="sort-select">
            <SelectValue placeholder="Sortierung" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full bg-transparent">
          Filter zurücksetzen
        </Button>
      )}

      {isMobile && (
        <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
          Ergebnisse anzeigen
        </Button>
      )}
    </div>
  )
}

export { cities, categories }
