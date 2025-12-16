"use client"

import { MapPin, Euro, AlertCircle, Clock, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./status-badge"
import type { JobRequest } from "@/lib/types"

interface JobRequestCardProps {
  jobRequest: JobRequest
  onClick?: () => void
  showOfferButton?: boolean
}

const urgencyConfig = {
  urgent: {
    icon: AlertCircle,
    label: "Dringend",
    variant: "destructive" as const,
  },
  normal: {
    icon: Clock,
    label: "Normal",
    variant: "secondary" as const,
  },
  flexible: {
    icon: Clock,
    label: "Zeitlich flexibel",
    variant: "outline" as const,
  },
}

export function JobRequestCard({ jobRequest, onClick, showOfferButton = true }: JobRequestCardProps) {
  const urgency = urgencyConfig[jobRequest.urgency]
  const UrgencyIcon = urgency.icon
  const daysAgo = Math.floor((Date.now() - jobRequest.createdAt.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 leading-tight">{jobRequest.title}</h3>
            <p className="text-sm text-muted-foreground">von {jobRequest.customerName}</p>
          </div>
          <StatusBadge status={jobRequest.status} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{jobRequest.category}</Badge>
          <Badge variant={urgency.variant} className="gap-1">
            <UrgencyIcon className="h-3 w-3" />
            {urgency.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{jobRequest.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{jobRequest.location}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Euro className="h-4 w-4" />
            <span>Budget: {jobRequest.budget.toLocaleString("de-DE")} €</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{jobRequest.offerCount} Angebote</span>
            </div>
            <span>vor {daysAgo === 0 ? "heute" : `${daysAgo} Tagen`}</span>
          </div>

          {showOfferButton && (
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              Angebot erstellen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
