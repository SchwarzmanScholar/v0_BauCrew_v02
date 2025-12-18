"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AppShell } from "@/components/baucrew/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Inbox, FileText, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/inbox-data"
import type { Conversation } from "@/lib/types"

type FilterType = "all" | "booking" | "request"

interface InboxClientProps {
  conversations: (Conversation & { link: string })[]
  userName: string
}

export function InboxClient({ conversations, userName }: InboxClientProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let result = conversations

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (conv) =>
          conv.counterpartyName.toLowerCase().includes(query) ||
          conv.contextTitle.toLowerCase().includes(query) ||
          conv.lastMessage.toLowerCase().includes(query),
      )
    }

    // Apply context filter
    if (filter !== "all") {
      const contextFilter = filter === "booking" ? "booking" : "request"
      result = result.filter((conv) => conv.context === contextFilter)
    }

    return result
  }, [conversations, searchQuery, filter])

  // Count unread
  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  // Empty inbox state
  const isEmptyInbox = conversations.length === 0

  return (
    <AppShell userRole="customer" userName={userName}>
      <div className="h-[calc(100vh-64px-73px)] flex">
        {/* Left column - Conversation list */}
        <div className="w-full md:w-[380px] border-r flex flex-col bg-card">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">Nachrichten</h1>
              {unreadCount > 0 && (
                <span className="flex h-6 min-w-6 px-2 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Konversationen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter chips */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="gap-1.5"
              >
                <Inbox className="h-3.5 w-3.5" />
                Alle
              </Button>
              <Button
                variant={filter === "booking" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("booking")}
                className="gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5" />
                Buchungen
              </Button>
              <Button
                variant={filter === "request" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("request")}
                className="gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                Aufträge
              </Button>
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {isEmptyInbox ? (
              // Empty inbox state
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Noch keine Nachrichten</h3>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  Stelle deinen ersten Auftrag ein und lass Handwerker auf dich zukommen.
                </p>
                <Button asChild className="bg-secondary hover:bg-secondary/90">
                  <Link href="/app/requests/new">Auftrag einstellen</Link>
                </Button>
              </div>
            ) : filteredConversations.length === 0 ? (
              // No results state
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Keine Ergebnisse</h3>
                <p className="text-muted-foreground mb-4">
                  Keine Konversationen gefunden für &quot;{searchQuery}&quot;
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Filter zurücksetzen
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredConversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={conversation.link}
                    className="flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12">
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
                        <span
                          className={cn(
                            "font-medium truncate",
                            conversation.unreadCount > 0 && "font-semibold",
                          )}
                        >
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
                        <span className="text-xs text-muted-foreground truncate">
                          {conversation.contextTitle}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-sm truncate",
                          conversation.unreadCount > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Message thread (empty state) */}
        <div className="hidden md:flex flex-1 flex-col bg-background items-center justify-center">
          <div className="text-center p-8">
            <div className="rounded-full bg-muted p-6 mb-4 mx-auto w-fit">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Wähle eine Konversation</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Klicke auf eine Konversation, um zur Detail-Ansicht zu gelangen.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
