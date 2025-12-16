"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface WorkRequestMessagePanelProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  customerName: string
}

export function WorkRequestMessagePanel({ messages, onSendMessage, customerName }: WorkRequestMessagePanelProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <Card className="flex flex-col h-[450px]">
      <CardHeader className="pb-3 border-b shrink-0">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Chat mit {customerName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Noch keine Nachrichten</p>
              <p className="text-xs text-muted-foreground mt-1">Sende eine erste Nachricht…</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.isCurrentUser
              return (
                <div key={message.id} className={cn("flex gap-3", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
                    <AvatarFallback>
                      {message.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn("flex flex-col gap-1 max-w-[75%]", isCurrentUser ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2",
                        isCurrentUser ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground px-1">
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

        {/* Input area */}
        <div className="border-t p-4 shrink-0">
          <div className="flex gap-2">
            <Textarea
              placeholder="Nachricht schreiben..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] max-h-[100px] resize-none"
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
          <p className="text-xs text-muted-foreground mt-2">Enter zum Senden, Shift+Enter für Zeilenumbruch</p>
        </div>
      </CardContent>
    </Card>
  )
}
