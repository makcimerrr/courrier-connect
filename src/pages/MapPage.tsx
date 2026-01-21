import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { SmartDeclarationForm } from "@/components/declarations/SmartDeclarationForm";
import { AppHeader } from "@/components/layout/AppHeader";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { toast } from "sonner";

interface DeclarationState {
  mailboxId: string;
  address: string;
}

export default function MapPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [declarationState, setDeclarationState] = useState<DeclarationState | null>(null);

  // Gestion du bouton FAB via query param
  useEffect(() => {
    const declareParam = searchParams.get("declare");
    if (declareParam === "true") {
      // Ouvrir le formulaire de déclaration sans BAL spécifique (nouvelle déclaration)
      setDeclarationState({ mailboxId: "new", address: "" });
      // Nettoyer le param
      searchParams.delete("declare");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleDeclare = (mailboxId: string, address: string) => {
    setDeclarationState({ mailboxId, address });
  };

  const handleViewTicket = (ticketId: string) => {
    navigate(`/history/${ticketId}`);
  };

  const handleSubmitDeclaration = (data: { type: string; comment: string; photo?: string }) => {
    toast.success("Déclaration envoyée avec succès", {
      description: "Votre signalement a été enregistré et sera traité rapidement.",
    });
    setDeclarationState(null);
  };

  const handleNotificationClick = (notification: { ticketRef?: string }) => {
    if (notification.ticketRef) {
      navigate(`/history/${notification.ticketRef}`);
    }
  };

  // Formulaire de déclaration
  if (declarationState) {
    return (
      <MobileLayout>
        <SmartDeclarationForm
          mailboxId={declarationState.mailboxId}
          mailboxAddress={declarationState.address || undefined}
          onSubmit={handleSubmitDeclaration}
          onCancel={() => setDeclarationState(null)}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <AppHeader
          title="Carte des BAL"
          rightElement={<NotificationBell onNotificationClick={handleNotificationClick} />}
        />
        <div className="flex-1 relative">
          <InteractiveMap
            onDeclare={handleDeclare}
            onViewTicket={handleViewTicket}
          />
        </div>
      </div>
    </MobileLayout>
  );
}
