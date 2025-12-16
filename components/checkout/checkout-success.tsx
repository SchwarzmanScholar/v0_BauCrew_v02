"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CheckoutSuccess() {
  return (
    <Card className="border-success/30 bg-success/5">
      <CardContent className="pt-8 pb-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Zahlung erfolgreich</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Der Handwerker bestätigt den Termin. Du wirst benachrichtigt, sobald es Neuigkeiten gibt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/app/buchungen">
              Zu meinen Buchungen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/suche">Weiter stöbern</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
