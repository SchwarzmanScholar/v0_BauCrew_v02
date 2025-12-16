import { AppShell } from "@/components/baucrew/app-shell"
import { ListingForm } from "@/components/provider/listing-form"
import { mockProviderListingDetail } from "@/lib/mock-data"

export default function EditListingPage() {
  // In real app, would fetch listing by ID
  const listing = mockProviderListingDetail

  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <ListingForm listing={listing} isEdit />
      </div>
    </AppShell>
  )
}
