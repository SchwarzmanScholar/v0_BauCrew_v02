"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * List all message threads for the current user
 * Returns threads where user is either customer or provider
 * Includes last message preview and provider display name
 */
export async function listMyThreads() {
  const user = await requireDbUser();

  const threads = await prisma.messageThread.findMany({
    where: {
      OR: [
        { customerId: user.id },
        { providerId: user.id },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          body: true,
          createdAt: true,
          senderId: true,
        },
      },
      provider: {
        select: {
          id: true,
          fullName: true,
          providerProfile: {
            select: {
              displayName: true,
              companyName: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      jobRequest: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
    },
  });

  // Transform to lightweight array with last message preview
  return threads.map((thread) => ({
    id: thread.id,
    jobRequestId: thread.jobRequestId,
    bookingId: thread.bookingId,
    customerId: thread.customerId,
    providerId: thread.providerId,
    createdAt: thread.createdAt,
    lastMessage: thread.messages[0] || null,
    provider: {
      id: thread.provider.id,
      fullName: thread.provider.fullName,
      displayName: thread.provider.providerProfile?.displayName || thread.provider.fullName,
      companyName: thread.provider.providerProfile?.companyName,
    },
    customer: {
      id: thread.customer.id,
      email: thread.customer.email,
      fullName: thread.customer.fullName,
    },
    jobRequest: thread.jobRequest,
  }));
}
