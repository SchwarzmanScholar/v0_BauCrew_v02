"use client"

import { useState } from "react"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const sections = [
  {
    id: "geltungsbereich",
    title: "1. Geltungsbereich",
    content: (
      <div className="space-y-4">
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Nutzer der Plattform BauCrew, betrieben von der
          BauCrew GmbH, Musterstraße 42, 10115 Berlin.
        </p>
        <p>
          Mit der Registrierung oder Nutzung der Plattform erklären Sie sich mit diesen AGB einverstanden. Abweichende
          Bedingungen des Nutzers werden nicht anerkannt, es sei denn, BauCrew stimmt ihrer Geltung ausdrücklich
          schriftlich zu.
        </p>
        <p>
          Diese AGB gelten sowohl für Kunden (Auftraggeber), die Handwerkerleistungen suchen, als auch für Anbieter
          (Handwerker), die ihre Leistungen über die Plattform anbieten.
        </p>
      </div>
    ),
  },
  {
    id: "leistungsbeschreibung",
    title: "2. Leistungsbeschreibung",
    content: (
      <div className="space-y-4">
        <p>BauCrew betreibt einen Online-Marktplatz, der Kunden und Handwerker zusammenbringt.</p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Marktplatz-Funktion</h4>
            <p className="text-muted-foreground">
              Kunden können Handwerkerleistungen suchen, Anbieterprofile einsehen und direkt Buchungen anfragen.
              Alternativ können Kunden Arbeitsaufträge einstellen, auf die Handwerker Angebote abgeben können.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Vermittlungsrolle</h4>
            <p className="text-muted-foreground">
              BauCrew ist ausschließlich Vermittler und wird nicht selbst Vertragspartei der zwischen Kunden und
              Handwerkern geschlossenen Verträge. Der Vertrag über die Erbringung der Handwerkerleistung kommt
              ausschließlich zwischen Kunde und Handwerker zustande.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Keine Garantie</h4>
            <p className="text-muted-foreground">
              BauCrew garantiert nicht die Verfügbarkeit von Handwerkern, die Qualität der erbrachten Leistungen oder
              den erfolgreichen Abschluss von Aufträgen.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "registrierung",
    title: "3. Registrierung und Pflichten",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Registrierung</h4>
          <p className="text-muted-foreground">
            Zur Nutzung der Plattform ist eine Registrierung erforderlich. Sie müssen wahrheitsgemäße und vollständige
            Angaben machen. Jeder Nutzer darf nur ein Konto anlegen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Pflichten der Nutzer</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            <li>Zugangsdaten vertraulich behandeln und vor unbefugtem Zugriff schützen</li>
            <li>Keine falschen, irreführenden oder rechtswidrigen Inhalte einstellen</li>
            <li>Keine Kontaktdaten in öffentlichen Bereichen der Plattform teilen, um die Vermittlung zu umgehen</li>
            <li>Andere Nutzer respektvoll und sachlich behandeln</li>
            <li>Geltende Gesetze und Vorschriften einhalten</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Zusätzliche Pflichten für Anbieter</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            <li>Gewerbliche Tätigkeit ordnungsgemäß angemeldet haben</li>
            <li>Über erforderliche Qualifikationen und Genehmigungen verfügen</li>
            <li>Verifizierungsunterlagen wahrheitsgemäß einreichen</li>
            <li>Angebotene Leistungen korrekt und vollständig beschreiben</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "buchungen",
    title: "4. Buchungen, Aufträge und Angebote",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Direktbuchung</h4>
          <p className="text-muted-foreground">
            Kunden können direkt bei einem Anbieter eine Leistung anfragen. Die Anfrage ist zunächst unverbindlich. Ein
            Vertrag kommt erst zustande, wenn der Anbieter die Anfrage annimmt und der Kunde die Zahlung veranlasst.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Arbeitsaufträge</h4>
          <p className="text-muted-foreground">
            Kunden können Arbeitsaufträge mit Beschreibung, Ort und Budget einstellen. Anbieter können darauf Angebote
            mit Preis und Verfügbarkeit abgeben. Der Kunde entscheidet frei, welches Angebot er annimmt.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Angebote</h4>
          <p className="text-muted-foreground">
            Angebote von Anbietern sind verbindlich für die angegebene Gültigkeitsdauer. Mit Annahme durch den Kunden
            kommt ein Vertrag zwischen Kunde und Anbieter zustande.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Kommunikation</h4>
          <p className="text-muted-foreground">
            Die Kommunikation zwischen Kunden und Anbietern erfolgt über das integrierte Nachrichtensystem.
            Kommunikation außerhalb der Plattform zur Umgehung der Servicegebühr ist nicht gestattet.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "gebuehren",
    title: "5. Gebühren",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Servicegebühr</h4>
          <p className="text-muted-foreground">
            BauCrew erhebt eine Servicegebühr in Höhe von 12% des Auftragswertes. Diese Gebühr wird bei erfolgreicher
            Vermittlung fällig und deckt die Kosten für Plattformbetrieb, Zahlungsabwicklung und Kundenservice.
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Beispielrechnung</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auftragswert (Netto)</span>
              <span>500,00 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Servicegebühr (12%)</span>
              <span>60,00 €</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border mt-2">
              <span>Gesamtbetrag (Kunde zahlt)</span>
              <span>560,00 €</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Auszahlung an Anbieter</span>
              <span>500,00 €</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Fälligkeit</h4>
          <p className="text-muted-foreground">
            Die Servicegebühr wird automatisch bei der Zahlung durch den Kunden einbehalten. Es fallen keine
            zusätzlichen Registrierungs- oder Grundgebühren an.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "zahlungen",
    title: "6. Zahlungen",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Zahlungsabwicklung</h4>
          <p className="text-muted-foreground">
            Zahlungen werden über sichere, zertifizierte Zahlungsdienstleister abgewickelt. Kunden zahlen den
            Gesamtbetrag (inkl. Servicegebühr) vor Leistungserbringung.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Auszahlung an Anbieter</h4>
          <p className="text-muted-foreground">
            Die Auszahlung an den Anbieter erfolgt nach erfolgreicher Leistungserbringung und Bestätigung durch den
            Kunden, in der Regel innerhalb von 7 Werktagen. Im MVP werden Auszahlungen wöchentlich manuell bearbeitet.
          </p>
        </div>
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Beta-Hinweis:</strong> Im Testbetrieb können Zahlungen simuliert sein. Echte Zahlungen werden erst
            nach Abschluss der Beta-Phase aktiviert.
          </AlertDescription>
        </Alert>
        <div>
          <h4 className="font-semibold mb-2">Treuhandmodell</h4>
          <p className="text-muted-foreground">
            Die Zahlung des Kunden wird zunächst treuhänderisch verwahrt und erst nach Leistungsbestätigung an den
            Anbieter ausgezahlt. Dies schützt beide Parteien.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "stornierung",
    title: "7. Stornierung und Erstattung",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Stornierung durch den Kunden</h4>
          <p className="text-muted-foreground">
            Kunden können eine Buchung bis 24 Stunden vor dem vereinbarten Termin kostenfrei stornieren. Bei späterer
            Stornierung kann eine Stornogebühr von bis zu 50% des Auftragswertes anfallen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Stornierung durch den Anbieter</h4>
          <p className="text-muted-foreground">
            Anbieter können Buchungen nur aus wichtigem Grund (z.B. Krankheit) stornieren. Wiederholte Stornierungen
            können zu Einschränkungen des Kontos führen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Erstattungen</h4>
          <p className="text-muted-foreground">
            Bei berechtigter Stornierung wird der gezahlte Betrag innerhalb von 5-10 Werktagen erstattet. Die
            Servicegebühr wird bei kostenfreier Stornierung ebenfalls erstattet.
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">MVP-Hinweis</h4>
          <p className="text-sm text-muted-foreground">
            Im aktuellen MVP-Stadium werden Stornierungen und Erstattungen manuell durch unser Support-Team bearbeitet.
            Bitte kontaktieren Sie uns unter{" "}
            <a href="mailto:support@baucrew.de" className="text-primary hover:underline">
              support@baucrew.de
            </a>
            .
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "bewertungen",
    title: "8. Bewertungen und Inhalte",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Bewertungssystem</h4>
          <p className="text-muted-foreground">
            Nach Abschluss eines Auftrags können Kunden den Anbieter bewerten (1-5 Sterne) und einen Kommentar
            hinterlassen. Bewertungen müssen wahrheitsgemäß, sachlich und frei von beleidigenden Inhalten sein.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Inhalte der Nutzer</h4>
          <p className="text-muted-foreground">
            Nutzer sind für die von ihnen eingestellten Inhalte (Texte, Bilder, Bewertungen) selbst verantwortlich.
            BauCrew behält sich das Recht vor, Inhalte zu entfernen, die gegen diese AGB oder geltendes Recht verstoßen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Nutzungsrechte</h4>
          <p className="text-muted-foreground">
            Mit dem Einstellen von Inhalten räumen Nutzer BauCrew ein nicht-exklusives, weltweites Nutzungsrecht ein,
            diese Inhalte im Rahmen des Plattformbetriebs zu verwenden, anzuzeigen und zu verbreiten.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Verbotene Inhalte</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Rechtswidrige, beleidigende oder diskriminierende Inhalte</li>
            <li>Spam, Werbung oder irreführende Informationen</li>
            <li>Personenbezogene Daten Dritter ohne deren Einwilligung</li>
            <li>Inhalte, die Rechte Dritter verletzen</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "haftung",
    title: "9. Haftung",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Haftung von BauCrew</h4>
          <p className="text-muted-foreground">
            BauCrew haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen. Die Haftung
            für leichte Fahrlässigkeit ist auf vorhersehbare, vertragstypische Schäden beschränkt.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Keine Haftung für Dritte</h4>
          <p className="text-muted-foreground">
            BauCrew haftet nicht für die Qualität, Vollständigkeit oder Rechtmäßigkeit der durch Anbieter erbrachten
            Leistungen. Ansprüche aus dem Vertrag zwischen Kunde und Anbieter sind direkt gegenüber dem Vertragspartner
            geltend zu machen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Verfügbarkeit</h4>
          <p className="text-muted-foreground">
            BauCrew bemüht sich um eine hohe Verfügbarkeit der Plattform, übernimmt jedoch keine Garantie für
            ununterbrochenen Zugang. Wartungsarbeiten werden nach Möglichkeit angekündigt.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Streitbeilegung</h4>
          <p className="text-muted-foreground">
            Bei Streitigkeiten zwischen Kunden und Anbietern bietet BauCrew einen Vermittlungsservice an. Die
            letztendliche Entscheidung über Erstattungen liegt bei BauCrew und ist bindend für die Nutzung der
            Plattform.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "schlussbestimmungen",
    title: "10. Schlussbestimmungen",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Änderungen der AGB</h4>
          <p className="text-muted-foreground">
            BauCrew behält sich vor, diese AGB jederzeit zu ändern. Änderungen werden den Nutzern per E-Mail und/oder
            über die Plattform mitgeteilt. Die weitere Nutzung nach Inkrafttreten gilt als Zustimmung.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Sperrung und Kündigung</h4>
          <p className="text-muted-foreground">
            BauCrew kann Nutzerkonten bei Verstößen gegen diese AGB sperren oder kündigen. Nutzer können ihr Konto
            jederzeit ohne Angabe von Gründen löschen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Anwendbares Recht</h4>
          <p className="text-muted-foreground">
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle
            Streitigkeiten ist, soweit gesetzlich zulässig, Berlin.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Salvatorische Klausel</h4>
          <p className="text-muted-foreground">
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen
            Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame Regelung, die dem
            wirtschaftlichen Zweck am nächsten kommt.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Kontakt</h4>
          <p className="text-muted-foreground">
            Bei Fragen zu diesen AGB wenden Sie sich bitte an:{" "}
            <a href="mailto:legal@baucrew.de" className="text-primary hover:underline">
              legal@baucrew.de
            </a>
          </p>
        </div>
      </div>
    ),
  },
]

export default function AGBPage() {
  const [activeSection, setActiveSection] = useState("geltungsbereich")

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
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Allgemeine Geschäftsbedingungen</h1>
            </div>
            <p className="text-muted-foreground">Nutzungsbedingungen für die BauCrew-Plattform</p>
          </div>

          {/* Warning Note */}
          <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Hinweis:</strong> Vor Nutzung im Live-Betrieb rechtlich prüfen lassen.
            </AlertDescription>
          </Alert>

          {/* Desktop: Two-column layout */}
          <div className="hidden lg:flex gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <aside className="w-72 shrink-0">
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
                  <FileText className="h-3 w-3" />
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
            <Accordion type="single" collapsible defaultValue="geltungsbereich" className="w-full">
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
                <FileText className="h-3 w-3" />
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
