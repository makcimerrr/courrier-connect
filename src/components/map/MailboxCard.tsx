import { MapPin, Calendar, AlertTriangle, ChevronRight, FileText, Plus } from "lucide-react";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

interface MailboxCardProps {
  id: string;
  address: string;
  reference: string;
  lastInspection: string;
  problemCount: number;
  currentStatus?: TicketStatus;
  ticketId?: string; // ID du ticket associé si problème existant
  onDeclare: () => void;
  onViewTicket?: () => void; // Pour voir le ticket existant
}

export function MailboxCard({
  address,
  reference,
  lastInspection,
  problemCount,
  currentStatus,
  ticketId,
  onDeclare,
  onViewTicket,
}: MailboxCardProps) {
  // Si problème existant (status actif et non résolu), afficher "Voir le ticket"
  const hasActiveProblem = currentStatus && currentStatus !== "resolved" && problemCount > 0;

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
        {hasActiveProblem ? (
          // Si problème existant, bouton pour voir le ticket
          <Button
            onClick={onViewTicket}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
          >
            <FileText className="w-4 h-4 mr-2" />
            Voir le ticket
          </Button>
        ) : (
          // Sinon, bouton pour déclarer un nouveau problème
          <Button
            onClick={onDeclare}
            className="flex-1 bg-primary text-primary-foreground hover:bg-laposte-yellow-dark font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Déclarer un problème
          </Button>
        )}
      </div>
    </div>
  );
}
