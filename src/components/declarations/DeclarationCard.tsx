import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";
import {
  ProblemTypeIcon,
  problemTypeLabels,
  type ProblemTypeId,
} from "@/components/icons/ProblemTypeIcon";
import { cn } from "@/lib/utils";

interface DeclarationCardProps {
  id: string;
  address: string;
  reference: string;
  type: string;
  problemType?: ProblemTypeId;
  date: string;
  status: TicketStatus;
  progress?: number; // 0-100, pourcentage de progression du traitement
  onClick: () => void;
}

// Progression estimée selon le statut
const statusProgress: Record<TicketStatus, number> = {
  signaled: 10,
  "in-progress": 50,
  pending: 75,
  resolved: 100,
};

export function DeclarationCard({
  address,
  reference,
  type,
  problemType,
  date,
  status,
  progress,
  onClick,
}: DeclarationCardProps) {
  // Utiliser la progression fournie ou celle par défaut selon le statut
  const displayProgress = progress ?? statusProgress[status];
  const isResolved = status === "resolved";

  return (
    <button
      onClick={onClick}
      className={cn(
        "mailbox-card w-full text-left flex items-start gap-3",
        "transition-all duration-200",
        "hover:shadow-card active:scale-[0.99]",
        "group"
      )}
    >
      {/* Icône du type de problème */}
      {problemType ? (
        <ProblemTypeIcon
          type={problemType}
          size="lg"
          showRiskBadge={!isResolved}
          className="flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Titre et statut */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground line-clamp-1">
            {problemType ? problemTypeLabels[problemType] : type}
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Adresse */}
        <p className="text-sm text-muted-foreground truncate mb-2">{address}</p>

        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{reference}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </div>

        {/* Barre de progression */}
        {!isResolved && (
          <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                status === "signaled" && "bg-status-signaled",
                status === "in-progress" && "bg-status-in-progress",
                status === "pending" && "bg-status-pending"
              )}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        )}

        {/* Indicateur résolu */}
        {isResolved && (
          <div className="flex items-center gap-1.5 text-xs text-status-resolved font-medium">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" className="animate-check-draw" />
            </svg>
            <span>Problème résolu</span>
          </div>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight
        className={cn(
          "w-5 h-5 text-muted-foreground flex-shrink-0 mt-2",
          "transition-transform duration-200",
          "group-hover:translate-x-0.5"
        )}
      />
    </button>
  );
}
