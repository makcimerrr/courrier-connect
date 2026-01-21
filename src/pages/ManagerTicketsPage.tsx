import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronDown,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpDown,
  Download,
  BarChart3,
  FileText,
  Users,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

// Types
type TicketStatus = "signaled" | "in-progress" | "pending" | "action-required" | "resolved";
type TicketPriority = "low" | "medium" | "high" | "urgent";
type ProblemType = "dog" | "too-low" | "too-far" | "dangerous-access" | "damaged";

interface Ticket {
  id: string;
  reference: string;
  address: string;
  zone: string;
  type: ProblemType;
  typeLabel: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  assigneeId?: string;
  daysOpen: number;
  eventsCount: number;
  position: { lat: number; lng: number };
}

// Mock Data - 50 tickets
const generateTickets = (): Ticket[] => {
  const types: { type: ProblemType; label: string }[] = [
    { type: "dog", label: "Présence de chien" },
    { type: "too-low", label: "Boîte trop basse" },
    { type: "too-far", label: "Boîte trop éloignée" },
    { type: "dangerous-access", label: "Accès dangereux" },
    { type: "damaged", label: "Boîte détériorée" },
  ];
  const statuses: TicketStatus[] = ["signaled", "in-progress", "pending", "action-required", "resolved"];
  const priorities: TicketPriority[] = ["low", "medium", "high", "urgent"];
  const zones = ["75001", "75002", "75003", "75004", "75008", "75009", "75016"];
  const assignees = ["Marie Dupont", "Jean Martin", "Sophie Bernard", "Pierre Moreau", "Claire Petit", undefined];
  const addresses = [
    "12 Rue de la République", "45 Avenue des Champs", "8 Place du Marché",
    "23 Boulevard Haussmann", "67 Rue Saint-Honoré", "15 Rue de Rivoli",
    "92 Avenue Montaigne", "3 Place de la Concorde", "28 Rue du Faubourg",
    "55 Rue de Passy", "18 Avenue Victor Hugo", "7 Rue de Rome",
  ];

  const tickets: Ticket[] = [];
  for (let i = 1; i <= 50; i++) {
    const typeObj = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysOpen = status === "resolved" ? 0 : Math.floor(Math.random() * 30);
    const zone = zones[Math.floor(Math.random() * zones.length)];

    tickets.push({
      id: `TK-2026-${String(i).padStart(4, "0")}`,
      reference: `BAL-${zone}-${String(Math.floor(Math.random() * 500)).padStart(4, "0")}`,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      zone,
      type: typeObj.type,
      typeLabel: typeObj.label,
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: new Date(Date.now() - daysOpen * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * daysOpen) * 24 * 60 * 60 * 1000).toISOString(),
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      daysOpen,
      eventsCount: Math.floor(Math.random() * 8) + 1,
      position: {
        lat: 48.8566 + (Math.random() - 0.5) * 0.05,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
      },
    });
  }
  return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const allTickets = generateTickets();

// Filter Chips
interface FilterOption {
  id: string;
  label: string;
  color?: string;
}

const statusFilters: FilterOption[] = [
  { id: "all", label: "Tous" },
  { id: "signaled", label: "Signalé", color: "bg-status-signaled" },
  { id: "in-progress", label: "En cours", color: "bg-status-in-progress" },
  { id: "pending", label: "En attente", color: "bg-status-pending" },
  { id: "action-required", label: "Action req.", color: "bg-laposte-yellow" },
  { id: "resolved", label: "Résolu", color: "bg-status-resolved" },
];

const priorityFilters: FilterOption[] = [
  { id: "all", label: "Toutes" },
  { id: "urgent", label: "Urgent", color: "bg-red-500" },
  { id: "high", label: "Haute", color: "bg-orange-500" },
  { id: "medium", label: "Moyenne", color: "bg-blue-500" },
  { id: "low", label: "Basse", color: "bg-gray-400" },
];

const typeFilters: FilterOption[] = [
  { id: "all", label: "Tous" },
  { id: "dog", label: "Chien" },
  { id: "too-low", label: "Trop basse" },
  { id: "too-far", label: "Trop loin" },
  { id: "dangerous-access", label: "Accès" },
  { id: "damaged", label: "Détériorée" },
];

const zoneFilters: FilterOption[] = [
  { id: "all", label: "Toutes" },
  { id: "75001", label: "75001" },
  { id: "75002", label: "75002" },
  { id: "75003", label: "75003" },
  { id: "75004", label: "75004" },
  { id: "75008", label: "75008" },
  { id: "75009", label: "75009" },
  { id: "75016", label: "75016" },
];

type SortField = "createdAt" | "daysOpen" | "priority" | "status";
type SortOrder = "asc" | "desc";

// Components
function FilterSection({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground px-1">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              selected === opt.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {opt.color && selected !== opt.id && (
              <span className={cn("inline-block w-2 h-2 rounded-full mr-1.5", opt.color)} />
            )}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const statusConfig = {
    signaled: { label: "Signalé", class: "bg-status-signaled/15 text-status-signaled" },
    "in-progress": { label: "En cours", class: "bg-status-in-progress/15 text-status-in-progress" },
    pending: { label: "En attente", class: "bg-status-pending/15 text-status-pending" },
    "action-required": { label: "Action req.", class: "bg-laposte-yellow/15 text-laposte-yellow-dark" },
    resolved: { label: "Résolu", class: "bg-status-resolved/15 text-status-resolved" },
  };

  const priorityConfig = {
    low: { label: "Basse", class: "text-gray-500" },
    medium: { label: "Moyenne", class: "text-blue-500" },
    high: { label: "Haute", class: "text-orange-500" },
    urgent: { label: "URGENT", class: "text-red-600 font-bold" },
  };

  const isOverdue = ticket.daysOpen > 7 && ticket.status !== "resolved";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-card rounded-xl p-4 shadow-sm border border-border text-left",
        "transition-all hover:shadow-md",
        isOverdue && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
            <span className={cn("text-[10px]", priorityConfig[ticket.priority].class)}>
              {priorityConfig[ticket.priority].label}
            </span>
          </div>
          <p className="font-semibold text-foreground text-sm">{ticket.typeLabel}</p>
        </div>
        <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap", statusConfig[ticket.status].class)}>
          {statusConfig[ticket.status].label}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{ticket.address}</span>
          <span className="text-muted-foreground/60">• {ticket.zone}</span>
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>Créé le {format(parseISO(ticket.createdAt), "dd MMM yyyy", { locale: fr })}</span>
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-3">
          {ticket.assignee ? (
            <span className="text-xs text-muted-foreground">
              Assigné à <span className="font-medium text-foreground">{ticket.assignee}</span>
            </span>
          ) : (
            <span className="text-xs text-amber-600 font-medium">Non assigné</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {ticket.status !== "resolved" && (
            <span className={cn(
              "text-xs",
              isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"
            )}>
              {ticket.daysOpen}j
            </span>
          )}
          <span className="text-xs text-muted-foreground">{ticket.eventsCount} événements</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}

export default function ManagerTicketsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    let result = [...allTickets];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.address.toLowerCase().includes(query) ||
          t.reference.toLowerCase().includes(query) ||
          t.typeLabel.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Zone filter
    if (zoneFilter !== "all") {
      result = result.filter((t) => t.zone === zoneFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "daysOpen":
          comparison = a.daysOpen - b.daysOpen;
          break;
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "status":
          const statusOrder = { "action-required": 5, signaled: 4, "in-progress": 3, pending: 2, resolved: 1 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, statusFilter, priorityFilter, typeFilter, zoneFilter, sortField, sortOrder]);

  const activeFiltersCount = [statusFilter, priorityFilter, typeFilter, zoneFilter].filter((f) => f !== "all").length;

  const stats = {
    total: filteredTickets.length,
    urgent: filteredTickets.filter((t) => t.priority === "urgent").length,
    overdue: filteredTickets.filter((t) => t.daysOpen > 7 && t.status !== "resolved").length,
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setTypeFilter("all");
    setZoneFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold">Tous les tickets</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-secondary-foreground">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un ticket, une adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-laposte-yellow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-secondary-foreground/50" />
              </button>
            )}
          </div>
        </div>

        {/* Filter toggle */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              showFilters || activeFiltersCount > 0
                ? "bg-laposte-yellow text-primary-foreground"
                : "bg-secondary-foreground/10 text-secondary-foreground/70"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-white text-laposte-yellow text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showFilters && "rotate-180")} />
          </button>

          {/* Sort */}
          <div className="flex items-center gap-1 ml-auto">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-2 py-1.5 rounded-lg bg-secondary-foreground/10 text-secondary-foreground text-xs focus:outline-none"
            >
              <option value="createdAt">Date</option>
              <option value="daysOpen">Ancienneté</option>
              <option value="priority">Priorité</option>
              <option value="status">Statut</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1.5 rounded-lg bg-secondary-foreground/10 text-secondary-foreground"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 space-y-4 border-t border-secondary-foreground/10 pt-4">
            <FilterSection title="Statut" options={statusFilters} selected={statusFilter} onChange={setStatusFilter} />
            <FilterSection title="Priorité" options={priorityFilters} selected={priorityFilter} onChange={setPriorityFilter} />
            <FilterSection title="Type" options={typeFilters} selected={typeFilter} onChange={setTypeFilter} />
            <FilterSection title="Zone" options={zoneFilters} selected={zoneFilter} onChange={setZoneFilter} />

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-laposte-yellow font-medium"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </header>

      {/* Stats bar */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{stats.total}</span> tickets
        </span>
        {stats.urgent > 0 && (
          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {stats.urgent} urgents
          </span>
        )}
        {stats.overdue > 0 && (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {stats.overdue} en retard
          </span>
        )}
      </div>

      {/* Tickets List */}
      <main className="p-4 pb-24 space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun ticket trouvé</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-laposte-yellow font-medium mt-2"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => navigate(`/manager/tickets/${ticket.id}`)}
            />
          ))
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          <button onClick={() => navigate("/manager")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-2 px-3 text-laposte-yellow">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Tickets</span>
          </button>
          <button onClick={() => navigate("/manager/map")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium">Carte</span>
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
