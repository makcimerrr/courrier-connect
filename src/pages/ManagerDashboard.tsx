import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MapPin,
  Filter,
  ChevronRight,
  Bell,
  Calendar,
  Target,
  Zap,
  FileText,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  ticketsToday: number;
  ticketsResolved: number;
  status: "online" | "offline" | "busy";
}

interface TicketSummary {
  id: string;
  reference: string;
  address: string;
  type: string;
  status: "signaled" | "in-progress" | "pending" | "action-required";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  assignee?: string;
  daysOpen: number;
}

// Mock Data
const ticketsByType = [
  { name: "Chien", count: 45, color: "#dc2626" },
  { name: "Trop basse", count: 32, color: "#f59e0b" },
  { name: "Trop loin", count: 28, color: "#8b5cf6" },
  { name: "Détériorée", count: 21, color: "#3b82f6" },
  { name: "Accès", count: 18, color: "#22c55e" },
];

const ticketsByZone = [
  { zone: "75001", tickets: 42, resolved: 35 },
  { zone: "75002", tickets: 38, resolved: 30 },
  { zone: "75003", tickets: 45, resolved: 40 },
  { zone: "75004", tickets: 30, resolved: 25 },
  { zone: "75008", tickets: 55, resolved: 42 },
  { zone: "75009", tickets: 48, resolved: 38 },
];

const weeklyTrend = [
  { day: "Lun", created: 12, resolved: 8 },
  { day: "Mar", created: 15, resolved: 12 },
  { day: "Mer", created: 8, resolved: 14 },
  { day: "Jeu", created: 18, resolved: 10 },
  { day: "Ven", created: 22, resolved: 16 },
  { day: "Sam", created: 5, resolved: 8 },
  { day: "Dim", created: 3, resolved: 5 },
];

const delayDistribution = [
  { range: "< 24h", count: 45 },
  { range: "1-3j", count: 32 },
  { range: "3-7j", count: 18 },
  { range: "7-14j", count: 12 },
  { range: "> 14j", count: 8 },
];

const teamMembers: TeamMember[] = [
  { id: "1", name: "Marie Dupont", role: "Factrice", ticketsToday: 5, ticketsResolved: 3, status: "online" },
  { id: "2", name: "Jean Martin", role: "Facteur", ticketsToday: 8, ticketsResolved: 6, status: "online" },
  { id: "3", name: "Sophie Bernard", role: "Factrice", ticketsToday: 4, ticketsResolved: 4, status: "busy" },
  { id: "4", name: "Pierre Moreau", role: "Facteur", ticketsToday: 6, ticketsResolved: 2, status: "online" },
  { id: "5", name: "Claire Petit", role: "Factrice", ticketsToday: 3, ticketsResolved: 3, status: "offline" },
];

const recentTickets: TicketSummary[] = [
  { id: "TK-2026-0089", reference: "BAL-75001-0089", address: "8 Place du Marché", type: "Chien agressif", status: "action-required", priority: "urgent", createdAt: "Il y a 2h", daysOpen: 0 },
  { id: "TK-2026-0088", reference: "BAL-75008-0156", address: "45 Avenue des Champs", type: "Boîte trop basse", status: "in-progress", priority: "medium", createdAt: "Il y a 4h", daysOpen: 1 },
  { id: "TK-2026-0087", reference: "BAL-75004-0234", address: "15 Rue de Rivoli", type: "Accès dangereux", status: "signaled", priority: "high", createdAt: "Il y a 6h", daysOpen: 0 },
  { id: "TK-2026-0086", reference: "BAL-75009-0312", address: "92 Avenue Montaigne", type: "Boîte détériorée", status: "pending", priority: "low", createdAt: "Hier", daysOpen: 3 },
  { id: "TK-2026-0085", reference: "BAL-75001-0178", address: "67 Rue Saint-Honoré", type: "Trop éloignée", status: "in-progress", priority: "medium", createdAt: "Hier", daysOpen: 5 },
];

const pendingActions = [
  { id: "1", type: "Vérification terrain", ticket: "TK-2026-0042", address: "12 Rue de la République", dueDate: "Aujourd'hui", overdue: false },
  { id: "2", type: "Appel propriétaire", ticket: "TK-2026-0038", address: "45 Avenue des Champs", dueDate: "Hier", overdue: true },
  { id: "3", type: "Dépôt flyer", ticket: "TK-2026-0051", address: "67 Rue Saint-Honoré", dueDate: "Demain", overdue: false },
  { id: "4", type: "Photo conformité", ticket: "TK-2026-0025", address: "8 Place du Marché", dueDate: "Il y a 3j", overdue: true },
];

// Components
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: typeof BarChart3;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs mt-1",
              changeType === "up" && "text-green-600",
              changeType === "down" && "text-red-600",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "up" && <TrendingUp className="w-3 h-3" />}
              {changeType === "down" && <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
          {member.name.split(" ").map(n => n[0]).join("")}
        </div>
        <span className={cn(
          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
          member.status === "online" && "bg-green-500",
          member.status === "offline" && "bg-gray-400",
          member.status === "busy" && "bg-amber-500"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.role}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-foreground">{member.ticketsResolved}/{member.ticketsToday}</p>
        <p className="text-[10px] text-muted-foreground">résolus</p>
      </div>
    </div>
  );
}

function TicketRow({ ticket, onClick }: { ticket: TicketSummary; onClick: () => void }) {
  const statusColors = {
    "signaled": "bg-status-signaled/15 text-status-signaled",
    "in-progress": "bg-status-in-progress/15 text-status-in-progress",
    "pending": "bg-status-pending/15 text-status-pending",
    "action-required": "bg-laposte-yellow/15 text-laposte-yellow-dark",
  };

  const priorityColors = {
    "low": "bg-gray-100 text-gray-600",
    "medium": "bg-blue-100 text-blue-600",
    "high": "bg-orange-100 text-orange-600",
    "urgent": "bg-red-100 text-red-600",
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold", priorityColors[ticket.priority])}>
            {ticket.priority === "urgent" ? "URGENT" : ticket.priority}
          </span>
        </div>
        <p className="font-medium text-sm text-foreground truncate">{ticket.type}</p>
        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {ticket.address}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold", statusColors[ticket.status])}>
          {ticket.status === "signaled" && "Signalé"}
          {ticket.status === "in-progress" && "En cours"}
          {ticket.status === "pending" && "En attente"}
          {ticket.status === "action-required" && "Action req."}
        </span>
        <p className="text-[10px] text-muted-foreground mt-1">{ticket.createdAt}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

function ActionItem({ action, onClick }: { action: typeof pendingActions[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
        action.overdue ? "bg-red-50 hover:bg-red-100" : "hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        action.overdue ? "bg-red-100" : "bg-laposte-yellow/20"
      )}>
        <Zap className={cn("w-5 h-5", action.overdue ? "text-red-600" : "text-laposte-yellow-dark")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{action.type}</p>
        <p className="text-xs text-muted-foreground truncate">{action.address}</p>
      </div>
      <div className="text-right">
        <p className={cn(
          "text-xs font-semibold",
          action.overdue ? "text-red-600" : "text-muted-foreground"
        )}>
          {action.dueDate}
        </p>
        {action.overdue && (
          <span className="text-[10px] text-red-600 font-semibold">EN RETARD</span>
        )}
      </div>
    </button>
  );
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("week");

  const totalTickets = 258;
  const resolvedToday = 23;
  const pendingCount = 45;
  const overdueCount = 8;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Tableau de bord</h1>
            <p className="text-xs text-secondary-foreground/70">Manager - Secteur Paris Centre</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-secondary-foreground">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-secondary-foreground">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Period selector */}
        <div className="px-4 pb-3 flex gap-2">
          {(["day", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                selectedPeriod === period
                  ? "bg-laposte-yellow text-primary-foreground"
                  : "bg-secondary-foreground/10 text-secondary-foreground/70 hover:bg-secondary-foreground/20"
              )}
            >
              {period === "day" && "Aujourd'hui"}
              {period === "week" && "Cette semaine"}
              {period === "month" && "Ce mois"}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Tickets actifs"
            value={totalTickets}
            change="+12% vs sem. dernière"
            changeType="up"
            icon={FileText}
            color="bg-laposte-blue"
          />
          <StatCard
            title="Résolus aujourd'hui"
            value={resolvedToday}
            change="+5 vs hier"
            changeType="up"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="En attente"
            value={pendingCount}
            change="-8% vs sem. dernière"
            changeType="down"
            icon={Clock}
            color="bg-amber-500"
          />
          <StatCard
            title="En retard"
            value={overdueCount}
            change="À traiter"
            changeType="neutral"
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Weekly Trend Chart */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Évolution hebdomadaire</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/manager/analytics")}>
              Détails
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="created" stroke="#f59e0b" fill="url(#colorCreated)" name="Créés" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#colorResolved)" name="Résolus" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Type - Pie Chart */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Répartition par type</h2>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="count"
                    paddingAngle={2}
                  >
                    {ticketsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {ticketsByType.map((type) => (
                <div key={type.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-muted-foreground">{type.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-foreground">Actions en attente</h2>
              {pendingActions.filter(a => a.overdue).length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                  {pendingActions.filter(a => a.overdue).length} en retard
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/actions")}>
              Tout voir
            </Button>
          </div>
          <div className="divide-y divide-border">
            {pendingActions.slice(0, 4).map((action) => (
              <ActionItem
                key={action.id}
                action={action}
                onClick={() => navigate(`/history/${action.ticket}`)}
              />
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Tickets récents</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/manager/tickets")}>
              Tout voir
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentTickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`/history/${ticket.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Mon équipe</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/manager/team")}>
              Gérer
            </Button>
          </div>
          <div className="divide-y divide-border">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Quick Stats by Zone */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Performance par zone</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/manager/zones")}>
              Carte
              <MapPin className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketsByZone} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="zone" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={45} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="tickets" fill="#1e3a5f" name="Total" radius={[0, 4, 4, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" name="Résolus" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Manager */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          <button
            onClick={() => navigate("/manager")}
            className="flex flex-col items-center gap-0.5 py-2 px-3 text-laposte-yellow"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/manager/tickets")}
            className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">Tickets</span>
          </button>
          <button
            onClick={() => navigate("/manager/map")}
            className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium">Carte</span>
          </button>
          <button
            onClick={() => navigate("/manager/team")}
            className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium">Équipe</span>
          </button>
          <button
            onClick={() => navigate("/manager/analytics")}
            className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground"
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
