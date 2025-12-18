"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, FileText, ShoppingBag } from "lucide-react"
import { AppShell } from "@/components/baucrew/app-shell"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderCard } from "@/components/orders/order-card"
import type { Order } from "@/lib/types"

type OrderStatus = "requested" | "payment_pending" | "scheduled" | "in_progress" | "completed"
type TabValue = "all" | OrderStatus

const tabConfig: { value: TabValue; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "requested", label: "Angefragt" },
  { value: "payment_pending", label: "Zahlung offen" },
  { value: "scheduled", label: "Geplant" },
  { value: "in_progress", label: "In Arbeit" },
  { value: "completed", label: "Abgeschlossen" },
]

interface OrdersClientProps {
  orders: Order[]
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all")

  // Filter orders by status
  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  // Check if user has any orders (for empty state)
  const hasAnyOrders = orders.length > 0

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold">Meine Bestellungen</h1>
        </div>

        {!hasAnyOrders ? (
          // First-time / empty state
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <ShoppingBag className="h-14 w-14 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Noch keine Bestellungen</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Finde einen Handwerker oder stelle einen Auftrag ein, um loszulegen.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/app/suche">
                  <Search className="h-4 w-4 mr-2" />
                  Handwerker finden
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/requests/new">
                  <FileText className="h-4 w-4 mr-2" />
                  Auftrag einstellen
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          // Tabs with orders
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
            <TabsList className="flex w-full overflow-x-auto lg:inline-flex lg:w-auto">
              {tabConfig.map((tab) => {
                const count = tab.value === "all" ? orders.length : orders.filter((o) => o.status === tab.value).length
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-2 whitespace-nowrap">
                    {tab.label}
                    {count > 0 && <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{count}</span>}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {tabConfig.map((tab) => {
              const tabOrders = tab.value === "all" ? orders : orders.filter((o) => o.status === tab.value)

              return (
                <TabsContent key={tab.value} value={tab.value} className="mt-6">
                  {tabOrders.length === 0 ? (
                    // Tab-specific empty state
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="rounded-full bg-muted p-5 mb-4">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Keine {tab.label.toLowerCase()}en Bestellungen</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        {tab.value === "requested"
                          ? "Angefragte Bestellungen erscheinen hier, sobald du eine Anfrage sendest."
                          : tab.value === "payment_pending"
                            ? "Bestellungen mit offener Zahlung werden hier angezeigt."
                            : tab.value === "scheduled"
                              ? "Geplante Termine erscheinen hier nach der Bestätigung."
                              : tab.value === "in_progress"
                                ? "Laufende Arbeiten werden hier angezeigt."
                                : "Abgeschlossene Bestellungen werden hier archiviert."}
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button asChild className="bg-secondary hover:bg-secondary/90">
                          <Link href="/app/suche">
                            <Search className="h-4 w-4 mr-2" />
                            Handwerker finden
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/app/requests/new">
                            <FileText className="h-4 w-4 mr-2" />
                            Auftrag einstellen
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tabOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        )}
      </div>
    </AppShell>
  )
}
