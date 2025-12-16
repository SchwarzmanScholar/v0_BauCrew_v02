"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"

const cities = [
  { value: "berlin", label: "Berlin" },
  { value: "hamburg", label: "Hamburg" },
  { value: "muenchen", label: "München" },
  { value: "koeln", label: "Köln" },
]

const categories = [
  { value: "handwerker", label: "Handwerker" },
  { value: "maler", label: "Maler" },
  { value: "elektriker", label: "Elektriker" },
  { value: "sanitaer", label: "Sanitär" },
  { value: "trockenbau", label: "Trockenbau" },
]

export function HeroSection() {
  const [isSearching, setIsSearching] = useState(false)
  const [city, setCity] = useState("")
  const [category, setCategory] = useState("")
  const [keyword, setKeyword] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
      // Would navigate to search results
    }, 1500)
  }

  const isFormValid = city && category

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-16 md:py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Finde geprüfte Handwerker in deiner Nähe.
          </h1>

          {/* Subhead */}
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
            Elektriker, Sanitär, Maler, Trockenbau – buchen oder Auftrag einstellen.
          </p>

          {/* Search Module */}
          <form onSubmit={handleSearch} className="mt-10">
            <div className="rounded-xl border border-border bg-card p-4 shadow-lg md:p-6">
              <div className="grid gap-4 md:grid-cols-4">
                {/* City Select */}
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Stadt wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Category Select */}
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Keyword Input */}
                <Input
                  type="text"
                  placeholder="Stichwort (optional)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-12 bg-background"
                />

                {/* Search Button */}
                <Button type="submit" size="lg" className="h-12" disabled={!isFormValid || isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suche...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Suchen
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Secondary Link */}
          <p className="mt-6 text-sm text-muted-foreground">
            Nichts passendes gefunden?{" "}
            <Link href="/auftrag" className="font-medium text-secondary underline-offset-4 hover:underline">
              Auftrag einstellen
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
