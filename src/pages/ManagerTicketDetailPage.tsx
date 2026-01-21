import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Phone,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Camera,
  ClipboardCheck,
  UserPlus,
  MessageSquare,
  XCircle,
  Send,
  MoreVertical,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  zone?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  daysOpen?: number;
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
const priorities: ("low" | "medium" | "high" | "urgent")[] = ["low", "medium", "high", "urgent"];
const zones = ["75001", "75002", "75003", "75004", "75008", "75009", "75016"];
const assignees = ["Marie Dupont", "Jean Martin", "Sophie Bernard", "Pierre Moreau", "Claire Petit"];

// Génère un ticket de manière déterministe basé sur l'ID
function generateTicketFromId(ticketId: string): TicketData | null {
  const match = ticketId.match(/TK-\d{4}-(\d+)/);
  if (!match) return null;

  const ticketNum = parseInt(match[1], 10);
  const seed = ticketNum;

  const random = (max: number) => ((seed * 9301 + 49297) % 233280) % max;

  const addressIndex = random(addresses.length);
  const problemIndex = random(problemTypes.length);
  const statusIndex = random(statuses.length);
  const zone = zones[random(zones.length)];
  const priority = priorities[random(priorities.length)];
  const assignee = random(10) > 3 ? assignees[random(assignees.length)] : undefined;

  const problem = problemTypes[problemIndex];
  const status = statuses[statusIndex];
  const daysAgo = random(20) + 1;

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
    zone,
    assignee,
    priority,
    daysOpen: status === "resolved" ? 0 : daysAgo,
  };
}

// Mock ticket data avec quelques tickets spécifiques
const specificTickets: Record<string, TicketData> = {
  "TK-2026-0042": {
    address: "12 Rue de la République",
    reference: "BAL-75001-0042",
    problemType: "Présence de chien",
    status: "signaled",
    zone: "75001",
    assignee: "Marie Dupont",
    priority: "high",
    daysOpen: 2,
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
    zone: "75008",
    assignee: "Jean Martin",
    priority: "medium",
    daysOpen: 5,
    events: [
      { id: "e1", type: "declaration", title: "Déclaration créée", description: "Boîte installée à 40cm du sol - Non conforme", date: "18/01/2026", time: "14:30", imageUrl: "/placeholder.svg" },
      { id: "e2", type: "email", title: "Mail envoyé au propriétaire", description: "Demande de mise aux normes de la boîte aux lettres", date: "19/01/2026", time: "10:00" },
      { id: "e3", type: "response", title: "Réponse reçue", description: "Le propriétaire indique avoir rehaussé la boîte", date: "22/01/2026", time: "16:45" },
      { id: "e4", type: "action", title: "Action assignée", description: "Vérification terrain nécessaire - Reprendre photo", date: "22/01/2026", time: "17:00" },
    ],
  },
};

function getTicketData(ticketId: string): TicketData | null {
  if (specificTickets[ticketId]) {
    return specificTickets[ticketId];
  }
  return generateTicketFromId(ticketId);
}

const eventIcons: Record<string, typeof Mail> = {
  declaration: AlertCircle,
  email: Mail,
  response: Mail,
  call: Phone,
  letter: FileText,
  manager: User,
  resolved: CheckCircle,
  photo: Camera,
  action: ClipboardCheck,
};

const eventColors: Record<string, string> = {
  declaration: "bg-status-signaled text-white",
  email: "bg-laposte-blue text-white",
  response: "bg-status-in-progress text-white",
  call: "bg-laposte-blue text-white",
  letter: "bg-laposte-blue text-white",
  manager: "bg-status-pending text-white",
  resolved: "bg-status-resolved text-white",
  photo: "bg-laposte-yellow text-laposte-blue",
  action: "bg-status-action-required text-white",
};

const priorityConfig = {
  low: { label: "Basse", class: "bg-gray-100 text-gray-600" },
  medium: { label: "Moyenne", class: "bg-blue-100 text-blue-600" },
  high: { label: "Haute", class: "bg-orange-100 text-orange-600" },
  urgent: { label: "URGENT", class: "bg-red-100 text-red-600 font-bold" },
};

// Action Modal Component
function ActionModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <XCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ManagerTicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [noteText, setNoteText] = useState("");

  const ticket = useMemo(() => {
    if (!ticketId) return null;
    return getTicketData(ticketId);
  }, [ticketId]);

  if (!ticketId || !ticket) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Ce ticket n'existe pas.</p>
        <Button onClick={() => navigate("/manager/tickets")}>
          Retour aux tickets
        </Button>
      </div>
    );
  }

  const handleAssign = (assigneeName: string) => {
    toast.success(`Ticket assigné à ${assigneeName}`);
    setShowAssignModal(false);
  };

  const handleCreateAction = (actionType: string) => {
    toast.success(`Action "${actionType}" créée`);
    setShowActionModal(false);
  };

  const handleChangeStatus = (newStatus: string) => {
    toast.success(`Statut changé en "${newStatus}"`);
    setShowStatusModal(false);
  };

  const handleContact = (method: string) => {
    toast.success(`Contact par ${method} initié`);
    setShowContactModal(false);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      toast.success("Note ajoutée au ticket");
      setNoteText("");
    }
  };

  const isOverdue = (ticket.daysOpen || 0) > 7 && ticket.status !== "resolved";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-secondary text-secondary-foreground">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="font-semibold text-sm">{ticketId}</h1>
                <p className="text-xs text-secondary-foreground/70">Gestion du ticket</p>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
              {showMoreActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
                  <button
                    onClick={() => {
                      toast.success("Ticket exporté en PDF");
                      setShowMoreActions(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted"
                  >
                    Exporter en PDF
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Ticket dupliqué");
                      setShowMoreActions(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted"
                  >
                    Dupliquer le ticket
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Ticket archivé");
                      setShowMoreActions(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted text-red-600"
                  >
                    Archiver le ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Ticket Info Card */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="font-semibold text-foreground text-lg mb-1">{ticket.problemType}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={ticket.status} />
              {ticket.priority && (
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", priorityConfig[ticket.priority].class)}>
                  {priorityConfig[ticket.priority].label}
                </span>
              )}
              {isOverdue && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  En retard
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{ticket.address}</span>
            {ticket.zone && <span className="text-muted-foreground/60">• {ticket.zone}</span>}
          </p>
          <p className="text-xs text-muted-foreground">Réf. {ticket.reference}</p>
          {ticket.assignee && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Assigné à <span className="font-medium text-foreground">{ticket.assignee}</span></span>
            </p>
          )}
          {ticket.daysOpen !== undefined && ticket.status !== "resolved" && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                Ouvert depuis {ticket.daysOpen} jour{ticket.daysOpen > 1 ? "s" : ""}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border-b border-border p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Actions rapides</p>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <UserPlus className="w-5 h-5 text-laposte-blue" />
            <span className="text-[10px] font-medium text-center">Assigner</span>
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-status-resolved" />
            <span className="text-[10px] font-medium text-center">Statut</span>
          </button>
          <button
            onClick={() => setShowActionModal(true)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <ClipboardCheck className="w-5 h-5 text-status-action-required" />
            <span className="text-[10px] font-medium text-center">Action</span>
          </button>
          <button
            onClick={() => setShowContactModal(true)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Send className="w-5 h-5 text-laposte-yellow" />
            <span className="text-[10px] font-medium text-center">Contacter</span>
          </button>
        </div>
      </div>

      {/* Add Note Section */}
      <div className="bg-card border-b border-border p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Ajouter une note</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Écrire une note interne..."
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted border-none focus:outline-none focus:ring-2 focus:ring-laposte-yellow"
          />
          <Button
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            className="bg-laposte-yellow hover:bg-laposte-yellow-dark text-primary-foreground"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
          Historique ({ticket.events.length} événements)
        </p>
        <div className="space-y-0">
          {ticket.events.map((event) => {
            const Icon = eventIcons[event.type] || AlertCircle;
            const colorClass = eventColors[event.type] || "bg-muted text-foreground";

            return (
              <div key={event.id} className="timeline-item">
                <div className={cn("timeline-dot", colorClass)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">{event.title}</span>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  {event.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border">
                      <img src={event.imageUrl} alt="Photo jointe" className="w-full h-32 object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom padding for safe area */}
      <div className="h-24" />

      {/* Assign Modal */}
      <ActionModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assigner le ticket"
      >
        <div className="space-y-2">
          {assignees.map((name) => (
            <button
              key={name}
              onClick={() => handleAssign(name)}
              className={cn(
                "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors",
                ticket.assignee === name ? "bg-laposte-yellow/20 border-2 border-laposte-yellow" : "bg-muted hover:bg-muted/80"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">Facteur</p>
              </div>
              {ticket.assignee === name && (
                <CheckCircle className="w-5 h-5 text-laposte-yellow ml-auto" />
              )}
            </button>
          ))}
        </div>
      </ActionModal>

      {/* Status Modal */}
      <ActionModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Changer le statut"
      >
        <div className="space-y-2">
          {[
            { id: "signaled", label: "Signalé", color: "bg-status-signaled" },
            { id: "in-progress", label: "En cours", color: "bg-status-in-progress" },
            { id: "pending", label: "En attente", color: "bg-status-pending" },
            { id: "action-required", label: "Action requise", color: "bg-status-action-required" },
            { id: "resolved", label: "Résolu", color: "bg-status-resolved" },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => handleChangeStatus(status.label)}
              className={cn(
                "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors",
                ticket.status === status.id ? "bg-laposte-yellow/20 border-2 border-laposte-yellow" : "bg-muted hover:bg-muted/80"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full", status.color)} />
              <span className="font-medium text-sm">{status.label}</span>
              {ticket.status === status.id && (
                <CheckCircle className="w-5 h-5 text-laposte-yellow ml-auto" />
              )}
            </button>
          ))}
        </div>
      </ActionModal>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Créer une action"
      >
        <div className="space-y-2">
          {[
            { id: "flyer", label: "Dépôt de flyer", icon: FileText },
            { id: "photo", label: "Prendre une photo", icon: Camera },
            { id: "verification", label: "Vérification terrain", icon: ClipboardCheck },
            { id: "call", label: "Appel téléphonique", icon: Phone },
          ].map((action) => (
            <button
              key={action.id}
              onClick={() => handleCreateAction(action.label)}
              className="w-full p-3 rounded-lg text-left flex items-center gap-3 bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-laposte-yellow/20 flex items-center justify-center">
                <action.icon className="w-5 h-5 text-laposte-yellow" />
              </div>
              <span className="font-medium text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </ActionModal>

      {/* Contact Modal */}
      <ActionModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contacter le propriétaire"
      >
        <div className="space-y-2">
          {[
            { id: "email", label: "Envoyer un email", icon: Mail, desc: "Notification standard" },
            { id: "letter", label: "Envoyer un courrier", icon: FileText, desc: "Mise en demeure officielle" },
            { id: "call", label: "Appeler", icon: Phone, desc: "Contact téléphonique direct" },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => handleContact(method.label)}
              className="w-full p-3 rounded-lg text-left flex items-center gap-3 bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-laposte-blue/20 flex items-center justify-center">
                <method.icon className="w-5 h-5 text-laposte-blue" />
              </div>
              <div>
                <p className="font-medium text-sm">{method.label}</p>
                <p className="text-xs text-muted-foreground">{method.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </ActionModal>
    </div>
  );
}
