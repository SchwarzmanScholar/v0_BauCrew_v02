"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmSimulatedPayment } from "@/app/_actions/payments";

interface SimulatedPaymentButtonProps {
  bookingId: string;
}

export function SimulatedPaymentButton({ bookingId }: SimulatedPaymentButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSimulatedPayment() {
    setIsProcessing(true);

    try {
      const result = await confirmSimulatedPayment({ bookingId });

      if (result.ok) {
        toast({
          title: "Zahlung erfolgreich",
          description: "Deine simulierte Zahlung wurde verarbeitet. Du wirst weitergeleitet...",
        });

        // Wait a moment for toast to show, then redirect to booking detail
        setTimeout(() => {
          router.push(`/app/bookings/${bookingId}`);
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description:
          error instanceof Error ? error.message : "Zahlung konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }

  return (
    <Button
      onClick={handleSimulatedPayment}
      disabled={isProcessing}
      size="lg"
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      <CheckCircle className="mr-2 h-5 w-5" />
      {isProcessing ? "Wird verarbeitet..." : "Zahlung bestätigen (Demo)"}
    </Button>
  );
}
