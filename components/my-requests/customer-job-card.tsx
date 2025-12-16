"use client"

import Link from "next/link"
import { MapPin, Euro, Clock, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/baucrew/status-badge"
import type { JobRequest } from "@/lib/types"

interface CustomerJobCardProps {
  jobRequest: JobRequest
}

const urgencyConfig = {
  urgent: {
    label: "Dringend",
    variant: "destructive" as const,
  },
  normal: {
    label: "Normal",
    variant: "secondary" as const,
  },
  flexible: {
    label: "Zeitlich flexibel",
    variant: "outline" as const,
  },
}

export function CustomerJobCard({ jobRequest }: CustomerJobCardProps) {
  const urgency = urgencyConfig[jobRequest.urgency]
  const daysAgo = Math.floor((Date.now() - jobRequest.createdAt.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Link href={`/app/requests/${jobRequest.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 leading-tight truncate">{jobRequest.title}</h3>
            </div>
            <StatusBadge status={jobRequest.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{jobRequest.category}</Badge>
            <Badge variant={urgency.variant}>{urgency.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {jobRequest.plz ? `${jobRequest.plz} ${jobRequest.location}` : jobRequest.location}
              </span>
            </div>
          </div>

          {jobRequest.budget > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Euro className="h-4 w-4 shrink-0" />
              <span>Budget: {jobRequest.budget.toLocaleString("de-DE")} €</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>
                {jobRequest.offerCount} {jobRequest.offerCount === 1 ? "Antwort" : "Antworten"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{daysAgo === 0 ? "Heute" : daysAgo === 1 ? "Gestern" : `vor ${daysAgo} Tagen`}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
