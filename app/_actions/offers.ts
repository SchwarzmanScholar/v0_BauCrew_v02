"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Input type for creating an offer
 */
export interface CreateOfferInput {
  jobRequestId: string;
  amountCents: number;
  message: string;
  earliestStart?: Date;
}

/**
 * Create an offer for a job request
 * Requires: PROVIDER, BOTH, or ADMIN role
 * 
 * - Finds or creates a MessageThread for { jobRequestId, providerId: currentUser.id }
 * - Creates a RequestOffer with the provided details
 * - If JobRequest.status is OPEN, updates it to IN_DISCUSSION
 * 
 * Returns { ok: true, offerId }
 */
export async function createOffer(input: CreateOfferInput) {
  const user = await requireDbUser();

  // Authorization: Only providers can create offers
  if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only providers can create offers");
  }

  const { jobRequestId, amountCents, message, earliestStart } = input;

  // Validate inputs
  if (amountCents <= 0) {
    throw new Error("Offer amount must be greater than zero");
  }

  if (!message || message.trim().length === 0) {
    throw new Error("Offer message cannot be empty");
  }

  // Load the job request to get the customerId and status
  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId },
    select: { customerId: true, status: true },
  });

  if (!jobRequest) {
    throw new Error("Job request not found");
  }

  // Find or create the thread
  const thread = await prisma.messageThread.upsert({
    where: {
      jobRequestId_providerId: {
        jobRequestId,
        providerId: user.id,
      },
    },
    create: {
      jobRequestId,
      customerId: jobRequest.customerId,
      providerId: user.id,
    },
    update: {},
  });

  // Create the offer
  const offer = await prisma.requestOffer.create({
    data: {
      jobRequestId,
      providerId: user.id,
      threadId: thread.id,
      currency: "EUR",
      amountCents,
      message: message.trim(),
      earliestStart,
      status: "SENT",
    },
  });

  // Update job request status to IN_DISCUSSION if currently OPEN
  if (jobRequest.status === "OPEN") {
    await prisma.jobRequest.update({
      where: { id: jobRequestId },
      data: { status: "IN_DISCUSSION" },
    });
  }

  return { ok: true, offerId: offer.id };
}
