import { CheckCircle2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function VerificationBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Verifizierter Handwerker</p>
          <p className="text-xs text-muted-foreground">Identität und Qualifikationen geprüft</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
