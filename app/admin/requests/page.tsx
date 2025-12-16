"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/baucrew/status-badge"
import { JobRequestDetailDrawer } from "@/components/admin/job-request-detail-drawer"
import { adminJobRequestsData } from "@/lib/admin-data"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import { Search, ClipboardList, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AdminJobRequestDetail, AdminJobRequestStatus, FlagReason } from "@/lib/types"

type FilterStatus = "all" | AdminJobRequestStatus

const categoryColors: Record<string, string> = {
  Elektriker: "bg-amber-100 text-amber-800 border-amber-200",
  Sanitär: "bg-blue-100 text-blue-800 border-blue-200",
  Maler: "bg-rose-100 text-rose-800 border-rose-200",
  Trockenbau: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Handwerker: "bg-purple-100 text-purple-800 border-purple-200",
}

const cities = ["Alle", "Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Düsseldorf", "Leipzig"]
const categories = ["Alle", "Elektriker", "Sanitär", "Maler", "Trockenbau", "Handwerker"]

export default function AdminJobRequestsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<AdminJobRequestDetail[]>(adminJobRequestsData)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [filterCity, setFilterCity] = useState("Alle")
  const [filterCategory, setFilterCategory] = useState("Alle")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<AdminJobRequestDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = filterStatus === "all" || r.status === filterStatus
      const matchesCity = filterCity === "Alle" || r.location === filterCity
      const matchesCategory = filterCategory === "Alle" || r.category === filterCategory
      const matchesSearch =
        searchQuery === "" ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.plz.includes(searchQuery)
      return matchesStatus && matchesCity && matchesCategory && matchesSearch
    })
  }, [requests, filterStatus, filterCity, filterCategory, searchQuery])

  const counts = useMemo(
    () => ({
      all: requests.length,
      open: requests.filter((r) => r.status === "open").length,
      in_discussion: requests.filter((r) => r.status === "in_discussion").length,
      filled: requests.filter((r) => r.status === "filled").length,
      closed: requests.filter((r) => r.status === "closed").length,
      flagged: requests.filter((r) => r.status === "flagged").length,
    }),
    [requests],
  )

  const handleRowClick = (request: AdminJobRequestDetail) => {
    setSelectedRequest(request)
    setDrawerOpen(true)
  }

  const handleClose = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "closed" as AdminJobRequestStatus } : r)))
    toast({
      title: "Auftrag geschlossen",
      description: "Der Auftrag wurde erfolgreich geschlossen.",
    })
  }

  const handleFlag = (id: string, reason: FlagReason, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "flagged" as AdminJobRequestStatus,
              isFlagged: true,
              flagReason: reason,
              flagNotes: notes,
              flaggedAt: new Date(),
              flaggedBy: "Admin Team",
            }
          : r,
      ),
    )
    toast({
      title: "Auftrag markiert",
      description: "Der Auftrag wurde als problematisch markiert.",
      variant: "destructive",
    })
  }

  const handleReopen = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "open" as AdminJobRequestStatus,
              isFlagged: false,
              flagReason: undefined,
              flagNotes: undefined,
              flaggedAt: undefined,
              flaggedBy: undefined,
            }
          : r,
      ),
    )
    toast({
      title: "Auftrag wieder geöffnet",
      description: "Der Auftrag ist jetzt wieder aktiv.",
    })
  }

  // Demo loading state
  if (isLoading) {
    return (
      <AppShell userRole="admin" userName="Admin">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell userRole="admin" userName="Admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Arbeitsaufträge</h1>
              <p className="text-sm text-muted-foreground">
                {counts.flagged > 0 && (
                  <span className="text-destructive font-medium">{counts.flagged} markiert · </span>
                )}
                {counts.all} Aufträge insgesamt
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  Alle
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {counts.all}
                  </Badge>
                </Button>
                <Button
                  variant={filterStatus === "open" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("open")}
                >
                  Offen
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {counts.open}
                  </Badge>
                </Button>
                <Button
                  variant={filterStatus === "in_discussion" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("in_discussion")}
                >
                  In Gespräch
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {counts.in_discussion}
                  </Badge>
                </Button>
                <Button
                  variant={filterStatus === "filled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("filled")}
                >
                  Vergeben
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {counts.filled}
                  </Badge>
                </Button>
                <Button
                  variant={filterStatus === "closed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("closed")}
                >
                  Geschlossen
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {counts.closed}
                  </Badge>
                </Button>
                <Button
                  variant={filterStatus === "flagged" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("flagged")}
                  className={
                    filterStatus !== "flagged" && counts.flagged > 0 ? "border-destructive/50 text-destructive" : ""
                  }
                >
                  Markiert
                  <Badge
                    variant={filterStatus === "flagged" ? "secondary" : "destructive"}
                    className="ml-1.5 h-5 px-1.5 text-xs"
                  >
                    {counts.flagged}
                  </Badge>
                </Button>
              </div>

              {/* Other Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Stadt" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Titel, ID oder PLZ suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">
              {filteredRequests.length} {filteredRequests.length === 1 ? "Auftrag" : "Aufträge"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <ClipboardList className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">Keine Aufträge gefunden</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Versuchen Sie, die Filter anzupassen oder einen anderen Suchbegriff zu verwenden.
                </p>
                {(filterStatus !== "all" || filterCity !== "Alle" || filterCategory !== "Alle" || searchQuery) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setFilterStatus("all")
                      setFilterCity("Alle")
                      setFilterCategory("Alle")
                      setSearchQuery("")
                    }}
                  >
                    Filter zurücksetzen
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auftrag</TableHead>
                    <TableHead className="hidden md:table-cell">Kategorie</TableHead>
                    <TableHead className="hidden sm:table-cell">Ort</TableHead>
                    <TableHead className="hidden lg:table-cell">Erstellt von</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Antworten</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Erstellt</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(request)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{request.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{request.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className={categoryColors[request.category] || "bg-muted"}>
                          {request.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm">
                          <span className="font-mono text-xs">{request.plz}</span>
                          <span className="text-muted-foreground"> {request.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={request.customer.avatar || "/placeholder.svg"}
                              alt={request.customer.name}
                            />
                            <AvatarFallback className="text-xs">
                              {request.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{request.customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span className="text-sm">{request.offerCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {formatDistanceToNow(request.createdAt, { addSuffix: true, locale: de })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(request)
                          }}
                        >
                          Prüfen
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Drawer */}
      <JobRequestDetailDrawer
        request={selectedRequest}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onClose={handleClose}
        onFlag={handleFlag}
        onReopen={handleReopen}
      />
    </AppShell>
  )
}
