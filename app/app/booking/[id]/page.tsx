"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/baucrew/app-shell"
import { ListingSummaryCard } from "@/components/booking/listing-summary-card"
import { PhotoUpload } from "@/components/booking/photo-upload"
import { PriceSummary } from "@/components/booking/price-summary"
import { BookingSuccess } from "@/components/booking/booking-success"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { mockListingDetail } from "@/lib/mock-data"

interface FormData {
  preferredDate: Date | undefined
  preferredTime: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  jobTitle: string
  jobDescription: string
  photos: File[]
  accessNotes: string
}

interface FormErrors {
  preferredDate?: string
  preferredTime?: string
  street?: string
  houseNumber?: string
  postalCode?: string
  city?: string
  jobTitle?: string
  jobDescription?: string
}

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export default function BookingRequestPage() {
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    preferredDate: undefined,
    preferredTime: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    jobTitle: "",
    jobDescription: "",
    photos: [],
    accessNotes: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Use mock listing data
  const listing = mockListingDetail

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Bitte wähle ein Datum"
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Bitte wähle eine Uhrzeit"
    }
    if (!formData.street.trim()) {
      newErrors.street = "Straße erforderlich"
    }
    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = "Hausnummer erforderlich"
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "PLZ erforderlich"
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Ungültige PLZ"
    }
    if (!formData.city.trim()) {
      newErrors.city = "Ort erforderlich"
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Auftragsbezeichnung erforderlich"
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Beschreibung erforderlich"
    } else if (formData.jobDescription.length < 20) {
      newErrors.jobDescription = "Mindestens 20 Zeichen erforderlich"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <AppShell userRole="customer">
        <BookingSuccess />
      </AppShell>
    )
  }

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back link */}
        <Link
          href={`/app/listing/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Angebot
        </Link>

        <h1 className="text-2xl font-bold mb-6">Termin anfragen</h1>

        {/* Listing summary */}
        <div className="mb-6">
          <ListingSummaryCard listing={listing} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main form column */}
            <div className="flex-1 space-y-8">
              {/* Date & Time */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Wunschtermin</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.preferredDate && "text-muted-foreground",
                            errors.preferredDate && "border-destructive",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.preferredDate ? (
                            format(formData.preferredDate, "PPP", { locale: de })
                          ) : (
                            <span>Datum wählen</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.preferredDate}
                          onSelect={(date) => updateField("preferredDate", date)}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.preferredDate && <p className="text-xs text-destructive">{errors.preferredDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Uhrzeit</Label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) => updateField("preferredTime", value)}
                    >
                      <SelectTrigger className={cn(errors.preferredTime && "border-destructive")}>
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
                    {errors.preferredTime && <p className="text-xs text-destructive">{errors.preferredTime}</p>}
                  </div>
                </div>
              </section>

              {/* Address */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Adresse</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3 space-y-2">
                    <Label htmlFor="street">Straße</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => updateField("street", e.target.value)}
                      placeholder="Musterstraße"
                      className={cn(errors.street && "border-destructive")}
                    />
                    {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">Hausnr.</Label>
                    <Input
                      id="houseNumber"
                      value={formData.houseNumber}
                      onChange={(e) => updateField("houseNumber", e.target.value)}
                      placeholder="12a"
                      className={cn(errors.houseNumber && "border-destructive")}
                    />
                    {errors.houseNumber && <p className="text-xs text-destructive">{errors.houseNumber}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">PLZ</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      placeholder="10115"
                      maxLength={5}
                      className={cn(errors.postalCode && "border-destructive")}
                    />
                    {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="city">Ort</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Berlin"
                      className={cn(errors.city && "border-destructive")}
                    />
                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                  </div>
                </div>
              </section>

              {/* Job Details */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Auftragsdetails</h2>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Auftragsbezeichnung</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="z.B. Badezimmer komplett renovieren"
                    className={cn(errors.jobTitle && "border-destructive")}
                  />
                  {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Beschreibung</Label>
                  <Textarea
                    id="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => updateField("jobDescription", e.target.value)}
                    placeholder="Beschreibe den Auftrag möglichst genau: Was soll gemacht werden? Welche Materialien? Besondere Anforderungen?"
                    rows={5}
                    className={cn(errors.jobDescription && "border-destructive")}
                  />
                  <div className="flex justify-between items-center">
                    {errors.jobDescription ? (
                      <p className="text-xs text-destructive">{errors.jobDescription}</p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-muted-foreground">{formData.jobDescription.length} / 20 min.</p>
                  </div>
                </div>
              </section>

              {/* Photo Upload */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Fotos (optional)</h2>
                <p className="text-sm text-muted-foreground">
                  Fotos helfen dem Handwerker, den Umfang besser einzuschätzen.
                </p>
                <PhotoUpload value={formData.photos} onChange={(files) => updateField("photos", files)} maxFiles={5} />
              </section>

              {/* Access Notes */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Zugangshinweise (optional)</h2>
                <Textarea
                  value={formData.accessNotes}
                  onChange={(e) => updateField("accessNotes", e.target.value)}
                  placeholder="z.B. Hinterhaus, 3. Stock links, Klingeln bei Müller"
                  rows={3}
                />
              </section>

              {/* Mobile Submit */}
              <div className="lg:hidden pt-4">
                <PriceSummary subtotal={listing.priceFrom} />
                <div className="mt-4 space-y-3">
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      "Anfrage senden"
                    )}
                  </Button>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/app/requests/new">Stattdessen Auftrag einstellen</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <PriceSummary subtotal={listing.priceFrom} />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    "Anfrage senden"
                  )}
                </Button>

                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/app/requests/new">Stattdessen Auftrag einstellen</Link>
                </Button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
