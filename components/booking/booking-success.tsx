"use client"

import { CheckCircle2, ArrowRight, Clock, MessageSquare, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function BookingSuccess() {
  const nextSteps = [
    {
      icon: Clock,
      title: "Terminbestätigung abwarten",
      description: "Der Handwerker prüft deine Anfrage und bestätigt den Termin.",
    },
    {
      icon: MessageSquare,
      title: "Bei Rückfragen erreichbar sein",
      description: "Der Handwerker kann dich bei Fragen über den Chat kontaktieren.",
    },
    {
      icon: CreditCard,
      title: "Sicher bezahlen",
      description: "Nach der Bestätigung kannst du den Auftrag bezahlen.",
    },
  ]

  return (
    <div className="max-w-lg mx-auto text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">Anfrage gesendet</h1>
      <p className="text-muted-foreground mb-8">Der Handwerker bestätigt den Termin. Danach kannst du bezahlen.</p>

      <Card className="mb-8 text-left">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Nächste Schritte</h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button asChild size="lg">
          <Link href="/app/buchungen">
            Zum Status
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/app/suche">Weitere Handwerker suchen</Link>
        </Button>
      </div>
    </div>
  )
}
