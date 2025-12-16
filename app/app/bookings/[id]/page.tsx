"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { AppShell } from "@/components/baucrew/app-shell"
import { StatusTimeline } from "@/components/booking-detail/status-timeline"
import { BookingDetailsCard } from "@/components/booking-detail/booking-details-card"
import { ProviderSidebarCard } from "@/components/booking-detail/provider-sidebar-card"
import { ReviewForm } from "@/components/booking-detail/review-form"
import { MessageThreadPanel } from "@/components/baucrew/message-thread-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { mockBookingDetails, mockBookingMessages } from "@/lib/mock-data"
import type { Message } from "@/lib/types"

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  // Get booking data - use different mock data based on ID for demo purposes
  const booking = mockBookingDetails[bookingId] || mockBookingDetails["booking-1"]
  const [messages, setMessages] = useState<Message[]>(mockBookingMessages)

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "customer-1",
      senderName: "Max Mustermann",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content,
      timestamp: new Date(),
      isCurrentUser: true,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handlePayNow = () => {
    router.push(`/app/checkout/${booking.id}`)
  }

  const showReviewForm = booking.status === "completed" && !booking.hasReview

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/app/orders">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zu meinen Buchungen
            </Button>
          </Link>
        </div>

        {/* Status timeline */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline currentStatus={booking.status} />
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking details */}
            <BookingDetailsCard booking={booking} />

            {/* Review form - only show if completed and no review */}
            {showReviewForm && <ReviewForm providerName={booking.providerName} />}

            {/* Message thread - mobile only */}
            <div className="lg:hidden">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Nachrichten
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <MessageThreadPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    currentUserId="customer-1"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - sidebar */}
          <div className="space-y-6">
            {/* Provider card with price and CTA */}
            <ProviderSidebarCard booking={booking} onPayNow={handlePayNow} />

            {/* Message thread - desktop only */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Nachrichten
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <MessageThreadPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    currentUserId="customer-1"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
