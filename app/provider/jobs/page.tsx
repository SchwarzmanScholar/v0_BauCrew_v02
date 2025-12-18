import { requireDbUser } from "@/lib/auth"
import { listProviderBookings } from "@/app/_actions/bookings"
import { ProviderJobsClient } from "@/components/provider/provider-jobs-client"
import type { BookingStatus } from "@prisma/client"
import type { ProviderJob, ProviderJobStatus } from "@/lib/types"

// Map Prisma BookingStatus to UI ProviderJobStatus
function mapBookingStatusToProviderJobStatus(status: BookingStatus): ProviderJobStatus {
  switch (status) {
    case "REQUESTED":
    case "ACCEPTED":
    case "DECLINED":
      return "requested"
    case "NEEDS_PAYMENT":
    case "PAID":
      return "payment_pending"
    case "SCHEDULED":
      return "scheduled"
    case "IN_PROGRESS":
      return "in_progress"
    case "COMPLETED":
    case "CANCELED":
    case "DISPUTED":
    case "REFUNDED":
      return "completed"
    default:
      return "requested"
  }
}

export default async function ProviderJobsPage() {
  await requireDbUser()
  const bookings = await listProviderBookings()

  // Transform bookings to ProviderJob format
  const jobs: ProviderJob[] = bookings.map((booking) => ({
    id: booking.id,
    jobTitle: booking.jobTitle,
    customerId: booking.customer.id,
    customerName: booking.customer.fullName || booking.customer.email,
    customerAvatar: "",
    category: `${booking.city}, ${booking.postalCode}`,
    status: mapBookingStatusToProviderJobStatus(booking.status),
    requestedDate: booking.createdAt,
    requestedTime: "TBD", // TODO: Add time to Booking model
    amount: (booking.quotedPriceCents ?? 0) / 100,
    city: booking.city,
    createdAt: booking.createdAt,
  }))

  return <ProviderJobsClient jobs={jobs} />
}
