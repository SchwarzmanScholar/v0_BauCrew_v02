"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StatusBadge } from "@/components/baucrew/status-badge"
import {
  MapPin,
  Calendar,
  Euro,
  Clock,
  MessageSquare,
  Flag,
  XCircle,
  RotateCcw,
  Loader2,
  AlertTriangle,
  ImageIcon,
  ExternalLink,
} from "lucide-react"
import type { AdminJobRequestDetail, FlagReason } from "@/lib/types"

interface JobRequestDetailDrawerProps {
  request: AdminJobRequestDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: (id: string) => void
  onFlag: (id: string, reason: FlagReason, notes: string) => void
  onReopen: (id: string) => void
}

const flagReasonLabels: Record<FlagReason, string> = {
  spam: "Spam",
  illegal: "Illegaler Inhalt",
  personal_data: "Persönliche Daten",
  other: "Sonstiges",
}

const categoryColors: Record<string, string> = {
  Elektriker: "bg-amber-100 text-amber-800 border-amber-200",
  Sanitär: "bg-blue-100 text-blue-800 border-blue-200",
  Maler: "bg-rose-100 text-rose-800 border-rose-200",
  Trockenbau: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Handwerker: "bg-purple-100 text-purple-800 border-purple-200",
}

export function JobRequestDetailDrawer({
  request,
  open,
  onOpenChange,
  onClose,
  onFlag,
  onReopen,
}: JobRequestDetailDrawerProps) {
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flagReason, setFlagReason] = useState<FlagReason | "">("")
  const [flagNotes, setFlagNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Safety checklist
  const [hasPersonalData, setHasPersonalData] = useState(false)
  const [isSpam, setIsSpam] = useState(false)

  if (!request) return null

  const handleClose = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onClose(request.id)
    setIsLoading(false)
    setShowCloseDialog(false)
    onOpenChange(false)
  }

  const handleFlag = async () => {
    if (!flagReason || !flagNotes.trim()) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onFlag(request.id, flagReason as FlagReason, flagNotes)
    setIsLoading(false)
    setShowFlagDialog(false)
    setFlagReason("")
    setFlagNotes("")
    onOpenChange(false)
  }

  const handleReopen = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onReopen(request.id)
    setIsLoading(false)
    onOpenChange(false)
  }

  const isClosed = request.status === "closed"
  const isFlagged = request.status === "flagged"
  const canModerate = !isClosed

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-lg leading-tight">{request.title}</SheetTitle>
                </div>
                <SheetDescription className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs">{request.id}</span>
                  <StatusBadge status={request.status} />
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {/* Flagged Warning */}
            {isFlagged && request.flagReason && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Flag className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">
                        Markiert: {flagReasonLabels[request.flagReason]}
                      </p>
                      {request.flagNotes && <p className="text-sm text-muted-foreground">{request.flagNotes}</p>}
                      {request.flaggedAt && (
                        <p className="text-xs text-muted-foreground">
                          {format(request.flaggedAt, "dd.MM.yyyy 'um' HH:mm", { locale: de })}
                          {request.flaggedBy && ` von ${request.flaggedBy}`}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Request Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={categoryColors[request.category] || "bg-muted"}>
                  {request.category}
                </Badge>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {request.plz} {request.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{request.timeframe}</span>
                </div>
                {request.budget && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-4 w-4 shrink-0" />
                    <span>
                      {request.budget.toLocaleString("de-DE")}
                      {request.budgetMax && ` - ${request.budgetMax.toLocaleString("de-DE")}`} €
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{format(request.createdAt, "dd.MM.yyyy 'um' HH:mm", { locale: de })}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Beschreibung</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
              </div>

              {/* Photos */}
              {request.photos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Fotos ({request.photos.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {request.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Foto ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Kunde</h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.customer.avatar || "/placeholder.svg"} alt={request.customer.name} />
                  <AvatarFallback>
                    {request.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{request.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{request.customer.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Safety Checklist */}
            {canModerate && !isFlagged && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                    Sicherheits-Checkliste
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="personal-data" className="text-sm cursor-pointer">
                      Enthält persönliche Daten?
                    </Label>
                    <Switch id="personal-data" checked={hasPersonalData} onCheckedChange={setHasPersonalData} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="spam" className="text-sm cursor-pointer">
                      Spam?
                    </Label>
                    <Switch id="spam" checked={isSpam} onCheckedChange={setIsSpam} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Offers & Messages Link */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{request.offerCount}</span> Antworten
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/requests/${request.id}/thread`}>
                      Zum Kunden-Thread
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <SheetFooter className="flex gap-2 pt-4 border-t">
            {isClosed || isFlagged ? (
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleReopen} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                Wieder öffnen
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                  onClick={() => setShowCloseDialog(true)}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Schließen
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-warning/50 text-warning-foreground hover:bg-warning/10 bg-transparent"
                  onClick={() => setShowFlagDialog(true)}
                  disabled={isLoading}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Flaggen
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Auftrag schließen?</AlertDialogTitle>
            <AlertDialogDescription>
              Der Auftrag wird geschlossen und ist nicht mehr für Handwerker sichtbar. Diese Aktion kann rückgängig
              gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClose}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Schließen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Dialog */}
      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Auftrag markieren</AlertDialogTitle>
            <AlertDialogDescription>
              Wählen Sie einen Grund für die Markierung und fügen Sie Notizen hinzu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Grund</Label>
              <Select value={flagReason} onValueChange={(v) => setFlagReason(v as FlagReason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Grund auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="illegal">Illegaler Inhalt</SelectItem>
                  <SelectItem value="personal_data">Persönliche Daten</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notizen</Label>
              <Textarea
                placeholder="Details zur Markierung..."
                value={flagNotes}
                onChange={(e) => setFlagNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFlag}
              disabled={isLoading || !flagReason || !flagNotes.trim()}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Markieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
