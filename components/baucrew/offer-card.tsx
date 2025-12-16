"use client"

import { Star, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerificationBadge } from "./verification-badge"
import type { Offer } from "@/lib/types"

interface OfferCardProps {
  offer: Offer
  onAccept?: () => void
  onDecline?: () => void
  onContact?: () => void
  showActions?: boolean
}

export function OfferCard({ offer, onAccept, onDecline, onContact, showActions = true }: OfferCardProps) {
  const hoursAgo = Math.floor((Date.now() - offer.createdAt.getTime()) / (1000 * 60 * 60))
  const timeAgo =
    hoursAgo < 24
      ? `vor ${hoursAgo} ${hoursAgo === 1 ? "Stunde" : "Stunden"}`
      : `vor ${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? "Tag" : "Tagen"}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
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
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">{offer.providerRating.toFixed(1)}</span>
                <span>({offer.providerReviewCount})</span>
              </div>
              <span className="text-muted-foreground">{timeAgo}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary">{offer.price.toLocaleString("de-DE")} €</div>
            <div className="text-xs text-muted-foreground">Gesamtpreis</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Dauer: {offer.estimatedDuration}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{offer.message}</p>

        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onContact}>
              Nachricht senden
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onDecline}>
              Ablehnen
            </Button>
            <Button className="flex-1 bg-secondary hover:bg-secondary/90" onClick={onAccept}>
              Akzeptieren
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
