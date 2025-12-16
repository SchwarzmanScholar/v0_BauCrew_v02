import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function UnverifiedWarning() {
  return (
    <Alert variant="destructive" className="mb-6 border-amber-500/50 bg-amber-500/10 text-amber-900">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900">Anbieter nicht verifiziert</AlertTitle>
      <AlertDescription className="text-amber-800">
        Dieser Anbieter hat den Verifizierungsprozess noch nicht abgeschlossen. Wir empfehlen, verifizierte Handwerker
        zu bevorzugen.
      </AlertDescription>
    </Alert>
  )
}
