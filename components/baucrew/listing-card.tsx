"use client"

import { Star, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerificationBadge } from "./verification-badge"
import type { ServiceListing } from "@/lib/types"

interface ListingCardProps {
  listing: ServiceListing
  onClick?: () => void
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={listing.imageUrl || "/placeholder.svg"}
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-card/95 backdrop-blur-sm text-card-foreground">
            {listing.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={listing.providerAvatar || "/placeholder.svg"} alt={listing.providerName} />
            <AvatarFallback>
              {listing.providerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{listing.providerName}</h3>
              {listing.verified && <VerificationBadge />}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">{listing.rating.toFixed(1)}</span>
                <span>({listing.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{listing.completedJobs} Jobs</span>
              </div>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{listing.title}</h4>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{listing.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{listing.priceFrom.toLocaleString("de-DE")} €</div>
            <div className="text-xs text-muted-foreground">pro {listing.priceUnit}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span>{listing.responseTime}</span>
            </div>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              Anfragen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
