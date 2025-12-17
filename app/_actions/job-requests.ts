"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ListingCategory, JobTimeframe } from "@prisma/client";

/**
 * Input type for creating a new job request
 */
export interface CreateJobRequestInput {
  category: ListingCategory;
  title: string;
  description: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country?: string;
  timeframe?: JobTimeframe;
  desiredDate?: Date;
  budgetMinCents?: number;
  budgetMaxCents?: number;
  photoUrls?: string[];
}

/**
 * Create a new job request
 * Requires: CUSTOMER, BOTH, or ADMIN role
 */
export async function createJobRequest(input: CreateJobRequestInput) {
  const user = await requireDbUser();

  // Authorization: Only customers, users with both roles, or admins can create job requests
  if (user.role !== "CUSTOMER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only customers can create job requests");
  }

  const jobRequest = await prisma.jobRequest.create({
    data: {
      customerId: user.id,
      category: input.category,
      title: input.title,
      description: input.description,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      postalCode: input.postalCode,
      country: input.country || "DE",
      timeframe: input.timeframe || "NEXT_7_DAYS",
      desiredDate: input.desiredDate,
      budgetMinCents: input.budgetMinCents,
      budgetMaxCents: input.budgetMaxCents,
      photoUrls: input.photoUrls || [],
    },
  });

  return { ok: true, jobRequestId: jobRequest.id };
}

/**
 * List all job requests for the current user
 * Returns full details including addresses since it's the customer's own requests
 */
export async function listCustomerJobRequests() {
  const user = await requireDbUser();

  const jobRequests = await prisma.jobRequest.findMany({
    where: {
      customerId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          offers: true,
        },
      },
    },
  });

  return jobRequests;
}

/**
 * List open job requests for providers to view and bid on
 * Requires: PROVIDER, BOTH, or ADMIN role
 * Returns OPEN requests with masked addresses (excludes addressLine1/addressLine2)
 */
export async function listOpenJobRequestsForProviders() {
  const user = await requireDbUser();

  // Authorization: Only providers, users with both roles, or admins can view job board
  if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only providers can view job requests");
  }

  const jobRequests = await prisma.jobRequest.findMany({
    where: {
      status: "OPEN",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      category: true,
      title: true,
      description: true,
      city: true,
      postalCode: true,
      country: true,
      timeframe: true,
      desiredDate: true,
      budgetMinCents: true,
      budgetMaxCents: true,
      currency: true,
      photoUrls: true,
      createdAt: true,
      status: true,
      // Explicitly exclude sensitive address fields
      // addressLine1: false,
      // addressLine2: false,
      _count: {
        select: {
          offers: true,
        },
      },
    },
  });

  return jobRequests;
}
