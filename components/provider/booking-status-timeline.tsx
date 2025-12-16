"use client"

import { cn } from "@/lib/utils"
import { Clock, CheckCircle2, CreditCard, Calendar, Wrench, Star } from "lucide-react"
import type { ProviderJobStatus } from "@/lib/types"

interface BookingStatusTimelineProps {
  currentStatus: ProviderJobStatus
}

const steps = [
  { status: "requested", label: "Angefragt", icon: Clock },
  { status: "payment_pending", label: "Zahlung offen", icon: CreditCard },
  { status: "scheduled", label: "Geplant", icon: Calendar },
  { status: "in_progress", label: "In Arbeit", icon: Wrench },
  { status: "completed", label: "Abgeschlossen", icon: Star },
] as const

const statusOrder: Record<ProviderJobStatus, number> = {
  requested: 0,
  payment_pending: 1,
  scheduled: 2,
  in_progress: 3,
  completed: 4,
}

export function BookingStatusTimeline({ currentStatus }: BookingStatusTimelineProps) {
  const currentIndex = statusOrder[currentStatus]

  return (
    <div className="w-full">
      {/* Desktop timeline */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-secondary transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete && "bg-secondary border-secondary text-secondary-foreground",
                  isCurrent && "bg-primary border-primary text-primary-foreground",
                  isPending && "bg-card border-muted text-muted-foreground",
                )}
              >
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile timeline - vertical */}
      <div className="md:hidden space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.status} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete && "bg-secondary border-secondary text-secondary-foreground",
                  isCurrent && "bg-primary border-primary text-primary-foreground",
                  isPending && "bg-card border-muted text-muted-foreground",
                )}
              >
                {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
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
