"use client"

import { Star, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerificationBadge } from "@/components/baucrew/verification-badge"
import { cn } from "@/lib/utils"
import type { Offer } from "@/lib/types"

interface OfferListCardProps {
  offer: Offer
  isSelected: boolean
  onSelect: () => void
  onAccept: () => void
  onMessage: () => void
}

export function OfferListCard({ offer, isSelected, onSelect, onAccept, onMessage }: OfferListCardProps) {
  const hoursAgo = Math.floor((Date.now() - offer.createdAt.getTime()) / (1000 * 60 * 60))
  const timeAgo =
    hoursAgo < 1
      ? "vor wenigen Minuten"
      : hoursAgo < 24
        ? `vor ${hoursAgo} ${hoursAgo === 1 ? "Stunde" : "Stunden"}`
        : `vor ${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? "Tag" : "Tagen"}`

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all",
        isSelected ? "ring-2 ring-secondary border-secondary" : "hover:border-muted-foreground/30",
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={offer.providerAvatar || "/placeholder.svg"} alt={offer.providerName} />
            <AvatarFallback>
              {offer.providerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{offer.providerName}</h3>
              {offer.verified && <VerificationBadge />}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-medium text-foreground">{offer.providerRating.toFixed(1)}</span>
                <span>({offer.providerReviewCount})</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-primary">{offer.price.toLocaleString("de-DE")} €</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Dauer: {offer.estimatedDuration}</span>
          <span className="mx-1">•</span>
          <span>{timeAgo}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{offer.message}</p>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onMessage()
            }}
          >
            Nachricht
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-secondary hover:bg-secondary/90"
            onClick={(e) => {
              e.stopPropagation()
              onAccept()
            }}
          >
            Annehmen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
