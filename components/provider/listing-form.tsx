"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Save, Eye, ArrowLeft, Info, Euro } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ProviderListingDetail } from "@/lib/types"

interface ListingFormProps {
  listing?: ProviderListingDetail
  isEdit?: boolean
}

interface FormData {
  title: string
  category: string
  description: string
  priceType: "fixed" | "hourly" | "quote"
  price: string
  city: string
  plz: string
  radius: number[]
  isActive: boolean
}

interface FormErrors {
  title?: string
  category?: string
  description?: string
  price?: string
  city?: string
  plz?: string
}

const categories = [
  { value: "handwerker", label: "Allgemeiner Handwerker" },
  { value: "elektriker", label: "Elektriker" },
  { value: "sanitaer", label: "Sanitär & Heizung" },
  { value: "maler", label: "Maler & Lackierer" },
  { value: "trockenbau", label: "Trockenbau" },
  { value: "tischler", label: "Tischler & Schreiner" },
  { value: "fliesenleger", label: "Fliesenleger" },
]

const cities = [
  { value: "berlin", label: "Berlin" },
  { value: "hamburg", label: "Hamburg" },
  { value: "muenchen", label: "München" },
  { value: "koeln", label: "Köln" },
  { value: "frankfurt", label: "Frankfurt" },
  { value: "stuttgart", label: "Stuttgart" },
  { value: "duesseldorf", label: "Düsseldorf" },
  { value: "leipzig", label: "Leipzig" },
]

export function ListingForm({ listing, isEdit = false }: ListingFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    title: listing?.title ?? "",
    category: listing?.category ?? "",
    description: listing?.description ?? "",
    priceType: listing?.priceType ?? "fixed",
    price: listing?.price?.toString() ?? "",
    city: listing?.city ?? "",
    plz: listing?.plz ?? "",
    radius: [listing?.radius ?? 25],
    isActive: listing?.isActive ?? true,
  })

  const [photos, setPhotos] = useState<(File | string)[]>(listing?.photos ?? [])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPreview, setIsSavingPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Bitte gib einen Titel ein"
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Titel muss mindestens 5 Zeichen haben"
    }

    if (!formData.category) {
      newErrors.category = "Bitte wähle eine Kategorie"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Bitte gib eine Beschreibung ein"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Beschreibung muss mindestens 20 Zeichen haben"
    }

    if (formData.priceType !== "quote") {
      if (!formData.price.trim()) {
        newErrors.price = "Bitte gib einen Preis ein"
      } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        newErrors.price = "Bitte gib einen gültigen Preis ein"
      }
    }

    if (!formData.city) {
      newErrors.city = "Bitte wähle eine Stadt"
    }

    if (!formData.plz.trim()) {
      newErrors.plz = "Bitte gib eine PLZ ein"
    } else if (!/^\d{5}$/.test(formData.plz.trim())) {
      newErrors.plz = "PLZ muss 5 Ziffern haben"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (preview = false) => {
    if (!validateForm()) return

    if (preview) {
      setIsSavingPreview(true)
    } else {
      setIsSaving(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (preview) {
      setIsSavingPreview(false)
      // Would navigate to preview in real app
      router.push("/provider/listings")
    } else {
      setIsSaving(false)
      router.push("/provider/listings")
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      const newPhotos = [...photos, ...droppedFiles].slice(0, 8)
      setPhotos(newPhotos)
    },
    [photos],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
        const newPhotos = [...photos, ...selectedFiles].slice(0, 8)
        setPhotos(newPhotos)
      }
    },
    [photos],
  )

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const updateField = (field: keyof FormData, value: string | number[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Leistung bearbeiten" : "Neue Leistung erstellen"}</h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? "Aktualisiere die Details deiner Leistung" : "Erstelle eine neue Leistung für dein Angebot"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Grundinformationen</CardTitle>
              <CardDescription>Titel und Kategorie deiner Leistung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  placeholder="z.B. Badezimmerrenovierung - Komplettservice"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={cn(errors.title && "border-destructive")}
                />
                <p className="text-xs text-muted-foreground">
                  Ein aussagekräftiger Titel hilft Kunden, deine Leistung zu finden
                </p>
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
                  <SelectTrigger id="category" className={cn(errors.category && "border-destructive")}>
                    <SelectValue placeholder="Kategorie auswählen" />
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreibe deine Leistung ausführlich. Was ist inbegriffen? Welche Materialien verwendest du?"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={cn("min-h-32 resize-none", errors.description && "border-destructive")}
                />
                <p className="text-xs text-muted-foreground">
                  Mindestens 20 Zeichen. Je detaillierter, desto besser können Kunden dein Angebot einschätzen.
                </p>
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Preisgestaltung</CardTitle>
              <CardDescription>Wie berechnest du deine Leistung?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Type */}
              <div className="space-y-3">
                <Label>Preisart</Label>
                <RadioGroup
                  value={formData.priceType}
                  onValueChange={(value) => updateField("priceType", value as "fixed" | "hourly" | "quote")}
                  className="grid gap-3"
                >
                  <label
                    htmlFor="price-fixed"
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      formData.priceType === "fixed" && "border-secondary bg-secondary/5",
                    )}
                  >
                    <RadioGroupItem value="fixed" id="price-fixed" className="mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-medium">Festpreis</span>
                      <p className="text-sm text-muted-foreground">Ein fester Preis für das gesamte Projekt</p>
                    </div>
                  </label>

                  <label
                    htmlFor="price-hourly"
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      formData.priceType === "hourly" && "border-secondary bg-secondary/5",
                    )}
                  >
                    <RadioGroupItem value="hourly" id="price-hourly" className="mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-medium">Stundensatz</span>
                      <p className="text-sm text-muted-foreground">Abrechnung nach tatsächlich geleisteten Stunden</p>
                    </div>
                  </label>

                  <label
                    htmlFor="price-quote"
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      formData.priceType === "quote" && "border-secondary bg-secondary/5",
                    )}
                  >
                    <RadioGroupItem value="quote" id="price-quote" className="mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-medium">Auf Anfrage</span>
                      <p className="text-sm text-muted-foreground">
                        Preis wird individuell nach Projektumfang bestimmt
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Price Input */}
              {formData.priceType !== "quote" && (
                <div className="space-y-2">
                  <Label htmlFor="price">{formData.priceType === "fixed" ? "Festpreis" : "Stundensatz"} (EUR)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder={formData.priceType === "fixed" ? "z.B. 2500" : "z.B. 65"}
                      value={formData.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className={cn("pl-10", errors.price && "border-destructive")}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.priceType === "fixed"
                      ? "Der Preis, den Kunden für diese Leistung zahlen"
                      : "Dein Stundensatz für diese Leistung"}
                  </p>
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Area */}
          <Card>
            <CardHeader>
              <CardTitle>Servicegebiet</CardTitle>
              <CardDescription>Wo bietest du diese Leistung an?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">Stadt</Label>
                  <Select value={formData.city} onValueChange={(value) => updateField("city", value)}>
                    <SelectTrigger id="city" className={cn(errors.city && "border-destructive")}>
                      <SelectValue placeholder="Stadt auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>

                {/* PLZ */}
                <div className="space-y-2">
                  <Label htmlFor="plz">Postleitzahl</Label>
                  <Input
                    id="plz"
                    placeholder="z.B. 10115"
                    value={formData.plz}
                    onChange={(e) => updateField("plz", e.target.value)}
                    className={cn(errors.plz && "border-destructive")}
                    maxLength={5}
                  />
                  {errors.plz && <p className="text-sm text-destructive">{errors.plz}</p>}
                </div>
              </div>

              {/* Radius Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Einsatzradius</Label>
                  <span className="text-sm font-medium">{formData.radius[0]} km</span>
                </div>
                <Slider
                  value={formData.radius}
                  onValueChange={(value) => updateField("radius", value)}
                  min={5}
                  max={100}
                  step={5}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>5 km</span>
                  <span>100 km</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kunden innerhalb dieses Radius können deine Leistung buchen
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
              <CardDescription>Zeige Beispiele deiner Arbeit (max. 8 Fotos)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                  photos.length >= 8 && "opacity-50 pointer-events-none",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={photos.length >= 8}
                />
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-foreground mb-1">Fotos hochladen</p>
                <p className="text-sm text-muted-foreground">Drag & Drop oder klicken zum Auswählen</p>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border bg-muted group"
                    >
                      <img
                        src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Gute Fotos erhöhen die Buchungsrate um bis zu 40%. Zeige vorher/nachher Bilder und Details deiner
                  Arbeit.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="active-toggle">Aktiv</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.isActive ? "Leistung ist sichtbar" : "Leistung ist versteckt"}
                  </p>
                </div>
                <Switch
                  id="active-toggle"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => handleSave(false)} disabled={isSaving || isSavingPreview} className="w-full">
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Speichern...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Speichern
                  </span>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleSave(true)}
                disabled={isSaving || isSavingPreview}
                className="w-full"
              >
                {isSavingPreview ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Speichern...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Speichern & Vorschau
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving || isSavingPreview}
                className="w-full"
              >
                Abbrechen
              </Button>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Tipps für eine gute Leistung</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    <span>Wähle einen klaren, beschreibenden Titel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    <span>Beschreibe genau, was im Preis enthalten ist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    <span>Füge hochwertige Fotos hinzu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    <span>Setze einen fairen, wettbewerbsfähigen Preis</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
