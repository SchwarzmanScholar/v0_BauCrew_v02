"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/baucrew/app-shell"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { EmptyState } from "@/components/baucrew/empty-state"
import { RequestDetailsCard } from "@/components/request-detail/request-details-card"
import { ActivityTimeline } from "@/components/request-detail/activity-timeline"
import { OfferListCard } from "@/components/request-detail/offer-list-card"
import { AcceptOfferDialog } from "@/components/request-detail/accept-offer-dialog"
import { InlineMessagePanel } from "@/components/request-detail/inline-message-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, XCircle, Inbox, AlertTriangle } from "lucide-react"
import {
  mockJobRequestDetail,
  mockJobRequestDetailClosed,
  mockJobRequestDetailNoOffers,
  mockActivityTimeline,
  mockDetailOffers,
  mockProviderMessages,
} from "@/lib/mock-data"
import type { Offer, Message } from "@/lib/types"

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string

  // Determine which mock data to show based on ID
  const request =
    requestId === "closed"
      ? mockJobRequestDetailClosed
      : requestId === "no-offers"
        ? mockJobRequestDetailNoOffers
        : mockJobRequestDetail

  const offers = request.status === "closed" || requestId === "no-offers" ? [] : mockDetailOffers
  const timeline = mockActivityTimeline

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(offers.length > 0 ? offers[0].id : null)
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [offerToAccept, setOfferToAccept] = useState<Offer | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || null

  // Load messages when selected offer changes
  useEffect(() => {
    if (selectedOffer) {
      const providerMessages = mockProviderMessages[selectedOffer.providerId] || []
      setMessages(providerMessages)
    } else {
      setMessages([])
    }
  }, [selectedOffer])

  const handleSelectOffer = (offerId: string) => {
    setSelectedOfferId(offerId)
  }

  const handleAcceptClick = (offer: Offer) => {
    setOfferToAccept(offer)
    setAcceptDialogOpen(true)
  }

  const handleConfirmAccept = () => {
    setIsAccepting(true)
    // Simulate API call
    setTimeout(() => {
      setIsAccepting(false)
      setAcceptDialogOpen(false)
      router.push("/app/bookings/payment")
    }, 1500)
  }

  const handleSendMessage = (content: string) => {
    const newMsg: Message = {
      id: `new-msg-${Date.now()}`,
      senderId: "current-user",
      senderName: "Max Mustermann",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content,
      timestamp: new Date(),
      isCurrentUser: true,
    }
    setMessages((prev) => [...prev, newMsg])
  }

  const handleMessageClick = (offer: Offer) => {
    setSelectedOfferId(offer.id)
    // Scroll to message panel on mobile
    const messageSection = document.getElementById("message-section")
    if (messageSection && window.innerWidth < 1024) {
      messageSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const isClosed = request.status === "closed"

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-6">
        {/* Closed banner */}
        {isClosed && (
          <Alert className="mb-6 border-muted bg-muted/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Dieser Auftrag ist geschlossen. Du kannst keine neuen Angebote mehr erhalten.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-balance">{request.title}</h1>
            <StatusBadge status={request.status} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={isClosed}>
              <Pencil className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
            <Button variant="destructive" size="sm" disabled={isClosed}>
              <XCircle className="h-4 w-4 mr-2" />
              Schließen
            </Button>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Left column - Request details & Activity */}
          <div className="space-y-6">
            <RequestDetailsCard request={request} />
            <ActivityTimeline events={timeline} />
          </div>

          {/* Right column - Offers & Messages */}
          <div className="space-y-6">
            {/* Offers section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Angebote & Antworten ({offers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {offers.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="Noch keine Antworten"
                    description="Sobald Handwerker antworten, erscheinen sie hier. Du erhältst eine Benachrichtigung."
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {offers.map((offer) => (
                      <OfferListCard
                        key={offer.id}
                        offer={offer}
                        isSelected={selectedOfferId === offer.id}
                        onSelect={() => handleSelectOffer(offer.id)}
                        onAccept={() => handleAcceptClick(offer)}
                        onMessage={() => handleMessageClick(offer)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages section */}
            {offers.length > 0 && (
              <div id="message-section">
                <h2 className="text-lg font-semibold mb-4">Nachrichten</h2>
                <InlineMessagePanel
                  messages={messages}
                  selectedOffer={selectedOffer}
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Accept offer dialog */}
        <AcceptOfferDialog
          open={acceptDialogOpen}
          onOpenChange={setAcceptDialogOpen}
          offer={offerToAccept}
          onConfirm={handleConfirmAccept}
          isLoading={isAccepting}
        />
      </div>
    </AppShell>
  )
}
