"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActivityEvent } from "@/lib/types"

interface ActivityTimelineProps {
  events: ActivityEvent[]
}

const eventIcons = {
  published: Send,
  offer_received: Clock,
  message: MessageSquare,
  accepted: CheckCircle2,
  closed: XCircle,
}

const eventColors = {
  published: "bg-secondary text-secondary-foreground",
  offer_received: "bg-primary/10 text-primary",
  message: "bg-muted text-muted-foreground",
  accepted: "bg-success/10 text-success-foreground",
  closed: "bg-destructive/10 text-destructive-foreground",
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return "vor wenigen Minuten"
    if (diffHours < 24) return `vor ${diffHours} ${diffHours === 1 ? "Stunde" : "Stunden"}`
    if (diffDays < 7) return `vor ${diffDays} ${diffDays === 1 ? "Tag" : "Tagen"}`
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Aktivität</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type]
            const isLast = index === events.length - 1

            return (
              <div key={event.id} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={cn("rounded-full p-1.5 shrink-0", eventColors[event.type])}>
                    <Icon className="h-3 w-3" />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border mt-2" />}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <p className="text-sm font-medium">{event.title}</p>
                  {event.description && <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(event.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
