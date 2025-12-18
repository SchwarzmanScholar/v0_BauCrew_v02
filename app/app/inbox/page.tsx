import { requireDbUser } from "@/lib/auth"
import { listMyThreads } from "@/app/_actions/inbox"
import { InboxClient } from "@/components/inbox/inbox-client"
import type { Conversation } from "@/lib/types"

export default async function InboxPage() {
  const user = await requireDbUser()
  const threads = await listMyThreads()

  // Transform threads to Conversation format
  const conversations: (Conversation & { link: string})[] = threads.map((thread) => {
    const isUserCustomer = thread.customerId === user.id
    const counterparty = isUserCustomer ? thread.provider : thread.customer
    const counterpartyName = isUserCustomer
      ? (thread.provider.displayName || "Anbieter")
      : (thread.customer.fullName || thread.customer.email)

    // Determine context
    const context = thread.bookingId ? "booking" : "request"
    const contextId = thread.bookingId || thread.jobRequestId || thread.id
    const contextTitle = thread.jobRequest?.title || "Buchung"

    // Build link based on context
    const link = thread.bookingId
      ? `/app/bookings/${thread.bookingId}`
      : thread.jobRequestId
        ? `/app/requests/${thread.jobRequestId}`
        : `/app/inbox`

    return {
      id: thread.id,
      counterpartyId: counterparty.id,
      counterpartyName,
      counterpartyAvatar: "",
      counterpartyVerified: false,
      context: context as "booking" | "request",
      contextId,
      contextTitle,
      lastMessage: thread.lastMessage?.body || "Keine Nachrichten",
      lastMessageAt: thread.lastMessage?.createdAt || thread.createdAt,
      unreadCount: 0, // TODO: Implement unread tracking
      messages: [], // Messages are loaded in detail view
      link, // Add link for navigation
    }
  })

  return <InboxClient conversations={conversations} userName={user.fullName || user.email} />
}
