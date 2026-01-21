import { ChevronLeft, Mail, Phone, FileText, User, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";

interface TimelineEvent {
  id: string;
  type: "declaration" | "email" | "response" | "call" | "letter" | "manager" | "resolved";
  title: string;
  description?: string;
  date: string;
  time: string;
}

interface TicketTimelineProps {
  ticketId: string;
  address: string;
  reference: string;
  problemType: string;
  status: TicketStatus;
  events: TimelineEvent[];
  onBack: () => void;
}

const eventIcons: Record<string, typeof Mail> = {
  declaration: AlertCircle,
  email: Mail,
  response: Mail,
  call: Phone,
  letter: FileText,
  manager: User,
  resolved: CheckCircle,
};

const eventColors: Record<string, string> = {
  declaration: "bg-status-signaled text-white",
  email: "bg-laposte-blue text-white",
  response: "bg-status-in-progress text-white",
  call: "bg-laposte-blue text-white",
  letter: "bg-laposte-blue text-white",
  manager: "bg-status-pending text-white",
  resolved: "bg-status-resolved text-white",
};

export function TicketTimeline({
  address,
  reference,
  problemType,
  status,
  events,
  onBack,
}: TicketTimelineProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-secondary-foreground hover:bg-secondary-foreground/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-semibold">Suivi du ticket</h1>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-start justify-between mb-2">
          <h2 className="font-semibold text-foreground">{problemType}</h2>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-foreground mb-1">{address}</p>
        <p className="text-xs text-muted-foreground">Réf. {reference}</p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-0">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type] || AlertCircle;
            const colorClass = eventColors[event.type] || "bg-muted text-foreground";
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="timeline-item">
                <div className={`timeline-dot ${colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {event.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.time}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
