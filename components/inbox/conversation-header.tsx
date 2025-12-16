"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/baucrew/verification-badge"
import { ExternalLink } from "lucide-react"
import type { Conversation } from "@/lib/types"

interface ConversationHeaderProps {
  conversation: Conversation
  userRole: "customer" | "provider"
}

export function ConversationHeader({ conversation, userRole }: ConversationHeaderProps) {
  const contextLink =
    conversation.context === "booking"
      ? userRole === "customer"
        ? `/app/orders/${conversation.contextId}`
        : `/provider/jobs/${conversation.contextId}`
      : userRole === "customer"
        ? `/app/requests/${conversation.contextId}`
        : `/provider/job-board/${conversation.contextId}`

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={conversation.counterpartyAvatar || "/placeholder.svg"}
            alt={conversation.counterpartyName}
          />
          <AvatarFallback>
            {conversation.counterpartyName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{conversation.counterpartyName}</span>
            {conversation.counterpartyVerified && <VerificationBadge />}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {conversation.context === "booking" ? "Buchung" : "Auftrag"}
            </Badge>
            <span className="text-sm text-muted-foreground">{conversation.contextTitle}</span>
          </div>
        </div>
      </div>

      <Link href={contextLink}>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <ExternalLink className="h-4 w-4" />
          {conversation.context === "booking" ? "Zur Buchung" : "Zum Auftrag"}
        </Button>
      </Link>
    </div>
  )
}
