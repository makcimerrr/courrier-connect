import { useState } from "react";
import { MapPin } from "./MapPin";
import { MailboxCard } from "./MailboxCard";
import { Locate, Plus, Minus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TicketStatus } from "@/components/ui/StatusBadge";

interface Mailbox {
  id: string;
  address: string;
  reference: string;
  lastInspection: string;
  problemCount: number;
  status?: TicketStatus | "normal";
  position: { x: number; y: number };
}

const mockMailboxes: Mailbox[] = [
  {
    id: "1",
    address: "12 Rue de la République",
    reference: "BAL-75001-0042",
    lastInspection: "15/01/2025",
    problemCount: 0,
    status: "normal",
    position: { x: 30, y: 25 },
  },
  {
    id: "2",
    address: "45 Avenue des Champs",
    reference: "BAL-75001-0156",
    lastInspection: "10/01/2025",
    problemCount: 2,
    status: "signaled",
    position: { x: 55, y: 40 },
  },
  {
    id: "3",
    address: "8 Place du Marché",
    reference: "BAL-75001-0089",
    lastInspection: "18/01/2025",
    problemCount: 1,
    status: "in-progress",
    position: { x: 70, y: 60 },
  },
  {
    id: "4",
    address: "23 Boulevard Haussmann",
    reference: "BAL-75001-0201",
    lastInspection: "20/01/2025",
    problemCount: 1,
    status: "resolved",
    position: { x: 25, y: 55 },
  },
  {
    id: "5",
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0178",
    lastInspection: "19/01/2025",
    problemCount: 0,
    status: "normal",
    position: { x: 48, y: 72 },
  },
];

interface InteractiveMapProps {
  onDeclare: (mailboxId: string) => void;
  onViewDetails: (mailboxId: string) => void;
}

export function InteractiveMap({ onDeclare, onViewDetails }: InteractiveMapProps) {
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);

  const handlePinClick = (mailbox: Mailbox) => {
    setSelectedMailbox(mailbox.id === selectedMailbox?.id ? null : mailbox);
  };

  return (
    <div className="relative h-full w-full">
      {/* Map Background - Simulated */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted">
        {/* Grid pattern to simulate map */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Simulated roads */}
        <div className="absolute top-1/4 left-0 right-0 h-2 bg-card/60" />
        <div className="absolute top-2/3 left-0 right-0 h-3 bg-card/70" />
        <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-card/60" />
        <div className="absolute left-2/3 top-0 bottom-0 w-3 bg-card/70" />
        
        {/* User location indicator */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-status-in-progress rounded-full animate-pulse-soft" />
          <div className="absolute inset-0 w-4 h-4 bg-status-in-progress/30 rounded-full animate-ping" />
        </div>
      </div>

      {/* Map Pins */}
      {mockMailboxes.map((mailbox) => (
        <div
          key={mailbox.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${mailbox.position.x}%`,
            top: `${mailbox.position.y}%`,
          }}
        >
          <MapPin
            status={mailbox.status}
            selected={selectedMailbox?.id === mailbox.id}
            onClick={() => handlePinClick(mailbox)}
          />
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-md hover:bg-card/90 text-foreground"
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-md hover:bg-card/90 text-foreground"
        >
          <Minus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-md hover:bg-card/90 text-foreground"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Locate Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-4 bg-card shadow-md hover:bg-card/90 text-foreground"
      >
        <Locate className="w-5 h-5" />
      </Button>

      {/* Legend */}
      <div className="absolute left-4 bottom-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <p className="text-xs font-medium text-muted-foreground mb-2">Légende</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-laposte-blue" />
            <span className="text-xs">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-signaled" />
            <span className="text-xs">Signalé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-in-progress" />
            <span className="text-xs">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-resolved" />
            <span className="text-xs">Résolu</span>
          </div>
        </div>
      </div>

      {/* Selected Mailbox Card */}
      {selectedMailbox && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <MailboxCard
            id={selectedMailbox.id}
            address={selectedMailbox.address}
            reference={selectedMailbox.reference}
            lastInspection={selectedMailbox.lastInspection}
            problemCount={selectedMailbox.problemCount}
            currentStatus={selectedMailbox.status === "normal" ? undefined : selectedMailbox.status}
            onDeclare={() => onDeclare(selectedMailbox.id)}
            onViewDetails={() => onViewDetails(selectedMailbox.id)}
          />
        </div>
      )}
    </div>
  );
}
