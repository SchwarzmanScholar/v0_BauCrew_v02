"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, FileText, Camera, Key } from "lucide-react"
import type { ProviderJobDetail } from "@/lib/types"

interface ProviderJobDetailsCardProps {
  job: ProviderJobDetail
  showFullAddress: boolean
}

export function ProviderJobDetailsCard({ job, showFullAddress }: ProviderJobDetailsCardProps) {
  const formattedDate = job.requestedDate.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
            <Badge variant="secondary">{job.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date and Time */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{job.requestedTime} Uhr</span>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Adresse</span>
          </div>
          {showFullAddress ? (
            <p className="text-sm text-muted-foreground pl-6">
              {job.address.street} {job.address.houseNumber}
              <br />
              {job.address.plz} {job.address.city}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground pl-6">
              {job.address.plz} {job.address.city}
              <br />
              <span className="text-xs italic">Vollständige Adresse nach Annahme sichtbar</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Beschreibung</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6 leading-relaxed">{job.description}</p>
        </div>

        {/* Photos */}
        {job.photos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span>Fotos ({job.photos.length})</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pl-6">
              {job.photos.map((photo, index) => (
                <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-muted">
                  <Image src={photo || "/placeholder.svg"} alt={`Foto ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access Notes - only show if address is visible */}
        {showFullAddress && job.accessNotes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span>Zugangshinweise</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6 leading-relaxed">{job.accessNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
