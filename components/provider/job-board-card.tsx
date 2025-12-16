"use client"

import Link from "next/link"
import { MapPin, Euro, Clock, MessageSquare, AlertCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { JobBoardItem } from "@/lib/types"

interface JobBoardCardProps {
  item: JobBoardItem
}

const urgencyConfig = {
  urgent: {
    icon: AlertCircle,
    label: "Dringend",
    className: "bg-destructive text-destructive-foreground",
  },
  normal: {
    icon: Clock,
    label: "Normal",
    className: "bg-secondary text-secondary-foreground",
  },
  flexible: {
    icon: Calendar,
    label: "Flexibel",
    className: "bg-muted text-muted-foreground",
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `vor ${diffMins} Min.`
  } else if (diffHours < 24) {
    return `vor ${diffHours} Std.`
  } else if (diffDays === 1) {
    return "vor 1 Tag"
  } else {
    return `vor ${diffDays} Tagen`
  }
}

export function JobBoardCard({ item }: JobBoardCardProps) {
  const urgency = urgencyConfig[item.urgency]
  const UrgencyIcon = urgency.icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">von {item.customerName}</p>
          </div>
          <Badge className={urgency.className}>
            <UrgencyIcon className="mr-1 h-3 w-3" />
            {urgency.label}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="outline">{item.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {item.plz} {item.location}
            </span>
          </div>
          {item.budget !== null && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Euro className="h-4 w-4 shrink-0" />
              <span>
                {item.budget.toLocaleString("de-DE")}
                {item.budgetMax && ` – ${item.budgetMax.toLocaleString("de-DE")}`} €
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>{item.offerCount} Angebote</span>
            </div>
            <span>{formatTimeAgo(item.createdAt)}</span>
          </div>

          <Link href={`/provider/job-board/${item.id}`}>
            <Button size="sm">Details ansehen</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
