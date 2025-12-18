import { redirect } from "next/navigation"

/**
 * Root route redirects to marketing landing page.
 * Component showcase moved to /dev/components
 */
export default function RootPage() {
  redirect("/")
}
