"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { VerificationBadge } from "@/components/baucrew/verification-badge"
import { Calendar, MapPin, Star } from "lucide-react"

interface BookingSummaryCardProps {
  listing: {
    title: string
    category: string
    providerName: string
    providerAvatar: string
    verified: boolean
    rating: number
    reviewCount: number
  }
  booking: {
    date: string
    time: string
    address: string
  }
}

export function BookingSummaryCard({ listing, booking }: BookingSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Buchungsübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={listing.providerAvatar || "/placeholder.svg"} alt={listing.providerName} />
            <AvatarFallback>
              {listing.providerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{listing.providerName}</span>
              {listing.verified && <VerificationBadge size="sm" />}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{listing.rating.toFixed(1)}</span>
              <span className="text-muted-foreground/60">({listing.reviewCount} Bewertungen)</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-medium">{listing.title}</h4>
          <Badge variant="secondary" className="text-xs">
            {listing.category}
          </Badge>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.date} um {booking.time}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{booking.address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
