"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, MessageSquare, Loader2, Calendar, Euro, Briefcase, CheckCircle2 } from "lucide-react"
import { StatusBadge } from "@/components/baucrew/status-badge"
import type { AdminDisputeDetail, DisputeStatus, DisputeReason, DisputeResolution } from "@/lib/types"

interface DisputeDetailDrawerProps {
  dispute: AdminDisputeDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onResolve: (id: string, resolution: DisputeResolution, notes: string, refundAmount?: number) => void
  onUpdateStatus: (id: string, status: DisputeStatus) => void
}

const reasonLabels: Record<DisputeReason, string> = {
  quality: "Qualitätsmangel",
  no_show: "Nichterscheinen",
  payment: "Zahlungsproblem",
  damage: "Sachschaden",
  communication: "Kommunikation",
  other: "Sonstiges",
}

const resolutionLabels: Record<DisputeResolution, string> = {
  refund_full: "Vollständige Rückerstattung",
  refund_partial: "Teilrückerstattung",
  no_refund: "Keine Rückerstattung",
  cancelled: "Storniert",
}

export function DisputeDetailDrawer({
  dispute,
  open,
  onOpenChange,
  onResolve,
  onUpdateStatus,
}: DisputeDetailDrawerProps) {
  const [status, setStatus] = useState<DisputeStatus>(dispute?.status || "open")
  const [resolution, setResolution] = useState<DisputeResolution | "">("")
  const [notes, setNotes] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!dispute) return null

  const isResolved = dispute.status === "resolved"
  const canResolve = !isResolved && resolution && notes.trim()

  const handleStatusChange = async (newStatus: DisputeStatus) => {
    setStatus(newStatus)
    onUpdateStatus(dispute.id, newStatus)
  }

  const handleResolve = async () => {
    if (!resolution || !notes.trim()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const refund = resolution === "refund_partial" ? Number.parseFloat(refundAmount) : undefined
    onResolve(dispute.id, resolution as DisputeResolution, notes, refund)
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg">{dispute.bookingTitle}</SheetTitle>
              <SheetDescription>Streitfall #{dispute.id}</SheetDescription>
            </div>
            <StatusBadge status={dispute.status} />
          </div>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Dispute Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Streitfall-Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Grund</p>
                <p className="font-medium">{reasonLabels[dispute.reason]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Geöffnet von</p>
                <p className="font-medium">
                  {dispute.openerName} ({dispute.openedBy === "customer" ? "Kunde" : "Anbieter"})
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Erstellt am</p>
                <p className="font-medium">{format(dispute.createdAt, "dd.MM.yyyy HH:mm", { locale: de })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Buchungsbetrag</p>
                <p className="font-medium">{dispute.bookingAmount.toFixed(2)} €</p>
              </div>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm">{dispute.reasonDetails}</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Booking Context */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Buchungskontext</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/bookings/${dispute.booking.id}`}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Buchung ansehen
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{dispute.booking.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">{dispute.booking.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{dispute.booking.amount.toFixed(2)} €</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={dispute.booking.customerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {dispute.booking.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-muted-foreground">Kunde</p>
                      <p className="text-sm font-medium">{dispute.booking.customerName}</p>
                    </div>
                  </div>

                  {/* Provider */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={dispute.booking.providerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {dispute.booking.providerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-muted-foreground">Anbieter</p>
                      <p className="text-sm font-medium">{dispute.booking.providerName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(dispute.booking.scheduledDate, "dd.MM.yyyy", { locale: de })}</span>
                  </div>
                  {dispute.booking.completedDate && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Abgeschlossen {format(dispute.booking.completedDate, "dd.MM.yyyy", { locale: de })}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Message Thread */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Nachrichtenverlauf</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/messages/${dispute.bookingId}`}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Vollständiger Thread
                </Link>
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dispute.messages.map((msg) => (
                <Card
                  key={msg.id}
                  className={
                    msg.senderRole === "admin"
                      ? "bg-primary/5 border-primary/20"
                      : msg.senderRole === "provider"
                        ? "bg-secondary/5"
                        : "bg-muted/50"
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {msg.senderName}
                        {msg.senderRole === "admin" && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Admin
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(msg.timestamp, "dd.MM. HH:mm", { locale: de })}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resolution (if resolved) */}
          {dispute.resolution && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Lösung
                </h3>
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{resolutionLabels[dispute.resolution.type]}</span>
                      {dispute.resolution.refundAmount && (
                        <span className="font-semibold">{dispute.resolution.refundAmount.toFixed(2)} € erstattet</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{dispute.resolution.notes}</p>
                    <p className="text-xs text-muted-foreground">
                      Gelöst am {format(dispute.resolution.resolvedAt, "dd.MM.yyyy HH:mm", { locale: de })} von{" "}
                      {dispute.resolution.resolvedBy}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Resolution Form (if not resolved) */}
          {!isResolved && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Fall bearbeiten</h3>

                {/* Status Update */}
                <div className="space-y-2">
                  <Label>Status ändern</Label>
                  <Select value={status} onValueChange={(v) => handleStatusChange(v as DisputeStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Offen</SelectItem>
                      <SelectItem value="under_review">In Prüfung</SelectItem>
                      <SelectItem value="escalated">Eskaliert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resolution Type */}
                <div className="space-y-2">
                  <Label>Lösungstyp</Label>
                  <Select value={resolution} onValueChange={(v) => setResolution(v as DisputeResolution)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lösung auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refund_full">Vollständige Rückerstattung</SelectItem>
                      <SelectItem value="refund_partial">Teilrückerstattung</SelectItem>
                      <SelectItem value="no_refund">Keine Rückerstattung</SelectItem>
                      <SelectItem value="cancelled">Storniert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Refund Amount (if partial) */}
                {resolution === "refund_partial" && (
                  <div className="space-y-2">
                    <Label>Erstattungsbetrag</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        className="pl-9"
                        max={dispute.bookingAmount}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Max: {dispute.bookingAmount.toFixed(2)} €</p>
                  </div>
                )}

                {/* Resolution Notes */}
                <div className="space-y-2">
                  <Label>Lösungsnotizen</Label>
                  <Textarea
                    placeholder="Beschreiben Sie die Lösung und Begründung..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {!isResolved && (
          <SheetFooter className="pt-4 border-t">
            <Button className="w-full" onClick={handleResolve} disabled={!canResolve || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Fall abschließen
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
