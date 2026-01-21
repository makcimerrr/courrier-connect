import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Layers,
  Filter,
  X,
  ChevronDown,
  BarChart3,
  FileText,
  MapPin,
  Users,
  Target,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapboxMap, type MapMailbox } from "@/components/map/MapboxMap";
import { MailboxBottomSheet } from "@/components/map/MailboxBottomSheet";
import { BuildingBottomSheet, type BuildingData, type BuildingMailbox } from "@/components/map/BuildingBottomSheet";

// Mock data avec plus de points pour la heatmap
const generateMailboxes = (): MapMailbox[] => {
  const statuses: MapMailbox["status"][] = ["normal", "signaled", "in-progress", "pending", "action-required", "resolved"];
  const problemTypes: MapMailbox["problemType"][] = ["dog", "too-low", "too-far", "dangerous-access", "damaged", undefined];

  const mailboxes: MapMailbox[] = [];

  // Points individuels
  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hasProblems = status !== "normal" && status !== "resolved";

    mailboxes.push({
      id: `mb-${i}`,
      address: `${Math.floor(Math.random() * 100) + 1} Rue ${["de la Paix", "du Commerce", "Victor Hugo", "des Lilas", "Nationale"][Math.floor(Math.random() * 5)]}`,
      reference: `BAL-750${String(Math.floor(Math.random() * 20)).padStart(2, "0")}-${String(i).padStart(4, "0")}`,
      lastInspection: `${Math.floor(Math.random() * 28) + 1}/01/2026`,
      problemCount: hasProblems ? Math.floor(Math.random() * 3) + 1 : 0,
      status,
      problemType: hasProblems ? problemTypes[Math.floor(Math.random() * (problemTypes.length - 1))] : undefined,
      position: {
        lat: 48.8566 + (Math.random() - 0.5) * 0.06,
        lng: 2.3522 + (Math.random() - 0.5) * 0.12,
      },
      urgent: hasProblems && Math.random() > 0.7,
      inTour: Math.random() > 0.3,
    });
  }

  // Immeubles
  const buildings: MapMailbox[] = [
    {
      id: "building-1",
      address: "8 Place du Marché",
      reference: "IMM-75001-0089",
      lastInspection: "15/01/2026",
      problemCount: 3,
      status: "signaled",
      position: { lat: 48.8656, lng: 2.3312 },
      urgent: true,
      inTour: true,
      isBuilding: true,
      buildingName: "Résidence du Marché",
      totalMailboxes: 12,
    },
    {
      id: "building-2",
      address: "15 Rue de Rivoli",
      reference: "IMM-75004-0234",
      lastInspection: "12/01/2026",
      problemCount: 2,
      status: "action-required",
      position: { lat: 48.8556, lng: 2.3522 },
      urgent: true,
      inTour: true,
      isBuilding: true,
      buildingName: "Le Rivoli",
      totalMailboxes: 24,
    },
    {
      id: "building-3",
      address: "45 Boulevard Haussmann",
      reference: "IMM-75009-0156",
      lastInspection: "18/01/2026",
      problemCount: 0,
      status: "normal",
      position: { lat: 48.8738, lng: 2.3318 },
      inTour: true,
      isBuilding: true,
      buildingName: "Haussmann Résidence",
      totalMailboxes: 18,
    },
  ];

  return [...mailboxes, ...buildings];
};

const allMailboxes = generateMailboxes();

// Building mock data
const mockBuildingData: Record<string, BuildingData> = {
  "building-1": {
    id: "building-1",
    address: "8 Place du Marché",
    reference: "IMM-75001-0089",
    buildingName: "Résidence du Marché",
    totalMailboxes: 12,
    position: { x: 0, y: 0 },
    mailboxes: [
      { id: "b1-1", apartment: "Apt 1", residentName: "M. Dupont", problemCount: 0, status: "normal" },
      { id: "b1-2", apartment: "Apt 2", residentName: "Mme Martin", problemCount: 1, status: "signaled", problemType: "dog", urgent: true },
      { id: "b1-3", apartment: "Apt 3", residentName: "M. Bernard", problemCount: 0, status: "normal" },
      { id: "b1-4", apartment: "Apt 4", residentName: "Mme Petit", problemCount: 2, status: "in-progress", problemType: "damaged" },
      { id: "b1-5", apartment: "Apt 5", residentName: "M. Moreau", problemCount: 0, status: "resolved" },
      { id: "b1-6", apartment: "Apt 6", residentName: "Mme Leroy", problemCount: 0, status: "normal" },
      { id: "b1-7", apartment: "Apt 7", residentName: "M. Girard", problemCount: 0, status: "normal" },
      { id: "b1-8", apartment: "Apt 8", residentName: "Mme Roux", problemCount: 0, status: "normal" },
      { id: "b1-9", apartment: "Apt 9", residentName: "M. Fournier", problemCount: 0, status: "normal" },
      { id: "b1-10", apartment: "Apt 10", residentName: "Mme Vincent", problemCount: 0, status: "normal" },
      { id: "b1-11", apartment: "Apt 11", residentName: "M. Simon", problemCount: 0, status: "normal" },
      { id: "b1-12", apartment: "Apt 12", residentName: "Mme Laurent", problemCount: 0, status: "normal" },
    ],
  },
  "building-2": {
    id: "building-2",
    address: "15 Rue de Rivoli",
    reference: "IMM-75004-0234",
    buildingName: "Le Rivoli",
    totalMailboxes: 24,
    position: { x: 0, y: 0 },
    mailboxes: Array.from({ length: 24 }, (_, i) => ({
      id: `b2-${i + 1}`,
      apartment: `${Math.floor(i / 2) + 1}${i % 2 === 0 ? "G" : "D"}`,
      residentName: `Résident ${i + 1}`,
      problemCount: i === 0 ? 1 : i === 4 ? 1 : 0,
      status: i === 0 ? "action-required" as const : i === 4 ? "signaled" as const : "normal" as const,
      problemType: i === 0 ? "dangerous-access" as const : i === 4 ? "too-low" as const : undefined,
      urgent: i === 0,
    })),
  },
  "building-3": {
    id: "building-3",
    address: "45 Boulevard Haussmann",
    reference: "IMM-75009-0156",
    buildingName: "Haussmann Résidence",
    totalMailboxes: 18,
    position: { x: 0, y: 0 },
    mailboxes: Array.from({ length: 18 }, (_, i) => ({
      id: `b3-${i + 1}`,
      apartment: `Apt ${i + 1}`,
      residentName: `Résident ${i + 1}`,
      problemCount: 0,
      status: "normal" as const,
    })),
  },
};

type FilterMode = "all" | "problems" | "urgent" | "buildings";

export default function ManagerMapPage() {
  const navigate = useNavigate();
  const [selectedMailbox, setSelectedMailbox] = useState<MapMailbox | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [buildingSheetOpen, setBuildingSheetOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterMode>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter mailboxes
  const filteredMailboxes = useMemo(() => {
    switch (activeFilter) {
      case "problems":
        return allMailboxes.filter((m) => m.problemCount > 0);
      case "urgent":
        return allMailboxes.filter((m) => m.urgent);
      case "buildings":
        return allMailboxes.filter((m) => m.isBuilding);
      default:
        return allMailboxes;
    }
  }, [activeFilter]);

  const handleMailboxSelect = (mailbox: MapMailbox | null) => {
    if (!mailbox) {
      setSelectedMailbox(null);
      setSelectedBuilding(null);
      setBottomSheetOpen(false);
      setBuildingSheetOpen(false);
      return;
    }

    if (mailbox.isBuilding) {
      const buildingData = mockBuildingData[mailbox.id];
      if (buildingData) {
        setSelectedBuilding(buildingData);
        setBuildingSheetOpen(true);
        setSelectedMailbox(null);
        setBottomSheetOpen(false);
      }
    } else {
      setSelectedMailbox(mailbox);
      setBottomSheetOpen(true);
      setSelectedBuilding(null);
      setBuildingSheetOpen(false);
    }
  };

  const handleDeclare = (mailboxId: string) => {
    setBottomSheetOpen(false);
    setBuildingSheetOpen(false);
    navigate(`/declarations/new?mailbox=${mailboxId}`);
  };

  const handleViewHistory = (mailboxId: string) => {
    setBottomSheetOpen(false);
    setBuildingSheetOpen(false);
    navigate(`/history/${mailboxId}`);
  };

  const handleSelectBuildingMailbox = (mailbox: BuildingMailbox) => {
    setBuildingSheetOpen(false);
    // Navigate to ticket or show details
    navigate(`/history/${mailbox.id}`);
  };

  const stats = {
    total: allMailboxes.length,
    problems: allMailboxes.filter((m) => m.problemCount > 0).length,
    urgent: allMailboxes.filter((m) => m.urgent).length,
    buildings: allMailboxes.filter((m) => m.isBuilding).length,
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Carte des incidents</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={cn(
                "text-secondary-foreground",
                showHeatmap && "bg-laposte-yellow text-primary-foreground"
              )}
            >
              <Flame className="w-4 h-4 mr-1.5" />
              Heatmap
            </Button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all" as FilterMode, label: "Tous", count: stats.total },
            { id: "problems" as FilterMode, label: "Problèmes", count: stats.problems, color: "text-amber-500" },
            { id: "urgent" as FilterMode, label: "Urgents", count: stats.urgent, color: "text-red-500" },
            { id: "buildings" as FilterMode, label: "Immeubles", count: stats.buildings, icon: Building2 },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                activeFilter === filter.id
                  ? "bg-laposte-yellow text-primary-foreground"
                  : "bg-secondary-foreground/10 text-secondary-foreground/70 hover:bg-secondary-foreground/20"
              )}
            >
              {filter.icon && <filter.icon className="w-3.5 h-3.5" />}
              {filter.label}
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                activeFilter === filter.id
                  ? "bg-white/20"
                  : filter.color || "bg-secondary-foreground/10"
              )}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <MapboxMap
          mailboxes={filteredMailboxes}
          onMailboxSelect={handleMailboxSelect}
          selectedMailboxId={selectedMailbox?.id}
          showHeatmap={showHeatmap}
        />

        {/* Legend */}
        <div className="absolute left-4 bottom-4 bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-10">
          <p className="text-xs font-semibold text-foreground mb-2">Légende</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
              <span className="text-[10px] text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="text-[10px] text-muted-foreground">Signalé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
              <span className="text-[10px] text-muted-foreground">En cours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#facc15]" />
              <span className="text-[10px] text-muted-foreground">Action req.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
              <span className="text-[10px] text-muted-foreground">Urgent</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-border mt-1">
              <span className="w-3 h-3 rounded bg-[#1e3a5f] flex items-center justify-center">
                <Building2 className="w-2 h-2 text-white" />
              </span>
              <span className="text-[10px] text-muted-foreground">Immeuble</span>
            </div>
          </div>
        </div>

        {/* Heatmap legend */}
        {showHeatmap && (
          <div className="absolute right-4 bottom-4 bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-10">
            <p className="text-xs font-semibold text-foreground mb-2">Densité incidents</p>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">Faible</span>
              <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500" />
              <span className="text-[10px] text-muted-foreground">Élevée</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet for individual mailbox */}
      <MailboxBottomSheet
        mailbox={selectedMailbox}
        open={bottomSheetOpen}
        onOpenChange={(open) => {
          setBottomSheetOpen(open);
          if (!open) setSelectedMailbox(null);
        }}
        onDeclare={handleDeclare}
        onViewHistory={handleViewHistory}
      />

      {/* Bottom Sheet for building */}
      <BuildingBottomSheet
        building={selectedBuilding}
        open={buildingSheetOpen}
        onOpenChange={(open) => {
          setBuildingSheetOpen(open);
          if (!open) setSelectedBuilding(null);
        }}
        onSelectMailbox={handleSelectBuildingMailbox}
        onDeclareAll={() => handleDeclare(selectedBuilding?.id || "")}
      />

      {/* Bottom Navigation */}
      <nav className="bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          <button onClick={() => navigate("/manager")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button onClick={() => navigate("/manager/tickets")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">Tickets</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-2 px-3 text-laposte-yellow">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Carte</span>
          </button>
          <button onClick={() => navigate("/manager/team")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium">Équipe</span>
          </button>
          <button onClick={() => navigate("/manager/analytics")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
