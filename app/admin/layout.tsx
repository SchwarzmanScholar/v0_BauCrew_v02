import type React from "react"
import { requireDbUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDbUser()
  if (user.role !== "ADMIN") redirect("/app")
  return <>{children}</>
}
