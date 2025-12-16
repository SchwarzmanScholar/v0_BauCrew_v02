"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { ExternalLink, MessageSquare } from "lucide-react"
import type { AdminJobRequest } from "@/lib/types"

interface RecentJobRequestsTableProps {
  jobRequests: AdminJobRequest[]
}

export function RecentJobRequestsTable({ jobRequests }: RecentJobRequestsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Job Requests</CardTitle>
        <Link href="/admin/job-requests">
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
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Offers</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Link href={`/admin/job-requests/${request.id}`} className="font-medium text-sm hover:underline">
                    {request.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {request.customerName}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{request.category}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {request.offerCount}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatDistanceToNow(request.createdAt, { addSuffix: true, locale: de })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
