"use client"

import { useState } from "react"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const sections = [
  {
    id: "ueberblick",
    title: "1. Überblick",
    content: (
      <div className="space-y-4">
        <p>
          Diese Datenschutzerklärung informiert Sie darüber, wie BauCrew personenbezogene Daten erhebt, verarbeitet und
          schützt, wenn Sie unsere Plattform nutzen.
        </p>
        <p>
          Wir nehmen den Schutz Ihrer Daten sehr ernst und behandeln Ihre personenbezogenen Daten vertraulich und
          entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
        <p>
          Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren
          Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis oder ist für die
          Nutzung bestimmter Funktionen erforderlich.
        </p>
      </div>
    ),
  },
  {
    id: "verantwortlicher",
    title: "2. Verantwortlicher",
    content: (
      <div className="space-y-4">
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
          <p className="font-semibold">BauCrew GmbH</p>
          <p>Musterstraße 42</p>
          <p>10115 Berlin</p>
          <p>Deutschland</p>
          <p className="pt-2">
            E-Mail:{" "}
            <a href="mailto:datenschutz@baucrew.de" className="text-primary hover:underline">
              datenschutz@baucrew.de
            </a>
          </p>
        </div>
        <p>Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.</p>
      </div>
    ),
  },
  {
    id: "daten",
    title: "3. Welche Daten wir verarbeiten",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Account-Daten</h4>
          <p className="text-muted-foreground">
            Bei der Registrierung erfassen wir: E-Mail-Adresse, Passwort (verschlüsselt gespeichert), Name,
            Telefonnummer (optional) und bei Anbietern zusätzlich Unternehmensangaben und Steuer-ID.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Buchungs- und Auftragsdaten</h4>
          <p className="text-muted-foreground">
            Wenn Sie Buchungen durchführen oder Aufträge einstellen, speichern wir: Beschreibung des Auftrags, Adresse
            des Einsatzorts, gewählte Kategorie, Preisinformationen und Zeitangaben.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Nachrichten</h4>
          <p className="text-muted-foreground">
            Kommunikation zwischen Kunden und Handwerkern wird auf unserer Plattform gespeichert, um den Auftragsverlauf
            nachvollziehbar zu machen und bei Streitfällen als Nachweis zu dienen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Uploads und Medien</h4>
          <p className="text-muted-foreground">
            Hochgeladene Fotos (z.B. von Aufträgen, Profilbilder, Verifizierungsdokumente) werden sicher gespeichert und
            nur für den vorgesehenen Zweck verwendet.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Technische Daten</h4>
          <p className="text-muted-foreground">
            Bei der Nutzung der Website erfassen wir automatisch: IP-Adresse, Browsertyp, Betriebssystem, Zugriffszeit
            und Referrer-URL. Diese Daten werden für technische Zwecke und zur Sicherheit der Plattform benötigt.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "zweck",
    title: "4. Zweck und Rechtsgrundlagen",
    content: (
      <div className="space-y-4">
        <p>Wir verarbeiten Ihre Daten für folgende Zwecke:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
          <li>
            <span className="font-medium text-foreground">Vertragserfüllung:</span> Um Ihnen unsere Plattform-Dienste
            bereitzustellen, Buchungen abzuwickeln und die Kommunikation zu ermöglichen (Art. 6 Abs. 1 lit. b DSGVO).
          </li>
          <li>
            <span className="font-medium text-foreground">Berechtigtes Interesse:</span> Zur Verbesserung unserer
            Dienste, Betrugsprävention und Sicherheit der Plattform (Art. 6 Abs. 1 lit. f DSGVO).
          </li>
          <li>
            <span className="font-medium text-foreground">Einwilligung:</span> Für Marketing und Newsletter, sofern Sie
            zugestimmt haben (Art. 6 Abs. 1 lit. a DSGVO).
          </li>
          <li>
            <span className="font-medium text-foreground">Rechtliche Verpflichtungen:</span> Zur Erfüllung gesetzlicher
            Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO).
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "dienstleister",
    title: "5. Weitergabe an Dienstleister",
    content: (
      <div className="space-y-4">
        <p>Zur Bereitstellung unserer Dienste arbeiten wir mit ausgewählten Dienstleistern zusammen:</p>
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-1">Authentifizierung</h4>
            <p className="text-sm text-muted-foreground">
              Für sichere Anmeldung und Benutzerverwaltung setzen wir bewährte Authentifizierungsdienste ein, die Ihre
              Login-Daten verschlüsselt verarbeiten.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-1">Hosting und Infrastruktur</h4>
            <p className="text-sm text-muted-foreground">
              Unsere Server befinden sich in der EU. Wir nutzen professionelle Cloud-Dienste, die DSGVO-konform
              arbeiten.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-1">Zahlungsabwicklung</h4>
            <p className="text-sm text-muted-foreground">
              Zahlungen werden über zertifizierte Zahlungsdienstleister abgewickelt. Wir speichern keine vollständigen
              Zahlungsdaten wie Kreditkartennummern.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Mit allen Dienstleistern haben wir Auftragsverarbeitungsverträge abgeschlossen, die den Schutz Ihrer Daten
          gewährleisten.
        </p>
      </div>
    ),
  },
  {
    id: "speicherdauer",
    title: "6. Speicherdauer",
    content: (
      <div className="space-y-4">
        <p>
          Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die jeweiligen Verarbeitungszwecke
          erforderlich ist:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
          <li>
            <span className="font-medium text-foreground">Account-Daten:</span> Bis zur Löschung Ihres Kontos, danach
            für 30 Tage zur Wiederherstellung.
          </li>
          <li>
            <span className="font-medium text-foreground">Buchungsdaten:</span> 10 Jahre gemäß handels- und
            steuerrechtlichen Aufbewahrungspflichten.
          </li>
          <li>
            <span className="font-medium text-foreground">Nachrichten:</span> 3 Jahre nach Abschluss des Auftrags,
            sofern kein Rechtsstreit vorliegt.
          </li>
          <li>
            <span className="font-medium text-foreground">Technische Logs:</span> Maximal 90 Tage.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "rechte",
    title: "7. Betroffenenrechte",
    content: (
      <div className="space-y-4">
        <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
        <div className="grid gap-3">
          <div className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Auskunftsrecht</p>
              <p className="text-sm text-muted-foreground">
                Sie können Auskunft über die von uns verarbeiteten Daten verlangen.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Berichtigung</p>
              <p className="text-sm text-muted-foreground">Sie können die Berichtigung unrichtiger Daten verlangen.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Löschung</p>
              <p className="text-sm text-muted-foreground">
                Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten
                entgegenstehen.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              4
            </div>
            <div>
              <p className="font-medium">Einschränkung der Verarbeitung</p>
              <p className="text-sm text-muted-foreground">
                Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              5
            </div>
            <div>
              <p className="font-medium">Datenübertragbarkeit</p>
              <p className="text-sm text-muted-foreground">Sie können Ihre Daten in einem gängigen Format erhalten.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              6
            </div>
            <div>
              <p className="font-medium">Widerspruch</p>
              <p className="text-sm text-muted-foreground">Sie können der Verarbeitung Ihrer Daten widersprechen.</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground pt-2">
          Zudem haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die
          Verarbeitung Ihrer Daten gegen die DSGVO verstößt.
        </p>
      </div>
    ),
  },
  {
    id: "kontakt",
    title: "8. Kontakt",
    content: (
      <div className="space-y-4">
        <p>Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:</p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold">Datenschutzbeauftragter</p>
          <p>BauCrew GmbH</p>
          <p>
            E-Mail:{" "}
            <a href="mailto:datenschutz@baucrew.de" className="text-primary hover:underline">
              datenschutz@baucrew.de
            </a>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Wir werden Ihre Anfrage schnellstmöglich, spätestens jedoch innerhalb eines Monats, beantworten.
        </p>
      </div>
    ),
  },
]

export default function DatenschutzPage() {
  const [activeSection, setActiveSection] = useState("ueberblick")

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Datenschutzerklärung</h1>
            </div>
            <p className="text-muted-foreground">Informationen zum Umgang mit Ihren personenbezogenen Daten</p>
          </div>

          {/* Warning Note */}
          <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Dies ist eine Beta-Version.</strong> Bitte rechtlich prüfen lassen.
            </AlertDescription>
          </Alert>

          {/* Desktop: Two-column layout */}
          <div className="hidden lg:flex gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <aside className="w-64 shrink-0">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Inhalt</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        activeSection === section.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 max-w-3xl">
              <div className="space-y-12">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                      {section.title}
                    </h2>
                    <div className="text-foreground leading-relaxed">{section.content}</div>
                  </section>
                ))}
              </div>

              {/* Beta Badge and Date */}
              <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  BETA
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: Accordion layout */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible defaultValue="ueberblick" className="w-full">
              {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-left font-semibold">{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-foreground leading-relaxed pt-2">{section.content}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Beta Badge and Date */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                BETA
              </Badge>
              <p className="text-sm text-muted-foreground">
                Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
