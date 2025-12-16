"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchX, Clock } from "lucide-react"
import Link from "next/link"

interface SearchEmptyStateProps {
  city: string
  category: string
  onClearFilters: () => void
}

const popularCategories = [
  { label: "Elektriker", value: "elektrik" },
  { label: "Maler", value: "maler" },
  { label: "Sanitär", value: "sanitaer" },
]

export function SearchEmptyState({ city, category, onClearFilters }: SearchEmptyStateProps) {
  // Build prefilled hints for the job request form
  const cityLabel = city !== "all" ? city.charAt(0).toUpperCase() + city.slice(1) : ""
  const categoryLabel = category !== "all" ? category.charAt(0).toUpperCase() + category.slice(1) : ""

  const hints: string[] = []
  if (cityLabel) hints.push(`Stadt: ${cityLabel}`)
  if (categoryLabel) hints.push(`Kategorie: ${categoryLabel}`)
  const hintText = hints.length > 0 ? ` (Vorausgefüllt: ${hints.join(", ")})` : ""

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold mb-2">Keine passenden Handwerker gefunden.</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Stelle deinen Auftrag ein und lass Handwerker auf dich zukommen.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/app/requests/new">Arbeitsauftrag einstellen</Link>
        </Button>
        <Button variant="outline" onClick={onClearFilters}>
          Filter ändern
        </Button>
      </div>

      {hintText && <p className="text-sm text-muted-foreground mb-6">{hintText}</p>}

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Clock className="h-4 w-4" />
        <span>Du erhältst Antworten typischerweise innerhalb weniger Stunden.</span>
      </div>

      <div className="border-t pt-6 w-full max-w-md">
        <p className="text-sm font-medium mb-3">Alternative: Beliebte Kategorien</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularCategories.map((cat) => (
            <Badge
              key={cat.value}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors px-4 py-1.5"
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
