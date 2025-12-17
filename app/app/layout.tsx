import type React from "react"
import { requireDbUser } from "@/lib/auth"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireDbUser()
  return <>{children}</>
}
