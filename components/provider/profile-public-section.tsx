"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Globe, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProfilePublicSectionProps {
  avatar: string
  displayName: string
  headline: string
  bio: string
  website: string
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function ProfilePublicSection({
  avatar,
  displayName,
  headline,
  bio,
  website,
  onChange,
  errors,
}: ProfilePublicSectionProps) {
  const [avatarPreview, setAvatarPreview] = useState(avatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
      onChange("avatar", url)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Öffentliches Profil</CardTitle>
        <CardDescription>Diese Informationen werden für Kunden sichtbar sein</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="text-2xl">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Profilbild</p>
            <p className="text-xs text-muted-foreground">JPG, PNG oder GIF. Max. 5 MB.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Bild ändern
            </Button>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Anzeigename</Label>
          <Input
            id="displayName"
            placeholder="z.B. Klaus Müller"
            value={displayName}
            onChange={(e) => onChange("displayName", e.target.value)}
            className={cn(errors.displayName && "border-destructive")}
          />
          <p className="text-xs text-muted-foreground">Der Name, unter dem du für Kunden sichtbar bist</p>
          {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <Label htmlFor="headline">Kurzbeschreibung</Label>
          <Input
            id="headline"
            placeholder="z.B. Meisterbetrieb für Sanitär & Heizung seit 2005"
            value={headline}
            onChange={(e) => onChange("headline", e.target.value)}
            className={cn(errors.headline && "border-destructive")}
            maxLength={100}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Ein kurzer Satz, der dein Angebot beschreibt</p>
            <span className="text-xs text-muted-foreground">{headline.length}/100</span>
          </div>
          {errors.headline && <p className="text-sm text-destructive">{errors.headline}</p>}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Über mich</Label>
          <Textarea
            id="bio"
            placeholder="Erzähle potenziellen Kunden etwas über dich, deine Erfahrung und deine Arbeitsweise..."
            value={bio}
            onChange={(e) => onChange("bio", e.target.value)}
            className={cn("min-h-32 resize-none", errors.bio && "border-destructive")}
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Beschreibe deine Erfahrung und Qualifikationen</p>
            <span className="text-xs text-muted-foreground">{bio.length}/1000</span>
          </div>
          {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website"
              placeholder="https://www.deine-website.de"
              value={website}
              onChange={(e) => onChange("website", e.target.value)}
              className={cn("pl-10", errors.website && "border-destructive")}
            />
          </div>
          {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>Ein vollständiges Profil erhöht die Chance auf Anfragen um bis zu 60%.</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
