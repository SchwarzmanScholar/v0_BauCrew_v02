import { notFound, redirect } from "next/navigation";
import { CheckCircle, Euro, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppShell } from "@/components/baucrew/app-shell";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { confirmSimulatedPayment } from "@/app/_actions/payments";
import { SimulatedPaymentButton } from "@/components/checkout/simulated-payment-button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { id: bookingId } = await params;
  const user = await requireDbUser();

  // Load booking with all related data
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      provider: {
        select: {
          id: true,
          fullName: true,
          providerProfile: {
            select: {
              displayName: true,
              companyName: true,
              verificationStatus: true,
            },
          },
        },
      },
      jobRequest: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) {
    notFound();
  }

  // Verify customer owns this booking
  if (booking.customerId !== user.id) {
    throw new Error("Unauthorized: You can only access your own bookings");
  }

  // If already paid, redirect to booking detail
  if (booking.status === "PAID") {
    redirect(`/app/bookings/${bookingId}`);
  }

  const providerName =
    booking.provider.providerProfile?.displayName ||
    booking.provider.fullName ||
    "Handwerker";

  const isSimulatedPaymentMode = process.env.PAYMENTS_MODE === "disabled";

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Angebot angenommen!</h1>
          <p className="text-muted-foreground">
            Schließe die Zahlung ab, um den Auftrag zu bestätigen
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Auftragsdetails</CardTitle>
              <CardDescription>Zusammenfassung deiner Buchung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Auftrag</div>
                <div className="font-semibold">{booking.jobTitle}</div>
                {booking.jobRequest && (
                  <Badge variant="outline" className="mt-1">
                    {booking.jobRequest.category}
                  </Badge>
                )}
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-1">Handwerker</div>
                <div className="font-semibold">{providerName}</div>
                {booking.provider.providerProfile?.companyName && (
                  <div className="text-sm text-muted-foreground">
                    {booking.provider.providerProfile.companyName}
                  </div>
                )}
                {booking.provider.providerProfile?.verificationStatus === "APPROVED" && (
                  <Badge variant="secondary" className="mt-1 gap-1">
                    <Shield className="h-3 w-3" />
                    Verifiziert
                  </Badge>
                )}
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-1">Adresse</div>
                <div className="text-sm">
                  {booking.addressLine1}
                  {booking.addressLine2 && (
                    <>
                      <br />
                      {booking.addressLine2}
                    </>
                  )}
                  <br />
                  {booking.postalCode} {booking.city}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Zahlung</CardTitle>
              <CardDescription>Preis und Zahlungsinformationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Angebotspreis</div>
                <div className="font-semibold">
                  {booking.quotedPriceCents
                    ? `${(booking.quotedPriceCents / 100).toFixed(2)} EUR`
                    : "N/A"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Plattformgebühr</div>
                <div className="font-semibold">
                  {(booking.platformFeeCents / 100).toFixed(2)} EUR
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="font-semibold">Gesamt</div>
                <div className="text-2xl font-bold">
                  <Euro className="inline h-5 w-5 mb-1" />
                  {booking.quotedPriceCents
                    ? ((booking.quotedPriceCents + booking.platformFeeCents) / 100).toFixed(2)
                    : "0.00"}
                </div>
              </div>

              <Separator />

              {/* Payment Status */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <Badge
                  variant={booking.status === "PAID" ? "default" : "secondary"}
                  className="font-medium"
                >
                  {booking.status === "NEEDS_PAYMENT" && "Zahlung ausstehend"}
                  {booking.status === "PAID" && "Bezahlt"}
                  {booking.status === "REQUESTED" && "Angefragt"}
                </Badge>
              </div>

              {booking.payment && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Zahlungsstatus
                  </div>
                  <Badge variant="outline">
                    {booking.payment.status === "REQUIRES_PAYMENT" &&
                      "Zahlung erforderlich"}
                    {booking.payment.status === "SUCCEEDED" && "Erfolgreich"}
                    {booking.payment.status === "PROCESSING" && "In Bearbeitung"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Simulated Payment Section */}
        {isSimulatedPaymentMode && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Testmodus
              </CardTitle>
              <CardDescription>
                Zahlungen sind deaktiviert. Verwende die Schaltfläche unten, um die
                Zahlung zu simulieren.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimulatedPaymentButton bookingId={bookingId} />
            </CardContent>
          </Card>
        )}

        {/* Real Payment Section (for future) */}
        {!isSimulatedPaymentMode && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Zahlung abschließen</CardTitle>
              <CardDescription>
                Sichere Zahlung über Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Deine Zahlung wird sicher über Stripe abgewickelt. Wir speichern keine
                  Kreditkartendaten.
                </AlertDescription>
              </Alert>
              <Button size="lg" className="w-full" disabled>
                Zur Zahlung (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info boxes */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Käuferschutz:</strong> Dein Geld ist bis zur erfolgreichen
              Fertigstellung des Auftrags geschützt.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Wichtig:</strong> Die Zahlung ist erforderlich, um den Auftrag zu
              bestätigen.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </AppShell>
  );
}
