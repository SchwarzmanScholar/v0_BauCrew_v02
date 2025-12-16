"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Euro, ImageIcon, Clock } from "lucide-react"
import type { ProviderWorkRequestDetail } from "@/lib/types"

interface WorkRequestDetailsCardProps {
  request: ProviderWorkRequestDetail
}

export function WorkRequestDetailsCard({ request }: WorkRequestDetailsCardProps) {
  const urgencyLabels = {
    urgent: "Dringend",
    normal: "Normal",
    flexible: "Flexibel",
  }

  const urgencyClasses = {
    urgent: "bg-destructive/10 text-destructive border-destructive/20",
    normal: "bg-secondary/10 text-secondary-foreground border-secondary/20",
    flexible: "bg-muted text-muted-foreground",
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Auftragsdetails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category & Urgency badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{request.category}</Badge>
          <Badge variant="outline" className={urgencyClasses[request.urgency]}>
            {urgencyLabels[request.urgency]}
          </Badge>
        </div>

        {/* Key details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Standort</p>
              <p className="text-muted-foreground">
                {request.plz} {request.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Zeitraum</p>
              <p className="text-muted-foreground">{request.timeframe}</p>
            </div>
          </div>

          {request.budget && (
            <div className="flex items-start gap-3 text-sm">
              <Euro className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Budget</p>
                <p className="text-muted-foreground">
                  {request.budgetMax
                    ? `${request.budget.toLocaleString("de-DE")} – ${request.budgetMax.toLocaleString("de-DE")} €`
                    : `bis ${request.budget.toLocaleString("de-DE")} €`}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Eingestellt</p>
              <p className="text-muted-foreground">
                {request.createdAt.toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Beschreibung</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
        </div>

        {/* Photos */}
        {request.photos.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Fotos ({request.photos.length})</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {request.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                  <Image src={photo || "/placeholder.svg"} alt={`Foto ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access notes */}
        {request.accessNotes && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Zugangshinweise</h4>
            <p className="text-sm text-muted-foreground">{request.accessNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
