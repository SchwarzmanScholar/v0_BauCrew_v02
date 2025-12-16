"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"

interface CheckoutCancelledProps {
  bookingId?: string
}

export function CheckoutCancelled({ bookingId }: CheckoutCancelledProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="pt-8 pb-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Zahlung abgebrochen</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Die Zahlung wurde nicht abgeschlossen. Du kannst es erneut versuchen oder den Handwerker kontaktieren.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href={bookingId ? `/app/checkout/${bookingId}` : "/app/buchungen"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Erneut versuchen
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/nachrichten">
              <MessageSquare className="mr-2 h-4 w-4" />
              Kontaktieren
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
