"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Offer } from "@/lib/types"

interface AcceptOfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer: Offer | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AcceptOfferDialog({ open, onOpenChange, offer, onConfirm, isLoading }: AcceptOfferDialogProps) {
  if (!offer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Angebot annehmen?</DialogTitle>
          <DialogDescription>Du bestätigst den Anbieter. Danach kannst du die Zahlung abschließen.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-4 border rounded-lg px-4 bg-muted/30">
          <Avatar className="h-12 w-12">
            <AvatarImage src={offer.providerAvatar || "/placeholder.svg"} alt={offer.providerName} />
            <AvatarFallback>
              {offer.providerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{offer.providerName}</p>
            <p className="text-sm text-muted-foreground">Dauer: {offer.estimatedDuration}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{offer.price.toLocaleString("de-DE")} €</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-secondary hover:bg-secondary/90">
            {isLoading ? "Wird verarbeitet..." : "Annehmen & zur Zahlung"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
