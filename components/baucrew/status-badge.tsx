import type React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  CreditCard,
  Calendar,
  Wrench,
  Loader2,
  Search,
  AlertOctagon,
  Flag,
} from "lucide-react"
import type {
  Booking,
  JobRequest,
  OrderStatus,
  PayoutStatus,
  DisputeStatus,
  AdminBookingStatus,
  AdminJobRequestStatus,
} from "@/lib/types"

type BookingStatus = Booking["status"]
type JobStatus = JobRequest["status"]

interface StatusBadgeProps {
  status:
    | BookingStatus
    | JobStatus
    | OrderStatus
    | PayoutStatus
    | DisputeStatus
    | AdminBookingStatus
    | AdminJobRequestStatus
  showIcon?: boolean
}

const statusConfig: Record<
  BookingStatus | JobStatus | OrderStatus | PayoutStatus | DisputeStatus | AdminBookingStatus | AdminJobRequestStatus,
  {
    label: string
    className: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  pending: {
    label: "Ausstehend",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
    icon: Clock,
  },
  confirmed: {
    label: "Bestätigt",
    className: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Arbeit",
    className: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    icon: Wrench,
  },
  completed: {
    label: "Abgeschlossen",
    className: "bg-success/10 text-success-foreground border-success/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Storniert",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: XCircle,
  },
  disputed: {
    label: "Streitfall",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
    icon: AlertTriangle,
  },
  open: {
    label: "Offen",
    className: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    icon: Clock,
  },
  in_discussion: {
    label: "In Gespräch",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: MessageSquare,
  },
  filled: {
    label: "Vergeben",
    className: "bg-success/10 text-success-foreground border-success/20",
    icon: UserCheck,
  },
  closed: {
    label: "Geschlossen",
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
    icon: XCircle,
  },
  requested: {
    label: "Angefragt",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
    icon: Clock,
  },
  payment_pending: {
    label: "Zahlung offen",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: CreditCard,
  },
  needs_payment: {
    label: "Zahlung offen",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: CreditCard,
  },
  paid: {
    label: "Bezahlt",
    className: "bg-success/10 text-success-foreground border-success/20",
    icon: CheckCircle2,
  },
  scheduled: {
    label: "Geplant",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: Calendar,
  },
  processing: {
    label: "In Bearbeitung",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
    icon: Loader2,
  },
  failed: {
    label: "Fehlgeschlagen",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: XCircle,
  },
  under_review: {
    label: "In Prüfung",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
    icon: Search,
  },
  resolved: {
    label: "Gelöst",
    className: "bg-success/10 text-success-foreground border-success/20",
    icon: CheckCircle2,
  },
  escalated: {
    label: "Eskaliert",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: AlertOctagon,
  },
  flagged: {
    label: "Markiert",
    className: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    icon: Flag,
  },
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}
