import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getDbUserOrNull() {
  const { userId } = await auth(); // <-- note: await (newer Clerk versions)
  if (!userId) return null;

  const existing = await prisma.user.findUnique({
    where: { authUserId: userId },
  });
  if (existing) return existing;

  const client = await clerkClient(); // <-- clerkClient is a function in newer versions
  const clerkUser = await client.users.getUser(userId);

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("No email found for authenticated user.");

  const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

  return prisma.user.create({
    data: {
      authUserId: userId,
      email,
      fullName: fullName || null,
      role: "CUSTOMER",
    },
  });
}

export async function requireDbUser() {
  const user = await getDbUserOrNull();
  if (!user) redirect("/sign-in");
  return user;
}
