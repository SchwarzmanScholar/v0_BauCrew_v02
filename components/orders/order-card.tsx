"use client"

import Link from "next/link"
import { Calendar, Clock, MessageSquare, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/baucrew/status-badge"
import type { Order } from "@/lib/types"

interface OrderCardProps {
  order: Order
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Header: Title + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{order.jobTitle}</h3>
              <p className="text-sm text-muted-foreground">{order.category}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Provider Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={order.providerAvatar || "/placeholder.svg"} alt={order.providerName} />
              <AvatarFallback>
                {order.providerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{order.providerName}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(order.scheduledDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {order.scheduledTime} Uhr
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Gesamtbetrag</span>
            <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
              <Link href={`/app/orders/${order.id}`}>
                <Eye className="h-4 w-4 mr-1.5" />
                Anzeigen
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="flex-1">
              <Link href={`/app/messages/${order.providerId}`}>
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Nachricht
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
