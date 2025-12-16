"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { DisputeDetailDrawer } from "@/components/admin/dispute-detail-drawer"
import { adminDisputes, disputeDetails } from "@/lib/admin-data"
import { useToast } from "@/hooks/use-toast"
import { Search, ExternalLink, AlertTriangle, User, Briefcase } from "lucide-react"
import type { DisputeStatus, DisputeReason, AdminDispute, AdminDisputeDetail, DisputeResolution } from "@/lib/types"

const reasonLabels: Record<DisputeReason, string> = {
  quality: "Qualität",
  no_show: "Nichterscheinen",
  payment: "Zahlung",
  damage: "Schaden",
  communication: "Kommunikation",
  other: "Sonstiges",
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<AdminDispute[]>(adminDisputes)
  const [selectedTab, setSelectedTab] = useState<"all" | DisputeStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDispute, setSelectedDispute] = useState<AdminDisputeDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { toast } = useToast()

  const filteredDisputes = useMemo(() => {
    let filtered = disputes

    if (selectedTab !== "all") {
      filtered = filtered.filter((d) => d.status === selectedTab)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.bookingTitle.toLowerCase().includes(query) ||
          d.customerName.toLowerCase().includes(query) ||
          d.providerName.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [disputes, selectedTab, searchQuery])

  const counts = useMemo(
    () => ({
      all: disputes.length,
      open: disputes.filter((d) => d.status === "open").length,
      under_review: disputes.filter((d) => d.status === "under_review").length,
      escalated: disputes.filter((d) => d.status === "escalated").length,
      resolved: disputes.filter((d) => d.status === "resolved").length,
    }),
    [disputes],
  )

  const handleRowClick = (dispute: AdminDispute) => {
    const detail = disputeDetails[dispute.id] || {
      ...dispute,
      booking: {
        id: dispute.bookingId,
        jobTitle: dispute.bookingTitle,
        category: "Handwerker",
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        amount: dispute.bookingAmount,
        customerName: dispute.customerName,
        customerAvatar: "/placeholder.svg?height=40&width=40",
        providerName: dispute.providerName,
        providerAvatar: "/placeholder.svg?height=40&width=40",
      },
      messages: [],
    }
    setSelectedDispute(detail as AdminDisputeDetail)
    setDrawerOpen(true)
  }

  const handleResolve = (id: string, resolution: DisputeResolution, notes: string, refundAmount?: number) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: "resolved" as DisputeStatus } : d)))
    toast({
      title: "Streitfall gelöst",
      description: `Der Streitfall wurde erfolgreich abgeschlossen.`,
    })
  }

  const handleUpdateStatus = (id: string, status: DisputeStatus) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
    toast({
      title: "Status aktualisiert",
      description: `Der Status wurde geändert.`,
    })
  }

  return (
    <AppShell userRole="admin" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Streitfälle</h1>
              <p className="text-muted-foreground">Verwalten Sie offene und geschlossene Disputes</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-warning/10 p-2">
                    <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{counts.open}</p>
                    <p className="text-xs text-muted-foreground">Offen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{counts.under_review}</p>
                    <p className="text-xs text-muted-foreground">In Prüfung</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-destructive/10 p-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{counts.escalated}</p>
                    <p className="text-xs text-muted-foreground">Eskaliert</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success/10 p-2">
                    <AlertTriangle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{counts.resolved}</p>
                    <p className="text-xs text-muted-foreground">Gelöst</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
                  <TabsList>
                    <TabsTrigger value="all">Alle ({counts.all})</TabsTrigger>
                    <TabsTrigger value="open">Offen ({counts.open})</TabsTrigger>
                    <TabsTrigger value="under_review">In Prüfung ({counts.under_review})</TabsTrigger>
                    <TabsTrigger value="escalated">Eskaliert ({counts.escalated})</TabsTrigger>
                    <TabsTrigger value="resolved">Gelöst ({counts.resolved})</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Buchung</TableHead>
                      <TableHead>Geöffnet von</TableHead>
                      <TableHead>Grund</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Erstellt</TableHead>
                      <TableHead className="text-right">Aktion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisputes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-8 w-8" />
                            <p>Keine Streitfälle gefunden</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDisputes.map((dispute) => (
                        <TableRow
                          key={dispute.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(dispute)}
                        >
                          <TableCell>
                            <StatusBadge status={dispute.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{dispute.bookingTitle}</p>
                                <p className="text-xs text-muted-foreground">
                                  {dispute.customerName} ↔ {dispute.providerName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm">{dispute.openerName}</p>
                                <Badge variant="outline" className="text-xs">
                                  {dispute.openedBy === "customer" ? "Kunde" : "Anbieter"}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{reasonLabels[dispute.reason]}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{dispute.bookingAmount.toFixed(2)} €</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(dispute.createdAt, "dd.MM.yyyy HH:mm", { locale: de })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowClick(dispute)
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DisputeDetailDrawer
        dispute={selectedDispute}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onResolve={handleResolve}
        onUpdateStatus={handleUpdateStatus}
      />
    </AppShell>
  )
}
