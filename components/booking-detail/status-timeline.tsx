"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookingDetailStatus } from "@/lib/types"

interface StatusTimelineProps {
  currentStatus: BookingDetailStatus
}

const timelineSteps: { status: BookingDetailStatus; label: string }[] = [
  { status: "requested", label: "Angefragt" },
  { status: "accepted", label: "Akzeptiert" },
  { status: "needs_payment", label: "Zahlung" },
  { status: "scheduled", label: "Geplant" },
  { status: "in_progress", label: "In Arbeit" },
  { status: "completed", label: "Abgeschlossen" },
]

const statusOrder: BookingDetailStatus[] = [
  "requested",
  "accepted",
  "needs_payment",
  "scheduled",
  "in_progress",
  "completed",
]

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className="w-full py-4">
      {/* Desktop timeline */}
      <div className="hidden md:flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.status} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "bg-secondary border-secondary text-secondary-foreground",
                    isCurrent && "bg-primary border-primary text-primary-foreground",
                    isPending && "bg-muted border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Circle className={cn("h-3 w-3", isCurrent && "fill-current")} />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium text-center whitespace-nowrap",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < timelineSteps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-2", index < currentIndex ? "bg-secondary" : "bg-border")} />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile timeline - vertical */}
      <div className="md:hidden flex flex-col gap-1">
        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.status} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "bg-secondary border-secondary text-secondary-foreground",
                    isCurrent && "bg-primary border-primary text-primary-foreground",
                    isPending && "bg-muted border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Circle className={cn("h-2 w-2", isCurrent && "fill-current")} />
                  )}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className={cn("w-0.5 h-4", index < currentIndex ? "bg-secondary" : "bg-border")} />
                )}
              </div>
              <span
                className={cn("text-sm font-medium", isCurrent && "text-primary", isPending && "text-muted-foreground")}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
