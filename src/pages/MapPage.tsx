import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { DeclarationForm } from "@/components/declarations/DeclarationForm";
import { AppHeader } from "@/components/layout/AppHeader";
import { toast } from "sonner";

// Mock mailbox data for declaration
const mockMailboxData: Record<string, { address: string }> = {
  "1": { address: "12 Rue de la République" },
  "2": { address: "45 Avenue des Champs" },
  "3": { address: "8 Place du Marché" },
  "4": { address: "23 Boulevard Haussmann" },
  "5": { address: "67 Rue Saint-Honoré" },
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

  if (declaringMailboxId) {
    const mailbox = mockMailboxData[declaringMailboxId];
    return (
      <MobileLayout>
        <DeclarationForm
          mailboxId={declaringMailboxId}
          mailboxAddress={mailbox?.address || "Adresse inconnue"}
          onSubmit={handleSubmitDeclaration}
          onCancel={() => setDeclaringMailboxId(null)}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <AppHeader title="Carte des BAL" />
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
