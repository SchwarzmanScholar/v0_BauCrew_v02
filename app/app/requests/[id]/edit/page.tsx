"use client"

import type React from "react"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/baucrew/app-shell"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarIcon, Loader2, Lightbulb, Eye, X, Trash2, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { JobRequest } from "@/lib/types"

const categories = [
  { value: "handwerker", label: "Handwerker (Allgemein)" },
  { value: "maler", label: "Maler" },
  { value: "elektriker", label: "Elektriker" },
  { value: "sanitaer", label: "Sanitär" },
  { value: "trockenbau", label: "Trockenbau" },
]

const berlinLocations = [
  { plz: "10115", ort: "Berlin Mitte" },
  { plz: "10178", ort: "Berlin Mitte" },
  { plz: "10243", ort: "Berlin Friedrichshain" },
  { plz: "10405", ort: "Berlin Prenzlauer Berg" },
  { plz: "10623", ort: "Berlin Charlottenburg" },
  { plz: "10785", ort: "Berlin Tiergarten" },
  { plz: "10967", ort: "Berlin Kreuzberg" },
  { plz: "12043", ort: "Berlin Neukölln" },
  { plz: "12161", ort: "Berlin Friedenau" },
  { plz: "13353", ort: "Berlin Wedding" },
]

// Mock existing request data
const mockExistingRequest = {
  id: "req-123",
  title: "Wohnzimmer streichen - 25m²",
  category: "maler",
  description:
    "Ich suche einen Maler für das Streichen meines Wohnzimmers. Die Wände sind ca. 25m², aktuell weiß gestrichen. Die Farbe soll auf ein helles Grau geändert werden. Kleine Risse in der Wand müssen vorher verspachtelt werden.",
  plz: "10405",
  ort: "Berlin Prenzlauer Berg",
  timeframe: "week" as const,
  customDate: undefined as Date | undefined,
  budgetMin: "300",
  budgetMax: "500",
  noBudget: false,
  existingPhotos: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
  status: "open" as JobRequest["status"],
  offerCount: 3,
  createdAt: new Date("2025-01-10"),
}

interface FormData {
  category: string
  title: string
  description: string
  plz: string
  ort: string
  timeframe: string
  customDate: Date | undefined
  budgetMin: string
  budgetMax: string
  noBudget: boolean
  newPhotos: File[]
  existingPhotos: string[]
}

interface FormErrors {
  category?: string
  title?: string
  description?: string
  plz?: string
  ort?: string
  timeframe?: string
  budgetMin?: string
  budgetMax?: string
}

export default function EditJobRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Initialize form with existing data
  const [formData, setFormData] = useState<FormData>({
    category: mockExistingRequest.category,
    title: mockExistingRequest.title,
    description: mockExistingRequest.description,
    plz: mockExistingRequest.plz,
    ort: mockExistingRequest.ort,
    timeframe: mockExistingRequest.timeframe,
    customDate: mockExistingRequest.customDate,
    budgetMin: mockExistingRequest.budgetMin,
    budgetMax: mockExistingRequest.budgetMax,
    noBudget: mockExistingRequest.noBudget,
    newPhotos: [],
    existingPhotos: mockExistingRequest.existingPhotos,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.category) {
      newErrors.category = "Bitte wähle eine Kategorie aus."
    }
    if (!formData.title.trim()) {
      newErrors.title = "Bitte gib einen Titel ein."
    } else if (formData.title.length < 5) {
      newErrors.title = "Der Titel muss mindestens 5 Zeichen lang sein."
    }
    if (!formData.description.trim()) {
      newErrors.description = "Bitte beschreibe deinen Auftrag."
    } else if (formData.description.length < 20) {
      newErrors.description = "Die Beschreibung muss mindestens 20 Zeichen lang sein."
    }
    if (!formData.plz.trim()) {
      newErrors.plz = "Bitte gib eine PLZ ein."
    } else if (!/^\d{5}$/.test(formData.plz)) {
      newErrors.plz = "Bitte gib eine gültige PLZ ein (5 Ziffern)."
    }
    if (!formData.ort.trim()) {
      newErrors.ort = "Bitte gib einen Ort ein."
    }
    if (!formData.timeframe) {
      newErrors.timeframe = "Bitte wähle einen Zeitraum aus."
    }
    if (!formData.noBudget) {
      if (formData.budgetMin && formData.budgetMax) {
        const min = Number.parseFloat(formData.budgetMin)
        const max = Number.parseFloat(formData.budgetMax)
        if (min > max) {
          newErrors.budgetMin = "Mindestbudget darf nicht größer als Maximum sein."
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast({
      title: "Gespeichert",
      description: "Deine Änderungen wurden erfolgreich gespeichert.",
    })
  }

  const handleCancel = () => {
    router.back()
  }

  const handleCloseRequest = async () => {
    setIsClosing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsClosing(false)
    setCloseDialogOpen(false)
    toast({
      title: "Auftrag geschlossen",
      description: "Dein Auftrag ist nicht mehr im Job-Board sichtbar.",
    })
    router.push("/app/requests")
  }

  const handlePlzChange = (value: string) => {
    setFormData((prev) => ({ ...prev, plz: value }))
    const match = berlinLocations.find((loc) => loc.plz === value)
    if (match) {
      setFormData((prev) => ({ ...prev, ort: match.ort }))
    }
    if (errors.plz) setErrors((prev) => ({ ...prev, plz: undefined }))
  }

  const removeExistingPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingPhotos: prev.existingPhotos.filter((_, i) => i !== index),
    }))
  }

  const removeNewPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      newPhotos: prev.newPhotos.filter((_, i) => i !== index),
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      const totalPhotos = formData.existingPhotos.length + formData.newPhotos.length + selectedFiles.length
      const maxNew = Math.max(0, 6 - formData.existingPhotos.length - formData.newPhotos.length)
      const newFiles = [...formData.newPhotos, ...selectedFiles.slice(0, maxNew)]
      setFormData((prev) => ({ ...prev, newPhotos: newFiles }))
    }
  }

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Auftrag bearbeiten</h1>
            <StatusBadge status={mockExistingRequest.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Erstellt am {format(mockExistingRequest.createdAt, "d. MMMM yyyy", { locale: de })} •{" "}
            {mockExistingRequest.offerCount} Antworten
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1 space-y-6">
            {/* Category & Title */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Kategorie <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, category: value }))
                      if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }))
                    }}
                  >
                    <SelectTrigger id="category" className={cn(errors.category && "border-destructive")}>
                      <SelectValue placeholder="Welche Art von Arbeit?" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Titel <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="z.B. Badezimmer Armatur tauschen"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                    }}
                    className={cn(errors.title && "border-destructive")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Kurz und prägnant – so finden Handwerker deinen Auftrag.
                  </p>
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Beschreibung <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Beschreibe, was genau gemacht werden soll..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                      if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
                    }}
                    className={cn("min-h-[120px]", errors.description && "border-destructive")}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Standort</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plz">
                      PLZ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="plz"
                      placeholder="z.B. 10115"
                      value={formData.plz}
                      onChange={(e) => handlePlzChange(e.target.value)}
                      className={cn(errors.plz && "border-destructive")}
                      maxLength={5}
                    />
                    {errors.plz && <p className="text-sm text-destructive">{errors.plz}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ort">
                      Ort <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ort"
                      placeholder="z.B. Berlin Mitte"
                      value={formData.ort}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, ort: e.target.value }))
                        if (errors.ort) setErrors((prev) => ({ ...prev, ort: undefined }))
                      }}
                      className={cn(errors.ort && "border-destructive")}
                    />
                    {errors.ort && <p className="text-sm text-destructive">{errors.ort}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeframe */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Wann soll es erledigt werden?</h3>
                <RadioGroup
                  value={formData.timeframe}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, timeframe: value }))
                    if (errors.timeframe) setErrors((prev) => ({ ...prev, timeframe: undefined }))
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="asap" id="asap" />
                    <Label htmlFor="asap" className="font-normal cursor-pointer">
                      So schnell wie möglich
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="week" id="week" />
                    <Label htmlFor="week" className="font-normal cursor-pointer">
                      In den nächsten 7 Tagen
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="custom" id="custom" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="custom" className="font-normal cursor-pointer">
                        Wunschtermin
                      </Label>
                      {formData.timeframe === "custom" && (
                        <div className="mt-2">
                          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formData.customDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.customDate
                                  ? format(formData.customDate, "PPP", { locale: de })
                                  : "Datum auswählen"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.customDate}
                                onSelect={(date) => {
                                  setFormData((prev) => ({ ...prev, customDate: date }))
                                  setDatePickerOpen(false)
                                }}
                                disabled={(date) => date < new Date()}
                                locale={de}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>
                {errors.timeframe && <p className="text-sm text-destructive">{errors.timeframe}</p>}
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Budget (optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Ein ungefähres Budget hilft Handwerkern, passende Angebote zu erstellen.
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="no-budget"
                    checked={formData.noBudget}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, noBudget: checked as boolean }))}
                  />
                  <label htmlFor="no-budget" className="text-sm cursor-pointer">
                    Kein Budget angeben
                  </label>
                </div>

                {!formData.noBudget && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget-min">Von</Label>
                      <div className="relative">
                        <Input
                          id="budget-min"
                          type="number"
                          placeholder="0"
                          value={formData.budgetMin}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, budgetMin: e.target.value }))
                            if (errors.budgetMin) setErrors((prev) => ({ ...prev, budgetMin: undefined }))
                          }}
                          className={cn("pr-8", errors.budgetMin && "border-destructive")}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          €
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget-max">Bis</Label>
                      <div className="relative">
                        <Input
                          id="budget-max"
                          type="number"
                          placeholder="0"
                          value={formData.budgetMax}
                          onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: e.target.value }))}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          €
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.budgetMin && <p className="text-sm text-destructive">{errors.budgetMin}</p>}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Fotos (optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Bilder helfen Handwerkern, den Umfang besser einzuschätzen.
                </p>

                {/* Existing Photos */}
                {formData.existingPhotos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Vorhandene Fotos</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.existingPhotos.map((photo, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted group"
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingPhoto(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Photos Upload */}
                {formData.existingPhotos.length + formData.newPhotos.length < 6 && (
                  <div
                    onClick={() => document.getElementById("photo-upload")?.click()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-border hover:border-primary/50 hover:bg-muted/50"
                  >
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-sm font-medium text-foreground mb-1">Weitere Fotos hinzufügen</p>
                    <p className="text-xs text-muted-foreground">
                      Noch {6 - formData.existingPhotos.length - formData.newPhotos.length} Fotos möglich
                    </p>
                  </div>
                )}

                {/* New Photos Preview */}
                {formData.newPhotos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Neue Fotos</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.newPhotos.map((file, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted group"
                        >
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Neues Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewPhoto(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons - Mobile */}
            <div className="lg:hidden flex flex-col gap-3">
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Änderungen speichern
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="w-full bg-transparent">
                Abbrechen
              </Button>
              <Button variant="destructive" onClick={() => setCloseDialogOpen(true)} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Auftrag schließen
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Tips Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  Tipp: Gute Aufträge bekommen schnellere Antworten
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Beschreibe den Umfang möglichst genau
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Lade Fotos hoch, die das Problem zeigen
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Gib ein realistisches Budget an
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Sei bei der Terminwahl flexibel
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Visibility Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Sichtbarkeit
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Dein Auftrag ist sichtbar im Job-Board solange er offen ist. Handwerker in deiner Nähe können dich
                  kontaktieren.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex flex-col gap-3 sticky top-24">
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Änderungen speichern
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="w-full bg-transparent">
                Abbrechen
              </Button>
              <Button variant="destructive" onClick={() => setCloseDialogOpen(true)} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Auftrag schließen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Close Request Confirmation Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auftrag schließen?</DialogTitle>
            <DialogDescription>
              Möchtest du diesen Auftrag wirklich schließen? Er wird nicht mehr im Job-Board angezeigt und Handwerker
              können keine neuen Angebote mehr senden.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="font-medium text-sm">{formData.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{mockExistingRequest.offerCount} Antworten erhalten</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleCloseRequest} disabled={isClosing}>
              {isClosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Schließen...
                </>
              ) : (
                "Ja, Auftrag schließen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
