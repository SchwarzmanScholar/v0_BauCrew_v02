"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CheckCircle, Euro, User, Building2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { acceptOffer } from "@/app/_actions/bookings";
import { cn } from "@/lib/utils";

interface Offer {
  id: string;
  status: string;
  amountCents: number;
  message: string;
  earliestStart: Date | null;
  createdAt: Date;
  provider: {
    id: string;
    fullName: string | null;
    providerProfile: {
      displayName: string;
      companyName: string | null;
      verificationStatus: string;
    } | null;
  };
}

interface CustomerOffersListProps {
  offers: Offer[];
  jobRequestStatus: string;
}

export function CustomerOffersList({ offers, jobRequestStatus }: CustomerOffersListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  async function handleAcceptOffer() {
    if (!selectedOffer) return;

    setIsAccepting(true);
    try {
      const result = await acceptOffer({ offerId: selectedOffer.id });

      if (result.ok && result.bookingId) {
        toast({
          title: "Angebot angenommen",
          description: "Du wirst zur Zahlung weitergeleitet.",
        });
        
        // Redirect to checkout
        router.push(`/app/checkout/${result.bookingId}`);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Angebot konnte nicht angenommen werden.",
        variant: "destructive",
      });
      setIsAccepting(false);
      setSelectedOffer(null);
    }
  }

  // Check if job is already assigned
  const isAssigned = jobRequestStatus === "ASSIGNED" || jobRequestStatus === "CLOSED";
  const hasAcceptedOffer = offers.some((offer) => offer.status === "ACCEPTED");

  if (offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Angebote</CardTitle>
          <CardDescription>
            Noch keine Angebote für diesen Auftrag eingegangen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Handwerker können dir Angebote für deinen Auftrag senden. Du wirst benachrichtigt,
            sobald ein neues Angebot eingeht.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Angebote ({offers.length})</CardTitle>
          <CardDescription>
            Wähle das beste Angebot für deinen Auftrag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offers.map((offer) => {
              const providerName =
                offer.provider.providerProfile?.displayName ||
                offer.provider.fullName ||
                "Handwerker";
              const isVerified =
                offer.provider.providerProfile?.verificationStatus === "APPROVED";
              const isAccepted = offer.status === "ACCEPTED";
              const isRejected = offer.status === "REJECTED";

              return (
                <div
                  key={offer.id}
                  className={cn(
                    "border rounded-lg p-4 space-y-3",
                    isAccepted && "border-green-500 bg-green-50",
                    isRejected && "opacity-50"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{providerName}</span>
                          {isVerified && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Verifiziert
                            </Badge>
                          )}
                        </div>
                        {offer.provider.providerProfile?.companyName && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            {offer.provider.providerProfile.companyName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    {isAccepted && (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Angenommen
                      </Badge>
                    )}
                    {isRejected && (
                      <Badge variant="secondary">Abgelehnt</Badge>
                    )}
                  </div>

                  <Separator />

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">
                        {(offer.amountCents / 100).toFixed(2)} EUR
                      </div>
                      <div className="text-xs text-muted-foreground">Gesamtpreis</div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {offer.message}
                    </p>
                  </div>

                  {/* Earliest start date */}
                  {offer.earliestStart && (
                    <div className="text-xs text-muted-foreground">
                      Frühester Start:{" "}
                      {format(new Date(offer.earliestStart), "dd. MMMM yyyy", {
                        locale: de,
                      })}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      Gesendet am{" "}
                      {format(new Date(offer.createdAt), "dd.MM.yyyy, HH:mm", {
                        locale: de,
                      })}
                    </div>

                    {/* Accept button */}
                    {!isAssigned && offer.status === "SENT" && (
                      <Button
                        onClick={() => setSelectedOffer(offer)}
                        disabled={isAccepting}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Angebot annehmen
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info message */}
          {hasAcceptedOffer && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Du hast ein Angebot angenommen. Der Handwerker wird sich mit dir in
                Verbindung setzen, um die Details zu besprechen.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accept confirmation dialog */}
      <AlertDialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Angebot annehmen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du das Angebot von{" "}
              <strong>
                {selectedOffer?.provider.providerProfile?.displayName ||
                  selectedOffer?.provider.fullName ||
                  "diesem Handwerker"}
              </strong>{" "}
              für{" "}
              <strong>
                {selectedOffer && (selectedOffer.amountCents / 100).toFixed(2)} EUR
              </strong>{" "}
              annehmen?
              <br />
              <br />
              Durch die Annahme wird ein verbindlicher Auftrag erstellt. Du wirst zur
              Zahlung weitergeleitet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAccepting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAcceptOffer}
              disabled={isAccepting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAccepting ? "Wird angenommen..." : "Ja, Angebot annehmen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
