import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, CreditCard } from "lucide-react"

export function HowItWorksSidebar() {
  const steps = [
    {
      icon: FileText,
      title: "Auftrag ist sichtbar",
      description: "Dein Auftrag erscheint im Job-Board für passende Handwerker.",
    },
    {
      icon: MessageSquare,
      title: "Handwerker melden sich",
      description: "Du erhältst Nachrichten und Angebote von interessierten Anbietern.",
    },
    {
      icon: CreditCard,
      title: "Du wählst und bezahlst",
      description: "Wähle einen Anbieter und bestätige die Zahlung – sicher über BauCrew.",
    },
  ]

  return (
    <Card className="border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">So läuft's ab</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
