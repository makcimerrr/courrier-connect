import { AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react";

export type TicketStatus = "signaled" | "in-progress" | "pending" | "resolved";

interface StatusBadgeProps {
  status: TicketStatus;
  showIcon?: boolean;
}

const statusConfig: Record<TicketStatus, { label: string; className: string; icon: typeof AlertCircle }> = {
  signaled: {
    label: "Signalé",
    className: "status-signaled",
    icon: AlertCircle,
  },
  "in-progress": {
    label: "En cours",
    className: "status-in-progress",
    icon: Loader2,
  },
  pending: {
    label: "En attente",
    className: "status-pending",
    icon: Clock,
  },
  resolved: {
    label: "Résolu",
    className: "status-resolved",
    icon: CheckCircle,
  },
};

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
