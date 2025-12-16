"use client"

import { Star, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerificationBadge } from "@/components/baucrew/verification-badge"
import type { ServiceListing } from "@/lib/types"

interface ListingSummaryCardProps {
  listing: ServiceListing
}

export function ListingSummaryCard({ listing }: ListingSummaryCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={listing.imageUrl || "/placeholder.svg"}
              alt={listing.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {listing.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{listing.title}</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
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
                  <span className="text-sm font-medium truncate">{listing.providerName}</span>
                  {listing.verified && <VerificationBadge />}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="font-medium text-foreground">{listing.rating.toFixed(1)}</span>
                    <span>({listing.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{listing.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
