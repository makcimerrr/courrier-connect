import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ConformityScore } from "@/components/dashboard/ConformityScore";
import { SecurityChecklist } from "@/components/dashboard/SecurityChecklist";
import { Button } from "@/components/ui/button";
import { Map, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [checklistCompleted, setChecklistCompleted] = useState(false);

  const handleNotificationClick = (notification: { ticketRef?: string }) => {
    if (notification.ticketRef) {
      navigate(`/history/${notification.ticketRef}`);
    }
  };

  const handleChecklistComplete = () => {
    setChecklistCompleted(true);
    toast.success("Checklist validée", {
      description: "Bonne tournée !",
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <AppHeader 
          title="Tableau de bord" 
          rightElement={<NotificationBell onNotificationClick={handleNotificationClick} />}
        />
        
        <div className="flex-1 overflow-auto p-4 space-y-4 pb-24">
          {/* Welcome Message */}
          <div className="bg-secondary text-secondary-foreground rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-1">Bonjour, Jean-Pierre 👋</h2>
            <p className="text-sm opacity-80">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/map")}
              className="h-auto py-4 flex flex-col items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Map className="w-6 h-6" />
              <span className="font-semibold">Ouvrir la carte</span>
            </Button>
            <Button
              onClick={() => navigate("/actions")}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 border-2"
            >
              <AlertTriangle className="w-6 h-6 text-status-signaled" />
              <span className="font-semibold">Mes actions (3)</span>
            </Button>
          </div>

          {/* Security Checklist */}
          <SecurityChecklist onComplete={handleChecklistComplete} />

          {/* Conformity Score */}
          <ConformityScore
            score={78}
            trend="up"
            totalMailboxes={142}
            conformMailboxes={111}
            issuesCount={5}
          />

          {/* Recent Alerts */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-signaled" />
                Alertes récentes
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/declarations")}
                className="text-xs text-primary"
              >
                Voir tout
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {[
                { address: "12 Rue de la République", issue: "Chien agressif", urgent: true },
                { address: "45 Avenue des Champs", issue: "Boîte détériorée", urgent: false },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    alert.urgent ? "bg-destructive/10" : "bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.issue}</p>
                    <p className="text-xs text-muted-foreground">{alert.address}</p>
                  </div>
                  {alert.urgent && (
                    <span className="px-2 py-0.5 bg-destructive text-white text-[10px] font-bold rounded-full uppercase">
                      Urgent
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-card rounded-xl p-3 text-center border border-border">
              <span className="text-2xl font-bold text-foreground">12</span>
              <p className="text-xs text-muted-foreground mt-1">Déclarations ce mois</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center border border-border">
              <span className="text-2xl font-bold text-status-resolved">8</span>
              <p className="text-xs text-muted-foreground mt-1">Résolues</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center border border-border">
              <span className="text-2xl font-bold text-status-in-progress">4</span>
              <p className="text-xs text-muted-foreground mt-1">En cours</p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;