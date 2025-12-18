"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Input type for sending a message
 */
export interface SendMessageInput {
  threadId?: string;
  jobRequestId?: string;
  body: string;
}

/**
 * Send a message in an existing thread or create a new thread for a job request
 * 
 * If threadId is provided:
 * - Validates current user is either the customer or provider on the thread
 * - Creates a new message in the existing thread
 * 
 * If threadId is missing and jobRequestId is provided:
 * - Only PROVIDER, BOTH, or ADMIN can call (providers initiating contact)
 * - Finds or creates a MessageThread for { jobRequestId, providerId: currentUser.id }
 * - Sets customerId from the JobRequest
 * - Creates the message
 * 
 * Returns { ok: true, threadId }
 */
export async function sendMessage(input: SendMessageInput) {
  const user = await requireDbUser();

  const { threadId, jobRequestId, body } = input;

  if (!body || body.trim().length === 0) {
    throw new Error("Message body cannot be empty");
  }

  let finalThreadId: string;

  if (threadId) {
    // Scenario 1: Existing thread - validate user is participant
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new Error("Thread not found");
    }

    // Authorization: User must be either the customer or provider on this thread
    if (thread.customerId !== user.id && thread.providerId !== user.id) {
      throw new Error("Unauthorized: You are not a participant in this thread");
    }

    finalThreadId = threadId;
  } else if (jobRequestId) {
    // Scenario 2: New thread from job request - only providers can initiate
    if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
      throw new Error("Unauthorized: Only providers can initiate contact on job requests");
    }

    // Load the job request to get the customerId
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

    finalThreadId = thread.id;
  } else {
    throw new Error("Either threadId or jobRequestId must be provided");
  }

  // Create the message
  await prisma.message.create({
    data: {
      threadId: finalThreadId,
      senderId: user.id,
      body: body.trim(),
      attachmentUrls: [],
    },
  });

  return { ok: true, threadId: finalThreadId };
}
