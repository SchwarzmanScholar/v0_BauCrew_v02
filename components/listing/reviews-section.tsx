"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageSquare } from "lucide-react"
import type { Review } from "@/lib/types"

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number
  totalCount: number
}

export function ReviewsSection({ reviews, averageRating, totalCount }: ReviewsSectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  // Empty state
  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h4 className="font-semibold mb-2">Noch keine Bewertungen</h4>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Dieser Anbieter ist neu auf BauCrew und hat noch keine Kundenbewertungen erhalten.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground">basierend auf {totalCount} Bewertungen</span>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.customerAvatar || "/placeholder.svg"} alt={review.customerName} />
                <AvatarFallback>
                  {review.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-medium">{review.customerName}</h4>
                  <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">{review.jobCategory}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
