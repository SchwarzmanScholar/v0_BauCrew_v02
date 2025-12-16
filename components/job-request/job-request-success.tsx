import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function JobRequestSuccess() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-secondary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Auftrag veröffentlicht</h1>

          <p className="text-muted-foreground mb-6">
            Dein Auftrag ist jetzt sichtbar für passende Handwerker in deiner Region.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-foreground mb-2">Nächste Schritte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">1.</span>
                Handwerker sehen deinen Auftrag und melden sich bei dir.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">2.</span>
                Vergleiche Angebote und wähle den passenden Anbieter.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">3.</span>
                Bestätige die Zahlung – sicher über BauCrew.
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Du erhältst Benachrichtigungen bei neuen Nachrichten und Angeboten.
          </p>

          <Link href="/app/anfragen">
            <Button className="w-full gap-2">
              Zu meinen Aufträgen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
