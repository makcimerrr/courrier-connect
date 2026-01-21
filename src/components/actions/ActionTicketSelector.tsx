import { useState } from "react";
import { X, Camera, FileText, CheckCircle2, MapPin, Clock, AlertTriangle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ActionType = "photo" | "flyer" | "verification";

export interface PendingAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  address: string;
  deadline?: string;
  ticketRef: string;
  isOverdue?: boolean;
}

// Mock des actions à réaliser (même données que ActionsPage)
const pendingActions: PendingAction[] = [
  {
    id: "1",
    type: "flyer",
    title: "Déposer flyer de sensibilisation",
    description: "Chien agressif signalé - Informer le propriétaire",
    address: "12 Rue de la République",
    deadline: "23/01/2026",
    ticketRef: "TK-2026-0042",
  },
  {
    id: "2",
    type: "photo",
    title: "Reprendre photo après correction",
    description: "Boîte rehaussée - Vérification nécessaire",
    address: "45 Avenue des Champs",
    deadline: "25/01/2026",
    ticketRef: "TK-2026-0038",
  },
  {
    id: "3",
    type: "verification",
    title: "Vérifier mise en conformité",
    description: "Chien attaché - Confirmer accès sécurisé",
    address: "8 Place du Marché",
    deadline: "18/01/2026",
    ticketRef: "TK-2026-0025",
    isOverdue: true,
  },
  {
    id: "4",
    type: "flyer",
    title: "Déposer flyer - Accès dangereux",
    description: "Escaliers glissants signalés",
    address: "67 Rue Saint-Honoré",
    deadline: "28/01/2026",
    ticketRef: "TK-2026-0051",
  },
];

const actionTypeConfig: Record<ActionType, { icon: typeof Camera; label: string; color: string }> = {
  photo: { icon: Camera, label: "Photo", color: "bg-laposte-blue" },
  flyer: { icon: FileText, label: "Flyer", color: "bg-status-signaled" },
  verification: { icon: CheckCircle2, label: "Vérification", color: "bg-status-action-required" },
};

interface ActionTicketSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: PendingAction) => void;
  filterType?: ActionType;
  title: string;
}

export function ActionTicketSelector({
  isOpen,
  onClose,
  onSelectAction,
  filterType,
  title,
}: ActionTicketSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filtrer les actions selon le type si spécifié
  let filteredActions = filterType
    ? pendingActions.filter((a) => a.type === filterType)
    : pendingActions;

  // Filtrer par recherche
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredActions = filteredActions.filter(
      (a) =>
        a.address.toLowerCase().includes(query) ||
        a.ticketRef.toLowerCase().includes(query) ||
        a.title.toLowerCase().includes(query)
    );
  }

  // Trier: en retard d'abord
  filteredActions = [...filteredActions].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return 0;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-t-2xl animate-slide-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une adresse, un ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-laposte-yellow"
            />
          </div>
        </div>

        {/* Actions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredActions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-status-resolved mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Aucune action à réaliser</p>
              <p className="text-sm text-muted-foreground mt-1">
                {filterType ? "Aucune action de ce type" : "Toutes les actions sont complétées"}
              </p>
            </div>
          ) : (
            filteredActions.map((action) => {
              const config = actionTypeConfig[action.type];
              const Icon = config.icon;

              return (
                <button
                  key={action.id}
                  onClick={() => onSelectAction(action)}
                  className={cn(
                    "w-full bg-background rounded-xl p-4 border text-left transition-all",
                    "hover:shadow-md hover:border-laposte-yellow",
                    action.isOverdue ? "border-destructive/30" : "border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {action.ticketRef}
                        </span>
                        {action.isOverdue && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            En retard
                          </span>
                        )}
                      </div>

                      <h4 className="font-medium text-foreground text-sm truncate">
                        {action.title}
                      </h4>

                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {action.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {action.address}
                        </span>
                        {action.deadline && (
                          <span className={cn(
                            "flex items-center gap-1 text-xs",
                            action.isOverdue ? "text-destructive" : "text-muted-foreground"
                          )}>
                            <Clock className="w-3 h-3" />
                            {action.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
