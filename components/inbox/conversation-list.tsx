"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/lib/types"
import { formatRelativeTime } from "@/lib/inbox-data"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (conversation: Conversation) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          className={cn(
            "flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b",
            selectedId === conversation.id && "bg-muted",
          )}
        >
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12">
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
            {conversation.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={cn("font-medium truncate", conversation.unreadCount > 0 && "font-semibold")}>
                {conversation.counterpartyName}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatRelativeTime(conversation.lastMessageAt)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 shrink-0">
                {conversation.context === "booking" ? "Buchung" : "Auftrag"}
              </Badge>
              <span className="text-xs text-muted-foreground truncate">{conversation.contextTitle}</span>
            </div>

            <p
              className={cn(
                "text-sm truncate",
                conversation.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {conversation.lastMessage}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
