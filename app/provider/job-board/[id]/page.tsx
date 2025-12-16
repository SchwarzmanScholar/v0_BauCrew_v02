"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/baucrew/app-shell"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { WorkRequestDetailsCard } from "@/components/provider/work-request-details-card"
import { LimitedCustomerCard } from "@/components/provider/limited-customer-card"
import { SendOfferPanel } from "@/components/provider/send-offer-panel"
import { WorkRequestMessagePanel } from "@/components/provider/work-request-message-panel"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MessageSquare, Send, AlertTriangle, Flag, Info } from "lucide-react"
import { mockProviderWorkRequestDetails, mockProviderWorkRequestMessages } from "@/lib/mock-data"
import type { Message, ProviderWorkRequestDetail } from "@/lib/types"

export default function ProviderWorkRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const requestId = params.id as string

  // Get mock data based on ID
  const request: ProviderWorkRequestDetail | undefined =
    mockProviderWorkRequestDetails[requestId] || mockProviderWorkRequestDetails["work-request-1"]

  const [messages, setMessages] = useState<Message[]>([])
  const [isSendingOffer, setIsSendingOffer] = useState(false)
  const [offerSent, setOfferSent] = useState(!!request?.myOffer)

  // Load messages
  useEffect(() => {
    const storedMessages = mockProviderWorkRequestMessages[requestId] || []
    setMessages(storedMessages)
  }, [requestId])

  if (!request) {
    return (
      <AppShell userRole="provider" userName="Klaus Müller">
        <div className="container mx-auto px-4 py-6">
          <p>Auftrag nicht gefunden.</p>
        </div>
      </AppShell>
    )
  }

  const isClosed = request.status === "closed"

  const handleSendMessage = (content: string) => {
    const newMsg: Message = {
      id: `msg-new-${Date.now()}`,
      senderId: "provider-current",
      senderName: "Klaus Müller",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content,
      timestamp: new Date(),
      isCurrentUser: true,
    }
    setMessages((prev) => [...prev, newMsg])
  }

  const handleSendOffer = (offer: { amount: number; message: string; availableDate?: Date }) => {
    setIsSendingOffer(true)
    // Simulate API call
    setTimeout(() => {
      setIsSendingOffer(false)
      setOfferSent(true)
      toast({
        title: "Angebot gesendet",
        description: "Der Kunde wurde über dein Angebot informiert.",
      })
      // Also send initial message if not already sent
      if (messages.length === 0) {
        handleSendMessage(offer.message)
      }
    }, 1500)
  }

  const scrollToMessages = () => {
    const messageSection = document.getElementById("message-section")
    if (messageSection) {
      messageSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider/job-board">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Job-Board
            </Link>
          </Button>
        </div>

        {/* Closed banner */}
        {isClosed && (
          <Alert className="mb-6 border-muted bg-muted/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Dieser Auftrag wurde geschlossen. Du kannst keine Angebote mehr senden.</AlertDescription>
          </Alert>
        )}

        {/* Header with title, status, and quick actions */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-balance">{request.title}</h1>
              <StatusBadge status={request.status} />
            </div>
            {!isClosed && (
              <div className="flex gap-2">
                <Button onClick={scrollToMessages} variant="default">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nachricht senden
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const offerSection = document.getElementById("offer-section")
                    if (offerSection) {
                      offerSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  disabled={offerSent}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {offerSent ? "Angebot gesendet" : "Angebot senden"}
                </Button>
              </div>
            )}
          </div>

          {/* Responses count */}
          <p className="text-sm text-muted-foreground">{request.offerCount} Angebote erhalten</p>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left column - Request details */}
          <div className="space-y-6">
            <WorkRequestDetailsCard request={request} />

            {/* Hints section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Hinweise</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Stelle Rückfragen im Chat.</li>
                      <li>• Keine Zahlungen außerhalb der Plattform.</li>
                      <li>• Antworte schnell für höhere Zuschlagschancen.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message panel on mobile/tablet */}
            <div id="message-section" className="lg:hidden">
              <WorkRequestMessagePanel
                messages={messages}
                onSendMessage={handleSendMessage}
                customerName={request.customer.firstName}
              />
            </div>
          </div>

          {/* Right column - Customer info, Messages, Offer panel */}
          <div className="space-y-6">
            {/* Customer info card */}
            <LimitedCustomerCard customer={request.customer} />

            {/* Message panel - desktop */}
            <div className="hidden lg:block">
              <WorkRequestMessagePanel
                messages={messages}
                onSendMessage={handleSendMessage}
                customerName={request.customer.firstName}
              />
            </div>

            {/* Offer panel */}
            {!isClosed && (
              <div id="offer-section">
                <SendOfferPanel
                  request={
                    offerSent
                      ? {
                          ...request,
                          myOffer: request.myOffer || {
                            id: "temp-offer",
                            amount: 0,
                            message: "",
                            sentAt: new Date(),
                            status: "pending" as const,
                          },
                        }
                      : request
                  }
                  onSendOffer={handleSendOffer}
                  isLoading={isSendingOffer}
                />
              </div>
            )}

            {/* Report link */}
            <div className="text-center">
              <Button variant="link" size="sm" className="text-muted-foreground">
                <Flag className="h-3 w-3 mr-1" />
                Problem melden
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
