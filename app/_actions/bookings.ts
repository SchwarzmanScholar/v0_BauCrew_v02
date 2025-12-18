"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shouldShowFullAddressToProvider } from "@/lib/utils";

/**
 * Input type for accepting an offer
 */
export interface AcceptOfferInput {
  offerId: string;
}

/**
 * Accept an offer and create a booking
 * Requires: CUSTOMER, BOTH, or ADMIN role
 * 
 * Validates:
 * - Offer exists
 * - Current user is the customer who created the job request
 * 
 * In a Prisma transaction:
 * - Sets accepted offer: status=ACCEPTED, acceptedAt=now
 * - Sets other offers on the same jobRequest: status=REJECTED
 * - Creates Booking with type=BOOKING, status=NEEDS_PAYMENT
 * - Copies job details from JobRequest
 * - Updates offer with bookingId
 * - Updates thread with bookingId
 * - Updates job request: status=ASSIGNED
 * - Creates PaymentTransaction with status=REQUIRES_PAYMENT
 * 
 * Returns { ok: true, bookingId }
 */
export async function acceptOffer(input: AcceptOfferInput) {
  const user = await requireDbUser();

  // Authorization: Only customers can accept offers
  if (user.role !== "CUSTOMER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only customers can accept offers");
  }

  const { offerId } = input;

  // Load the offer with related data
  const offer = await prisma.requestOffer.findUnique({
    where: { id: offerId },
    include: {
      jobRequest: true,
      thread: true,
    },
  });

  if (!offer) {
    throw new Error("Offer not found");
  }

  // Validate the current user is the customer who created the job request
  if (offer.jobRequest.customerId !== user.id) {
    throw new Error("Unauthorized: You can only accept offers for your own job requests");
  }

  // Check if offer is already accepted or rejected
  if (offer.status === "ACCEPTED") {
    throw new Error("This offer has already been accepted");
  }

  if (offer.status === "REJECTED" || offer.status === "WITHDRAWN") {
    throw new Error("This offer is no longer available");
  }

  // Perform all operations in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Accept this offer
    await tx.requestOffer.update({
      where: { id: offerId },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
    });

    // 2. Reject all other offers for this job request
    await tx.requestOffer.updateMany({
      where: {
        jobRequestId: offer.jobRequestId,
        id: { not: offerId },
        status: "SENT",
      },
      data: {
        status: "REJECTED",
      },
    });

    // 3. Create the booking
    const booking = await tx.booking.create({
      data: {
        type: "BOOKING",
        status: "NEEDS_PAYMENT",
        jobRequestId: offer.jobRequestId,
        customerId: offer.jobRequest.customerId,
        providerId: offer.providerId,
        jobTitle: offer.jobRequest.title,
        jobDescription: offer.jobRequest.description,
        jobPhotoUrls: offer.jobRequest.photoUrls,
        addressLine1: offer.jobRequest.addressLine1,
        addressLine2: offer.jobRequest.addressLine2,
        city: offer.jobRequest.city,
        postalCode: offer.jobRequest.postalCode,
        country: offer.jobRequest.country,
        currency: "EUR",
        priceType: "QUOTE",
        quotedPriceCents: offer.amountCents,
        platformFeeCents: 0,
        providerPayoutCents: 0,
      },
    });

    // 4. Update the offer with the bookingId
    await tx.requestOffer.update({
      where: { id: offerId },
      data: { bookingId: booking.id },
    });

    // 5. Update the thread with the bookingId
    await tx.messageThread.update({
      where: { id: offer.threadId },
      data: { bookingId: booking.id },
    });

    // 6. Update the job request status to ASSIGNED
    await tx.jobRequest.update({
      where: { id: offer.jobRequestId },
      data: { status: "ASSIGNED" },
    });

    // 7. Create the payment transaction
    await tx.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        amountCents: offer.amountCents,
        platformFeeCents: 0,
        providerAmountCents: offer.amountCents,
        currency: "EUR",
        status: "REQUIRES_PAYMENT",
      },
    });

    return { bookingId: booking.id };
  });

  return { ok: true, bookingId: result.bookingId };
}

/**
 * List all bookings for the current customer
 * Requires: CUSTOMER, BOTH, or ADMIN role
 * Returns bookings where customerId matches current user
 */
export async function listCustomerBookings() {
  const user = await requireDbUser();

  // Authorization: Only customers, users with both roles, or admins can view
  if (user.role !== "CUSTOMER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only customers can view customer bookings");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      jobTitle: true,
      city: true,
      postalCode: true,
      createdAt: true,
      quotedPriceCents: true,
      currency: true,
      provider: {
        select: {
          id: true,
          email: true,
          fullName: true,
          providerProfile: {
            select: {
              displayName: true,
              companyName: true,
            },
          },
        },
      },
    },
  });

  return bookings;
}

/**
 * List all bookings for the current provider
 * Requires: PROVIDER, BOTH, or ADMIN role
 * Returns bookings where providerId matches current user
 * 
 * Privacy: Excludes addressLine1/addressLine2 for privacy.
 * Only city and postalCode are included for listing view.
 */
export async function listProviderBookings() {
  const user = await requireDbUser();

  // Authorization: Only providers, users with both roles, or admins can view
  if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only providers can view provider bookings");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      providerId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      jobTitle: true,
      city: true,
      postalCode: true,
      createdAt: true,
      quotedPriceCents: true,
      currency: true,
      // Explicitly exclude addressLine1 and addressLine2 for privacy
      // These are only revealed in getProviderBookingDetail when payment is confirmed
      customer: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  return bookings;
}

/**
 * Get booking detail for provider view
 * Requires: PROVIDER, BOTH, or ADMIN role
 * 
 * **Address Privacy Enforcement (Server-Side):**
 * - addressLine1 and addressLine2 are redacted (returned as empty string) 
 *   when booking status is REQUESTED, ACCEPTED, DECLINED, or NEEDS_PAYMENT
 * - Full address is only revealed when status is PAID, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELED, DISPUTED, or REFUNDED
 * 
 * This ensures providers cannot access customer street addresses before payment,
 * even if they inspect the server response directly.
 */
export async function getProviderBookingDetail(bookingId: string) {
  const user = await requireDbUser();

  // Authorization: Only providers, users with both roles, or admins can view
  if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only providers can view booking details");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      jobRequest: {
        select: {
          id: true,
          category: true,
        },
      },
      thread: {
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              sender: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Validate the current user is the provider assigned to this booking
  if (booking.providerId !== user.id) {
    throw new Error("Unauthorized: You can only view your own bookings");
  }

  // **SERVER-SIDE ADDRESS PRIVACY ENFORCEMENT**
  // Determine if full address should be visible based on payment status
  const showFullAddress = shouldShowFullAddressToProvider(booking.status);

  // Return booking with conditionally redacted address fields
  return {
    ...booking,
    // Redact street address if payment not yet confirmed
    addressLine1: showFullAddress ? booking.addressLine1 : "",
    addressLine2: showFullAddress ? (booking.addressLine2 || "") : "",
    // City and postal code are always visible for logistics
  };
}
