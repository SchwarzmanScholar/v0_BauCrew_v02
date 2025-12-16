"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, HelpCircle } from "lucide-react"

interface PriceSummaryProps {
  subtotal: number
  serviceFeePercent?: number
}

export function PriceSummary({ subtotal, serviceFeePercent = 12 }: PriceSummaryProps) {
  const serviceFee = Math.round(subtotal * (serviceFeePercent / 100))
  const total = subtotal + serviceFee

  const formatPrice = (price: number) => price.toLocaleString("de-DE", { style: "currency", currency: "EUR" })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Preisübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Zwischensumme</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              Servicegebühr ({serviceFeePercent}%)
              <HelpCircle className="h-3 w-3" />
            </span>
            <span className="font-medium">{formatPrice(serviceFee)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Gesamt</span>
          <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
          <Shield className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
          <span>Sichere Zahlung • Support bei Problemen</span>
        </div>
      </CardContent>
    </Card>
  )
}
