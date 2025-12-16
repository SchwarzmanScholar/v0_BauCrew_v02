"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Pencil, Eye, Calendar } from "lucide-react"
import type { ProviderListing } from "@/lib/types"

interface ProviderListingCardProps {
  listing: ProviderListing
  onToggleActive?: (id: string, isActive: boolean) => void
}

export function ProviderListingCard({ listing, onToggleActive }: ProviderListingCardProps) {
  const [isActive, setIsActive] = useState(listing.isActive)
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true)
    setIsActive(checked)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    onToggleActive?.(listing.id, checked)
    setIsToggling(false)
  }

  return (
    <Card className={`overflow-hidden transition-opacity ${!isActive ? "opacity-70" : ""}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0">
          <img
            src={listing.imageUrl || "/placeholder.svg"}
            alt={listing.title}
            className="object-cover w-full h-full"
          />
          {!isActive && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                Inaktiv
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{listing.title}</h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {listing.category}
                </Badge>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:inline">{isActive ? "Aktiv" : "Inaktiv"}</span>
                <Switch
                  checked={isActive}
                  onCheckedChange={handleToggle}
                  disabled={isToggling}
                  aria-label="Leistung aktivieren/deaktivieren"
                />
              </div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <span className="text-lg font-bold text-primary">{listing.price.toLocaleString("de-DE")} €</span>
              <span className="text-sm text-muted-foreground ml-1">/ {listing.priceUnit}</span>
            </div>

            {/* Stats & actions row */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t">
              {/* Bookings count */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{listing.bookingsCount} Buchungen</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/provider/listings/${listing.id}`}>
                    <Eye className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Ansehen</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/provider/listings/${listing.id}/edit`}>
                    <Pencil className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
