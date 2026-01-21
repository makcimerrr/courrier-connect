import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { ActionCard, type Action, type ActionStatus } from "@/components/actions/ActionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

// Mock data for actions
const mockActions: Action[] = [
  {
    id: "1",
    type: "flyer",
    title: "Déposer flyer de sensibilisation",
    description: "Boîte trop basse signalée - Informer le propriétaire des normes d'accessibilité",
    address: "12 Rue de la République",
    deadline: "23/01/2026",
    status: "pending",
    ticketRef: "TK-2026-0042",
  },
  {
    id: "2",
    type: "photo",
    title: "Reprendre photo après correction",
    description: "Le propriétaire a indiqué avoir rehaussé la boîte - Vérification terrain nécessaire",
    address: "45 Avenue des Champs",
    deadline: "25/01/2026",
    status: "pending",
    ticketRef: "TK-2026-0038",
  },
  {
    id: "3",
    type: "verification",
    title: "Vérifier mise en conformité",
    description: "Chien attaché suite à notre signalement - Confirmer que l'accès est sécurisé",
    address: "8 Place du Marché",
    status: "overdue",
    deadline: "18/01/2026",
    ticketRef: "TK-2026-0025",
  },
  {
    id: "4",
    type: "flyer",
    title: "Déposer flyer - Accès dangereux",
    description: "Escaliers glissants signalés - Rappel des obligations de sécurité",
    address: "67 Rue Saint-Honoré",
    deadline: "28/01/2026",
    status: "in_progress",
    ticketRef: "TK-2026-0051",
  },
  {
    id: "5",
    type: "photo",
    title: "Photo boîte réparée",
    description: "Boîte détériorée remplacée par le propriétaire",
    address: "23 Boulevard Haussmann",
    status: "completed",
    ticketRef: "TK-2026-0019",
  },
];

export default function ActionsPage() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const pendingActions = actions.filter(a => a.status !== "completed");
  const completedActions = actions.filter(a => a.status === "completed");
  const overdueCount = actions.filter(a => a.status === "overdue").length;

  const handleComplete = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: "completed" as ActionStatus }
        : action
    ));
    toast.success("Action validée", {
      description: "Votre confirmation a été enregistrée",
    });
  };

  const handleViewDetails = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      navigate(`/history/${action.ticketRef}`);
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <AppHeader title="Mes Actions" />
        
        <div className="flex-1 overflow-auto">
          {/* Stats Summary */}
          <div className="bg-secondary text-secondary-foreground px-4 py-3">
            <div className="flex items-center justify-around">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-xl font-bold">{pendingActions.length}</span>
                  <span className="text-xs ml-1 opacity-80">à faire</span>
                </div>
              </div>
              {overdueCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div>
                    <span className="text-xl font-bold">{overdueCount}</span>
                    <span className="text-xs ml-1 opacity-80">en retard</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-status-resolved" />
                <div>
                  <span className="text-xl font-bold">{completedActions.length}</span>
                  <span className="text-xs ml-1 opacity-80">terminées</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "completed")} className="flex-1">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="pending" className="flex-1">
                  À réaliser ({pendingActions.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  Terminées ({completedActions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="p-4 space-y-3 pb-24">
              {pendingActions.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-status-resolved mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune action en attente</p>
                  <p className="text-sm text-muted-foreground mt-1">Bravo, vous êtes à jour !</p>
                </div>
              ) : (
                pendingActions
                  .sort((a, b) => {
                    // Overdue first
                    if (a.status === "overdue" && b.status !== "overdue") return -1;
                    if (b.status === "overdue" && a.status !== "overdue") return 1;
                    return 0;
                  })
                  .map(action => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      onComplete={handleComplete}
                      onViewDetails={handleViewDetails}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="p-4 space-y-3 pb-24">
              {completedActions.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune action terminée</p>
                </div>
              ) : (
                completedActions.map(action => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
}
