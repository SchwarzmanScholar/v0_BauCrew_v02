"use client"

import { useState } from "react"
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
import {
  FileText,
  CreditCard,
  Shield,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Mail,
  MapPin,
  Building2,
  Loader2,
} from "lucide-react"
import type { AdminVerificationDetail, VerificationStatus } from "@/lib/types"

interface VerificationDetailDrawerProps {
  verification: AdminVerificationDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string, notes: string) => void
}

const documentTypeLabels: Record<string, { label: string; icon: typeof FileText }> = {
  id: { label: "Personalausweis", icon: CreditCard },
  trade_license: { label: "Handwerkskarte", icon: FileText },
  insurance: { label: "Versicherung", icon: Shield },
}

const statusConfig: Record<VerificationStatus, { label: string; className: string }> = {
  not_submitted: { label: "Nicht eingereicht", className: "bg-muted text-muted-foreground" },
  pending: { label: "Ausstehend", className: "bg-warning/10 text-warning-foreground border-warning/20" },
  approved: { label: "Genehmigt", className: "bg-success/10 text-success-foreground border-success/20" },
  rejected: { label: "Abgelehnt", className: "bg-destructive/10 text-destructive-foreground border-destructive/20" },
}

export function VerificationDetailDrawer({
  verification,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: VerificationDetailDrawerProps) {
  const [notes, setNotes] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  if (!verification) return null

  const handleApprove = async () => {
    setIsApproving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onApprove(verification.id)
    setIsApproving(false)
    onOpenChange(false)
  }

  const handleReject = async () => {
    if (!notes.trim()) return
    setIsRejecting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onReject(verification.id, notes)
    setIsRejecting(false)
    setShowRejectDialog(false)
    setNotes("")
    onOpenChange(false)
  }

  const isPending = verification.status === "pending"

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={verification.providerAvatar || "/placeholder.svg"} alt={verification.providerName} />
                <AvatarFallback>
                  {verification.providerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-lg">{verification.providerName}</SheetTitle>
                <SheetDescription>{verification.companyName}</SheetDescription>
              </div>
            </div>
            <Badge variant="outline" className={statusConfig[verification.status].className}>
              {statusConfig[verification.status].label}
            </Badge>
          </SheetHeader>

          <div className="space-y-6 py-4">
            {/* Provider Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Anbieter-Informationen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{verification.providerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{verification.city}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{verification.companyName}</span>
                </div>
                {verification.vatId && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>USt-IdNr: {verification.vatId}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Documents */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Dokumente</h3>
              <div className="space-y-2">
                {verification.documents.map((doc) => {
                  const docConfig = documentTypeLabels[doc.type]
                  const Icon = docConfig.icon
                  return (
                    <Card key={doc.id} className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-background p-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{docConfig.label}</p>
                              <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Öffnen</span>
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Eingereicht am {format(verification.submittedAt, "dd.MM.yyyy 'um' HH:mm", { locale: de })}
              </p>
            </div>

            {/* Previous Review Info */}
            {verification.reviewedAt && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Letzte Prüfung</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Geprüft am {format(verification.reviewedAt, "dd.MM.yyyy 'um' HH:mm", { locale: de })}
                      {verification.reviewedBy && ` von ${verification.reviewedBy}`}
                    </p>
                    {verification.adminNotes && (
                      <Card className="bg-destructive/5 border-destructive/20">
                        <CardContent className="p-3">
                          <p className="text-sm text-destructive-foreground">{verification.adminNotes}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Admin Notes for Rejection */}
            {isPending && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label htmlFor="admin-notes" className="text-sm font-semibold">
                    Notizen (bei Ablehnung erforderlich)
                  </Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Grund für Ablehnung eingeben..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </>
            )}
          </div>

          {isPending && (
            <SheetFooter className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => setShowRejectDialog(true)}
                disabled={isApproving}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Ablehnen
              </Button>
              <Button className="flex-1" onClick={handleApprove} disabled={isApproving || isRejecting}>
                {isApproving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Genehmigen
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verifizierung ablehnen?</AlertDialogTitle>
            <AlertDialogDescription>
              Der Anbieter wird über die Ablehnung informiert und kann neue Dokumente einreichen.
              {!notes.trim() && (
                <span className="block mt-2 text-destructive">Bitte geben Sie einen Ablehnungsgrund ein.</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!notes.trim() || isRejecting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isRejecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Ablehnen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
