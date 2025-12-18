import { Suspense } from "react";
import type { Metadata } from "next";
import { Briefcase, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/baucrew/app-shell";
import { EmptyState } from "@/components/baucrew/empty-state";
import { LoadingSkeletonGrid } from "@/components/baucrew/loading-skeleton-grid";
import { ProviderJobRequestCard } from "@/components/provider/provider-job-request-card";
import { JobBoardFilters } from "@/components/provider/job-board-filters-simple";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { listOpenJobRequestsForProviders } from "@/app/_actions/job-requests";

export const metadata: Metadata = {
  title: "Job Board | BauCrew",
  description: "Finde offene Aufträge und sende Angebote an Kunden",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function JobBoardContent({ searchParams }: PageProps) {
  // Await the searchParams
  const params = await searchParams;
  const categoryFilter = typeof params.category === "string" ? params.category : undefined;
  const cityFilter = typeof params.city === "string" ? params.city : undefined;

  // Fetch job requests from server
  const jobRequests = await listOpenJobRequestsForProviders();

  // Apply filters
  const filteredJobRequests = jobRequests.filter((job) => {
    if (categoryFilter && job.category !== categoryFilter) {
      return false;
    }
    if (cityFilter && !job.city.toLowerCase().includes(cityFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl font-bold">Job Board</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Finde passende Aufträge und sende deine Angebote
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Hinweis</AlertTitle>
        <AlertDescription>
          Die vollständige Adresse wird erst nach Auftragsvergabe sichtbar. Du siehst nur Stadt
          und Postleitzahl.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <Suspense fallback={<div>Loading filters...</div>}>
              <JobBoardFilters />
            </Suspense>
          </div>
        </aside>

        {/* Job Listings */}
        <main className="lg:col-span-3">
          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredJobRequests.length} {filteredJobRequests.length === 1 ? "Auftrag" : "Aufträge"}{" "}
              gefunden
            </p>
          </div>

          {/* Job Cards Grid */}
          {filteredJobRequests.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Keine Aufträge gefunden"
              description="Aktuell gibt es keine offenen Aufträge, die deinen Filterkriterien entsprechen. Versuche, die Filter anzupassen."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobRequests.map((jobRequest) => (
                <ProviderJobRequestCard key={jobRequest.id} jobRequest={jobRequest} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function ProviderJobBoardPage(props: PageProps) {
  return (
    <AppShell userRole="provider">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSkeletonGrid />}>
          <JobBoardContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </AppShell>
  );
}
