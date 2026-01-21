import { MapPin, Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

interface MailboxCardProps {
  id: string;
  address: string;
  reference: string;
  lastInspection: string;
  problemCount: number;
  currentStatus?: TicketStatus;
  onDeclare: () => void;
  onViewDetails: () => void;
}

export function MailboxCard({
  address,
  reference,
  lastInspection,
  problemCount,
  currentStatus,
  onDeclare,
  onViewDetails,
}: MailboxCardProps) {
  return (
    <div className="mailbox-card animate-slide-up">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span>Réf. {reference}</span>
          </div>
          <h3 className="font-semibold text-foreground leading-tight">{address}</h3>
        </div>
        {currentStatus && <StatusBadge status={currentStatus} />}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Inspection: {lastInspection}</span>
        </div>
        {problemCount > 0 && (
          <div className="flex items-center gap-1.5 text-status-signaled">
            <AlertTriangle className="w-4 h-4" />
            <span>{problemCount} signalement{problemCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onDeclare}
          className="flex-1 bg-primary text-primary-foreground hover:bg-laposte-yellow-dark font-semibold"
        >
          Déclarer un problème
        </Button>
        <Button
          onClick={onViewDetails}
          variant="outline"
          size="icon"
          className="border-border hover:bg-muted"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
