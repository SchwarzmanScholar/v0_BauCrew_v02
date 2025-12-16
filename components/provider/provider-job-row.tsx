"use client"

import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Eye, MessageSquare, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/baucrew/status-badge"
import type { ProviderJob } from "@/lib/types"

interface ProviderJobRowProps {
  job: ProviderJob
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
}

export function ProviderJobRow({ job, onAccept, onDecline }: ProviderJobRowProps) {
  const formattedDate = format(job.requestedDate, "dd. MMM yyyy", { locale: de })
  const formattedAmount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(job.amount)

  return (
    <TableRow className="group">
      {/* Customer */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={job.customerAvatar || "/placeholder.svg"} alt={job.customerName} />
            <AvatarFallback>
              {job.customerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{job.customerName}</p>
            <p className="text-xs text-muted-foreground">{job.city}</p>
          </div>
        </div>
      </TableCell>

      {/* Job Title */}
      <TableCell>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate max-w-[200px]">{job.jobTitle}</p>
          <Badge variant="outline" className="text-xs mt-1">
            {job.category}
          </Badge>
        </div>
      </TableCell>

      {/* Date/Time */}
      <TableCell>
        <div className="text-sm">
          <p>{formattedDate}</p>
          <p className="text-muted-foreground">{job.requestedTime} Uhr</p>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell>
        <p className="font-semibold text-sm">{formattedAmount}</p>
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={job.status} />
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Quick actions for requested status */}
          {job.status === "requested" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-success-foreground hover:bg-success/10"
                onClick={() => onAccept?.(job.id)}
                title="Annehmen"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => onDecline?.(job.id)}
                title="Ablehnen"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Aktionen</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/provider/jobs/${job.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Details ansehen
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/provider/nachrichten?job=${job.id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nachricht senden
                </Link>
              </DropdownMenuItem>
              {job.status === "requested" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onAccept?.(job.id)} className="text-success-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Annehmen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDecline?.(job.id)} className="text-destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Ablehnen
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}
