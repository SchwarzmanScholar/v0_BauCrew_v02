"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { VerificationBadge } from "@/components/baucrew/verification-badge"
import { Star, Clock, Shield, Headphones, CreditCard, AlertTriangle } from "lucide-react"
import type { BookingDetail } from "@/lib/types"

interface ProviderSidebarCardProps {
  booking: BookingDetail
  onPayNow?: () => void
}

export function ProviderSidebarCard({ booking, onPayNow }: ProviderSidebarCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)

  const total = booking.totalAmount + booking.serviceFee

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        {/* Provider info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={booking.providerAvatar || "/placeholder.svg"} alt={booking.providerName} />
            <AvatarFallback>
              {booking.providerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{booking.providerName}</span>
              {booking.verified && <VerificationBadge />}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium">{booking.providerRating}</span>
              <span>({booking.providerReviewCount} Bewertungen)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>Antwortet meist innerhalb 2 Std.</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Zwischensumme</span>
            <span>{formatCurrency(booking.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Servicegebühr (12%)</span>
            <span>{formatCurrency(booking.serviceFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Gesamt</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Separator />

        {/* CTA based on status */}
        {booking.status === "needs_payment" && (
          <Button className="w-full" size="lg" onClick={onPayNow}>
            <CreditCard className="h-4 w-4 mr-2" />
            Jetzt bezahlen
          </Button>
        )}

        {/* Trust microcopy */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            <span>Sichere Zahlung</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="h-3.5 w-3.5 text-secondary" />
            <span>Support bei Problemen</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Separator className="mb-2" />
        <Link href="/app/support/report" className="w-full">
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Problem melden
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
