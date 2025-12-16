"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Save, Loader2 } from "lucide-react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ProfilePublicSection } from "@/components/provider/profile-public-section"
import { ProfileServiceAreaSection } from "@/components/provider/profile-service-area-section"
import { ProfileBusinessSection } from "@/components/provider/profile-business-section"
import { VerificationCard } from "@/components/provider/verification-card"
import type { VerificationStatus, VerificationDocument } from "@/lib/types"

// Mock initial data
const initialProfile = {
  avatar: "/placeholder.svg?height=96&width=96",
  displayName: "Klaus Müller",
  headline: "Meisterbetrieb für Sanitär & Heizung seit 2005",
  bio: "Mit über 15 Jahren Erfahrung biete ich Ihnen einen kompletten Renovierungsservice für Ihr Badezimmer. Von der Planung bis zur Fertigstellung bekommen Sie alles aus einer Hand.",
  website: "https://mueller-sanitaer.de",
  city: "berlin",
  plz: "10115",
  radius: 25,
  companyName: "Müller Sanitär GmbH",
  vatId: "DE123456789",
}

const initialDocuments: VerificationDocument[] = [
  {
    id: "doc-1",
    type: "id",
    fileName: "personalausweis.pdf",
    uploadedAt: new Date(),
    status: "approved",
  },
]

interface FormData {
  avatar: string
  displayName: string
  headline: string
  bio: string
  website: string
  city: string
  plz: string
  radius: number
  companyName: string
  vatId: string
}

export default function ProviderProfilePage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get verification status from URL for demo purposes
  const demoStatus = searchParams.get("status") as VerificationStatus | null

  const [formData, setFormData] = useState<FormData>(initialProfile)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Verification state
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(demoStatus || "not_submitted")
  const [documents, setDocuments] = useState<VerificationDocument[]>(
    demoStatus === "approved" || demoStatus === "pending"
      ? [
          {
            id: "doc-1",
            type: "id",
            fileName: "personalausweis.pdf",
            uploadedAt: new Date(),
            status: verificationStatus,
          },
          {
            id: "doc-2",
            type: "trade_license",
            fileName: "gewerbeanmeldung.pdf",
            uploadedAt: new Date(),
            status: verificationStatus,
          },
          {
            id: "doc-3",
            type: "insurance",
            fileName: "haftpflicht.pdf",
            uploadedAt: new Date(),
            status: verificationStatus,
          },
        ]
      : demoStatus === "rejected"
        ? initialDocuments
        : [],
  )
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false)

  const rejectionNotes =
    demoStatus === "rejected"
      ? "Das hochgeladene Ausweisdokument ist nicht lesbar. Bitte laden Sie ein gut lesbares Foto oder PDF hoch. Die Gewerbeanmeldung fehlt."
      : undefined

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Bitte gib einen Anzeigenamen ein"
    }

    if (!formData.headline.trim()) {
      newErrors.headline = "Bitte gib eine Kurzbeschreibung ein"
    }

    if (!formData.city) {
      newErrors.city = "Bitte wähle eine Stadt"
    }

    if (!formData.plz.trim()) {
      newErrors.plz = "Bitte gib eine PLZ ein"
    } else if (!/^\d{5}$/.test(formData.plz.trim())) {
      newErrors.plz = "PLZ muss 5 Ziffern haben"
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Bitte gib einen Firmennamen ein"
    }

    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "Bitte gib eine gültige URL ein (beginnend mit http:// oder https://)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Fehler",
        description: "Bitte überprüfe deine Eingaben",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)

    toast({
      title: "Gespeichert",
      description: "Deine Profiländerungen wurden gespeichert",
    })
  }

  const handleDocumentUpload = (type: "id" | "trade_license" | "insurance", file: File) => {
    const existingIndex = documents.findIndex((d) => d.type === type)
    const newDoc: VerificationDocument = {
      id: `doc-${Date.now()}`,
      type,
      fileName: file.name,
      uploadedAt: new Date(),
      status: "not_submitted",
    }

    if (existingIndex >= 0) {
      setDocuments((prev) => prev.map((d, i) => (i === existingIndex ? newDoc : d)))
    } else {
      setDocuments((prev) => [...prev, newDoc])
    }

    toast({
      title: "Dokument hochgeladen",
      description: `${file.name} wurde erfolgreich hochgeladen`,
    })
  }

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  const handleVerificationSubmit = async () => {
    setIsSubmittingVerification(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setVerificationStatus("pending")
    setIsSubmittingVerification(false)

    toast({
      title: "Verifizierung eingereicht",
      description: "Deine Dokumente werden geprüft. Du erhältst eine Benachrichtigung.",
    })
  }

  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Profil & Einstellungen</h1>
            <p className="text-muted-foreground">Verwalte dein öffentliches Profil und Geschäftsdaten</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Änderungen speichern
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ProfilePublicSection
              avatar={formData.avatar}
              displayName={formData.displayName}
              headline={formData.headline}
              bio={formData.bio}
              website={formData.website}
              onChange={updateField}
              errors={errors}
            />

            <ProfileServiceAreaSection
              city={formData.city}
              plz={formData.plz}
              radius={formData.radius}
              onChange={updateField}
              errors={errors}
            />

            <ProfileBusinessSection
              companyName={formData.companyName}
              vatId={formData.vatId}
              onChange={updateField}
              errors={errors}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VerificationCard
              status={verificationStatus}
              documents={documents}
              rejectionNotes={rejectionNotes}
              onSubmit={handleVerificationSubmit}
              onUpload={handleDocumentUpload}
              onRemoveDocument={handleRemoveDocument}
              isSubmitting={isSubmittingVerification}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
