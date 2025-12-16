"use client"

import { format } from "date-fns"
import { de } from "date-fns/locale"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/baucrew/status-badge"
import type { Transaction } from "@/lib/types"

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-card">
        <div className="rounded-full bg-muted p-5 mb-4">
          <Wallet className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Noch keine Transaktionen</h3>
        <p className="text-muted-foreground max-w-sm">
          Sobald du Aufträge abschließt, erscheinen hier deine Einnahmen.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Datum</TableHead>
              <TableHead className="min-w-[200px]">Buchung</TableHead>
              <TableHead className="w-[110px] text-right">Brutto</TableHead>
              <TableHead className="w-[100px] text-right">Gebühr (12%)</TableHead>
              <TableHead className="w-[110px] text-right">Netto</TableHead>
              <TableHead className="w-[140px]">Auszahlung</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="text-sm">{format(txn.date, "dd.MM.yyyy", { locale: de })}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{txn.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{txn.customerName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(txn.grossAmount)}</TableCell>
                <TableCell className="text-right text-muted-foreground">-{formatCurrency(txn.fee)}</TableCell>
                <TableCell className="text-right font-semibold text-success-foreground">
                  {formatCurrency(txn.netAmount)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge status={txn.payoutStatus} />
                    {txn.payoutDate && (
                      <p className="text-xs text-muted-foreground">
                        {format(txn.payoutDate, "dd.MM.", { locale: de })}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/provider/jobs/${txn.bookingId}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Details</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Import for empty state
import { Wallet } from "lucide-react"
