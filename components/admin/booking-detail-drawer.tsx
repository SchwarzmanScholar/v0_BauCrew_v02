"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ExternalLink,
  MessageSquare,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Banknote,
} from "lucide-react"
import { StatusBadge } from "@/components/baucrew/status-badge"
import type { AdminBookingDetail, AdminBookingStatus } from "@/lib/types"

interface BookingDetailDrawerProps {
  booking: AdminBookingDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: AdminBookingStatus) => void
  onOpenDispute: (id: string, reason: string) => void
}

const statusOptions: { value: AdminBookingStatus; label: string }[] = [
  { value: "requested", label: "Angefragt" },
  { value: "needs_payment", label: "Zahlung offen" },
  { value: "paid", label: "Bezahlt" },
  { value: "scheduled", label: "Geplant" },
  { value: "in_progress", label: "In Arbeit" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "cancelled", label: "Storniert" },
  { value: "disputed", label: "Streitfall" },
]

const paymentStatusLabels: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  pending: { label: "Ausstehend", icon: Clock, className: "text-warning-foreground" },
  paid: { label: "Bezahlt", icon: CheckCircle2, className: "text-success" },
  refunded: { label: "Erstattet", icon: Banknote, className: "text-muted-foreground" },
  failed: { label: "Fehlgeschlagen", icon: XCircle, className: "text-destructive" },
}

export function BookingDetailDrawer({
  booking,
  open,
  onOpenChange,
  onStatusChange,
  onOpenDispute,
}: BookingDetailDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<AdminBookingStatus | "">(booking?.status || "")
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [disputeReason, setDisputeReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!booking) return null

  const PaymentIcon = paymentStatusLabels[booking.paymentStatus].icon

  const handleStatusConfirm = async () => {
    if (!selectedStatus || selectedStatus === booking.status) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onStatusChange(booking.id, selectedStatus)
    setIsSubmitting(false)
    setShowStatusConfirm(false)
  }

  const handleDisputeSubmit = async () => {
    if (!disputeReason.trim()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onOpenDispute(booking.id, disputeReason)
    setIsSubmitting(false)
    setShowDisputeModal(false)
    setDisputeReason("")
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg">{booking.jobTitle}</SheetTitle>
                <SheetDescription>{booking.id}</SheetDescription>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {/* Booking Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Buchungsübersicht</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{booking.jobTitle}</p>
                      <Badge variant="secondary" className="mt-1">
                        {booking.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.description}</p>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Erstellt</p>
                        <p className="font-medium">{format(booking.createdAt, "dd.MM.yyyy", { locale: de })}</p>
                      </div>
                    </div>
                    {booking.scheduledDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Termin</p>
                          <p className="font-medium">
                            {format(booking.scheduledDate, "dd.MM.yyyy", { locale: de })}
                            {booking.scheduledTime && ` um ${booking.scheduledTime}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Adresse</p>
                      <p className="font-medium text-sm">
                        {booking.address.street} {booking.address.houseNumber}
                      </p>
                      <p className="text-sm">
                        {booking.address.plz} {booking.address.city}
                      </p>
                    </div>
                  </div>

                  {booking.accessNotes && (
                    <div className="bg-muted/50 rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-1">Zugangshinweise</p>
                      <p className="text-sm">{booking.accessNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Participants */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Teilnehmer</h3>
              <div className="grid gap-3">
                {/* Customer Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.customer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {booking.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{booking.customer.name}</p>
                          <Badge variant="outline" className="text-xs">
                            Kunde
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {booking.customer.email}
                          </div>
                        </div>
                        {booking.customer.phone && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {booking.customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Provider Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.provider.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {booking.provider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{booking.provider.name}</p>
                          <Badge variant="outline" className="text-xs">
                            Anbieter
                          </Badge>
                          {booking.provider.verified ? (
                            <ShieldCheck className="h-4 w-4 text-success" />
                          ) : (
                            <ShieldAlert className="h-4 w-4 text-warning-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.provider.companyName}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {booking.provider.email}
                          </div>
                        </div>
                        {booking.provider.phone && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {booking.provider.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Payment Panel */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Zahlung</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Zahlungsstatus</span>
                    <div className={`flex items-center gap-1 ${paymentStatusLabels[booking.paymentStatus].className}`}>
                      <PaymentIcon className="h-4 w-4" />
                      <span className="font-medium">{paymentStatusLabels[booking.paymentStatus].label}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zwischensumme</span>
                      <span>{booking.subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plattformgebühr (12%)</span>
                      <span>{booking.platformFee.toFixed(2)} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Gesamt</span>
                      <span>{booking.total.toFixed(2)} €</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Banknote className="h-4 w-4" />
                      Auszahlung an Anbieter
                    </span>
                    <span className="font-medium text-success">{booking.providerPayout.toFixed(2)} €</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Message Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Nachrichten</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/messages/${booking.id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Thread öffnen
                  </Link>
                </Button>
              </div>

              {booking.recentMessages.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center text-muted-foreground">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Keine Nachrichten</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {booking.recentMessages.slice(0, 5).map((msg) => (
                    <Card key={msg.id} className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {msg.senderName}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {msg.senderRole === "customer" ? "Kunde" : "Anbieter"}
                            </Badge>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(msg.timestamp, "dd.MM. HH:mm", { locale: de })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Notes */}
            {booking.adminNotes && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Admin-Notizen</h3>
                  <Card className="bg-warning/5 border-warning/20">
                    <CardContent className="p-3">
                      <p className="text-sm">{booking.adminNotes}</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            <Separator />

            {/* Admin Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Admin-Aktionen</h3>

              <div className="space-y-2">
                <Label>Status ändern</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedStatus || booking.status}
                    onValueChange={(v) => setSelectedStatus(v as AdminBookingStatus)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="secondary"
                    disabled={!selectedStatus || selectedStatus === booking.status}
                    onClick={() => setShowStatusConfirm(true)}
                  >
                    Ändern
                  </Button>
                </div>
              </div>

              {booking.status !== "disputed" && booking.status !== "cancelled" && (
                <Button
                  variant="outline"
                  className="w-full text-warning-foreground bg-transparent"
                  onClick={() => setShowDisputeModal(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Dispute eröffnen
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status ändern</DialogTitle>
            <DialogDescription>
              Möchten Sie den Status von "{statusOptions.find((s) => s.value === booking.status)?.label}" auf "
              {statusOptions.find((s) => s.value === selectedStatus)?.label}" ändern?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusConfirm(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleStatusConfirm} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Modal */}
      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute eröffnen</DialogTitle>
            <DialogDescription>Beschreiben Sie den Grund für den Streitfall.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Grund</Label>
              <Textarea
                placeholder="Beschreiben Sie den Grund für den Dispute..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeModal(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleDisputeSubmit}
              disabled={!disputeReason.trim() || isSubmitting}
              variant="destructive"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Dispute eröffnen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
