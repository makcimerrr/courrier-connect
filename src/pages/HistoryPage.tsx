import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { TicketTimeline } from "@/components/timeline/TicketTimeline";
import { AppHeader } from "@/components/layout/AppHeader";
import type { TicketStatus } from "@/components/ui/StatusBadge";

// Mock ticket data
const mockTicketData: Record<string, {
  address: string;
  reference: string;
  problemType: string;
  status: TicketStatus;
  events: Array<{
    id: string;
    type: "declaration" | "email" | "response" | "call" | "letter" | "manager" | "resolved";
    title: string;
    description?: string;
    date: string;
    time: string;
  }>;
}> = {
  "1": {
    address: "45 Avenue des Champs",
    reference: "BAL-75001-0156",
    problemType: "Présence de chien",
    status: "signaled",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Chien agressif non attaché dans la propriété",
        date: "21/01/2025",
        time: "09:15",
      },
    ],
  },
  "2": {
    address: "8 Place du Marché",
    reference: "BAL-75001-0089",
    problemType: "Accès dangereux",
    status: "in-progress",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Escalier glissant et mal éclairé",
        date: "18/01/2025",
        time: "14:30",
      },
      {
        id: "e2",
        type: "email",
        title: "Mail envoyé au propriétaire",
        description: "Demande de mise aux normes de l'accès",
        date: "19/01/2025",
        time: "10:00",
      },
      {
        id: "e3",
        type: "response",
        title: "Réponse reçue",
        description: "Le propriétaire confirme les travaux sous 2 semaines",
        date: "20/01/2025",
        time: "16:45",
      },
    ],
  },
  "3": {
    address: "23 Boulevard Haussmann",
    reference: "BAL-75001-0201",
    problemType: "Boîte trop basse",
    status: "resolved",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Boîte installée à 40cm du sol",
        date: "15/01/2025",
        time: "08:45",
      },
      {
        id: "e2",
        type: "email",
        title: "Mail envoyé au propriétaire",
        date: "15/01/2025",
        time: "14:00",
      },
      {
        id: "e3",
        type: "call",
        title: "Appel téléphonique effectué",
        description: "Discussion avec le propriétaire",
        date: "16/01/2025",
        time: "11:30",
      },
      {
        id: "e4",
        type: "manager",
        title: "Action manager",
        description: "Validation de la solution proposée",
        date: "17/01/2025",
        time: "09:00",
      },
      {
        id: "e5",
        type: "resolved",
        title: "Problème résolu",
        description: "Boîte rehaussée à la hauteur réglementaire",
        date: "20/01/2025",
        time: "15:00",
      },
    ],
  },
  "4": {
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0178",
    problemType: "Autre problème technique",
    status: "pending",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Serrure de boîte défectueuse",
        date: "12/01/2025",
        time: "10:20",
      },
      {
        id: "e2",
        type: "letter",
        title: "Courrier envoyé",
        description: "Mise en demeure de réparation",
        date: "14/01/2025",
        time: "09:00",
      },
    ],
  },
};

export default function HistoryPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  // If no ticketId, show list of recent tickets
  if (!ticketId) {
    return (
      <MobileLayout>
        <div className="flex flex-col h-full">
          <AppHeader title="Suivi des tickets" />
          <div className="flex-1 p-4">
            <div className="space-y-3">
              {Object.entries(mockTicketData).map(([id, ticket]) => (
                <button
                  key={id}
                  onClick={() => navigate(`/history/${id}`)}
                  className="mailbox-card w-full text-left"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{ticket.problemType}</span>
                    <span className={`status-badge status-${ticket.status}`}>
                      {ticket.status === "signaled" && "Signalé"}
                      {ticket.status === "in-progress" && "En cours"}
                      {ticket.status === "pending" && "En attente"}
                      {ticket.status === "resolved" && "Résolu"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ticket.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticket.events.length} étape{ticket.events.length > 1 ? "s" : ""}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const ticket = mockTicketData[ticketId];

  if (!ticket) {
    return (
      <MobileLayout>
        <div className="flex flex-col h-full">
          <AppHeader title="Ticket non trouvé" />
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-muted-foreground">Ce ticket n'existe pas.</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <TicketTimeline
        ticketId={ticketId}
        address={ticket.address}
        reference={ticket.reference}
        problemType={ticket.problemType}
        status={ticket.status}
        events={ticket.events}
        onBack={() => navigate("/history")}
      />
    </MobileLayout>
  );
}
