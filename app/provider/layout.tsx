import type React from "react"
import { requireDbUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDbUser()
  if (user.role !== "PROVIDER" && user.role !== "BOTH" && user.role !== "ADMIN") {
    redirect("/onboarding")
  }
  return <>{children}</>
}
