"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message, Offer } from "@/lib/types"

interface InlineMessagePanelProps {
  messages: Message[]
  selectedOffer: Offer | null
  onSendMessage?: (content: string) => void
}

export function InlineMessagePanel({ messages, selectedOffer, onSendMessage }: InlineMessagePanelProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  if (!selectedOffer) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Wähle ein Angebot aus, um die Konversation anzuzeigen.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={selectedOffer.providerAvatar || "/placeholder.svg"} alt={selectedOffer.providerName} />
            <AvatarFallback>
              {selectedOffer.providerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base">{selectedOffer.providerName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[280px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground text-center">
                Noch keine Nachrichten. Schreibe dem Anbieter eine Nachricht.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.senderId === "current-user"
              return (
                <div key={message.id} className={cn("flex gap-2", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
                    <AvatarFallback className="text-xs">
                      {message.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn("flex flex-col gap-1 max-w-[75%]", isCurrentUser ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        isCurrentUser ? "bg-secondary text-secondary-foreground" : "bg-muted",
                      )}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">
                      {message.timestamp.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="border-t p-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Nachricht schreiben..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="min-h-[48px] max-h-[100px] resize-none text-sm"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="shrink-0 bg-secondary hover:bg-secondary/90"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Senden</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
