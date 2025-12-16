import { Badge } from "@/components/ui/badge"

type PaymentStatus = "disabled" | "test" | "live"

interface AppEnvironmentBadgeProps {
  showPaymentStatus?: boolean
  paymentStatus?: PaymentStatus
  className?: string
}

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  disabled: {
    label: "Payments: Disabled",
    className: "bg-muted text-muted-foreground",
  },
  test: {
    label: "Payments: Test",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  live: {
    label: "Payments: Live",
    className: "bg-success/15 text-success border-success/30",
  },
}

export function AppEnvironmentBadge({
  showPaymentStatus = false,
  paymentStatus = "test",
  className = "",
}: AppEnvironmentBadgeProps) {
  const statusConfig = paymentStatusConfig[paymentStatus]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant="outline"
        className="border-warning/50 bg-warning/10 text-warning-foreground text-xs font-semibold"
      >
        BETA
      </Badge>
      {showPaymentStatus && (
        <Badge variant="outline" className={`text-xs ${statusConfig.className}`}>
          {statusConfig.label}
        </Badge>
      )}
    </div>
  )
}
