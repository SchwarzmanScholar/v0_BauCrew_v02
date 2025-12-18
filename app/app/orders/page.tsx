import { requireDbUser } from "@/lib/auth"
import { listCustomerBookings } from "@/app/_actions/bookings"
import { OrdersClient } from "@/components/orders/orders-client"
import type { BookingStatus } from "@prisma/client"
import type { Order } from "@/lib/types"

// Map Prisma BookingStatus to UI OrderStatus
function mapBookingStatusToOrderStatus(
  status: BookingStatus,
): "requested" | "payment_pending" | "scheduled" | "in_progress" | "completed" {
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

export default async function OrdersPage() {
  const user = await requireDbUser()
  const bookings = await listCustomerBookings()

  // Transform bookings to Order format
  const orders: Order[] = bookings.map((booking) => ({
    id: booking.id,
    jobTitle: booking.jobTitle,
    providerId: booking.provider.id,
    providerName: booking.provider.providerProfile?.displayName || booking.provider.fullName || booking.provider.email,
    providerAvatar: "",
    customerId: user.id,
    status: mapBookingStatusToOrderStatus(booking.status),
    scheduledDate: new Date(), // TODO: Add scheduledDate to Booking model
    scheduledTime: "TBD", // TODO: Add scheduledTime to Booking model
    totalAmount: (booking.quotedPriceCents ?? 0) / 100,
    category: `${booking.city}, ${booking.postalCode}`,
  }))

  return <OrdersClient orders={orders} />
}
