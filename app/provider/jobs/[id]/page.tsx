"use client"

import { useState, use } from "react"
import Link from "next/link"
import { AppShell } from "@/components/baucrew/app-shell"
import { MessageThreadPanel } from "@/components/baucrew/message-thread-panel"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { BookingStatusTimeline } from "@/components/provider/booking-status-timeline"
import { ProviderJobDetailsCard } from "@/components/provider/provider-job-details-card"
import { CustomerInfoCard } from "@/components/provider/customer-info-card"
import { ProviderBookingActions } from "@/components/provider/provider-booking-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Flag } from "lucide-react"
import { mockProviderJobDetails, mockProviderMessages } from "@/lib/mock-data"
import type { ProviderJobStatus, Message } from "@/lib/types"

export default function ProviderJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // Get mock data based on ID or use default
  const initialJob = mockProviderJobDetails[id] || mockProviderJobDetails["job-detail-1"]

  const [job, setJob] = useState(initialJob)
  const [messages, setMessages] = useState<Message[]>(mockProviderMessages)

  // Address is fully visible after the request is accepted (not in requested status)
  const showFullAddress = job.status !== "requested"

  const handleAccept = () => {
    setJob((prev) => ({ ...prev, status: "payment_pending" as ProviderJobStatus }))
  }

  const handleDecline = () => {
    // In real app, would navigate away or show declined state
  }

  const handleMarkInProgress = () => {
    setJob((prev) => ({ ...prev, status: "in_progress" as ProviderJobStatus }))
  }

  const handleMarkCompleted = () => {
    setJob((prev) => ({ ...prev, status: "completed" as ProviderJobStatus }))
  }

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "provider-1",
      senderName: "Klaus Müller",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content,
      timestamp: new Date(),
      isCurrentUser: true,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/provider/jobs">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu Aufträgen
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-muted-foreground">
                Auftrag #{job.id} · Erstellt am {job.createdAt.toLocaleDateString("de-DE")}
              </p>
            </div>
            <Link href="/support/report">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="h-4 w-4 mr-2" />
                Problem melden
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Timeline */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingStatusTimeline currentStatus={job.status} />
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <ProviderJobDetailsCard job={job} showFullAddress={showFullAddress} />

            {/* Message Thread */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Nachrichten</h2>
              <MessageThreadPanel messages={messages} onSendMessage={handleSendMessage} currentUserId="provider-1" />
            </div>
          </div>

          {/* Right Column - Actions & Customer */}
          <div className="space-y-6">
            <CustomerInfoCard job={job} />
            <ProviderBookingActions
              status={job.status}
              amount={job.amount}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onMarkInProgress={handleMarkInProgress}
              onMarkCompleted={handleMarkCompleted}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
