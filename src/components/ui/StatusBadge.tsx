import { AlertCircle, Clock, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TicketStatus =
  | "signaled"
  | "in-progress"
  | "pending"
  | "resolved"
  | "action-required";

interface StatusBadgeProps {
  status: TicketStatus;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const statusConfig: Record<
  TicketStatus,
  {
    label: string;
    className: string;
    icon: typeof AlertCircle;
    pulseColor?: string;
  }
> = {
  signaled: {
    label: "Signalé",
    className: "status-signaled",
    icon: AlertCircle,
    pulseColor: "bg-status-signaled",
  },
  "in-progress": {
    label: "En cours",
    className: "status-in-progress",
    icon: Loader2,
    pulseColor: "bg-status-in-progress",
  },
  pending: {
    label: "En attente",
    className: "status-pending",
    icon: Clock,
    pulseColor: "bg-status-pending",
  },
  "action-required": {
    label: "Action requise",
    className: "status-action-required",
    icon: AlertTriangle,
    pulseColor: "bg-status-action-required",
  },
  resolved: {
    label: "Résolu",
    className: "status-resolved",
    icon: CheckCircle,
  },
};

const sizeClasses = {
  sm: {
    badge: "px-2 py-0.5 text-[10px] gap-1",
    icon: "w-3 h-3",
    pulse: "w-1.5 h-1.5",
  },
  md: {
    badge: "px-2.5 py-1 text-xs gap-1.5",
    icon: "w-3.5 h-3.5",
    pulse: "w-2 h-2",
  },
  lg: {
    badge: "px-3 py-1.5 text-sm gap-2",
    icon: "w-4 h-4",
    pulse: "w-2.5 h-2.5",
  },
};

export function StatusBadge({
  status,
  showIcon = true,
  size = "md",
  animated = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) {
    console.error("Invalid status passed to StatusBadge:", status);

    return (
      <span
        className={cn(
          "status-badge inline-flex items-center rounded-full font-semibold",
          "px-2 py-1 text-xs bg-gray-200 text-gray-700"
        )}
      >
        Inconnu
      </span>
    );
  }
  const Icon = config.icon;
  const sizeConfig = sizeClasses[size];
  const isActive = status !== "resolved";
  const showPulse = animated && isActive && config.pulseColor;

  return (
    <span
      className={cn(
        "status-badge inline-flex items-center rounded-full font-semibold",
        "transition-all duration-300 animate-scale-in",
        config.className,
        sizeConfig.badge,
        className
      )}
    >
      {/* Indicateur de pulsation pour les statuts actifs */}
      {showPulse && (
        <span className="relative flex">
          <span
            className={cn(
              "absolute inline-flex rounded-full opacity-75 animate-ping",
              config.pulseColor,
              sizeConfig.pulse
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full",
              config.pulseColor,
              sizeConfig.pulse
            )}
          />
        </span>
      )}

      {/* Icône */}
      {showIcon && !showPulse && (
        <Icon
          className={cn(
            sizeConfig.icon,
            status === "in-progress" && animated && "animate-spin"
          )}
        />
      )}

      {/* Label */}
      <span>{config.label}</span>
    </span>
  );
}

// Composant pour afficher un badge de statut avec animation de transition
interface AnimatedStatusBadgeProps extends StatusBadgeProps {
  previousStatus?: TicketStatus;
}

export function AnimatedStatusBadge({
  status,
  previousStatus,
  ...props
}: AnimatedStatusBadgeProps) {
  const hasChanged = previousStatus && previousStatus !== status;

  return (
    <div className={cn("relative", hasChanged && "animate-bounce-in")}>
      <StatusBadge status={status} {...props} />
      {hasChanged && (
        <span className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
      )}
    </div>
  );
}

// Badge compact pour les listes
export function StatusDot({
  status,
  size = "md",
  className,
}: {
  status: TicketStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const config = statusConfig[status];
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        config.pulseColor || "bg-status-resolved",
        dotSizes[size],
        status !== "resolved" && "animate-pulse-soft",
        className
      )}
      title={config.label}
    />
  );
}
