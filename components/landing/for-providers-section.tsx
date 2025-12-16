import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

const benefits = [
  "Keine monatlichen Gebühren – zahle nur bei erfolgreicher Vermittlung",
  "Direkter Zugang zu Kunden in deiner Region",
  "Flexible Arbeitszeiten – du entscheidest, welche Aufträge du annimmst",
  "Professionelles Profil mit Bewertungen und Portfolio",
  "Sichere Bezahlung – Geld wird garantiert ausgezahlt",
]

export function ForProvidersSection() {
  return (
    <section id="fuer-handwerker" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Für Handwerker</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Werde Teil von BauCrew und gewinne neue Kunden ohne Aufwand. Konzentriere dich auf dein Handwerk – wir
              kümmern uns um den Rest.
            </p>

            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register/provider">Jetzt registrieren</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/provider-info">Mehr erfahren</Link>
              </Button>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:aspect-square">
            <img
              src="/placeholder.svg?height=600&width=600"
              alt="Handwerker bei der Arbeit"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
