"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle2, Euro, CalendarIcon, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import type { ProviderWorkRequestDetail } from "@/lib/types"

interface SendOfferPanelProps {
  request: ProviderWorkRequestDetail
  onSendOffer: (offer: { amount: number; message: string; availableDate?: Date }) => void
  isLoading?: boolean
}

export function SendOfferPanel({ request, onSendOffer, isLoading }: SendOfferPanelProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [availableDate, setAvailableDate] = useState<Date | undefined>()
  const [errors, setErrors] = useState<{ amount?: string; message?: string }>({})

  const handleSubmit = () => {
    const newErrors: { amount?: string; message?: string } = {}

    const numAmount = Number.parseFloat(amount.replace(",", "."))
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Bitte geben Sie einen gültigen Betrag ein."
    }

    if (!message.trim() || message.trim().length < 20) {
      newErrors.message = "Bitte schreiben Sie mindestens 20 Zeichen."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSendOffer({
      amount: numAmount,
      message: message.trim(),
      availableDate,
    })
  }

  // If offer already sent
  if (request.myOffer) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success-foreground" />
            Angebot gesendet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dein Angebot</span>
              <span className="font-semibold">{request.myOffer.amount.toLocaleString("de-DE")} €</span>
            </div>
            {request.myOffer.availableDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verfügbar ab</span>
                <span>
                  {request.myOffer.availableDate.toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gesendet</span>
              <span>
                {request.myOffer.sentAt.toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{request.myOffer.message}</p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
            <span className="text-sm text-muted-foreground">Warte auf Annahme</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Angebot senden</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount input */}
        <div className="space-y-2">
          <Label htmlFor="offer-amount">Angebotspreis</Label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="offer-amount"
              type="text"
              inputMode="decimal"
              placeholder="z.B. 2500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn("pl-9", errors.amount && "border-destructive")}
            />
          </div>
          {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          {request.budget && (
            <p className="text-xs text-muted-foreground">
              Budget des Kunden:{" "}
              {request.budgetMax
                ? `${request.budget.toLocaleString("de-DE")} – ${request.budgetMax.toLocaleString("de-DE")} €`
                : `bis ${request.budget.toLocaleString("de-DE")} €`}
            </p>
          )}
        </div>

        {/* Message textarea */}
        <div className="space-y-2">
          <Label htmlFor="offer-message">Nachricht</Label>
          <Textarea
            id="offer-message"
            placeholder="Beschreiben Sie Ihr Angebot kurz..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className={cn(errors.message && "border-destructive")}
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          <p className="text-xs text-muted-foreground">{message.length} / 20 Min. Zeichen</p>
        </div>

        {/* Optional date */}
        <div className="space-y-2">
          <Label>Frühester Starttermin (optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !availableDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {availableDate ? format(availableDate, "PPP", { locale: de }) : "Datum auswählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={availableDate}
                onSelect={setAvailableDate}
                disabled={(date) => date < new Date()}
                locale={de}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit button */}
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Angebot senden
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
