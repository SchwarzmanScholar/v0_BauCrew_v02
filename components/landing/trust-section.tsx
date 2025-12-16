import { ShieldCheck, Star, HeadphonesIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verifizierung",
    description:
      "Alle Handwerker werden auf Identität und Qualifikation geprüft. Gewerbeschein und Meisterbrief werden verifiziert.",
  },
  {
    icon: Star,
    title: "Echte Bewertungen",
    description:
      "Nur Kunden mit abgeschlossenen Aufträgen können bewerten. Transparente und ehrliche Erfahrungsberichte.",
  },
  {
    icon: HeadphonesIcon,
    title: "Persönlicher Support",
    description: "Unser deutsches Support-Team ist für dich da. Bei Problemen helfen wir schnell und unkompliziert.",
  },
]

export function TrustSection() {
  return (
    <section id="sicherheit" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Vertrauen & Sicherheit</h2>
          <p className="mt-4 text-lg text-muted-foreground">Deine Sicherheit hat bei uns höchste Priorität</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {trustItems.map((item) => (
            <Card key={item.title} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <item.icon className="h-6 w-6 text-success" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
