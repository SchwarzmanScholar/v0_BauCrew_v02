import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, FileText, Camera, Key } from "lucide-react"
import type { BookingDetail } from "@/lib/types"

interface BookingDetailsCardProps {
  booking: BookingDetail
}

export function BookingDetailsCard({ booking }: BookingDetailsCardProps) {
  const formattedDate = booking.scheduledDate.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{booking.jobTitle}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {booking.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Schedule */}
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Termin</p>
            <p className="text-sm text-muted-foreground">
              {formattedDate} um {booking.scheduledTime} Uhr
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Adresse</p>
            <p className="text-sm text-muted-foreground">
              {booking.address.street} {booking.address.houseNumber}
              <br />
              {booking.address.plz} {booking.address.city}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Beschreibung</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{booking.description}</p>
          </div>
        </div>

        {/* Access notes */}
        {booking.accessNotes && (
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Zugangshinweise</p>
              <p className="text-sm text-muted-foreground">{booking.accessNotes}</p>
            </div>
          </div>
        )}

        {/* Photos */}
        {booking.photos.length > 0 && (
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-2">Fotos</p>
              <div className="grid grid-cols-2 gap-2">
                {booking.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo || "/placeholder.svg"}
                    alt={`Foto ${index + 1}`}
                    className="rounded-lg border object-cover aspect-video"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
