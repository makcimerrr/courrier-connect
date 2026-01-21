import React, { useState } from "react";
import { MapPin, type ProblemType } from "./MapPin";
import { MailboxCard } from "./MailboxCard";
import { BuildingBottomSheet, type BuildingData, type BuildingMailbox } from "./BuildingBottomSheet";
import { Locate, Plus, Minus, Layers, Shield, Route, AlertTriangle, Building2 } from "lucide-react";
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
  inTour?: boolean;
  ticketId?: string; // ID du ticket associé si problème
}

// Données mock des boîtes individuelles
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
    reference: "BAL-75008-0156",
    lastInspection: "10/01/2025",
    problemCount: 2,
    status: "signaled",
    problemType: "dog",
    position: { x: 55, y: 40 },
    urgent: true,
    inTour: true,
    ticketId: "TK-2026-0088",
  },
  {
    id: "4",
    address: "23 Boulevard Haussmann",
    reference: "BAL-75009-0019",
    lastInspection: "20/01/2025",
    problemCount: 0,
    status: "resolved",
    problemType: "damaged",
    position: { x: 25, y: 55 },
    inTour: false,
  },
  {
    id: "7",
    address: "92 Avenue Montaigne",
    reference: "BAL-75009-0312",
    lastInspection: "08/01/2025",
    problemCount: 1,
    status: "pending",
    problemType: "too-far",
    position: { x: 82, y: 35 },
    inTour: false,
    ticketId: "TK-2026-0086",
  },
];

// Données mock des immeubles avec plusieurs boîtes aux lettres
const mockBuildings: BuildingData[] = [
  {
    id: "building-1",
    address: "8 Place du Marché",
    reference: "IMM-75001-0089",
    buildingName: "Résidence du Marché",
    totalMailboxes: 6,
    position: { x: 70, y: 60 },
    mailboxes: [
      { id: "b1-1", apartment: "Apt 1", residentName: "M. Dupont", problemCount: 0, status: "normal" },
      { id: "b1-2", apartment: "Apt 2", residentName: "Mme Martin", problemCount: 1, status: "in-progress", problemType: "too-low", ticketId: "TK-2026-0038" },
      { id: "b1-3", apartment: "Apt 3", residentName: "M. Bernard", problemCount: 0, status: "normal" },
      { id: "b1-4", apartment: "Apt 4", residentName: "Mme Petit", problemCount: 2, status: "signaled", problemType: "damaged", urgent: true, ticketId: "TK-2026-0089" },
      { id: "b1-5", apartment: "Apt 5", residentName: "M. Moreau", problemCount: 0, status: "resolved" },
      { id: "b1-6", apartment: "Apt 6", residentName: "Mme Leroy", problemCount: 0, status: "normal" },
    ],
  },
  {
    id: "building-2",
    address: "15 Rue de Rivoli",
    reference: "IMM-75004-0234",
    buildingName: "Le Rivoli",
    totalMailboxes: 12,
    position: { x: 38, y: 45 },
    mailboxes: [
      { id: "b2-1", apartment: "RDC G", residentName: "Cabinet Médical", problemCount: 1, status: "action-required", problemType: "dangerous-access", urgent: true, ticketId: "TK-2026-0087" },
      { id: "b2-2", apartment: "RDC D", residentName: "Boulangerie", problemCount: 0, status: "normal" },
      { id: "b2-3", apartment: "1er G", residentName: "M. Dubois", problemCount: 0, status: "normal" },
      { id: "b2-4", apartment: "1er D", residentName: "Mme Garcia", problemCount: 0, status: "normal" },
      { id: "b2-5", apartment: "2e G", residentName: "M. Roux", problemCount: 1, status: "signaled", problemType: "dog", ticketId: "TK-2026-0042" },
      { id: "b2-6", apartment: "2e D", residentName: "Mme Fournier", problemCount: 0, status: "normal" },
      { id: "b2-7", apartment: "3e G", residentName: "M. Vincent", problemCount: 0, status: "normal" },
      { id: "b2-8", apartment: "3e D", residentName: "Mme Simon", problemCount: 0, status: "resolved" },
      { id: "b2-9", apartment: "4e G", residentName: "M. Laurent", problemCount: 0, status: "normal" },
      { id: "b2-10", apartment: "4e D", residentName: "Mme Michel", problemCount: 0, status: "normal" },
      { id: "b2-11", apartment: "5e G", residentName: "M. Lefebvre", problemCount: 0, status: "normal" },
      { id: "b2-12", apartment: "5e D", residentName: "Mme Girard", problemCount: 0, status: "pending", ticketId: "TK-2026-0056" },
    ],
  },
  {
    id: "building-3",
    address: "67 Rue Saint-Honoré",
    reference: "IMM-75001-0178",
    buildingName: "Saint-Honoré Prestige",
    totalMailboxes: 4,
    position: { x: 48, y: 72 },
    mailboxes: [
      { id: "b3-1", apartment: "Apt A", residentName: "M. André", problemCount: 0, status: "normal" },
      { id: "b3-2", apartment: "Apt B", residentName: "Mme Bonnet", problemCount: 0, status: "normal" },
      { id: "b3-3", apartment: "Apt C", residentName: "M. Clement", problemCount: 0, status: "normal" },
      { id: "b3-4", apartment: "Apt D", residentName: "Mme David", problemCount: 0, status: "normal" },
    ],
  },
];

interface InteractiveMapProps {
  onDeclare: (mailboxId: string, address: string) => void;
  onViewTicket: (ticketId: string) => void;
}

type FilterMode = "all" | "tour" | "security" | "urgent";

const filterChips: { id: FilterMode; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "Tous" },
  { id: "tour", label: "Ma tournée", icon: <Route className="w-3.5 h-3.5" /> },
  { id: "security", label: "Sécurité", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "urgent", label: "Urgents", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

export function InteractiveMap({ onDeclare, onViewTicket }: InteractiveMapProps) {
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [buildingSheetOpen, setBuildingSheetOpen] = useState(false);
  const [selectedBuildingMailbox, setSelectedBuildingMailbox] = useState<BuildingMailbox | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>("all");

  const handlePinClick = (mailbox: Mailbox) => {
    setSelectedBuilding(null);
    setBuildingSheetOpen(false);
    setSelectedBuildingMailbox(null);
    setSelectedMailbox(mailbox.id === selectedMailbox?.id ? null : mailbox);
  };

  const handleBuildingClick = (building: BuildingData) => {
    setSelectedMailbox(null);
    setSelectedBuildingMailbox(null);
    setSelectedBuilding(building);
    setBuildingSheetOpen(true);
  };

  const handleSelectBuildingMailbox = (mailbox: BuildingMailbox) => {
    setBuildingSheetOpen(false);
    setSelectedBuildingMailbox(mailbox);
  };

  const handleDeclareFromBuilding = (mailboxId: string, address: string) => {
    setBuildingSheetOpen(false);
    setSelectedBuildingMailbox(null);
    onDeclare(mailboxId, address);
  };

  // Helper pour obtenir le statut global d'un immeuble
  const getBuildingStatus = (building: BuildingData) => {
    const hasUrgent = building.mailboxes.some(m => m.urgent);
    const hasActionRequired = building.mailboxes.some(m => m.status === "action-required");
    const hasSignaled = building.mailboxes.some(m => m.status === "signaled");
    const hasInProgress = building.mailboxes.some(m => m.status === "in-progress");

    if (hasUrgent || hasActionRequired) return "action-required";
    if (hasSignaled) return "signaled";
    if (hasInProgress) return "in-progress";
    return "normal";
  };

  const getBuildingProblemCount = (building: BuildingData) => {
    return building.mailboxes.reduce((sum, m) => sum + m.problemCount, 0);
  };

  const isBuildingUrgent = (building: BuildingData) => {
    return building.mailboxes.some(m => m.urgent);
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

  // Filtrage des immeubles selon le mode actif
  const filteredBuildings = mockBuildings.filter((building) => {
    switch (activeFilter) {
      case "tour":
        return true; // Tous les immeubles sont sur la tournée par défaut
      case "security":
        return building.mailboxes.some(m => m.problemType === "dog" || m.problemType === "dangerous-access");
      case "urgent":
        return building.mailboxes.some(m => m.urgent || m.status === "action-required");
      default:
        return true;
    }
  });

  // Compteurs pour les badges de filtre (incluant les immeubles)
  const allMailboxesFlat = [
    ...mockMailboxes,
    ...mockBuildings.flatMap(b => b.mailboxes.map(m => ({ ...m, status: m.status, urgent: m.urgent, problemType: m.problemType })))
  ];
  const urgentCount = allMailboxesFlat.filter(m => m.urgent || m.status === "action-required").length;
  const securityCount = allMailboxesFlat.filter(m => m.problemType === "dog" || m.problemType === "dangerous-access").length;

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

      {/* Map Pins - Boîtes individuelles */}
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

      {/* Map Pins - Immeubles (plusieurs boîtes) */}
      {filteredBuildings.map((building) => {
        const buildingStatus = getBuildingStatus(building);
        const problemCount = getBuildingProblemCount(building);
        const isUrgent = isBuildingUrgent(building);
        const isSelected = selectedBuilding?.id === building.id;

        return (
          <div
            key={building.id}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 z-10",
              "transition-all duration-300"
            )}
            style={{
              left: `${building.position.x}%`,
              top: `${building.position.y}%`,
            }}
          >
            <button
              onClick={() => handleBuildingClick(building)}
              className={cn(
                "relative flex items-center justify-center",
                "w-12 h-12 rounded-xl shadow-lg",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                buildingStatus === "normal" && "bg-laposte-blue",
                buildingStatus === "signaled" && "bg-status-signaled",
                buildingStatus === "in-progress" && "bg-status-in-progress",
                buildingStatus === "action-required" && "bg-laposte-yellow",
                isSelected && "ring-2 ring-primary ring-offset-2 scale-110",
                isUrgent && "animate-urgent-pulse"
              )}
            >
              {/* Icône immeuble */}
              <Building2 className={cn(
                "w-6 h-6",
                buildingStatus === "action-required" ? "text-primary-foreground" : "text-white"
              )} />

              {/* Badge nombre de boîtes */}
              <span className={cn(
                "absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1",
                "rounded-full flex items-center justify-center",
                "text-[10px] font-bold border-2 border-white shadow-sm",
                problemCount > 0
                  ? "bg-destructive text-white"
                  : "bg-secondary text-secondary-foreground"
              )}>
                {building.totalMailboxes}
              </span>

              {/* Ring animation si problèmes */}
              {problemCount > 0 && (
                <span className={cn(
                  "absolute -inset-1 rounded-xl pointer-events-none animate-ring-pulse",
                  buildingStatus === "signaled" && "bg-status-signaled/30",
                  buildingStatus === "action-required" && "bg-laposte-yellow/40",
                  buildingStatus === "in-progress" && "bg-status-in-progress/30"
                )} />
              )}
            </button>
          </div>
        );
      })}

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
        (selectedMailbox || selectedBuildingMailbox) ? "bottom-44" : "bottom-4"
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
          <div className="flex items-center gap-2 pt-1 border-t border-border mt-1">
            <div className="w-4 h-4 rounded bg-laposte-blue shadow-sm flex items-center justify-center">
              <Building2 className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs text-muted-foreground">Immeuble</span>
          </div>
        </div>
      </div>

      {/* Selected Mailbox Card - Individual */}
      {selectedMailbox && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <MailboxCard
            id={selectedMailbox.id}
            address={selectedMailbox.address}
            reference={selectedMailbox.reference}
            lastInspection={selectedMailbox.lastInspection}
            problemCount={selectedMailbox.problemCount}
            currentStatus={selectedMailbox.status === "normal" ? undefined : selectedMailbox.status as TicketStatus}
            ticketId={selectedMailbox.ticketId}
            onDeclare={() => onDeclare(selectedMailbox.id, selectedMailbox.address)}
            onViewTicket={selectedMailbox.ticketId ? () => onViewTicket(selectedMailbox.ticketId!) : undefined}
          />
        </div>
      )}

      {/* Selected Building Mailbox Card */}
      {selectedBuildingMailbox && selectedBuilding && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <MailboxCard
            id={selectedBuildingMailbox.id}
            address={`${selectedBuilding.address} - ${selectedBuildingMailbox.apartment}`}
            reference={`${selectedBuilding.reference}/${selectedBuildingMailbox.apartment}`}
            lastInspection="--"
            problemCount={selectedBuildingMailbox.problemCount}
            currentStatus={selectedBuildingMailbox.status === "normal" ? undefined : selectedBuildingMailbox.status as TicketStatus}
            ticketId={(selectedBuildingMailbox as any).ticketId}
            onDeclare={() => onDeclare(selectedBuildingMailbox.id, `${selectedBuilding.address} - ${selectedBuildingMailbox.apartment}`)}
            onViewTicket={(selectedBuildingMailbox as any).ticketId ? () => onViewTicket((selectedBuildingMailbox as any).ticketId) : undefined}
          />
        </div>
      )}

      {/* Building Bottom Sheet */}
      <BuildingBottomSheet
        building={selectedBuilding}
        open={buildingSheetOpen}
        onOpenChange={(open) => {
          setBuildingSheetOpen(open);
          if (!open) {
            setSelectedBuilding(null);
          }
        }}
        onSelectMailbox={handleSelectBuildingMailbox}
        onDeclareAll={() => {
          if (selectedBuilding) {
            handleDeclareFromBuilding(`${selectedBuilding.id}-general`, selectedBuilding.address);
          }
        }}
      />
    </div>
  );
}
