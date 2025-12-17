import type React from "react"
import { requireDbUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDbUser()
  if (user.role === "ADMIN") redirect("/admin")
  if (user.role === "PROVIDER" || user.role === "BOTH") redirect("/provider")
  return <>{children}</>
}
