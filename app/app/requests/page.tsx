"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, FileText, Lightbulb } from "lucide-react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/baucrew/empty-state"
import { CustomerJobCard } from "@/components/my-requests/customer-job-card"
import { mockCustomerJobRequests } from "@/lib/mock-data"

type TabValue = "open" | "in_discussion" | "filled" | "closed"

const tabConfig: { value: TabValue; label: string }[] = [
  { value: "open", label: "Offen" },
  { value: "in_discussion", label: "In Gespräch" },
  { value: "filled", label: "Vergeben" },
  { value: "closed", label: "Geschlossen" },
]

export default function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("open")

  // Filter jobs by status
  const filteredJobs = mockCustomerJobRequests.filter((job) => job.status === activeTab)

  // Check if user has any jobs at all (for first-time empty state)
  const hasAnyJobs = mockCustomerJobRequests.length > 0

  // Toggle to simulate first-time user (for demo purposes)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)

  const showFirstTimeEmpty = isFirstTimeUser || !hasAnyJobs

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Meine Aufträge</h1>
          <Button asChild className="bg-secondary hover:bg-secondary/90">
            <Link href="/app/requests/new">
              <Plus className="h-4 w-4 mr-2" />
              Neuen Auftrag einstellen
            </Link>
          </Button>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-primary/5 border border-primary/10">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tipp:</span> Je genauer die Beschreibung und Fotos, desto
            schneller bekommst du passende Antworten.
          </p>
        </div>

        {/* Demo toggle for first-time user state */}
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => setIsFirstTimeUser(!isFirstTimeUser)}>
            {isFirstTimeUser ? "Demo: Aufträge anzeigen" : "Demo: Erster Besuch"}
          </Button>
        </div>

        {showFirstTimeEmpty ? (
          // First-time customer empty state
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <FileText className="h-14 w-14 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Noch keine Aufträge</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Stelle deinen ersten Auftrag ein und lass Handwerker auf dich zukommen.
            </p>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
              <Link href="/app/requests/new">
                <Plus className="h-5 w-5 mr-2" />
                Auftrag einstellen
              </Link>
            </Button>
          </div>
        ) : (
          // Tabs with job requests
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              {tabConfig.map((tab) => {
                const count = mockCustomerJobRequests.filter((job) => job.status === tab.value).length
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
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
                  <EmptyState
                    icon={FileText}
                    title={`Keine ${tab.label.toLowerCase()}en Aufträge`}
                    description={
                      tab.value === "open"
                        ? "Du hast aktuell keine offenen Aufträge. Stelle einen neuen Auftrag ein!"
                        : tab.value === "in_discussion"
                          ? "Sobald Handwerker auf deine Aufträge antworten, erscheinen sie hier."
                          : tab.value === "filled"
                            ? "Aufträge, die du an einen Handwerker vergeben hast, erscheinen hier."
                            : "Abgeschlossene und stornierte Aufträge werden hier archiviert."
                    }
                    actionLabel={tab.value === "open" ? "Auftrag einstellen" : undefined}
                    onAction={tab.value === "open" ? () => (window.location.href = "/app/requests/new") : undefined}
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                      <CustomerJobCard key={job.id} jobRequest={job} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AppShell>
  )
}
