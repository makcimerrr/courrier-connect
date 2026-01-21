import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { TicketTimeline } from "@/components/timeline/TicketTimeline";
import { AppHeader } from "@/components/layout/AppHeader";
import type { TicketStatus } from "@/components/ui/StatusBadge";

// Mock ticket data - IDs unifiés au format TK-YYYY-NNNN
const mockTicketData: Record<string, {
  address: string;
  reference: string;
  problemType: string;
  status: TicketStatus;
  events: Array<{
    id: string;
    type: "declaration" | "email" | "response" | "call" | "letter" | "manager" | "resolved" | "photo" | "action";
    title: string;
    description?: string;
    date: string;
    time: string;
    imageUrl?: string;
  }>;
}> = {
  // Ticket 1 - Chien agressif (Signalé)
  "TK-2026-0042": {
    address: "12 Rue de la République",
    reference: "BAL-75001-0042",
    problemType: "Présence de chien",
    status: "signaled",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Chien agressif non attaché dans la propriété - Distribution impossible",
        date: "21/01/2026",
        time: "09:15",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e2",
        type: "action",
        title: "Action assignée",
        description: "Dépôt flyer de sensibilisation prévu",
        date: "21/01/2026",
        time: "10:00",
      },
    ],
  },
  // Ticket 2 - Boîte trop basse (En cours)
  "TK-2026-0038": {
    address: "45 Avenue des Champs",
    reference: "BAL-75008-0038",
    problemType: "Boîte trop basse",
    status: "in-progress",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Boîte installée à 40cm du sol - Non conforme",
        date: "18/01/2026",
        time: "14:30",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e2",
        type: "email",
        title: "Mail envoyé au propriétaire",
        description: "Demande de mise aux normes de la boîte aux lettres",
        date: "19/01/2026",
        time: "10:00",
      },
      {
        id: "e3",
        type: "response",
        title: "Réponse reçue",
        description: "Le propriétaire indique avoir rehaussé la boîte",
        date: "22/01/2026",
        time: "16:45",
      },
      {
        id: "e4",
        type: "action",
        title: "Action assignée",
        description: "Vérification terrain nécessaire - Reprendre photo",
        date: "22/01/2026",
        time: "17:00",
      },
    ],
  },
  // Ticket 3 - Chien attaché (En attente vérification)
  "TK-2026-0025": {
    address: "8 Place du Marché",
    reference: "BAL-75001-0025",
    problemType: "Présence de chien",
    status: "action-required",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Chien non attaché lors des distributions",
        date: "10/01/2026",
        time: "08:45",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e2",
        type: "email",
        title: "Mail envoyé au propriétaire",
        description: "Demande de mise en sécurité du chien",
        date: "11/01/2026",
        time: "09:00",
      },
      {
        id: "e3",
        type: "response",
        title: "Réponse reçue",
        description: "Le propriétaire confirme que le chien sera attaché",
        date: "12/01/2026",
        time: "14:30",
      },
      {
        id: "e4",
        type: "action",
        title: "Action assignée - EN RETARD",
        description: "Vérification terrain requise pour confirmer la mise en conformité",
        date: "15/01/2026",
        time: "09:00",
      },
    ],
  },
  // Ticket 4 - Accès dangereux (En cours)
  "TK-2026-0051": {
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0051",
    problemType: "Accès dangereux",
    status: "in-progress",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Escaliers glissants signalés - Risque de chute",
        date: "20/01/2026",
        time: "10:20",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e2",
        type: "email",
        title: "Mail envoyé au propriétaire",
        description: "Rappel des obligations de sécurité d'accès",
        date: "21/01/2026",
        time: "09:00",
      },
      {
        id: "e3",
        type: "action",
        title: "Action assignée",
        description: "Dépôt flyer rappelant les obligations de sécurité",
        date: "21/01/2026",
        time: "10:00",
      },
    ],
  },
  // Ticket 5 - Boîte réparée (Résolu)
  "TK-2026-0019": {
    address: "23 Boulevard Haussmann",
    reference: "BAL-75009-0019",
    problemType: "Boîte détériorée",
    status: "resolved",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Boîte aux lettres cassée - Serrure défectueuse",
        date: "08/01/2026",
        time: "08:45",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e2",
        type: "email",
        title: "Mail envoyé au propriétaire",
        description: "Demande de réparation urgente",
        date: "08/01/2026",
        time: "14:00",
      },
      {
        id: "e3",
        type: "call",
        title: "Appel téléphonique effectué",
        description: "Discussion avec le propriétaire - Accord pour réparation",
        date: "09/01/2026",
        time: "11:30",
      },
      {
        id: "e4",
        type: "manager",
        title: "Validation manager",
        description: "Validation de la solution proposée par le propriétaire",
        date: "10/01/2026",
        time: "09:00",
      },
      {
        id: "e5",
        type: "photo",
        title: "Photo de vérification",
        description: "Photo prise confirmant la réparation",
        date: "15/01/2026",
        time: "10:30",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e6",
        type: "resolved",
        title: "Problème résolu",
        description: "Boîte remplacée par le propriétaire - Conforme",
        date: "15/01/2026",
        time: "15:00",
      },
    ],
  },
  // Ticket 6 - Boîte trop éloignée (En attente)
  "TK-2026-0056": {
    address: "15 Rue de Rivoli",
    reference: "BAL-75004-0056",
    problemType: "Boîte trop éloignée",
    status: "pending",
    events: [
      {
        id: "e1",
        type: "declaration",
        title: "Déclaration créée",
        description: "Boîte aux lettres située à plus de 100m de la voie publique",
        date: "10/01/2026",
        time: "11:00",
        imageUrl: "/placeholder.svg",
      },
      {
        id: "e2",
        type: "letter",
        title: "Courrier envoyé",
        description: "Mise en demeure de rapprochement de la boîte",
        date: "12/01/2026",
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
                      {ticket.status === "action-required" && "Action requise"}
                      {ticket.status === "pending" && "En attente"}
                      {ticket.status === "resolved" && "Résolu"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Réf: {id}</p>
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
