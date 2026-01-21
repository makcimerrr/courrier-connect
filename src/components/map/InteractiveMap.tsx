import React, { useState } from "react";
import { MapPin, type ProblemType } from "./MapPin";
import { MailboxCard } from "./MailboxCard";
import { Locate, Plus, Minus, Layers, Shield, Route, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TicketStatus } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface Mailbox {
  id: string;
  address: string;
  reference: string;
  lastInspection: string;
  problemCount: number;
  status?: TicketStatus | "normal" | "action-required";
  problemType?: ProblemType;
  position: { x: number; y: number };
  urgent?: boolean;
  inTour?: boolean; // Sur la tournée du jour
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
    inTour: true,
  },
  {
    id: "2",
    address: "45 Avenue des Champs",
    reference: "BAL-75001-0156",
    lastInspection: "10/01/2025",
    problemCount: 2,
    status: "signaled",
    problemType: "dog",
    position: { x: 55, y: 40 },
    urgent: true,
    inTour: true,
  },
  {
    id: "3",
    address: "8 Place du Marché",
    reference: "BAL-75001-0089",
    lastInspection: "18/01/2025",
    problemCount: 1,
    status: "in-progress",
    problemType: "too-low",
    position: { x: 70, y: 60 },
    inTour: true,
  },
  {
    id: "4",
    address: "23 Boulevard Haussmann",
    reference: "BAL-75001-0201",
    lastInspection: "20/01/2025",
    problemCount: 0,
    status: "resolved",
    problemType: "damaged",
    position: { x: 25, y: 55 },
    inTour: false,
  },
  {
    id: "5",
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0178",
    lastInspection: "19/01/2025",
    problemCount: 0,
    status: "normal",
    position: { x: 48, y: 72 },
    inTour: true,
  },
  {
    id: "6",
    address: "15 Rue de Rivoli",
    reference: "BAL-75001-0234",
    lastInspection: "12/01/2025",
    problemCount: 1,
    status: "action-required",
    problemType: "dangerous-access",
    position: { x: 38, y: 45 },
    urgent: true,
    inTour: true,
  },
  {
    id: "7",
    address: "92 Avenue Montaigne",
    reference: "BAL-75001-0312",
    lastInspection: "08/01/2025",
    problemCount: 1,
    status: "pending",
    problemType: "too-far",
    position: { x: 82, y: 35 },
    inTour: false,
  },
];

interface InteractiveMapProps {
  onDeclare: (mailboxId: string) => void;
  onViewDetails: (mailboxId: string) => void;
}

type FilterMode = "all" | "tour" | "security" | "urgent";

const filterChips: { id: FilterMode; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "Tous" },
  { id: "tour", label: "Ma tournée", icon: <Route className="w-3.5 h-3.5" /> },
  { id: "security", label: "Sécurité", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "urgent", label: "Urgents", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

export function InteractiveMap({ onDeclare, onViewDetails }: InteractiveMapProps) {
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>("all");

  const handlePinClick = (mailbox: Mailbox) => {
    setSelectedMailbox(mailbox.id === selectedMailbox?.id ? null : mailbox);
  };

  // Filtrage des boîtes selon le mode actif
  const filteredMailboxes = mockMailboxes.filter((mailbox) => {
    switch (activeFilter) {
      case "tour":
        return mailbox.inTour;
      case "security":
        return mailbox.problemType === "dog" || mailbox.problemType === "dangerous-access";
      case "urgent":
        return mailbox.urgent || mailbox.status === "action-required";
      default:
        return true;
    }
  });

  // Compteurs pour les badges de filtre
  const urgentCount = mockMailboxes.filter(m => m.urgent || m.status === "action-required").length;
  const securityCount = mockMailboxes.filter(m => m.problemType === "dog" || m.problemType === "dangerous-access").length;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Filter Chips */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              "transition-all duration-200 shadow-md",
              activeFilter === chip.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-card text-foreground hover:bg-card/90"
            )}
          >
            {chip.icon}
            {chip.label}
            {chip.id === "urgent" && urgentCount > 0 && (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {urgentCount}
              </span>
            )}
            {chip.id === "security" && securityCount > 0 && (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-status-signaled text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {securityCount}
              </span>
            )}
          </button>
        ))}
      </div>

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
      {filteredMailboxes.map((mailbox) => (
        <div
          key={mailbox.id}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 z-10",
            "transition-all duration-300"
          )}
          style={{
            left: `${mailbox.position.x}%`,
            top: `${mailbox.position.y}%`,
          }}
        >
          <MapPin
            status={mailbox.status}
            problemType={mailbox.problemType}
            problemCount={mailbox.problemCount}
            selected={selectedMailbox?.id === mailbox.id}
            urgent={mailbox.urgent}
            onClick={() => handlePinClick(mailbox)}
          />
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute right-4 top-16 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Minus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Locate Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-16 bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
      >
        <Locate className="w-5 h-5" />
      </Button>

      {/* Legend - Enhanced */}
      <div className={cn(
        "absolute left-4 bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border",
        "transition-all duration-300",
        selectedMailbox ? "bottom-44" : "bottom-4"
      )}>
        <p className="text-xs font-semibold text-foreground mb-2">Légende</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-laposte-blue shadow-sm" />
            <span className="text-xs text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-status-signaled shadow-sm relative">
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
            </div>
            <span className="text-xs text-muted-foreground">Signalé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-status-in-progress shadow-sm" />
            <span className="text-xs text-muted-foreground">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-laposte-yellow shadow-sm" />
            <span className="text-xs text-muted-foreground">Action requise</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-status-resolved shadow-sm" />
            <span className="text-xs text-muted-foreground">Résolu</span>
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
            currentStatus={selectedMailbox.status === "normal" ? undefined : selectedMailbox.status as TicketStatus}
            onDeclare={() => onDeclare(selectedMailbox.id)}
            onViewDetails={() => onViewDetails(selectedMailbox.id)}
          />
        </div>
      )}
    </div>
  );
}
