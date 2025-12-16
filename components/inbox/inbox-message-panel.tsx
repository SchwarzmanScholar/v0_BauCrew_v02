"use client"

import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface InboxMessagePanelProps {
  messages: Message[]
  onSendMessage?: (content: string) => void
  currentUserId?: string
}

export function InboxMessagePanel({ messages, onSendMessage, currentUserId = "current-user" }: InboxMessagePanelProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim() && onSendMessage) {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
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

              <div className={cn("flex flex-col gap-1 max-w-[70%]", isCurrentUser ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "rounded-lg px-4 py-2",
                    isCurrentUser ? "bg-secondary text-secondary-foreground" : "bg-muted",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground px-1">
                  {message.timestamp.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}
                  {message.timestamp.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t p-4 bg-card">
        <div className="flex gap-2">
          <Textarea
            placeholder="Nachricht schreiben..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[120px] resize-none"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="shrink-0 h-[60px] w-[60px] bg-secondary hover:bg-secondary/90"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Senden</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Enter zum Senden, Shift+Enter für Zeilenumbruch</p>
      </div>
    </div>
  )
}
