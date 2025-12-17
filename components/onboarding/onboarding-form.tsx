"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Briefcase, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  completeCustomerOnboarding,
  completeProviderOnboarding,
} from "@/app/_actions/onboarding"

type AccountType = "customer" | "provider" | null

interface FormErrors {
  displayName?: string
  category?: string
  city?: string
  postalCode?: string
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
  { value: "Berlin", label: "Berlin" },
  { value: "Hamburg", label: "Hamburg" },
  { value: "München", label: "München" },
  { value: "Köln", label: "Köln" },
  { value: "Frankfurt", label: "Frankfurt" },
  { value: "Stuttgart", label: "Stuttgart" },
  { value: "Düsseldorf", label: "Düsseldorf" },
  { value: "Leipzig", label: "Leipzig" },
]

export function OnboardingForm() {
  const router = useRouter()
  const [accountType, setAccountType] = useState<AccountType>(null)
  const [displayName, setDisplayName] = useState("")
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [radius, setRadius] = useState([25])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (accountType === "provider") {
      if (!displayName.trim()) {
        newErrors.displayName = "Bitte gib deinen Anzeigenamen ein"
      } else if (displayName.trim().length < 2) {
        newErrors.displayName = "Name muss mindestens 2 Zeichen haben"
      }

      if (!category) {
        newErrors.category = "Bitte wähle eine Kategorie"
      }

      if (!city) {
        newErrors.city = "Bitte wähle eine Stadt"
      }

      if (!postalCode.trim()) {
        newErrors.postalCode = "Bitte gib deine Postleitzahl ein"
      } else if (!/^\d{5}$/.test(postalCode.trim())) {
        newErrors.postalCode = "Postleitzahl muss genau 5 Ziffern haben"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!accountType) return

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (accountType === "customer") {
        await completeCustomerOnboarding()
        router.push("/app")
      } else if (accountType === "provider") {
        await completeProviderOnboarding({
          displayName,
          baseCity: city,
          basePostalCode: postalCode,
          serviceRadiusKm: radius[0],
        })
        router.push("/provider")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      setIsSubmitting(false)
    }
  }

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      {/* Account Type Selection Tiles */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Customer Tile */}
        <button
          type="button"
          onClick={() => handleAccountTypeSelect("customer")}
          className={cn(
            "group relative flex flex-col items-start gap-4 rounded-xl border-2 bg-card p-6 text-left transition-all hover:border-secondary hover:shadow-md",
            accountType === "customer" ? "border-secondary ring-2 ring-secondary/20 shadow-md" : "border-border",
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-xl transition-colors",
              accountType === "customer"
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary",
            )}
          >
            <Search className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">Ich suche Handwerker</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Finde Angebote, buche Termine oder stelle einen Auftrag ein.
            </p>
          </div>
          {accountType === "customer" && (
            <div className="absolute top-4 right-4 size-5 rounded-full bg-secondary flex items-center justify-center">
              <svg
                className="size-3 text-secondary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>

        {/* Provider Tile */}
        <button
          type="button"
          onClick={() => handleAccountTypeSelect("provider")}
          className={cn(
            "group relative flex flex-col items-start gap-4 rounded-xl border-2 bg-card p-6 text-left transition-all hover:border-secondary hover:shadow-md",
            accountType === "provider" ? "border-secondary ring-2 ring-secondary/20 shadow-md" : "border-border",
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-xl transition-colors",
              accountType === "provider"
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary",
            )}
          >
            <Briefcase className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-foreground">Ich biete Leistungen an</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Erhalte Anfragen, sende Angebote und verwalte Jobs.
            </p>
          </div>
          {accountType === "provider" && (
            <div className="absolute top-4 right-4 size-5 rounded-full bg-secondary flex items-center justify-center">
              <svg
                className="size-3 text-secondary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Provider Mini Form */}
      {accountType === "provider" && (
        <div className="rounded-xl border bg-card p-6 space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="space-y-1.5">
            <h4 className="font-medium text-foreground">Erzähl uns mehr über dich</h4>
            <p className="text-sm text-muted-foreground">Diese Angaben kannst du später jederzeit ändern.</p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Anzeigename</Label>
            <Input
              id="displayName"
              placeholder="z.B. Müller Elektrotechnik"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value)
                if (errors.displayName) {
                  setErrors((prev) => ({ ...prev, displayName: undefined }))
                }
              }}
              className={cn(errors.displayName && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
          </div>

          {/* Primary Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Hauptkategorie</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value)
                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: undefined }))
                }
              }}
            >
              <SelectTrigger
                id="category"
                className={cn("w-full", errors.category && "border-destructive focus-visible:ring-destructive/20")}
              >
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

          {/* Base City */}
          <div className="space-y-2">
            <Label htmlFor="city">Standort</Label>
            <Select
              value={city}
              onValueChange={(value) => {
                setCity(value)
                if (errors.city) {
                  setErrors((prev) => ({ ...prev, city: undefined }))
                }
              }}
            >
              <SelectTrigger
                id="city"
                className={cn("w-full", errors.city && "border-destructive focus-visible:ring-destructive/20")}
              >
                <SelectValue placeholder="Stadt auswählen" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postleitzahl</Label>
            <Input
              id="postalCode"
              type="text"
              inputMode="numeric"
              placeholder="z.B. 10115"
              maxLength={5}
              value={postalCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                setPostalCode(value)
                if (errors.postalCode) {
                  setErrors((prev) => ({ ...prev, postalCode: undefined }))
                }
              }}
              className={cn(errors.postalCode && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
          </div>

          {/* Service Radius Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Einsatzradius</Label>
              <span className="text-sm font-medium text-foreground">{radius[0]} km</span>
            </div>
            <Slider value={radius} onValueChange={setRadius} min={5} max={50} step={5} className="w-full" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>5 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!accountType || isSubmitting}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Wird gespeichert...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Weiter
            <ChevronRight className="size-5" />
          </span>
        )}
      </Button>
    </div>
  )
}
