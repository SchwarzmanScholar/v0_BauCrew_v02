"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import type { ProviderBookingRequest } from "@/lib/types"

interface BookingRequestsTableProps {
  requests: ProviderBookingRequest[]
}

export function BookingRequestsTable({ requests }: BookingRequestsTableProps) {
  const [pendingRequests, setPendingRequests] = useState(requests)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleAccept = async (id: string) => {
    setLoadingId(id)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPendingRequests((prev) => prev.filter((r) => r.id !== id))
    setLoadingId(null)
  }

  const handleDecline = async (id: string) => {
    setLoadingId(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPendingRequests((prev) => prev.filter((r) => r.id !== id))
    setLoadingId(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neue Buchungsanfragen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Keine offenen Anfragen</p>
            <p className="text-sm text-muted-foreground mt-1">Neue Anfragen erscheinen hier</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Neue Buchungsanfragen</CardTitle>
          <Badge variant="secondary">{pendingRequests.length} offen</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kunde</TableHead>
              <TableHead>Auftrag</TableHead>
              <TableHead className="hidden md:table-cell">Termin</TableHead>
              <TableHead className="hidden lg:table-cell">Adresse</TableHead>
              <TableHead className="text-right">Betrag</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.customerAvatar || "/placeholder.svg"} alt={request.customerName} />
                      <AvatarFallback>
                        {request.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{request.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(request.createdAt, { addSuffix: true, locale: de })}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{request.jobTitle}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {request.category}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="text-sm">
                    {request.scheduledDate.toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">{request.scheduledTime} Uhr</p>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[180px]">{request.address}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-semibold">{formatCurrency(request.amount)}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(request.id)}
                      disabled={loadingId === request.id}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1">Ablehnen</span>
                    </Button>
                    <Button size="sm" onClick={() => handleAccept(request.id)} disabled={loadingId === request.id}>
                      <Check className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1">Annehmen</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
