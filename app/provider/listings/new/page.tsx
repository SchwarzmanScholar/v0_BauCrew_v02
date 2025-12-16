import { AppShell } from "@/components/baucrew/app-shell"
import { ListingForm } from "@/components/provider/listing-form"

export default function NewListingPage() {
  return (
    <AppShell userRole="provider" userName="Klaus Müller">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <ListingForm />
      </div>
    </AppShell>
  )
}
