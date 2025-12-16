"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Flame, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import type { JobBoardListing } from "@/lib/types"
import Link from "next/link"

interface JobBoardTableProps {
  listings: JobBoardListing[]
}

export function JobBoardTable({ listings }: JobBoardTableProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Auf Anfrage"
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getUrgencyBadge = (urgency: JobBoardListing["urgency"]) => {
    switch (urgency) {
      case "urgent":
        return (
          <Badge variant="destructive" className="gap-1">
            <Flame className="h-3 w-3" />
            Dringend
          </Badge>
        )
      case "normal":
        return <Badge variant="secondary">Normal</Badge>
      case "flexible":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Flexibel
          </Badge>
        )
    }
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neue Aufträge im Job-Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Eye className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Keine passenden Aufträge gefunden</p>
            <p className="text-sm text-muted-foreground mt-1">Passe deine Kategorien im Profil an</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Neue Aufträge im Job-Board</CardTitle>
          <Link href="/provider/job-board">
            <Button variant="ghost" size="sm">
              Alle anzeigen
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auftrag</TableHead>
              <TableHead className="hidden md:table-cell">Standort</TableHead>
              <TableHead className="hidden lg:table-cell">Dringlichkeit</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.slice(0, 5).map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{listing.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {listing.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(listing.createdAt, { addSuffix: true, locale: de })}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{listing.location}</span>
                    <span className="text-xs">({listing.plz})</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{getUrgencyBadge(listing.urgency)}</TableCell>
                <TableCell className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(listing.budget)}</p>
                  <p className="text-xs text-muted-foreground">{listing.offerCount} Angebote</p>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/provider/job-board/${listing.id}`}>
                    <Button size="sm" variant="outline">
                      Ansehen
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
