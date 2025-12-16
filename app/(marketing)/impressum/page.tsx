import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Building2, Mail, Phone, FileText, Scale, Info } from "lucide-react"

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Impressum</h1>
            <p className="text-muted-foreground">Angaben gemäß § 5 TMG</p>
          </div>

          {/* Warning Note */}
          <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Hinweis:</strong> Bitte durch korrekte Unternehmensdaten ersetzen und rechtlich prüfen lassen.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-6">
            {/* Anbieter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  Anbieter / Verantwortlich
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-foreground">
                <p className="font-semibold">BauCrew GmbH</p>
                <p>Vertreten durch die Geschäftsführung:</p>
                <p>Max Mustermann, Julia Schmidt</p>
              </CardContent>
            </Card>

            {/* Anschrift */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Anschrift
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-foreground">
                <p>Musterstraße 42</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </CardContent>
            </Card>

            {/* Kontakt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  Kontakt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href="mailto:kontakt@baucrew.de" className="text-primary hover:underline">
                    kontakt@baucrew.de
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href="tel:+4930123456789" className="text-primary hover:underline">
                    +49 (0) 30 123 456 789
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Registerangaben */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Registerangaben
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-muted-foreground">Registergericht:</span>
                  <span>Amtsgericht Charlottenburg, Berlin</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-muted-foreground">Registernummer:</span>
                  <span>HRB 123456 B</span>
                </div>
              </CardContent>
            </Card>

            {/* Umsatzsteuer-ID */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5 text-primary" />
                  Umsatzsteuer-Identifikationsnummer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p>USt-IdNr. gemäß § 27a UStG: DE 123 456 789</p>
              </CardContent>
            </Card>

            {/* Haftungsausschluss */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5 text-primary" />
                  Haftungsausschluss
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <div>
                  <h4 className="font-semibold mb-1">Haftung für Inhalte</h4>
                  <p className="text-sm text-muted-foreground">
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                    Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als
                    Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                    allgemeinen Gesetzen verantwortlich.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Haftung für Links</h4>
                  <p className="text-sm text-muted-foreground">
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss
                    haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
                    der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Beta Hinweis */}
            <Card className="border-secondary bg-secondary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-secondary" />
                  Hinweis zum Testbetrieb
                  <Badge variant="secondary" className="ml-2">
                    BETA
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
                <p className="text-sm">
                  Dies ist ein Testbetrieb (Beta). Die Plattform befindet sich in der Entwicklungsphase. Zahlungen
                  können ggf. simuliert sein. Bei Fragen oder Feedback wenden Sie sich bitte an{" "}
                  <a href="mailto:support@baucrew.de" className="text-primary hover:underline">
                    support@baucrew.de
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            {/* Stand */}
            <p className="text-sm text-muted-foreground text-center pt-4">
              Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
