"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Briefcase, Search, Plus } from "lucide-react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProviderJobRow } from "@/components/provider/provider-job-row"
import type { ProviderJob, ProviderJobStatus } from "@/lib/types"

type TabValue = "all" | ProviderJobStatus

const tabConfig: { value: TabValue; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "requested", label: "Anfragen" },
  { value: "payment_pending", label: "Zahlung offen" },
  { value: "scheduled", label: "Geplant" },
  { value: "in_progress", label: "In Arbeit" },
  { value: "completed", label: "Abgeschlossen" },
]

interface ProviderJobsClientProps {
  jobs: ProviderJob[]
}

export function ProviderJobsClient({ jobs }: ProviderJobsClientProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtered jobs based on tab and search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tab filter
      if (activeTab !== "all" && job.status !== activeTab) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          job.jobTitle.toLowerCase().includes(query) ||
          job.customerName.toLowerCase().includes(query) ||
          job.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      return true
    })
  }, [jobs, activeTab, searchQuery])

  // Count jobs per tab
  const getTabCount = (tabValue: TabValue) => {
    if (tabValue === "all") return jobs.length
    return jobs.filter((j) => j.status === tabValue).length
  }

  // Check if user has any jobs
  const hasAnyJobs = jobs.length > 0

  return (
    <AppShell userRole="provider">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meine Aufträge</h1>
            <p className="text-muted-foreground text-sm mt-1">Verwalte deine Buchungen und Kundenanfragen</p>
          </div>
          <Button asChild className="bg-secondary hover:bg-secondary/90">
            <Link href="/provider/job-board">
              <Plus className="h-4 w-4 mr-2" />
              Neuen Auftrag finden
            </Link>
          </Button>
        </div>

        {!hasAnyJobs ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <Briefcase className="h-14 w-14 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Noch keine Aufträge</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Schaue im Job-Board nach passenden Aufträgen und sende dein erstes Angebot.
            </p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link href="/provider/job-board">
                <Plus className="h-4 w-4 mr-2" />
                Job-Board ansehen
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Auftrag, Kunde oder Kategorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
              <TabsList className="flex w-full overflow-x-auto lg:inline-flex lg:w-auto">
                {tabConfig.map((tab) => {
                  const count = getTabCount(tab.value)
                  return (
                    <TabsTrigger key={tab.value} value={tab.value} className="gap-2 whitespace-nowrap">
                      {tab.label}
                      {count > 0 && <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{count}</span>}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {tabConfig.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-6">
                  {filteredJobs.length === 0 ? (
                    // Tab-specific empty state
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="rounded-full bg-muted p-5 mb-4">
                        <Briefcase className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Keine {tab.label.toLowerCase()} Aufträge
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        {tab.value === "requested"
                          ? "Neue Anfragen erscheinen hier, sobald ein Kunde dein Angebot annimmt."
                          : tab.value === "payment_pending"
                            ? "Aufträge mit offener Zahlung werden hier angezeigt."
                            : tab.value === "scheduled"
                              ? "Geplante Termine erscheinen hier nach der Bestätigung."
                              : tab.value === "in_progress"
                                ? "Laufende Arbeiten werden hier angezeigt."
                                : "Abgeschlossene Aufträge werden hier archiviert."}
                      </p>
                      <Button asChild className="bg-secondary hover:bg-secondary/90">
                        <Link href="/provider/job-board">
                          <Plus className="h-4 w-4 mr-2" />
                          Job-Board ansehen
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Auftrag</TableHead>
                            <TableHead>Datum/Zeit</TableHead>
                            <TableHead>Betrag</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.map((job) => (
                            <ProviderJobRow key={job.id} job={job} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </AppShell>
  )
}
