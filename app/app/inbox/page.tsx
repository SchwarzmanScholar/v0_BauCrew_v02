"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/baucrew/app-shell"
import { ConversationList } from "@/components/inbox/conversation-list"
import { ConversationHeader } from "@/components/inbox/conversation-header"
import { InboxMessagePanel } from "@/components/inbox/inbox-message-panel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MessageSquare, Inbox, FileText, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { customerConversations, providerConversations } from "@/lib/inbox-data"
import type { Conversation, UserRole, ConversationContext } from "@/lib/types"

type FilterType = "all" | "booking" | "request"

export default function InboxPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Determine user role from query param (default: customer)
  const userRole: UserRole = (searchParams.get("role") as UserRole) || "customer"
  const isProvider = userRole === "provider"

  // Get conversations based on role
  const allConversations = isProvider ? providerConversations : customerConversations

  // State
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [isLoading] = useState(false)

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let result = allConversations

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
      const contextFilter: ConversationContext = filter === "booking" ? "booking" : "request"
      result = result.filter((conv) => conv.context === contextFilter)
    }

    return result
  }, [allConversations, searchQuery, filter])

  // Get selected conversation
  const selectedConversation = selectedId ? allConversations.find((c) => c.id === selectedId) : null

  // Handle conversation select
  const handleSelect = (conversation: Conversation) => {
    setSelectedId(conversation.id)
  }

  // Handle send message
  const handleSendMessage = (content: string) => {
    // In a real app, this would send to API
    console.log("Sending message:", content)
  }

  // Count unread
  const unreadCount = allConversations.reduce((sum, c) => sum + c.unreadCount, 0)

  // Empty inbox state
  const isEmptyInbox = allConversations.length === 0

  return (
    <AppShell userRole={userRole} userName={isProvider ? "Thomas Müller" : "Max Mustermann"}>
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
            {isLoading ? (
              // Loading skeleton
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isEmptyInbox ? (
              // Empty inbox state
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Noch keine Nachrichten</h3>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  {isProvider
                    ? "Schaue im Job-Board nach passenden Aufträgen und sende dein erstes Angebot."
                    : "Stelle deinen ersten Auftrag ein und lass Handwerker auf dich zukommen."}
                </p>
                <Button
                  className="bg-secondary hover:bg-secondary/90"
                  onClick={() => router.push(isProvider ? "/provider/job-board" : "/app/requests/new")}
                >
                  {isProvider ? "Job-Board ansehen" : "Auftrag einstellen"}
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
              <ConversationList conversations={filteredConversations} selectedId={selectedId} onSelect={handleSelect} />
            )}
          </div>
        </div>

        {/* Right column - Message thread */}
        <div
          className={cn(
            "hidden md:flex flex-1 flex-col bg-background",
            !selectedConversation && "items-center justify-center",
          )}
        >
          {selectedConversation ? (
            <>
              <ConversationHeader conversation={selectedConversation} userRole={userRole as "customer" | "provider"} />
              <div className="flex-1 overflow-hidden">
                <InboxMessagePanel messages={selectedConversation.messages} onSendMessage={handleSendMessage} />
              </div>
            </>
          ) : (
            // No conversation selected state
            <div className="text-center p-8">
              <div className="rounded-full bg-muted p-6 mb-4 mx-auto w-fit">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wähle eine Konversation</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Wähle links eine Konversation aus, um die Nachrichten anzuzeigen.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
