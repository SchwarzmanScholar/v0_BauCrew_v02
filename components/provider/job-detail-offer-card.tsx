"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Euro, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createOffer } from "@/app/_actions/offers";
import { Alert, AlertDescription } from "@/components/ui/alert";

const offerFormSchema = z.object({
  amountEuros: z
    .string()
    .min(1, "Bitte gib einen Preis ein")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Preis muss größer als 0 sein"),
  message: z
    .string()
    .min(10, "Nachricht muss mindestens 10 Zeichen lang sein")
    .max(1000, "Nachricht darf maximal 1000 Zeichen lang sein"),
});

type OfferFormData = z.infer<typeof offerFormSchema>;

interface Offer {
  id: string;
  status: string;
  amountCents: number;
  message: string;
  createdAt: Date;
}

interface JobDetailOfferCardProps {
  jobRequestId: string;
  existingOffers: Offer[];
  jobStatus: string;
}

export function JobDetailOfferCard({
  jobRequestId,
  existingOffers,
  jobStatus,
}: JobDetailOfferCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      amountEuros: "",
      message: "",
    },
  });

  async function onSubmit(data: OfferFormData) {
    setIsSubmitting(true);

    try {
      // Convert euros to cents
      const amountCents = Math.round(
        parseFloat(data.amountEuros.replace(",", ".")) * 100
      );

      const result = await createOffer({
        jobRequestId,
        amountCents,
        message: data.message,
      });

      if (result.ok) {
        toast({
          title: "Angebot gesendet",
          description: "Dein Angebot wurde erfolgreich an den Kunden gesendet.",
        });
        form.reset();
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Angebot konnte nicht gesendet werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Check if we already have a pending offer
  const hasPendingOffer = existingOffers.some(
    (offer) => offer.status === "SENT"
  );

  // Check if offer is accepted or job is closed
  const isJobClosed = jobStatus === "ASSIGNED" || jobStatus === "CLOSED";
  const hasAcceptedOffer = existingOffers.some(
    (offer) => offer.status === "ACCEPTED"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Angebot senden</CardTitle>
        <CardDescription>
          Sende dem Kunden ein Angebot für diesen Auftrag
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Show existing offers */}
        {existingOffers.length > 0 && (
          <div className="mb-4 space-y-2">
            {existingOffers.map((offer) => (
              <Alert key={offer.id}>
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {(offer.amountCents / 100).toFixed(2)} EUR
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {offer.status === "SENT" && "Wartet auf Antwort"}
                      {offer.status === "ACCEPTED" && "✓ Angenommen"}
                      {offer.status === "REJECTED" && "Abgelehnt"}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Show status messages */}
        {hasAcceptedOffer && (
          <Alert className="mb-4">
            <AlertDescription>
              Dein Angebot wurde angenommen! Der Kunde wird sich mit dir in Verbindung setzen.
            </AlertDescription>
          </Alert>
        )}

        {isJobClosed && !hasAcceptedOffer && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Dieser Auftrag ist bereits vergeben oder geschlossen.
            </AlertDescription>
          </Alert>
        )}

        {hasPendingOffer && !hasAcceptedOffer && !isJobClosed && (
          <Alert className="mb-4">
            <AlertDescription>
              Du hast bereits ein Angebot für diesen Auftrag abgegeben. Du kannst ein weiteres Angebot senden, um das vorherige zu aktualisieren.
            </AlertDescription>
          </Alert>
        )}

        {/* Offer form */}
        {!isJobClosed && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amountEuros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preis (EUR)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="z.B. 250,00"
                          className="pl-9"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Gib deinen Preis für diesen Auftrag an
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachricht</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Beschreibe dein Angebot und deine Verfügbarkeit..."
                        rows={5}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Erkläre dem Kunden, was in deinem Angebot enthalten ist
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Wird gesendet..." : "Angebot senden"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
