import { Suspense } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { MapPin, Calendar, Euro, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/baucrew/app-shell";
import { getJobRequestForProvider } from "@/app/_actions/job-requests";
import { JobDetailMessagesCard } from "@/components/provider/job-detail-messages-card";
import { JobDetailOfferCard } from "@/components/provider/job-detail-offer-card";
import { ListingCategoryLabels, JobTimeframeLabels } from "@/lib/validations/job-request";
import { requireDbUser } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProviderJobRequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireDbUser();

  let data;
  try {
    data = await getJobRequestForProvider(id);
  } catch (error) {
    notFound();
  }

  const { jobRequest, thread, myOffers } = data;

  const categoryLabel = ListingCategoryLabels[jobRequest.category] || jobRequest.category;
  const timeframeLabel = JobTimeframeLabels[jobRequest.timeframe] || jobRequest.timeframe;

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_DISCUSSION":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ASSIGNED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Offen";
      case "IN_DISCUSSION":
        return "In Diskussion";
      case "ASSIGNED":
        return "Vergeben";
      case "CLOSED":
        return "Geschlossen";
      case "FLAGGED":
        return "Markiert";
      default:
        return status;
    }
  };

  // Format messages for the component
  const messages = thread?.messages.map((msg) => ({
    id: msg.id,
    body: msg.body,
    createdAt: msg.createdAt,
    sender: msg.sender,
  })) || [];

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/provider/job-board">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Auftragsliste
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Left side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Request Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="font-medium">
                      {categoryLabel}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusColor(jobRequest.status)}
                    >
                      {getStatusLabel(jobRequest.status)}
                    </Badge>
                  </div>
                  {jobRequest.totalOffers > 0 && (
                    <Badge variant="secondary">
                      {jobRequest.totalOffers}{" "}
                      {jobRequest.totalOffers === 1 ? "Angebot" : "Angebote"}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{jobRequest.title}</CardTitle>
                <CardDescription>
                  Erstellt am{" "}
                  {format(new Date(jobRequest.createdAt), "dd. MMMM yyyy", {
                    locale: de,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Beschreibung</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {jobRequest.description}
                  </p>
                </div>

                <Separator />

                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Standort</h3>
                    <p className="text-sm text-muted-foreground">
                      {jobRequest.city}, {jobRequest.postalCode}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Die vollständige Adresse wird nach Auftragsannahme angezeigt
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Timing */}
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Zeitrahmen</h3>
                    <p className="text-sm text-muted-foreground">
                      {timeframeLabel}
                    </p>
                    {jobRequest.desiredDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Gewünschter Termin:{" "}
                        {format(new Date(jobRequest.desiredDate), "dd. MMMM yyyy", {
                          locale: de,
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Budget */}
                {(jobRequest.budgetMinCents || jobRequest.budgetMaxCents) && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2">
                      <Euro className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Budget</h3>
                        <p className="text-sm text-muted-foreground">
                          {jobRequest.budgetMinCents &&
                            `${(jobRequest.budgetMinCents / 100).toFixed(2)} EUR`}
                          {jobRequest.budgetMinCents &&
                            jobRequest.budgetMaxCents &&
                            " - "}
                          {jobRequest.budgetMaxCents &&
                            `${(jobRequest.budgetMaxCents / 100).toFixed(2)} EUR`}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Photos */}
                {jobRequest.photoUrls && jobRequest.photoUrls.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Fotos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {jobRequest.photoUrls.map((url, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden bg-muted"
                          >
                            <img
                              src={url}
                              alt={`Auftragsfoto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Messages Card */}
            <JobDetailMessagesCard
              jobRequestId={jobRequest.id}
              threadId={thread?.id}
              messages={messages}
              currentUserId={user.id}
            />
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <JobDetailOfferCard
                jobRequestId={jobRequest.id}
                existingOffers={myOffers}
                jobStatus={jobRequest.status}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
