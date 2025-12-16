"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Briefcase } from "lucide-react"
import type { ProviderJobDetail } from "@/lib/types"

interface CustomerInfoCardProps {
  job: ProviderJobDetail
}

export function CustomerInfoCard({ job }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Kunde</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={job.customerAvatar || "/placeholder.svg"} alt={job.customerName} />
            <AvatarFallback>
              {job.customerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{job.customerName}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {job.customerRating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span>{job.customerRating.toFixed(1)}</span>
                </div>
              )}
              {job.customerJobsCompleted && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.customerJobsCompleted} Aufträge</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
