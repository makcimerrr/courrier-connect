import { useState } from "react";
import { DeclarationCard } from "./DeclarationCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { DeclarationsListSkeleton } from "@/components/ui/skeletons";
import type { TicketStatus } from "@/components/ui/StatusBadge";
import type { ProblemTypeId } from "@/components/icons/ProblemTypeIcon";
import { cn } from "@/lib/utils";

interface Declaration {
  id: string;
  address: string;
  reference: string;
  type: string;
  problemType?: ProblemTypeId;
  date: string;
  status: TicketStatus;
  progress?: number;
}

// IDs correspondent aux tickets dans HistoryPage (format TK-YYYY-NNNN)
const mockDeclarations: Declaration[] = [
  {
    id: "TK-2026-0042",
    address: "12 Rue de la République",
    reference: "BAL-75001-0042",
    type: "Présence de chien",
    problemType: "dog",
    date: "21/01/2026",
    status: "signaled",
    progress: 15,
  },
  {
    id: "TK-2026-0038",
    address: "45 Avenue des Champs",
    reference: "BAL-75008-0038",
    type: "Boîte trop basse",
    problemType: "too-low",
    date: "18/01/2026",
    status: "in-progress",
    progress: 45,
  },
  {
    id: "TK-2026-0025",
    address: "8 Place du Marché",
    reference: "BAL-75001-0025",
    type: "Présence de chien",
    problemType: "dog",
    date: "10/01/2026",
    status: "action-required",
    progress: 70,
  },
  {
    id: "TK-2026-0051",
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0051",
    type: "Accès dangereux",
    problemType: "dangerous-access",
    date: "20/01/2026",
    status: "in-progress",
    progress: 40,
  },
  {
    id: "TK-2026-0019",
    address: "23 Boulevard Haussmann",
    reference: "BAL-75009-0019",
    type: "Boîte détériorée",
    problemType: "damaged",
    date: "08/01/2026",
    status: "resolved",
  },
  {
    id: "TK-2026-0056",
    address: "15 Rue de Rivoli",
    reference: "BAL-75004-0056",
    type: "Boîte trop éloignée",
    problemType: "too-far",
    date: "10/01/2026",
    status: "pending",
    progress: 25,
  },
];

const filterOptions: { value: TicketStatus | "all"; label: string; count?: number }[] = [
  { value: "all", label: "Tous" },
  { value: "signaled", label: "Signalé" },
  { value: "in-progress", label: "En cours" },
  { value: "action-required", label: "Action requise" },
  { value: "pending", label: "En attente" },
  { value: "resolved", label: "Résolu" },
];

interface DeclarationsListProps {
  onViewDetails: (id: string) => void;
  isLoading?: boolean;
}

export function DeclarationsList({ onViewDetails, isLoading = false }: DeclarationsListProps) {
  const [activeFilter, setActiveFilter] = useState<TicketStatus | "all">("all");

  const filteredDeclarations = mockDeclarations.filter(
    (d) => activeFilter === "all" || d.status === activeFilter
  );

  // Calculer les compteurs pour chaque filtre
  const getCounts = () => {
    const counts: Record<string, number> = { all: mockDeclarations.length };
    mockDeclarations.forEach((d) => {
      counts[d.status] = (counts[d.status] || 0) + 1;
    });
    return counts;
  };
  const counts = getCounts();

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Mes Déclarations" />

      {/* Filters */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filterOptions.map((option) => {
            const count = counts[option.value] || 0;
            const isActive = activeFilter === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                  "transition-all duration-200",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {option.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold",
                      "flex items-center justify-center",
                      isActive
                        ? "bg-secondary-foreground/20 text-secondary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {isLoading ? (
          <DeclarationsListSkeleton count={4} />
        ) : filteredDeclarations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground font-medium">Aucune déclaration trouvée</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Les déclarations avec ce statut apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeclarations.map((declaration, index) => (
              <div
                key={declaration.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DeclarationCard
                  {...declaration}
                  onClick={() => onViewDetails(declaration.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
