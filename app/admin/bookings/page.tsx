import { adminListBookings } from "@/app/_actions/admin"
import { AdminBookingsClient } from "./client"
import type { AdminBookingDetail } from "@/lib/types"
import type { BookingStatus } from "@prisma/client"

/**
 * Admin Bookings Page - Server Component
 * Fetches bookings from database and passes to client component for filtering/interactions
 */
export default async function AdminBookingsPage() {
  // Fetch bookings from database
  const dbBookings = await adminListBookings()

  // Transform DB data to match UI expectations
  const bookings: AdminBookingDetail[] = dbBookings.map((booking) => ({
    id: booking.id,
    jobTitle: booking.jobTitle,
    description: "", // Not fetched in list view
    category: booking.jobRequest?.category ? formatCategory(booking.jobRequest.category) : "Sonstiges",
    status: mapStatus(booking.status),
    createdAt: booking.createdAt,
    scheduledDate: booking.scheduledStart || undefined,
    scheduledTime: booking.scheduledStart ? formatTime(booking.scheduledStart) : undefined,
    completedDate: undefined, // Not tracked separately
    // Pricing
    subtotal: (booking.quotedPriceCents || 0) / 100,
    platformFee: (booking.platformFeeCents || 0) / 100,
    total: (booking.quotedPriceCents || 0) / 100,
    providerPayout: (booking.providerPayoutCents || 0) / 100,
    paymentStatus: booking.payment ? mapPaymentStatus(booking.payment.status) : "pending",
    // Location
    address: {
      street: booking.addressLine1,
      houseNumber: "", // Not split in DB
      plz: booking.postalCode,
      city: booking.city,
    },
    // Participants
    customer: {
      id: booking.customer.id,
      name: booking.customer.fullName || booking.customer.email,
      email: booking.customer.email,
      avatar: "",
      phone: undefined,
    },
    provider: {
      id: booking.provider.id,
      name: booking.provider.fullName || booking.provider.email,
      email: booking.provider.email,
      avatar: "",
      companyName: booking.provider.providerProfile?.companyName || "",
      verified: booking.provider.providerProfile?.verificationStatus === "APPROVED",
      phone: undefined,
    },
    // Messages preview
    recentMessages: [],
    // Notes
    accessNotes: undefined,
    adminNotes: undefined,
  }))

  return <AdminBookingsClient initialBookings={bookings} />
}

/**
 * Map Prisma category enum to German display name
 */
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    ELECTRICIAN: "Elektriker",
    PLUMBER: "Sanitär",
    PAINTING: "Maler",
    DRYWALL: "Trockenbau",
    HANDYMAN: "Handwerker",
    CARPENTRY: "Schreiner",
    FLOORING: "Bodenbelag",
    MASONRY: "Maurer",
    HVAC: "Heizung",
    OTHER: "Sonstiges",
  }
  return categoryMap[category] || category
}

/**
 * Map Prisma BookingStatus to AdminBookingStatus
 */
function mapStatus(status: BookingStatus): 
  | "requested"
  | "needs_payment"
  | "paid"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed" {
  const statusMap: Record<BookingStatus, 
    | "requested"
    | "needs_payment"
    | "paid"
    | "scheduled"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "disputed"> = {
    REQUESTED: "requested",
    ACCEPTED: "requested",
    DECLINED: "cancelled",
    NEEDS_PAYMENT: "needs_payment",
    PAID: "paid",
    SCHEDULED: "scheduled",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELED: "cancelled",
    DISPUTED: "disputed",
    REFUNDED: "cancelled",
  }
  return statusMap[status] || "requested"
}

/**
 * Map Prisma PaymentStatus to simplified payment status
 */
function mapPaymentStatus(status: string): "pending" | "paid" | "refunded" | "failed" {
  const statusMap: Record<string, "pending" | "paid" | "refunded" | "failed"> = {
    REQUIRES_PAYMENT: "pending",
    PROCESSING: "pending",
    SUCCEEDED: "paid",
    FAILED: "failed",
    CANCELED: "failed",
    REFUNDED: "refunded",
  }
  return statusMap[status] || "pending"
}

/**
 * Format Date to time string
 */
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
