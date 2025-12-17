"use server";

import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Complete customer onboarding flow
 * - Ensures user has a CustomerProfile
 * - Sets user role to CUSTOMER
 */
export async function completeCustomerOnboarding() {
  const user = await requireDbUser();

  // Upsert CustomerProfile
  await prisma.customerProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
    },
    update: {},
  });

  // Update user role if not already set
  if (user.role !== "CUSTOMER" && user.role !== "BOTH") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "CUSTOMER" },
    });
  }

  return { ok: true };
}

export interface CompleteProviderOnboardingInput {
  displayName: string;
  baseCity: string;
  basePostalCode: string;
  serviceRadiusKm: number;
}

/**
 * Complete provider onboarding flow
 * - Creates/updates ProviderProfile with required fields
 * - Sets user role to PROVIDER
 */
export async function completeProviderOnboarding(
  input: CompleteProviderOnboardingInput
) {
  const user = await requireDbUser();

  // Upsert ProviderProfile with onboarding data
  await prisma.providerProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      displayName: input.displayName,
      baseCity: input.baseCity,
      basePostalCode: input.basePostalCode,
      serviceRadiusKm: input.serviceRadiusKm,
    },
    update: {
      displayName: input.displayName,
      baseCity: input.baseCity,
      basePostalCode: input.basePostalCode,
      serviceRadiusKm: input.serviceRadiusKm,
    },
  });

  // Update user role if not already set
  if (user.role !== "PROVIDER" && user.role !== "BOTH") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "PROVIDER" },
    });
  }

  return { ok: true };
}
