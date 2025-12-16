"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, X } from "lucide-react"

export interface JobBoardFilters {
  city: string
  category: string
  budgetMin: string
  budgetMax: string
  timeframe: string
  openOnly: boolean
}

interface JobBoardFiltersProps {
  filters: JobBoardFilters
  onFiltersChange: (filters: JobBoardFilters) => void
  onReset: () => void
}

const cities = [
  { value: "all", label: "Alle Städte" },
  { value: "berlin", label: "Berlin" },
  { value: "hamburg", label: "Hamburg" },
  { value: "muenchen", label: "München" },
  { value: "koeln", label: "Köln" },
  { value: "frankfurt", label: "Frankfurt" },
]

const categories = [
  { value: "all", label: "Alle Kategorien" },
  { value: "Sanitär", label: "Sanitär" },
  { value: "Elektrik", label: "Elektrik" },
  { value: "Maler", label: "Maler" },
  { value: "Trockenbau", label: "Trockenbau" },
  { value: "Fliesen", label: "Fliesen" },
  { value: "Heizung", label: "Heizung" },
  { value: "Boden", label: "Boden" },
  { value: "Möbelmontage", label: "Möbelmontage" },
  { value: "Fenster & Türen", label: "Fenster & Türen" },
  { value: "Garten & Außen", label: "Garten & Außen" },
]

const timeframes = [
  { value: "all", label: "Alle Zeiträume" },
  { value: "asap", label: "ASAP / Dringend" },
  { value: "7_days", label: "Innerhalb 7 Tage" },
  { value: "custom", label: "Wunschtermin" },
]

function FilterContent({ filters, onFiltersChange, onReset }: JobBoardFiltersProps) {
  const hasActiveFilters =
    filters.city !== "all" ||
    filters.category !== "all" ||
    filters.budgetMin !== "" ||
    filters.budgetMax !== "" ||
    filters.timeframe !== "all" ||
    !filters.openOnly

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Stadt</Label>
        <Select value={filters.city} onValueChange={(value) => onFiltersChange({ ...filters, city: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Stadt wählen" />
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
        <Label>Kategorie</Label>
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Kategorie wählen" />
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
        <Label>Budget (EUR)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.budgetMin}
            onChange={(e) => onFiltersChange({ ...filters, budgetMin: e.target.value })}
            className="flex-1"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.budgetMax}
            onChange={(e) => onFiltersChange({ ...filters, budgetMax: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Zeitraum</Label>
        <Select value={filters.timeframe} onValueChange={(value) => onFiltersChange({ ...filters, timeframe: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Zeitraum wählen" />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((tf) => (
              <SelectItem key={tf.value} value={tf.value}>
                {tf.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="open-only" className="cursor-pointer">
          Nur offene Aufträge
        </Label>
        <Switch
          id="open-only"
          checked={filters.openOnly}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, openOnly: checked })}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full bg-transparent" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Filter zurücksetzen
        </Button>
      )}
    </div>
  )
}

export function JobBoardFiltersDesktop(props: JobBoardFiltersProps) {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 space-y-6 rounded-lg border bg-card p-6">
        <h2 className="font-semibold">Filter</h2>
        <FilterContent {...props} />
      </div>
    </aside>
  )
}

export function JobBoardFiltersMobile(props: JobBoardFiltersProps) {
  const [open, setOpen] = useState(false)

  const activeFilterCount = [
    props.filters.city !== "all",
    props.filters.category !== "all",
    props.filters.budgetMin !== "" || props.filters.budgetMax !== "",
    props.filters.timeframe !== "all",
    !props.filters.openOnly,
  ].filter(Boolean).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden gap-2 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterContent {...props} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
