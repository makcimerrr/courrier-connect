import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";

interface DeclarationCardProps {
  id: string;
  address: string;
  reference: string;
  type: string;
  date: string;
  status: TicketStatus;
  onClick: () => void;
}

export function DeclarationCard({
  address,
  reference,
  type,
  date,
  status,
  onClick,
}: DeclarationCardProps) {
  return (
    <button
      onClick={onClick}
      className="mailbox-card w-full text-left flex items-start gap-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-foreground truncate">
            {type}
          </span>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-foreground truncate mb-2">{address}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{reference}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
    </button>
  );
}
