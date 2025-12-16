import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, User } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Schnellzugriff</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Link href="/provider/leistungen/neu">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Neue Leistung
          </Button>
        </Link>
        <Link href="/provider/job-board">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Briefcase className="h-4 w-4" />
            Job-Board ansehen
          </Button>
        </Link>
        <Link href="/provider/profil">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <User className="h-4 w-4" />
            Profil bearbeiten
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
