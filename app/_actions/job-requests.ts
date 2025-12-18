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
 * Get a single job request with offers for customer detail view
 * Requires: CUSTOMER, BOTH, or ADMIN role
 * Returns job request details with all offers (including provider info)
 * Validates that the current user is the customer who created the request
 */
export async function getJobRequestForCustomer(jobRequestId: string) {
  const user = await requireDbUser();

  // Authorization: Only customers, users with both roles, or admins can view
  if (user.role !== "CUSTOMER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only customers can view job request details");
  }

  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId },
    include: {
      offers: {
        orderBy: {
          createdAt: "desc",
        },
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
        },
      },
    },
  });

  if (!jobRequest) {
    throw new Error("Job request not found");
  }

  // Validate the current user is the customer who created this request
  if (jobRequest.customerId !== user.id) {
    throw new Error("Unauthorized: You can only view your own job requests");
  }

  return jobRequest;
}

/**
 * Get a single job request with messages for provider detail view
 * Requires: PROVIDER, BOTH, or ADMIN role
 * Returns job request details, existing thread/messages if any, and existing offers
 */
export async function getJobRequestForProvider(jobRequestId: string) {
  const user = await requireDbUser();

  // Authorization: Only providers, users with both roles, or admins can view
  if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only providers can view job request details");
  }

  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId },
    select: {
      id: true,
      status: true,
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
      photoUrls: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          id: true,
          fullName: true,
        },
      },
      threads: {
        where: {
          providerId: user.id,
        },
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
      offers: {
        where: {
          providerId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          offers: true,
        },
      },
    },
  });

  if (!jobRequest) {
    throw new Error("Job request not found");
  }

  // Extract the single thread (there should only be 0 or 1)
  const thread = jobRequest.threads[0] || null;

  return {
    jobRequest: {
      id: jobRequest.id,
      status: jobRequest.status,
      category: jobRequest.category,
      title: jobRequest.title,
      description: jobRequest.description,
      city: jobRequest.city,
      postalCode: jobRequest.postalCode,
      country: jobRequest.country,
      timeframe: jobRequest.timeframe,
      desiredDate: jobRequest.desiredDate,
      budgetMinCents: jobRequest.budgetMinCents,
      budgetMaxCents: jobRequest.budgetMaxCents,
      photoUrls: jobRequest.photoUrls,
      createdAt: jobRequest.createdAt,
      updatedAt: jobRequest.updatedAt,
      customer: jobRequest.customer,
      totalOffers: jobRequest._count.offers,
    },
    thread,
    myOffers: jobRequest.offers,
  };
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
