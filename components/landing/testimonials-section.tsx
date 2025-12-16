import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Thomas Müller",
    location: "Berlin",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 5,
    text: "Innerhalb von 24 Stunden hatte ich drei Angebote für meine Badezimmer-Sanierung. Der ausgewählte Handwerker hat hervorragende Arbeit geleistet. Sehr empfehlenswert!",
  },
  {
    name: "Anna Schmidt",
    location: "München",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 5,
    text: "Als Mieterin war ich skeptisch, aber die Verifizierung der Handwerker hat mich überzeugt. Der Elektriker war pünktlich, professionell und der Preis war fair.",
  },
  {
    name: "Michael Weber",
    location: "Hamburg",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 5,
    text: "Ich nutze BauCrew regelmäßig für meine Wohnungsverwaltung. Die Qualität der Handwerker ist konstant hoch und die Abwicklung unkompliziert.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Das sagen unsere Kunden</h2>
          <p className="mt-4 text-lg text-muted-foreground">Tausende zufriedene Kunden vertrauen BauCrew</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border bg-card">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mt-4 text-sm text-foreground leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
