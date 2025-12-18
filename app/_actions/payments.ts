"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Input type for confirming simulated payment
 */
export interface ConfirmSimulatedPaymentInput {
  bookingId: string;
}

/**
 * Confirm a simulated payment for testing purposes
 * Requires: CUSTOMER, BOTH, or ADMIN role
 * 
 * This action only works when PAYMENTS_MODE=disabled
 * Validates:
 * - Booking exists
 * - Current user is the customer on the booking
 * - PAYMENTS_MODE environment variable is "disabled"
 * 
 * Updates:
 * - Booking: status=PAID, paidAt=now
 * - PaymentTransaction: status=SUCCEEDED
 * 
 * Returns { ok: true, bookingId }
 * 
 * Note: This is a development/testing feature. Do not use in production.
 */
export async function confirmSimulatedPayment(input: ConfirmSimulatedPaymentInput) {
  const user = await requireDbUser();

  // Authorization: Only customers can confirm payments
  if (user.role !== "CUSTOMER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only customers can confirm payments");
  }

  // Check if simulated payments are enabled
  if (process.env.PAYMENTS_MODE !== "disabled") {
    throw new Error(
      "Simulated payments are only available when PAYMENTS_MODE=disabled. " +
      "Use real payment flow in production."
    );
  }

  const { bookingId } = input;

  // Load the booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      status: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Validate the current user is the customer on this booking
  if (booking.customerId !== user.id) {
    throw new Error("Unauthorized: You can only confirm payments for your own bookings");
  }

  // Check if booking is in the correct state
  if (booking.status !== "NEEDS_PAYMENT") {
    throw new Error("This booking does not require payment or has already been paid");
  }

  // Update booking and payment transaction in a transaction
  await prisma.$transaction(async (tx) => {
    // Update booking status to PAID
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Update payment transaction status to SUCCEEDED
    await tx.paymentTransaction.update({
      where: { bookingId },
      data: {
        status: "SUCCEEDED",
      },
    });
  });

  return { ok: true, bookingId };
}
