"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const STORAGE_KEY = "baucrew-beta-banner-dismissed"

export function BetaBanner() {
  const [isDismissed, setIsDismissed] = useState(true) // Start hidden to prevent flash

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    setIsDismissed(dismissed === "true")
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
    <div className="w-full bg-warning/15 border-b border-warning/30">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Badge
            variant="outline"
            className="shrink-0 border-warning/50 bg-warning/10 text-warning-foreground text-xs font-semibold"
          >
            BETA
          </Badge>
          <p className="text-sm text-foreground truncate">
            <span className="font-medium">Testbetrieb</span>
            <span className="hidden sm:inline"> – Zahlungen ggf. simuliert. Feedback an </span>
            <a href="mailto:support@baucrew.de" className="hidden sm:inline text-secondary hover:underline font-medium">
              support@baucrew.de
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge className="hidden md:inline-flex bg-muted text-muted-foreground text-xs">Testumgebung</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-warning/20"
            onClick={handleDismiss}
            aria-label="Banner schließen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
