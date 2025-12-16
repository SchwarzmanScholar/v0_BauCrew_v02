"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CheckoutPriceBreakdownProps {
  subtotal: number
  serviceFeePercent?: number
}

export function CheckoutPriceBreakdown({ subtotal, serviceFeePercent = 12 }: CheckoutPriceBreakdownProps) {
  const serviceFee = Math.round(subtotal * (serviceFeePercent / 100))
  const total = subtotal + serviceFee

  const formatPrice = (price: number) => price.toLocaleString("de-DE", { style: "currency", currency: "EUR" })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Preisübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Zwischensumme</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground flex items-center gap-1 cursor-help">
                    Servicegebühr ({serviceFeePercent}%)
                    <HelpCircle className="h-3.5 w-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[240px]">
                  <p>Die Servicegebühr deckt Zahlungsabwicklung, Support und Absicherung bei Problemen.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-medium">{formatPrice(serviceFee)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Gesamt</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
