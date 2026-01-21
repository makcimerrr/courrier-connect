import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { SmartDeclarationForm } from "@/components/declarations/SmartDeclarationForm";
import { AppHeader } from "@/components/layout/AppHeader";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { toast } from "sonner";

// Données mock des adresses pour le formulaire de déclaration
const mockAddresses: Record<string, string> = {
  "1": "12 Rue de la République",
  "2": "45 Avenue des Champs",
  "3": "8 Place du Marché",
  "4": "23 Boulevard Haussmann",
  "5": "67 Rue Saint-Honoré",
  "6": "15 Rue de Rivoli",
  "7": "92 Avenue Montaigne",
};

export default function MapPage() {
  const navigate = useNavigate();
  const [declaringMailboxId, setDeclaringMailboxId] = useState<string | null>(null);

  const handleDeclare = (mailboxId: string) => {
    setDeclaringMailboxId(mailboxId);
  };

  const handleViewDetails = (mailboxId: string) => {
    navigate(`/history/${mailboxId}`);
  };

  const handleSubmitDeclaration = (data: { type: string; comment: string; photo?: string }) => {
    toast.success("Déclaration envoyée avec succès", {
      description: "Votre signalement a été enregistré et sera traité rapidement.",
    });
    setDeclaringMailboxId(null);
  };

  const handleNotificationClick = (notification: { ticketRef?: string }) => {
    if (notification.ticketRef) {
      navigate(`/history/${notification.ticketRef}`);
    }
  };

  // Formulaire de déclaration
  if (declaringMailboxId) {
    const address = mockAddresses[declaringMailboxId] || "Adresse inconnue";
    return (
      <MobileLayout>
        <SmartDeclarationForm
          mailboxId={declaringMailboxId}
          mailboxAddress={address}
          onSubmit={handleSubmitDeclaration}
          onCancel={() => setDeclaringMailboxId(null)}
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
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </MobileLayout>
  );
}
