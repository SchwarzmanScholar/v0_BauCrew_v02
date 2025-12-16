"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { Search, FileText, CreditCard, Shield, CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react"
import { VerificationDetailDrawer } from "@/components/admin/verification-detail-drawer"
import { verificationQueue } from "@/lib/admin-data"
import type { AdminVerificationDetail, VerificationStatus } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

type FilterStatus = "all" | "pending" | "approved" | "rejected"

const statusConfig: Record<VerificationStatus, { label: string; className: string; icon: typeof Clock }> = {
  not_submitted: { label: "Nicht eingereicht", className: "bg-muted text-muted-foreground", icon: Clock },
  pending: { label: "Ausstehend", className: "bg-warning/10 text-warning-foreground border-warning/20", icon: Clock },
  approved: {
    label: "Genehmigt",
    className: "bg-success/10 text-success-foreground border-success/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Abgelehnt",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: XCircle,
  },
}

const documentIcons: Record<string, typeof FileText> = {
  id: CreditCard,
  trade_license: FileText,
  insurance: Shield,
}

export default function AdminVerificationsPage() {
  const { toast } = useToast()
  const [verifications, setVerifications] = useState<AdminVerificationDetail[]>(verificationQueue)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<AdminVerificationDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) => {
      const matchesStatus = filterStatus === "all" || v.status === filterStatus
      const matchesSearch =
        searchQuery === "" ||
        v.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [verifications, filterStatus, searchQuery])

  const counts = useMemo(
    () => ({
      all: verifications.length,
      pending: verifications.filter((v) => v.status === "pending").length,
      approved: verifications.filter((v) => v.status === "approved").length,
      rejected: verifications.filter((v) => v.status === "rejected").length,
    }),
    [verifications],
  )

  const handleRowClick = (verification: AdminVerificationDetail) => {
    setSelectedVerification(verification)
    setDrawerOpen(true)
  }

  const handleApprove = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "approved" as VerificationStatus, reviewedAt: new Date(), reviewedBy: "Admin Team" }
          : v,
      ),
    )
    toast({
      title: "Verifizierung genehmigt",
      description: "Der Anbieter wurde erfolgreich verifiziert.",
    })
  }

  const handleReject = (id: string, notes: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "rejected" as VerificationStatus,
              adminNotes: notes,
              reviewedAt: new Date(),
              reviewedBy: "Admin Team",
            }
          : v,
      ),
    )
    toast({
      title: "Verifizierung abgelehnt",
      description: "Der Anbieter wurde über die Ablehnung informiert.",
      variant: "destructive",
    })
  }

  return (
    <AppShell userRole="admin" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Verifizierungen</h1>
              <p className="text-sm text-muted-foreground">{counts.pending} ausstehende Prüfungen</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Tabs
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as FilterStatus)}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
                  <TabsTrigger value="all" className="gap-2">
                    Alle
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {counts.all}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2">
                    Ausstehend
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {counts.pending}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="gap-2">
                    Genehmigt
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {counts.approved}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="gap-2">
                    Abgelehnt
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {counts.rejected}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Verifizierungs-Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredVerifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">Keine Verifizierungen gefunden</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {filterStatus === "pending"
                    ? "Alle ausstehenden Verifizierungen wurden bearbeitet."
                    : "Keine Einträge für die ausgewählten Filter."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anbieter</TableHead>
                    <TableHead className="hidden md:table-cell">Firma</TableHead>
                    <TableHead className="hidden sm:table-cell">Eingereicht</TableHead>
                    <TableHead className="hidden lg:table-cell">Dokumente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.map((verification) => {
                    const StatusIcon = statusConfig[verification.status].icon
                    return (
                      <TableRow
                        key={verification.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(verification)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={verification.providerAvatar || "/placeholder.svg"}
                                alt={verification.providerName}
                              />
                              <AvatarFallback>
                                {verification.providerName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{verification.providerName}</p>
                              <p className="text-xs text-muted-foreground md:hidden">{verification.companyName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <p className="text-sm">{verification.companyName}</p>
                            <p className="text-xs text-muted-foreground">{verification.city}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDistanceToNow(verification.submittedAt, { addSuffix: true, locale: de })}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            {verification.documents.map((doc) => {
                              const Icon = documentIcons[doc.type]
                              return (
                                <div
                                  key={doc.id}
                                  className="rounded bg-muted p-1.5"
                                  title={
                                    doc.type === "id"
                                      ? "Personalausweis"
                                      : doc.type === "trade_license"
                                        ? "Handwerkskarte"
                                        : "Versicherung"
                                  }
                                >
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[verification.status].className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[verification.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={verification.status === "pending" ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(verification)
                            }}
                          >
                            {verification.status === "pending" ? "Prüfen" : "Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Drawer */}
      <VerificationDetailDrawer
        verification={selectedVerification}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </AppShell>
  )
}
