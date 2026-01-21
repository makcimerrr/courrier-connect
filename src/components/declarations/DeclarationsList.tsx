import { useState } from "react";
import { DeclarationCard } from "./DeclarationCard";
import { AppHeader } from "@/components/layout/AppHeader";
import type { TicketStatus } from "@/components/ui/StatusBadge";

interface Declaration {
  id: string;
  address: string;
  reference: string;
  type: string;
  date: string;
  status: TicketStatus;
}

const mockDeclarations: Declaration[] = [
  {
    id: "1",
    address: "45 Avenue des Champs",
    reference: "BAL-75001-0156",
    type: "Présence de chien",
    date: "21/01/2025",
    status: "signaled",
  },
  {
    id: "2",
    address: "8 Place du Marché",
    reference: "BAL-75001-0089",
    type: "Accès dangereux",
    date: "18/01/2025",
    status: "in-progress",
  },
  {
    id: "3",
    address: "23 Boulevard Haussmann",
    reference: "BAL-75001-0201",
    type: "Boîte trop basse",
    date: "15/01/2025",
    status: "resolved",
  },
  {
    id: "4",
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0178",
    type: "Autre problème technique",
    date: "12/01/2025",
    status: "pending",
  },
];

const filterOptions: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "signaled", label: "Signalé" },
  { value: "in-progress", label: "En cours" },
  { value: "pending", label: "En attente" },
  { value: "resolved", label: "Résolu" },
];

interface DeclarationsListProps {
  onViewDetails: (id: string) => void;
}

export function DeclarationsList({ onViewDetails }: DeclarationsListProps) {
  const [activeFilter, setActiveFilter] = useState<TicketStatus | "all">("all");

  const filteredDeclarations = mockDeclarations.filter(
    (d) => activeFilter === "all" || d.status === activeFilter
  );

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Mes Déclarations" />

      {/* Filters */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === option.value
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {filteredDeclarations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucune déclaration trouvée</p>
          </div>
        ) : (
          filteredDeclarations.map((declaration) => (
            <DeclarationCard
              key={declaration.id}
              {...declaration}
              onClick={() => onViewDetails(declaration.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
