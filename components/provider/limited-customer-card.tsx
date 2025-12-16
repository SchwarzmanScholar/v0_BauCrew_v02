"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Calendar, Info } from "lucide-react"
import type { ProviderWorkRequestDetail } from "@/lib/types"

interface LimitedCustomerCardProps {
  customer: ProviderWorkRequestDetail["customer"]
}

export function LimitedCustomerCard({ customer }: LimitedCustomerCardProps) {
  const memberMonths = Math.floor((Date.now() - customer.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const memberText =
    memberMonths < 1 ? "Neu" : memberMonths < 12 ? `${memberMonths} Monate` : `${Math.floor(memberMonths / 12)} Jahr(e)`

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Kunde</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-muted text-muted-foreground text-lg">{customer.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{customer.firstName}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {customer.area}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Mitglied seit {memberText}</span>
        </div>

        {/* Privacy notice */}
        <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-border/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">Genaue Kontaktdaten erst nach Bestätigung.</p>
        </div>
      </CardContent>
    </Card>
  )
}
