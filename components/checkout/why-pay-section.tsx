"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Shield, Headphones, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

export function WhyPaySection() {
  const [isOpen, setIsOpen] = useState(false)

  const reasons = [
    {
      icon: Shield,
      title: "Sichere Zahlungsabwicklung",
      description: "Zahlungen werden sicher verarbeitet.",
    },
    {
      icon: Headphones,
      title: "Support bei Problemen",
      description: "Unser Team hilft bei Fragen und Problemen.",
    },
    {
      icon: Receipt,
      title: "Transparente Gebühren",
      description: "Keine versteckten Kosten.",
    },
  ]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span className="font-medium">Warum Bezahlen?</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pb-2">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div key={reason.title} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{reason.title}</p>
                  <p className="text-xs text-muted-foreground">{reason.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
