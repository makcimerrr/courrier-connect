import {
  Mail,
  AlertTriangle,
  Dog,
  ArrowDown,
  MoveRight,
  Wrench,
  Check,
  Clock
} from "lucide-react";
import type { TicketStatus } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export type ProblemType = "dog" | "too-low" | "too-far" | "dangerous-access" | "damaged" | null;

interface MapPinProps {
  status?: TicketStatus | "normal" | "action-required";
  problemType?: ProblemType;
  problemCount?: number;
  onClick?: () => void;
  selected?: boolean;
  urgent?: boolean;
  showPointer?: boolean;
}

const pinStatusClasses: Record<string, string> = {
  normal: "map-pin-normal",
  signaled: "map-pin-signaled",
  "in-progress": "map-pin-in-progress",
  pending: "map-pin-pending",
  resolved: "map-pin-resolved",
  "action-required": "map-pin-action-required",
};

const ringClasses: Record<string, string> = {
  signaled: "map-pin-ring-signaled",
  "in-progress": "map-pin-ring-in-progress",
  "action-required": "map-pin-ring-action-required",
  pending: "map-pin-ring-in-progress",
};

// Icône selon le type de problème
function getProblemIcon(problemType: ProblemType, className: string) {
  switch (problemType) {
    case "dog":
      return <Dog className={className} />;
    case "too-low":
      return <ArrowDown className={className} />;
    case "too-far":
      return <MoveRight className={className} />;
    case "dangerous-access":
      return <AlertTriangle className={className} />;
    case "damaged":
      return <Wrench className={className} />;
    default:
      return <Mail className={className} />;
  }
}

// Icône selon le statut (si pas de type de problème spécifique)
function getStatusIcon(status: string, className: string) {
  switch (status) {
    case "resolved":
      return <Check className={className} />;
    case "pending":
      return <Clock className={className} />;
    default:
      return <Mail className={className} />;
  }
}

export function MapPin({
  status = "normal",
  problemType = null,
  problemCount = 0,
  onClick,
  selected,
  urgent = false,
  showPointer = false,
}: MapPinProps) {
  const hasRing = status !== "normal" && status !== "resolved";
  const showBadge = problemCount > 0 || status === "action-required";

  // Détermine l'icône à afficher
  const iconClassName = "w-5 h-5";
  const icon = problemType
    ? getProblemIcon(problemType, iconClassName)
    : getStatusIcon(status, iconClassName);

  return (
    <button
      onClick={onClick}
      className={cn(
        "map-pin",
        pinStatusClasses[status],
        selected && "map-pin-selected",
        urgent && "map-pin-urgent",
        showPointer && "map-pin-pointer"
      )}
      aria-label={`Boîte aux lettres ${status === "normal" ? "normale" : `statut: ${status}`}${problemCount > 0 ? `, ${problemCount} problème(s)` : ""}`}
    >
      {/* Anneau pulsé pour les statuts actifs */}
      {hasRing && (
        <span
          className={cn(
            "map-pin-ring",
            ringClasses[status],
            urgent && "map-pin-ring-urgent"
          )}
        />
      )}

      {/* Icône centrale */}
      <span className="map-pin-icon">
        {icon}
      </span>

      {/* Badge compteur de problèmes */}
      {showBadge && (
        <span
          className={cn(
            "map-pin-badge",
            status === "resolved" && "map-pin-badge-resolved"
          )}
        >
          {status === "action-required" ? "!" : problemCount}
        </span>
      )}
    </button>
  );
}
