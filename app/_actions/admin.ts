"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin-only read access to job requests marketplace data
 * 
 * Returns last 50 job requests with key information for admin oversight.
 * Includes customer details, location, status, and creation date.
 * 
 * Authorization: ADMIN role only
 * @throws Error if user is not an admin
 */
export async function adminListJobRequests() {
  const user = await requireDbUser();

  // Enforce admin-only access
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const jobRequests = await prisma.jobRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      status: true,
      category: true,
      title: true,
      city: true,
      postalCode: true,
      createdAt: true,
      budgetMinCents: true,
      budgetMaxCents: true,
      currency: true,
      timeframe: true,
      // Customer information
      customer: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      // Count related data for admin insights
      _count: {
        select: {
          offers: true,
          threads: true,
        },
      },
    },
  });

  return jobRequests;
}

/**
 * Admin-only read access to bookings marketplace data
 * 
 * Returns last 50 bookings with full information for admin oversight.
 * Includes customer and provider details, location, status, pricing, and dates.
 * 
 * **Note:** Admins have full address visibility for all bookings regardless of payment status.
 * This is intentional for platform oversight and dispute resolution.
 * 
 * Authorization: ADMIN role only
 * @throws Error if user is not an admin
 */
export async function adminListBookings() {
  const user = await requireDbUser();

  // Enforce admin-only access
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      type: true,
      status: true,
      jobTitle: true,
      // Location - admins see full address for oversight
      addressLine1: true,
      addressLine2: true,
      city: true,
      postalCode: true,
      country: true,
      // Dates
      createdAt: true,
      requestedStart: true,
      requestedEnd: true,
      scheduledStart: true,
      scheduledEnd: true,
      paidAt: true,
      // Pricing
      currency: true,
      quotedPriceCents: true,
      platformFeeCents: true,
      providerPayoutCents: true,
      // Customer information
      customer: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      // Provider information
      provider: {
        select: {
          id: true,
          email: true,
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
      // Job request information (if booking is from a job request)
      jobRequest: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
      // Related data existence
      payment: {
        select: {
          id: true,
          status: true,
          amountCents: true,
        },
      },
      dispute: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  return bookings;
}
