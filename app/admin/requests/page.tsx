import { adminListJobRequests } from "@/app/_actions/admin"
import { AdminJobRequestsClient } from "./client"
import type { AdminJobRequestDetail } from "@/lib/types"

/**
 * Admin Job Requests Page - Server Component
 * Fetches job requests from database and passes to client component for filtering/interactions
 */
export default async function AdminJobRequestsPage() {
  // Fetch job requests from database
  const dbRequests = await adminListJobRequests()

  // Transform DB data to match UI expectations
  const requests: AdminJobRequestDetail[] = dbRequests.map((req) => ({
    id: req.id,
    title: req.title,
    description: "", // Not fetched in list view for performance
    category: formatCategory(req.category),
    location: req.city,
    plz: req.postalCode,
    timeframe: formatTimeframe(req.timeframe),
    budget: req.budgetMinCents ? req.budgetMinCents / 100 : null,
    budgetMax: req.budgetMaxCents ? req.budgetMaxCents / 100 : null,
    photos: [],
    status: mapStatus(req.status),
    offerCount: req._count.offers,
    createdAt: req.createdAt,
    customer: {
      id: req.customer.id,
      name: req.customer.fullName || req.customer.email,
      email: req.customer.email,
      avatar: "", // Not available in current schema
    },
    isFlagged: false,
  }))

  return <AdminJobRequestsClient initialRequests={requests} />
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
 * Map Prisma timeframe enum to German display
 */
function formatTimeframe(timeframe: string): string {
  const timeframeMap: Record<string, string> = {
    ASAP: "So bald wie möglich",
    NEXT_7_DAYS: "In den nächsten 7 Tagen",
    SPECIFIC_DATE: "Bestimmtes Datum",
  }
  return timeframeMap[timeframe] || timeframe
}

/**
 * Map Prisma JobRequestStatus to AdminJobRequestStatus
 */
function mapStatus(status: string): "open" | "in_discussion" | "filled" | "closed" | "flagged" {
  const statusMap: Record<string, "open" | "in_discussion" | "filled" | "closed" | "flagged"> = {
    OPEN: "open",
    IN_DISCUSSION: "in_discussion",
    ASSIGNED: "filled",
    CLOSED: "closed",
    FLAGGED: "flagged",
  }
  return statusMap[status] || "open"
}
