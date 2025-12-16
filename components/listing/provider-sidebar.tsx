"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VerificationBadge } from "@/components/baucrew/verification-badge"
import { Star, Clock, ShieldCheck, Headphones } from "lucide-react"
import type { ListingDetail } from "@/lib/types"

interface ProviderSidebarProps {
  listing: ListingDetail
}

export function ProviderSidebar({ listing }: ProviderSidebarProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-4">
      {/* Provider mini card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={listing.providerAvatar || "/placeholder.svg"} alt={listing.providerName} />
              <AvatarFallback>
                {listing.providerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{listing.providerName}</h3>
                {listing.verified && <VerificationBadge />}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{listing.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({listing.reviewCount} Bewertungen)</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Antwortet {listing.responseTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price box */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Preis ab</p>
            <p className="text-2xl font-bold">
              {formatPrice(listing.priceFrom)}{" "}
              <span className="text-base font-normal text-muted-foreground">/ {listing.priceUnit}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
              Termin anfragen
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
              <Link href="/app/requests/new">Stattdessen Auftrag einstellen</Link>
            </Button>
          </div>

          {/* Trust microcopy */}
          <div className="mt-4 pt-4 border-t flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span>Sichere Zahlung</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Headphones className="h-4 w-4 text-secondary" />
              <span>Support bei Problemen</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
