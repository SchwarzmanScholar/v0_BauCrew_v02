"use client"

import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileServiceAreaSectionProps {
  city: string
  plz: string
  radius: number
  onChange: (field: string, value: string | number) => void
  errors: Record<string, string>
}

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

export function ProfileServiceAreaSection({ city, plz, radius, onChange, errors }: ProfileServiceAreaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Servicegebiet
        </CardTitle>
        <CardDescription>Wo bietest du deine Leistungen an?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">Stadt</Label>
            <Select value={city} onValueChange={(value) => onChange("city", value)}>
              <SelectTrigger id="city" className={cn(errors.city && "border-destructive")}>
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

          {/* PLZ */}
          <div className="space-y-2">
            <Label htmlFor="plz">Postleitzahl</Label>
            <Input
              id="plz"
              placeholder="z.B. 10115"
              value={plz}
              onChange={(e) => onChange("plz", e.target.value)}
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
            <span className="text-sm font-medium px-2 py-1 rounded-md bg-muted">{radius} km</span>
          </div>
          <Slider value={[radius]} onValueChange={(value) => onChange("radius", value[0])} min={5} max={100} step={5} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>5 km</span>
            <span>100 km</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Kunden innerhalb dieses Radius können deine Leistungen anfragen
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
