"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/baucrew/app-shell"
import { PhotoCarousel } from "@/components/listing/photo-carousel"
import { ProviderSidebar } from "@/components/listing/provider-sidebar"
import { ReviewsSection } from "@/components/listing/reviews-section"
import { UnverifiedWarning } from "@/components/listing/unverified-warning"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, CheckCircle2 } from "lucide-react"
import { mockListingDetail, mockListingDetailUnverified } from "@/lib/mock-data"
import type { ListingDetail } from "@/lib/types"

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export default function ListingPage({ params }: ListingPageProps) {
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadListing() {
      const { id } = await params
      // Simulate loading
      setTimeout(() => {
        // Use unverified listing for demo if id contains "unverified"
        if (id.includes("unverified")) {
          setListing(mockListingDetailUnverified)
        } else {
          setListing(mockListingDetail)
        }
        setIsLoading(false)
      }, 800)
    }
    loadListing()
  }, [params])

  if (isLoading) {
    return (
      <AppShell userRole="customer">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="w-full lg:w-80 space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!listing) {
    return (
      <AppShell userRole="customer">
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Angebot nicht gefunden.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8">
        {/* Unverified warning banner */}
        {!listing.verified && <UnverifiedWarning />}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Main content */}
          <div className="flex-1 min-w-0">
            {/* Photo carousel */}
            <PhotoCarousel photos={listing.photos} title={listing.title} />

            {/* Title & category */}
            <div className="mt-6">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-balance">{listing.title}</h1>
                <Badge variant="secondary">{listing.category}</Badge>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Beschreibung</h2>
              <p className="text-foreground/90 leading-relaxed">{listing.fullDescription}</p>
            </div>

            {/* Leistungsumfang */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Leistungsumfang</h2>
              <ul className="space-y-2">
                {listing.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicegebiet */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Servicegebiet</h2>
              <div className="flex items-center gap-2 text-foreground/90">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>
                  {listing.serviceArea.city} + {listing.serviceArea.radius} km Umkreis
                </span>
              </div>
            </div>

            {/* Reviews section */}
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-semibold mb-4">Bewertungen</h2>
              <ReviewsSection
                reviews={listing.reviews}
                averageRating={listing.rating}
                totalCount={listing.reviewCount}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start">
            <ProviderSidebar listing={listing} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
