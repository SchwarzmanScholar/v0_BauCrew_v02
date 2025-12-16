"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { ExternalLink } from "lucide-react"
import type { AdminBooking } from "@/lib/types"

interface RecentBookingsTableProps {
  bookings: AdminBooking[]
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
        <Link href="/admin/bookings">
          <Button variant="ghost" size="sm">
            View all
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead className="hidden md:table-cell">Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <Link href={`/admin/bookings/${booking.id}`} className="font-medium text-sm hover:underline">
                    {booking.jobTitle}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {booking.customerName}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {booking.providerName}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(booking.amount)}</TableCell>
                <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                  {formatDistanceToNow(booking.createdAt, { addSuffix: true, locale: de })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
