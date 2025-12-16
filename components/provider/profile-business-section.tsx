"use client"

import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileBusinessSectionProps {
  companyName: string
  vatId: string
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function ProfileBusinessSection({ companyName, vatId, onChange, errors }: ProfileBusinessSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Geschäftsdaten
        </CardTitle>
        <CardDescription>Informationen zu deinem Unternehmen (nicht öffentlich sichtbar)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Firmenname</Label>
          <Input
            id="companyName"
            placeholder="z.B. Müller Sanitär GmbH"
            value={companyName}
            onChange={(e) => onChange("companyName", e.target.value)}
            className={cn(errors.companyName && "border-destructive")}
          />
          <p className="text-xs text-muted-foreground">Offizieller Firmenname für Rechnungen</p>
          {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
        </div>

        {/* VAT ID */}
        <div className="space-y-2">
          <Label htmlFor="vatId">USt-IdNr. (optional)</Label>
          <Input
            id="vatId"
            placeholder="z.B. DE123456789"
            value={vatId}
            onChange={(e) => onChange("vatId", e.target.value)}
            className={cn(errors.vatId && "border-destructive")}
          />
          <p className="text-xs text-muted-foreground">Umsatzsteuer-Identifikationsnummer, falls vorhanden</p>
          {errors.vatId && <p className="text-sm text-destructive">{errors.vatId}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
