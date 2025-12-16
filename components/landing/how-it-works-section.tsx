import { Search, MessageSquare, CreditCard, Star } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Suchen oder Auftrag einstellen",
    description: "Finde den passenden Handwerker über unsere Suche oder erstelle einen Auftrag und erhalte Angebote.",
  },
  {
    icon: MessageSquare,
    title: "Anbieter kontaktieren",
    description: "Vergleiche Profile, lies Bewertungen und kontaktiere Handwerker direkt über unsere Plattform.",
  },
  {
    icon: CreditCard,
    title: "Sicher bezahlen",
    description: "Bezahle erst, wenn die Arbeit abgeschlossen ist. Dein Geld ist bis zur Freigabe geschützt.",
  },
  {
    icon: Star,
    title: "Bewerten",
    description: "Teile deine Erfahrung und hilf anderen, die besten Handwerker zu finden.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="so-funktionierts" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">So funktioniert&apos;s</h2>
          <p className="mt-4 text-lg text-muted-foreground">In vier einfachen Schritten zum perfekten Handwerker</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {/* Step Number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <step.icon className="h-8 w-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
