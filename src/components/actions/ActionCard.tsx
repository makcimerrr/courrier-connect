import { CheckCircle2, Clock, AlertCircle, MapPin, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ActionStatus = "pending" | "in_progress" | "completed" | "overdue";
export type ActionType = "flyer" | "photo" | "verification" | "other";

export interface Action {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  address: string;
  deadline?: string;
  status: ActionStatus;
  ticketRef: string;
}

interface ActionCardProps {
  action: Action;
  onComplete: (actionId: string) => void;
  onViewDetails: (actionId: string) => void;
}

const actionTypeIcons: Record<ActionType, typeof FileText> = {
  flyer: FileText,
  photo: Camera,
  verification: CheckCircle2,
  other: AlertCircle,
};

const actionTypeLabels: Record<ActionType, string> = {
  flyer: "Dépôt flyer",
  photo: "Reprise photo",
  verification: "Vérification",
  other: "Action",
};

const statusConfig: Record<ActionStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: {
    label: "À faire",
    className: "bg-status-signaled/15 text-status-signaled",
    icon: Clock,
  },
  in_progress: {
    label: "En cours",
    className: "bg-status-in-progress/15 text-status-in-progress",
    icon: Clock,
  },
  completed: {
    label: "Terminé",
    className: "bg-status-resolved/15 text-status-resolved",
    icon: CheckCircle2,
  },
  overdue: {
    label: "En retard",
    className: "bg-destructive/15 text-destructive",
    icon: AlertCircle,
  },
};

export function ActionCard({ action, onComplete, onViewDetails }: ActionCardProps) {
  const TypeIcon = actionTypeIcons[action.type];
  const status = statusConfig[action.status];
  const StatusIcon = status.icon;

  const isCompletable = action.status !== "completed";

  return (
    <div className={cn(
      "bg-card rounded-xl p-4 border transition-all duration-200",
      action.status === "overdue" ? "border-destructive/30" : "border-border",
      "hover:shadow-md"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            action.status === "completed" ? "bg-status-resolved/15" : "bg-primary/10"
          )}>
            <TypeIcon className={cn(
              "w-5 h-5",
              action.status === "completed" ? "text-status-resolved" : "text-primary"
            )} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {actionTypeLabels[action.type]}
            </span>
            <h3 className="font-semibold text-foreground text-sm">{action.title}</h3>
          </div>
        </div>
        <Badge className={cn("text-[10px]", status.className)}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground mb-3">
        {action.description}
      </p>

      {/* Address */}
      <div className="flex items-center gap-2 text-sm text-foreground mb-3">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{action.address}</span>
      </div>

      {/* Deadline */}
      {action.deadline && (
        <div className={cn(
          "flex items-center gap-2 text-xs mb-4 p-2 rounded-lg",
          action.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
        )}>
          <Clock className="w-3.5 h-3.5" />
          <span>
            {action.status === "overdue" ? "Échéance dépassée : " : "À réaliser avant : "}
            <strong>{action.deadline}</strong>
          </span>
        </div>
      )}

      {/* Ticket Reference */}
      <div className="text-xs text-muted-foreground mb-4">
        Réf. ticket : {action.ticketRef}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isCompletable && (
          <Button
            onClick={() => onComplete(action.id)}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Valider
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => onViewDetails(action.id)}
          className={isCompletable ? "" : "flex-1"}
        >
          Voir le ticket
        </Button>
      </div>
    </div>
  );
}
