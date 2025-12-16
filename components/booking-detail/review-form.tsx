"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  providerName: string
  onSubmit?: (rating: number, comment: string) => void
}

export function ReviewForm({ providerName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
    onSubmit?.(rating, comment)
  }

  if (isSubmitted) {
    return (
      <Card className="bg-success/5 border-success/20">
        <CardContent className="flex flex-col items-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-success-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Vielen Dank für deine Bewertung!</h3>
          <p className="text-sm text-muted-foreground">Deine Bewertung hilft anderen Kunden bei der Auswahl.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewertung abgeben</CardTitle>
        <CardDescription>Wie war deine Erfahrung mit {providerName}?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Star rating */}
        <div>
          <p className="text-sm font-medium mb-2">Deine Bewertung</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hoveredRating || rating) >= star ? "fill-warning text-warning" : "text-muted-foreground/30",
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 5
                ? "Ausgezeichnet!"
                : rating === 4
                  ? "Sehr gut"
                  : rating === 3
                    ? "Gut"
                    : rating === 2
                      ? "Könnte besser sein"
                      : "Nicht zufrieden"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="text-sm font-medium mb-2 block">
            Dein Kommentar (optional)
          </label>
          <Textarea
            id="review-comment"
            placeholder="Beschreibe deine Erfahrung..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting} className="w-full">
          {isSubmitting ? "Wird gesendet..." : "Bewertung abschicken"}
        </Button>
      </CardContent>
    </Card>
  )
}
