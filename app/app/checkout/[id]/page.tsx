"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/baucrew/app-shell"
import { BookingSummaryCard } from "@/components/checkout/booking-summary-card"
import { CheckoutPriceBreakdown } from "@/components/checkout/checkout-price-breakdown"
import { WhyPaySection } from "@/components/checkout/why-pay-section"
import { CheckoutSuccess } from "@/components/checkout/checkout-success"
import { CheckoutCancelled } from "@/components/checkout/checkout-cancelled"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Loader2, CreditCard, FlaskConical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockBookingData = {
  listing: {
    title: "Badezimmerrenovierung - Komplettservice",
    category: "Sanitär",
    providerName: "Klaus Müller",
    providerAvatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    rating: 4.8,
    reviewCount: 127,
  },
  booking: {
    date: "Freitag, 24. Januar 2025",
    time: "10:00 Uhr",
    address: "Musterstraße 12, 10115 Berlin",
  },
  subtotal: 2500,
}

type CheckoutState = "checkout" | "success" | "cancelled"

export default function CheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const stateParam = searchParams.get("state")
  const initialState: CheckoutState =
    stateParam === "success" ? "success" : stateParam === "cancelled" ? "cancelled" : "checkout"

  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialState)
  const [isLoading, setIsLoading] = useState(false)

  const handleStripeCheckout = async () => {
    setIsLoading(true)
    // Simulate Stripe redirect
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // In real implementation, this would redirect to Stripe
    toast({
      title: "Weiterleitung zu Stripe...",
      description: "Du wirst zur sicheren Zahlungsseite weitergeleitet.",
    })
    setIsLoading(false)
    // For demo, show success after delay
    setTimeout(() => setCheckoutState("success"), 1500)
  }

  const handleDemoPayment = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCheckoutState("success")
    setIsLoading(false)
  }

  // Show success or cancelled states
  if (checkoutState === "success") {
    return (
      <AppShell userRole="customer">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <CheckoutSuccess />
        </div>
      </AppShell>
    )
  }

  if (checkoutState === "cancelled") {
    return (
      <AppShell userRole="customer">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <CheckoutCancelled bookingId={params.id as string} />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell userRole="customer">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">Überprüfe deine Buchung und schließe die Zahlung ab.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Column - Booking Summary */}
            <div className="lg:col-span-3 space-y-6">
              <BookingSummaryCard listing={mockBookingData.listing} booking={mockBookingData.booking} />

              {/* Trust Section */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Lock className="h-4 w-4" />
                        <span>Sichere Zahlung</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4" />
                        <span>Support bei Problemen</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Price & Actions */}
            <div className="lg:col-span-2 space-y-4">
              <CheckoutPriceBreakdown subtotal={mockBookingData.subtotal} />

              {/* Pay Button */}
              <Button
                className="w-full h-12 text-base gap-2"
                size="lg"
                onClick={handleStripeCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Wird verarbeitet...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Sicher bezahlen (Stripe)
                  </>
                )}
              </Button>

              {/* Demo Mode Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">oder</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={handleDemoPayment}
                disabled={isLoading}
              >
                <FlaskConical className="h-4 w-4" />
                Als bezahlt markieren (nur Demo)
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                  Test
                </Badge>
              </Button>

              {/* Why Pay Collapsible */}
              <WhyPaySection />

              {/* Cancel Link */}
              <p className="text-center text-sm text-muted-foreground">
                <button
                  onClick={() => setCheckoutState("cancelled")}
                  className="underline hover:text-foreground transition-colors"
                >
                  Abbrechen
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
