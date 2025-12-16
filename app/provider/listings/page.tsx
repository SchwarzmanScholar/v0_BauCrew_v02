"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/baucrew/app-shell"
import { EmptyState } from "@/components/baucrew/empty-state"
import { ProviderListingCard } from "@/components/provider/provider-listing-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Package, Search } from "lucide-react"
import { mockProviderListings } from "@/lib/mock-data"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProviderListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showEmpty = searchParams.get("empty") === "true"

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Get unique categories
  const categories = Array.from(new Set(mockProviderListings.map((l) => l.category)))

  // Filter listings
  const filteredListings = showEmpty
    ? []
    : mockProviderListings.filter((listing) => {
        const matchesSearch =
          searchQuery === "" ||
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && listing.isActive) ||
          (statusFilter === "inactive" && !listing.isActive)

        return matchesSearch && matchesCategory && matchesStatus
      })

  const activeCount = mockProviderListings.filter((l) => l.isActive).length
  const inactiveCount = mockProviderListings.filter((l) => !l.isActive).length

  const handleToggleActive = (id: string, isActive: boolean) => {
    // In real app, this would update the backend
    console.log(`Listing ${id} is now ${isActive ? "active" : "inactive"}`)
  }

  return (
    <AppShell userRole="provider" userName="Thomas Weber">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meine Leistungen</h1>
            <p className="text-muted-foreground mt-1">Verwalte deine angebotenen Services</p>
          </div>
          <Button asChild className="bg-secondary hover:bg-secondary/90">
            <Link href="/provider/listings/new">
              <Plus className="h-4 w-4 mr-2" />
              Neue Leistung
            </Link>
          </Button>
        </div>

        {/* Stats summary */}
        {!showEmpty && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{mockProviderListings.length}</span>
              <span className="text-muted-foreground">Leistungen gesamt</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="font-medium text-foreground">{activeCount}</span>
              <span className="text-muted-foreground">Aktiv</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="font-medium text-foreground">{inactiveCount}</span>
              <span className="text-muted-foreground">Inaktiv</span>
            </div>
          </div>
        )}

        {/* Filters */}
        {!showEmpty && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Leistung suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Content */}
        {filteredListings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Noch keine Leistungen"
            description="Erstelle deine erste Leistung, um für Kunden sichtbar zu werden und Buchungen zu erhalten."
            actionLabel="Erste Leistung anlegen"
            onAction={() => router.push("/provider/listings/new")}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredListings.map((listing) => (
              <ProviderListingCard key={listing.id} listing={listing} onToggleActive={handleToggleActive} />
            ))}
          </div>
        )}

        {/* No results from filter */}
        {!showEmpty && filteredListings.length === 0 && mockProviderListings.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Keine Leistungen gefunden. Passe deine Filter an.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
                setStatusFilter("all")
              }}
            >
              Filter zurücksetzen
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
