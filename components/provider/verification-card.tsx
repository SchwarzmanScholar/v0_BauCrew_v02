"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Shield, Upload, FileText, CheckCircle2, Clock, XCircle, AlertTriangle, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { VerificationStatus, VerificationDocument } from "@/lib/types"

interface VerificationCardProps {
  status: VerificationStatus
  documents: VerificationDocument[]
  rejectionNotes?: string
  onSubmit: () => void
  onUpload: (type: "id" | "trade_license" | "insurance", file: File) => void
  onRemoveDocument: (id: string) => void
  isSubmitting?: boolean
}

const statusConfig: Record<
  VerificationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }
> = {
  not_submitted: {
    label: "Nicht eingereicht",
    variant: "outline",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  pending: {
    label: "In Prüfung",
    variant: "secondary",
    icon: <Clock className="h-4 w-4" />,
  },
  approved: {
    label: "Verifiziert",
    variant: "default",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  rejected: {
    label: "Abgelehnt",
    variant: "destructive",
    icon: <XCircle className="h-4 w-4" />,
  },
}

const documentTypes = [
  {
    type: "id" as const,
    label: "Personalausweis / Reisepass",
    description: "Gültiges Ausweisdokument mit Foto",
  },
  {
    type: "trade_license" as const,
    label: "Gewerbeanmeldung / Meisterbrief",
    description: "Nachweis deiner gewerblichen Tätigkeit",
  },
  {
    type: "insurance" as const,
    label: "Haftpflichtversicherung",
    description: "Nachweis einer Betriebshaftpflicht",
  },
]

export function VerificationCard({
  status,
  documents,
  rejectionNotes,
  onSubmit,
  onUpload,
  onRemoveDocument,
  isSubmitting = false,
}: VerificationCardProps) {
  const [uploadingType, setUploadingType] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const statusInfo = statusConfig[status]
  const canEdit = status === "not_submitted" || status === "rejected"
  const allDocumentsUploaded = documentTypes.every((docType) => documents.some((d) => d.type === docType.type))

  const handleFileChange = async (
    type: "id" | "trade_license" | "insurance",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingType(type)
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onUpload(type, file)
      setUploadingType(null)
    }
  }

  const getDocumentForType = (type: string) => {
    return documents.find((d) => d.type === type)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Shield className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle>Verifizierung</CardTitle>
              <CardDescription>Werde ein verifizierter Handwerker</CardDescription>
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="gap-1.5">
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rejection Alert */}
        {status === "rejected" && rejectionNotes && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verifizierung abgelehnt</AlertTitle>
            <AlertDescription>{rejectionNotes}</AlertDescription>
          </Alert>
        )}

        {/* Pending Alert */}
        {status === "pending" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Prüfung läuft</AlertTitle>
            <AlertDescription>
              Deine Dokumente werden derzeit geprüft. Dies dauert in der Regel 1-2 Werktage.
            </AlertDescription>
          </Alert>
        )}

        {/* Approved Alert */}
        {status === "approved" && (
          <Alert className="border-secondary bg-secondary/5">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            <AlertTitle className="text-secondary">Verifiziert</AlertTitle>
            <AlertDescription>
              Du bist verifiziert! Dein Profil zeigt jetzt das Verifizierungsabzeichen.
            </AlertDescription>
          </Alert>
        )}

        {/* Document Upload Fields */}
        <div className="space-y-4">
          <p className="text-sm font-medium">Erforderliche Dokumente</p>

          {documentTypes.map((docType) => {
            const uploadedDoc = getDocumentForType(docType.type)
            const isUploading = uploadingType === docType.type

            return (
              <div
                key={docType.type}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border",
                  uploadedDoc ? "bg-muted/50" : "bg-background",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", uploadedDoc ? "bg-secondary/10" : "bg-muted")}>
                    {uploadedDoc ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{docType.label}</p>
                    {uploadedDoc ? (
                      <p className="text-xs text-muted-foreground">{uploadedDoc.fileName}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{docType.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedDoc && canEdit && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveDocument(uploadedDoc.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  {canEdit && (
                    <>
                      <input
                        ref={(el) => {
                          fileInputRefs.current[docType.type] = el
                        }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(docType.type, e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant={uploadedDoc ? "outline" : "secondary"}
                        size="sm"
                        disabled={isUploading}
                        onClick={() => fileInputRefs.current[docType.type]?.click()}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Lädt...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadedDoc ? "Ersetzen" : "Hochladen"}
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Akzeptierte Formate: PDF, JPG, PNG (max. 10 MB pro Datei)</p>
          <p>Deine Dokumente werden sicher gespeichert und nicht an Dritte weitergegeben.</p>
        </div>

        {/* Submit Button */}
        {canEdit && (
          <Button onClick={onSubmit} disabled={!allDocumentsUploaded || isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird eingereicht...
              </>
            ) : status === "rejected" ? (
              "Erneut einreichen"
            ) : (
              "Verifizierung einreichen"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
