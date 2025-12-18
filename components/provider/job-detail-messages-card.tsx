"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { sendMessage } from "@/app/_actions/messages";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  body: string;
  createdAt: Date;
  sender: {
    id: string;
    fullName: string | null;
  };
}

interface JobDetailMessagesCardProps {
  jobRequestId: string;
  threadId?: string;
  messages: Message[];
  currentUserId: string;
}

export function JobDetailMessagesCard({
  jobRequestId,
  threadId,
  messages,
  currentUserId,
}: JobDetailMessagesCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [messageBody, setMessageBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    if (!messageBody.trim() || isSending) return;

    setIsSending(true);
    try {
      const result = await sendMessage({
        threadId,
        jobRequestId: threadId ? undefined : jobRequestId,
        body: messageBody.trim(),
      });

      if (result.ok) {
        toast({
          title: "Nachricht gesendet",
          description: "Deine Nachricht wurde erfolgreich versendet.",
        });
        setMessageBody("");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Nachricht konnte nicht gesendet werden.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nachrichten</CardTitle>
        <CardDescription>
          {messages.length === 0
            ? "Noch keine Nachrichten. Sende die erste Nachricht an den Kunden."
            : "Kommunikation mit dem Kunden"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message List */}
        {messages.length > 0 && (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {messages.map((message) => {
                const isOwnMessage = message.sender.id === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col gap-1",
                      isOwnMessage ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-[80%]",
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.body}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{message.sender.fullName || "Benutzer"}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(message.createdAt), "dd.MM.yyyy, HH:mm", {
                          locale: de,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Message Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Schreibe eine Nachricht..."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            rows={3}
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!messageBody.trim() || isSending}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Senden
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
