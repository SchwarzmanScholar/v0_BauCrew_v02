"use client"

import { AppShell } from "@/components/baucrew/app-shell"
import { ListingCard } from "@/components/baucrew/listing-card"
import { JobRequestCard } from "@/components/baucrew/job-request-card"
import { EmptyState } from "@/components/baucrew/empty-state"
import { MessageThreadPanel } from "@/components/baucrew/message-thread-panel"
import { OfferCard } from "@/components/baucrew/offer-card"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { LoadingSkeletonGrid } from "@/components/baucrew/loading-skeleton-grid"
import { mockListings, mockJobRequests, mockMessages, mockOffers } from "@/lib/mock-data"
import { Search, Briefcase, Calendar, MessageSquare } from "lucide-react"

export default function ComponentShowcasePage() {
  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-2">BauCrew UI Component Library</h1>
          <p className="text-muted-foreground mb-8">
            Wiederverwendbare Komponenten für die BauCrew Marketplace Plattform
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Service Listings</h2>
          <p className="text-muted-foreground mb-6">
            Karten zur Anzeige von Dienstleistungsangeboten mit Bewertung, Verifizierung und Preis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onClick={() => console.log("Clicked:", listing.id)} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Job Requests</h2>
          <p className="text-muted-foreground mb-6">
            Karten für Auftragsanfragen mit Dringlichkeit, Budget und Angebotszähler
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockJobRequests.map((jobRequest) => (
              <JobRequestCard
                key={jobRequest.id}
                jobRequest={jobRequest}
                onClick={() => console.log("Clicked:", jobRequest.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Status Badges</h2>
          <p className="text-muted-foreground mb-6">Visuelle Indikatoren für verschiedene Buchungs- und Job-Status</p>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="pending" />
            <StatusBadge status="confirmed" />
            <StatusBadge status="in_progress" />
            <StatusBadge status="completed" />
            <StatusBadge status="cancelled" />
            <StatusBadge status="disputed" />
            <StatusBadge status="open" />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Offers</h2>
          <p className="text-muted-foreground mb-6">Angebotskarten von Handwerkern mit Preis, Dauer und Nachricht</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onAccept={() => console.log("Accepted:", offer.id)}
                onDecline={() => console.log("Declined:", offer.id)}
                onContact={() => console.log("Contact:", offer.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Message Thread</h2>
          <p className="text-muted-foreground mb-6">Chat-Interface für Kommunikation zwischen Kunden und Handwerkern</p>
          <div className="max-w-3xl">
            <MessageThreadPanel messages={mockMessages} onSendMessage={(content) => console.log("Send:", content)} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Empty States</h2>
          <p className="text-muted-foreground mb-6">Kontextuelle Leerdarstellungen mit Icons und CTAs</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg">
              <EmptyState
                icon={Search}
                title="Keine Handwerker gefunden"
                description="Passen Sie Ihre Suchfilter an, um mehr Ergebnisse zu erhalten."
                actionLabel="Filter zurücksetzen"
                onAction={() => console.log("Reset filters")}
              />
            </div>
            <div className="border rounded-lg">
              <EmptyState
                icon={Briefcase}
                title="Noch keine Aufträge"
                description="Erstellen Sie Ihre erste Auftragsanfrage und erhalten Sie Angebote von qualifizierten Handwerkern."
                actionLabel="Auftrag erstellen"
                onAction={() => console.log("Create job")}
              />
            </div>
            <div className="border rounded-lg">
              <EmptyState
                icon={MessageSquare}
                title="Keine Nachrichten"
                description="Ihre Konversationen mit Handwerkern erscheinen hier."
              />
            </div>
            <div className="border rounded-lg">
              <EmptyState
                icon={Calendar}
                title="Keine Buchungen"
                description="Sobald Sie einen Auftrag vergeben, erscheint er in Ihrem Kalender."
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Loading States</h2>
          <p className="text-muted-foreground mb-6">Skeleton-Ladezustände für verschiedene Kartentypen</p>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Listing Skeleton</h3>
              <LoadingSkeletonGrid count={3} variant="listing" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Job Skeleton</h3>
              <LoadingSkeletonGrid count={3} variant="job" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Booking Skeleton</h3>
              <LoadingSkeletonGrid count={3} variant="booking" />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
