import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { TicketTimeline } from "@/components/timeline/TicketTimeline";
import { AppHeader } from "@/components/layout/AppHeader";
import type { TicketStatus } from "@/components/ui/StatusBadge";

type EventType = "declaration" | "email" | "response" | "call" | "letter" | "manager" | "resolved" | "photo" | "action";

interface TicketEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  date: string;
  time: string;
  imageUrl?: string;
}

interface TicketData {
  address: string;
  reference: string;
  problemType: string;
  status: TicketStatus;
  events: TicketEvent[];
}

// Données de base pour la génération dynamique
const addresses = [
  "12 Rue de la République", "45 Avenue des Champs", "8 Place du Marché",
  "23 Boulevard Haussmann", "67 Rue Saint-Honoré", "15 Rue de Rivoli",
  "92 Avenue Montaigne", "3 Place de la Concorde", "28 Rue du Faubourg",
  "55 Rue de Passy", "18 Avenue Victor Hugo", "7 Rue de Rome",
  "34 Boulevard Saint-Germain", "11 Rue de Sèvres", "89 Avenue Kléber",
];

const problemTypes = [
  { type: "Présence de chien", description: "Chien agressif non attaché dans la propriété" },
  { type: "Boîte trop basse", description: "Boîte installée à 40cm du sol - Non conforme" },
  { type: "Boîte trop éloignée", description: "Boîte aux lettres située à plus de 100m de la voie publique" },
  { type: "Accès dangereux", description: "Escaliers glissants signalés - Risque de chute" },
  { type: "Boîte détériorée", description: "Boîte aux lettres cassée - Serrure défectueuse" },
];

const statuses: TicketStatus[] = ["signaled", "in-progress", "pending", "resolved"];

// Génère un ticket de manière déterministe basé sur l'ID
function generateTicketFromId(ticketId: string): TicketData | null {
  // Extraire le numéro du ticket
  const match = ticketId.match(/TK-\d{4}-(\d+)/);
  if (!match) return null;

  const ticketNum = parseInt(match[1], 10);
  const seed = ticketNum;

  // Générateur pseudo-aléatoire simple basé sur le seed
  const random = (max: number) => ((seed * 9301 + 49297) % 233280) % max;

  const addressIndex = random(addresses.length);
  const problemIndex = random(problemTypes.length);
  const statusIndex = random(statuses.length);
  const zone = `750${String(random(20)).padStart(2, "0")}`;

  const problem = problemTypes[problemIndex];
  const status = statuses[statusIndex];
  const daysAgo = random(20) + 1;

  // Générer les événements basés sur le statut
  const events: TicketEvent[] = [
    {
      id: "e1",
      type: "declaration",
      title: "Déclaration créée",
      description: problem.description,
      date: `${21 - daysAgo}/01/2026`,
      time: `${8 + random(4)}:${random(60).toString().padStart(2, "0")}`,
      imageUrl: "/placeholder.svg",
    },
  ];

  if (status !== "signaled") {
    events.push({
      id: "e2",
      type: "email",
      title: "Mail envoyé au propriétaire",
      description: "Demande de mise en conformité de l'installation",
      date: `${22 - daysAgo}/01/2026`,
      time: "10:00",
    });
  }

  if (status === "in-progress" || status === "resolved") {
    events.push({
      id: "e3",
      type: "response",
      title: "Réponse reçue",
      description: "Le propriétaire s'engage à effectuer les modifications",
      date: `${23 - daysAgo}/01/2026`,
      time: "14:30",
    });

    events.push({
      id: "e4",
      type: "action",
      title: "Action assignée",
      description: "Vérification terrain prévue",
      date: `${24 - daysAgo}/01/2026`,
      time: "09:00",
    });
  }

  if (status === "resolved") {
    events.push({
      id: "e5",
      type: "photo",
      title: "Photo de vérification",
      description: "Photo prise confirmant la mise en conformité",
      date: `${25 - daysAgo}/01/2026`,
      time: "10:30",
      imageUrl: "/placeholder.svg",
    });

    events.push({
      id: "e6",
      type: "resolved",
      title: "Problème résolu",
      description: "Installation conforme aux normes",
      date: `${26 - daysAgo}/01/2026`,
      time: "15:00",
    });
  }

  if (status === "pending") {
    events.push({
      id: "e2",
      type: "letter",
      title: "Courrier envoyé",
      description: "Mise en demeure envoyée au propriétaire",
      date: `${22 - daysAgo}/01/2026`,
      time: "09:00",
    });
  }

  return {
    address: addresses[addressIndex],
    reference: `BAL-${zone}-${String(ticketNum).padStart(4, "0")}`,
    problemType: problem.type,
    status,
    events,
  };
}

// Mock ticket data avec quelques tickets spécifiques
const specificTickets: Record<string, TicketData> = {
  "TK-2026-0042": {
    address: "12 Rue de la République",
    reference: "BAL-75001-0042",
    problemType: "Présence de chien",
    status: "signaled",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Chien agressif non attaché dans la propriété - Distribution impossible", date: "21/01/2026", time: "09:15", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "action", title: "Action assignée", description: "Dépôt flyer de sensibilisation prévu", date: "21/01/2026", time: "10:00" },
    ],
  },
  "TK-2026-0038": {
    address: "45 Avenue des Champs",
    reference: "BAL-75008-0038",
    problemType: "Boîte trop basse",
    status: "in-progress",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Boîte installée à 40cm du sol - Non conforme", date: "18/01/2026", time: "14:30", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "email", title: "Mail envoyé au propriétaire", description: "Demande de mise aux normes de la boîte aux lettres", date: "19/01/2026", time: "10:00" },
      { id: "e3", type: "response", title: "Réponse reçue", description: "Le propriétaire indique avoir rehaussé la boîte", date: "22/01/2026", time: "16:45" },
      { id: "e4", type: "action", title: "Action assignée", description: "Vérification terrain nécessaire - Reprendre photo", date: "22/01/2026", time: "17:00" },
    ],
  },
  "TK-2026-0089": {
    address: "8 Place du Marché",
    reference: "BAL-75001-0089",
    problemType: "Chien agressif",
    status: "signaled",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Chien non attaché - Morsure évitée de justesse", date: "21/01/2026", time: "08:30", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "action", title: "Action urgente assignée", description: "Contact immédiat du propriétaire requis", date: "21/01/2026", time: "09:00" },
    ],
  },
  "TK-2026-0088": {
    address: "45 Avenue des Champs",
    reference: "BAL-75008-0156",
    problemType: "Boîte trop basse",
    status: "in-progress",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Hauteur mesurée: 35cm - Non conforme (minimum 100cm)", date: "21/01/2026", time: "10:15", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "email", title: "Mail envoyé", description: "Notification de non-conformité envoyée", date: "21/01/2026", time: "14:00" },
      { id: "e3", type: "response", title: "Réponse propriétaire", description: "Travaux prévus la semaine prochaine", date: "22/01/2026", time: "11:30" },
    ],
  },
  "TK-2026-0087": {
    address: "15 Rue de Rivoli",
    reference: "BAL-75004-0234",
    problemType: "Accès dangereux",
    status: "signaled",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Marches cassées à l'entrée - Risque de chute", date: "21/01/2026", time: "07:45", imageUrl: "/placeholder.svg" },
    ],
  },
  "TK-2026-0086": {
    address: "92 Avenue Montaigne",
    reference: "BAL-75009-0312",
    problemType: "Boîte détériorée",
    status: "pending",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Porte de boîte arrachée - Courrier exposé", date: "18/01/2026", time: "09:20", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "letter", title: "Courrier envoyé", description: "Mise en demeure de réparation sous 15 jours", date: "19/01/2026", time: "09:00" },
    ],
  },
  "TK-2026-0085": {
    address: "67 Rue Saint-Honoré",
    reference: "BAL-75001-0178",
    problemType: "Trop éloignée",
    status: "in-progress",
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Distance mesurée: 150m de la voie publique", date: "16/01/2026", time: "11:00", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "email", title: "Mail envoyé", description: "Rappel de la réglementation sur la distance maximale", date: "17/01/2026", time: "10:00" },
      { id: "e3", type: "call", title: "Appel effectué", description: "Discussion avec le propriétaire sur les solutions possibles", date: "19/01/2026", time: "14:30" },
    ],
  },
};

// Fonction pour obtenir un ticket (spécifique ou généré)
function getTicketData(ticketId: string): TicketData | null {
  // D'abord chercher dans les tickets spécifiques
  if (specificTickets[ticketId]) {
    return specificTickets[ticketId];
  }
  // Sinon générer dynamiquement
  return generateTicketFromId(ticketId);
}

// Obtenir tous les tickets pour la liste
function getAllTickets(): Record<string, TicketData> {
  return specificTickets;
}

export default function HistoryPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  // Memoize ticket data
  const ticket = useMemo(() => {
    if (!ticketId) return null;
    return getTicketData(ticketId);
  }, [ticketId]);

  const allTickets = useMemo(() => getAllTickets(), []);

  // If no ticketId, show list of recent tickets
  if (!ticketId) {
    return (
      <MobileLayout>
        <div className="flex flex-col h-full">
          <AppHeader title="Suivi des tickets" />
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {Object.entries(allTickets).map(([id, ticketData]) => (
                <button
                  key={id}
                  onClick={() => navigate(`/history/${id}`)}
                  className="mailbox-card w-full text-left"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{ticketData.problemType}</span>
                    <span className={`status-badge status-${ticketData.status}`}>
                      {ticketData.status === "signaled" && "Signalé"}
                      {ticketData.status === "in-progress" && "En cours"}
                      {ticketData.status === "action-required" && "Action requise"}
                      {ticketData.status === "pending" && "En attente"}
                      {ticketData.status === "resolved" && "Résolu"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Réf: {id}</p>
                  <p className="text-sm text-muted-foreground">{ticketData.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticketData.events.length} étape{ticketData.events.length > 1 ? "s" : ""}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Ticket non trouvé
  if (!ticket) {
    return (
      <MobileLayout>
        <div className="flex flex-col h-full">
          <AppHeader title="Ticket non trouvé" />
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <p className="text-muted-foreground mb-4">Ce ticket n'existe pas.</p>
            <button
              onClick={() => navigate("/history")}
              className="text-sm text-primary font-medium"
            >
              Retour à la liste
            </button>
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
        onBack={() => navigate(-1)}
      />
    </MobileLayout>
  );
}
