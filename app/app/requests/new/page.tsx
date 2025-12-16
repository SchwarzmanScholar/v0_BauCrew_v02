"use client"

import { useState } from "react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PhotoUpload } from "@/components/booking/photo-upload"
import { HowItWorksSidebar } from "@/components/job-request/how-it-works-sidebar"
import { JobRequestSuccess } from "@/components/job-request/job-request-success"
import { CalendarIcon, Loader2, AlertTriangle, Save } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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
  photos: File[]
  contactInApp: boolean
  contactPhone: boolean
  phoneNumber: string
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
  phoneNumber?: string
}

export default function NewJobRequestPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    category: "",
    title: "",
    description: "",
    plz: "",
    ort: "",
    timeframe: "asap",
    customDate: undefined,
    budgetMin: "",
    budgetMax: "",
    noBudget: false,
    photos: [],
    contactInApp: true,
    contactPhone: false,
    phoneNumber: "",
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
    if (formData.contactPhone && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Bitte gib deine Telefonnummer ein."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleSaveDraft = () => {
    toast({
      title: "Entwurf gespeichert",
      description: "Du kannst deinen Auftrag später weiter bearbeiten.",
    })
  }

  const handlePlzChange = (value: string) => {
    setFormData((prev) => ({ ...prev, plz: value }))
    // Auto-fill city based on PLZ
    const match = berlinLocations.find((loc) => loc.plz === value)
    if (match) {
      setFormData((prev) => ({ ...prev, ort: match.ort }))
    }
    if (errors.plz) setErrors((prev) => ({ ...prev, plz: undefined }))
  }

  if (isSuccess) {
    return (
      <AppShell userRole="customer">
        <div className="container mx-auto px-4 py-8">
          <JobRequestSuccess />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Arbeitsauftrag einstellen</h1>
          <p className="text-muted-foreground mt-1">
            Beschreibe kurz, was gemacht werden soll. Handwerker können dich kontaktieren.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1 space-y-6">
            {/* Category */}
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

                {/* Job Title */}
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

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Beschreibung <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Beschreibe, was genau gemacht werden soll. Je detaillierter, desto besser können Handwerker dir ein Angebot machen."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                      if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
                    }}
                    className={cn("min-h-[120px]", errors.description && "border-destructive")}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox id="no-sensitive" />
                    <label htmlFor="no-sensitive" className="text-xs text-muted-foreground">
                      Keine sensiblen Daten teilen (z.B. Adresse, Telefonnummer)
                    </label>
                  </div>
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
                <PhotoUpload
                  value={formData.photos}
                  onChange={(files) => setFormData((prev) => ({ ...prev, photos: files }))}
                  maxFiles={6}
                />
              </CardContent>
            </Card>

            {/* Contact Preferences */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Kontaktmöglichkeit</h3>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">In-App Nachrichten</p>
                    <p className="text-xs text-muted-foreground">Empfohlen – sicher und nachvollziehbar</p>
                  </div>
                  <Switch
                    checked={formData.contactInApp}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, contactInApp: checked }))}
                    disabled
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Telefon anzeigen</p>
                      <p className="text-xs text-muted-foreground">Optional – für schnellere Abstimmung</p>
                    </div>
                    <Switch
                      checked={formData.contactPhone}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, contactPhone: checked }))}
                    />
                  </div>

                  {formData.contactPhone && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <p className="text-xs">
                          Deine Telefonnummer wird für alle Handwerker sichtbar sein. Wir empfehlen, zunächst über
                          In-App Nachrichten zu kommunizieren.
                        </p>
                      </div>
                      <Input
                        placeholder="z.B. +49 170 1234567"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                          if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
                        }}
                        className={cn(errors.phoneNumber && "border-destructive")}
                      />
                      {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pb-8">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 sm:flex-none">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird veröffentlicht...
                  </>
                ) : (
                  "Auftrag veröffentlichen"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="gap-2 bg-transparent"
              >
                <Save className="h-4 w-4" />
                Als Entwurf speichern
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <HowItWorksSidebar />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
