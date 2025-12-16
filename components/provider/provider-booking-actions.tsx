"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon, Check, X, Wrench, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"
import type { ProviderJobStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProviderBookingActionsProps {
  status: ProviderJobStatus
  amount: number
  onAccept: () => void
  onDecline: () => void
  onMarkInProgress: () => void
  onMarkCompleted: () => void
}

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export function ProviderBookingActions({
  status,
  amount,
  onAccept,
  onDecline,
  onMarkInProgress,
  onMarkCompleted,
}: ProviderBookingActionsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [showSuggestDialog, setShowSuggestDialog] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [suggestedDate, setSuggestedDate] = useState<Date>()
  const [suggestedTime, setSuggestedTime] = useState("")
  const [suggestionNote, setSuggestionNote] = useState("")

  const handleAccept = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onAccept()
    setIsLoading(false)
    toast({
      title: "Anfrage angenommen",
      description: "Der Kunde wurde benachrichtigt und kann nun bezahlen.",
    })
  }

  const handleDecline = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onDecline()
    setIsLoading(false)
    setShowDeclineDialog(false)
    toast({
      title: "Anfrage abgelehnt",
      description: "Der Kunde wurde über die Ablehnung informiert.",
    })
  }

  const handleSuggestTime = async () => {
    if (!suggestedDate || !suggestedTime) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setShowSuggestDialog(false)
    toast({
      title: "Terminvorschlag gesendet",
      description: "Der Kunde wurde über Ihren Vorschlag informiert.",
    })
  }

  const handleMarkInProgress = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onMarkInProgress()
    setIsLoading(false)
    toast({
      title: "Status aktualisiert",
      description: "Der Auftrag wurde als 'In Arbeit' markiert.",
    })
  }

  const handleMarkCompleted = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onMarkCompleted()
    setIsLoading(false)
    toast({
      title: "Auftrag abgeschlossen",
      description: "Der Kunde wurde benachrichtigt und kann nun bewerten.",
    })
  }

  const serviceFee = amount * 0.12
  const total = amount + serviceFee

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preisübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auftragswert</span>
              <span>{amount.toFixed(2).replace(".", ",")} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Servicegebühr (12%)</span>
              <span>-{serviceFee.toFixed(2).replace(".", ",")} €</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Ihre Auszahlung</span>
              <span className="text-lg">{(amount - serviceFee).toFixed(2).replace(".", ",")} €</span>
            </div>
          </div>

          {/* Requested status - Accept/Decline/Suggest */}
          {status === "requested" && (
            <div className="space-y-2 pt-2">
              <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={handleAccept} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                Anfrage annehmen
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowSuggestDialog(true)}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Anderen Termin vorschlagen
              </Button>
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeclineDialog(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Ablehnen
              </Button>
            </div>
          )}

          {/* Payment pending - waiting state */}
          {status === "payment_pending" && (
            <div className="pt-2">
              <div className="rounded-lg bg-warning/10 p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
                <p className="text-sm font-medium">Warten auf Zahlung</p>
                <p className="text-xs text-muted-foreground mt-1">Der Kunde wurde zur Zahlung aufgefordert.</p>
              </div>
            </div>
          )}

          {/* Scheduled - Mark as in progress */}
          {status === "scheduled" && (
            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-secondary hover:bg-secondary/90"
                onClick={handleMarkInProgress}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wrench className="h-4 w-4 mr-2" />}
                Als "In Arbeit" markieren
              </Button>
            </div>
          )}

          {/* In progress - Mark as completed */}
          {status === "in_progress" && (
            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-secondary hover:bg-secondary/90"
                onClick={handleMarkCompleted}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Als abgeschlossen markieren
              </Button>
            </div>
          )}

          {/* Completed - success state */}
          {status === "completed" && (
            <div className="pt-2">
              <div className="rounded-lg bg-success/10 p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium">Auftrag abgeschlossen</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Die Auszahlung erfolgt innerhalb von 3-5 Werktagen.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anfrage ablehnen</DialogTitle>
            <DialogDescription>
              Bitte teilen Sie dem Kunden mit, warum Sie die Anfrage nicht annehmen können.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="decline-reason">Grund (optional)</Label>
              <Textarea
                id="decline-reason"
                placeholder="z.B. Zeitlich nicht möglich, außerhalb meines Servicegebiets..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDecline} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Ablehnen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggest Time Dialog */}
      <Dialog open={showSuggestDialog} onOpenChange={setShowSuggestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anderen Termin vorschlagen</DialogTitle>
            <DialogDescription>Schlagen Sie dem Kunden einen alternativen Termin vor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Datum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !suggestedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {suggestedDate ? format(suggestedDate, "PPP", { locale: de }) : "Datum wählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={suggestedDate}
                    onSelect={setSuggestedDate}
                    disabled={(date) => date < new Date()}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Uhrzeit</Label>
              <Select value={suggestedTime} onValueChange={setSuggestedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Uhrzeit wählen" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time} Uhr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestion-note">Nachricht (optional)</Label>
              <Textarea
                id="suggestion-note"
                placeholder="z.B. Am ursprünglichen Termin bin ich leider verhindert..."
                value={suggestionNote}
                onChange={(e) => setSuggestionNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuggestDialog(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSuggestTime}
              disabled={!suggestedDate || !suggestedTime || isLoading}
              className="bg-secondary hover:bg-secondary/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Vorschlag senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
