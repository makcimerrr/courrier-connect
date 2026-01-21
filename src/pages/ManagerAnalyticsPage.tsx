import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  FileText,
  MapPin,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock Data
const monthlyTrend = [
  { month: "Août", created: 145, resolved: 132, rate: 91 },
  { month: "Sept", created: 168, resolved: 155, rate: 92 },
  { month: "Oct", created: 189, resolved: 170, rate: 90 },
  { month: "Nov", created: 156, resolved: 148, rate: 95 },
  { month: "Déc", created: 134, resolved: 128, rate: 96 },
  { month: "Jan", created: 178, resolved: 156, rate: 88 },
];

const ticketsByType = [
  { name: "Chien agressif", count: 245, percentage: 28, color: "#dc2626", trend: "+12%" },
  { name: "Boîte trop basse", count: 189, percentage: 22, color: "#f59e0b", trend: "-5%" },
  { name: "Boîte trop loin", count: 156, percentage: 18, color: "#8b5cf6", trend: "+3%" },
  { name: "Accès dangereux", count: 134, percentage: 15, color: "#3b82f6", trend: "+8%" },
  { name: "Boîte détériorée", count: 148, percentage: 17, color: "#22c55e", trend: "-2%" },
];

const delayDistribution = [
  { range: "< 24h", count: 312, percentage: 36 },
  { range: "1-3 jours", count: 245, percentage: 28 },
  { range: "3-7 jours", count: 156, percentage: 18 },
  { range: "7-14 jours", count: 98, percentage: 11 },
  { range: "> 14 jours", count: 61, percentage: 7 },
];

const zonePerformance = [
  { zone: "75001", tickets: 145, resolved: 132, avgDelay: 2.3, score: 91 },
  { zone: "75002", tickets: 98, resolved: 92, avgDelay: 1.8, score: 94 },
  { zone: "75003", tickets: 112, resolved: 98, avgDelay: 3.1, score: 87 },
  { zone: "75004", tickets: 87, resolved: 82, avgDelay: 2.0, score: 94 },
  { zone: "75008", tickets: 167, resolved: 145, avgDelay: 2.8, score: 87 },
  { zone: "75009", tickets: 134, resolved: 118, avgDelay: 3.5, score: 88 },
  { zone: "75016", tickets: 129, resolved: 121, avgDelay: 1.9, score: 94 },
];

const teamPerformance = [
  { name: "Marie D.", resolved: 89, avgDelay: 1.8, satisfaction: 96 },
  { name: "Jean M.", resolved: 76, avgDelay: 2.1, satisfaction: 94 },
  { name: "Sophie B.", resolved: 82, avgDelay: 1.5, satisfaction: 98 },
  { name: "Pierre M.", resolved: 71, avgDelay: 2.4, satisfaction: 92 },
  { name: "Claire P.", resolved: 68, avgDelay: 2.0, satisfaction: 95 },
];

const radarData = [
  { subject: "Réactivité", A: 92, fullMark: 100 },
  { subject: "Résolution", A: 88, fullMark: 100 },
  { subject: "Satisfaction", A: 95, fullMark: 100 },
  { subject: "Couverture", A: 85, fullMark: 100 },
  { subject: "Qualité", A: 90, fullMark: 100 },
];

const hourlyDistribution = [
  { hour: "6h", count: 12 },
  { hour: "7h", count: 28 },
  { hour: "8h", count: 45 },
  { hour: "9h", count: 67 },
  { hour: "10h", count: 78 },
  { hour: "11h", count: 82 },
  { hour: "12h", count: 45 },
  { hour: "13h", count: 38 },
  { hour: "14h", count: 72 },
  { hour: "15h", count: 68 },
  { hour: "16h", count: 54 },
  { hour: "17h", count: 32 },
  { hour: "18h", count: 18 },
];

type TimePeriod = "week" | "month" | "quarter" | "year";

export default function ManagerAnalyticsPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>("month");

  const kpis = {
    totalTickets: 872,
    resolvedTickets: 788,
    resolutionRate: 90.4,
    avgResolutionTime: 2.3,
    overdueTickets: 61,
    satisfaction: 94.5,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">Statistiques & Analytics</h1>
          <p className="text-xs text-secondary-foreground/70">Secteur Paris Centre</p>
        </div>

        {/* Period selector */}
        <div className="px-4 pb-3 flex gap-2">
          {([
            { id: "week", label: "Semaine" },
            { id: "month", label: "Mois" },
            { id: "quarter", label: "Trimestre" },
            { id: "year", label: "Année" },
          ] as const).map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                period === p.id
                  ? "bg-laposte-yellow text-primary-foreground"
                  : "bg-secondary-foreground/10 text-secondary-foreground/70 hover:bg-secondary-foreground/20"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Total tickets</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.totalTickets}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +8% vs période préc.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Taux résolution</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.resolutionRate}%</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +2.1% vs période préc.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Délai moyen</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.avgResolutionTime}j</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              -0.4j vs période préc.
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">En retard</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{kpis.overdueTickets}</p>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12 vs période préc.
            </p>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Évolution mensuelle</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
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
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="created" stroke="#f59e0b" fill="url(#colorCreated)" name="Créés" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#colorResolved)" name="Résolus" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Type */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Répartition par type de problème</h2>
          <div className="flex gap-4">
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
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
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }} />
                    <span className="text-muted-foreground text-xs truncate">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-xs">{type.count}</span>
                    <span className={cn(
                      "text-[10px]",
                      type.trend.startsWith("+") ? "text-red-500" : "text-green-500"
                    )}>
                      {type.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delay Distribution */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Distribution des délais de résolution</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="range" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#1e3a5f" radius={[0, 4, 4, 0]} name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Distribution horaire des signalements</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#facc15" radius={[4, 4, 0, 0]} name="Signalements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Performance */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Performance par zone</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Zone</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">Tickets</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">Résolus</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">Délai moy.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">Score</th>
                </tr>
              </thead>
              <tbody>
                {zonePerformance.map((zone) => (
                  <tr key={zone.zone} className="border-b border-border last:border-0">
                    <td className="py-2 font-medium text-foreground">{zone.zone}</td>
                    <td className="py-2 text-right text-muted-foreground">{zone.tickets}</td>
                    <td className="py-2 text-right text-muted-foreground">{zone.resolved}</td>
                    <td className="py-2 text-right text-muted-foreground">{zone.avgDelay}j</td>
                    <td className="py-2 text-right">
                      <span className={cn(
                        "font-semibold",
                        zone.score >= 90 ? "text-green-600" : zone.score >= 85 ? "text-amber-600" : "text-red-600"
                      )}>
                        {zone.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Performance équipe</h2>
          <div className="space-y-3">
            {teamPerformance.map((member, index) => (
              <div key={member.name} className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                  index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-700" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{member.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{member.resolved} résolus</span>
                    <span>•</span>
                    <span>{member.avgDelay}j moy.</span>
                    <span>•</span>
                    <span className="text-green-600">{member.satisfaction}% satisf.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart - Global Performance */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground mb-4">Performance globale</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#facc15"
                  fill="#facc15"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          <button onClick={() => navigate("/manager")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button onClick={() => navigate("/manager/tickets")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">Tickets</span>
          </button>
          <button onClick={() => navigate("/manager/map")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium">Carte</span>
          </button>
          <button onClick={() => navigate("/manager/team")} className="flex flex-col items-center gap-0.5 py-2 px-3 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium">Équipe</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-2 px-3 text-laposte-yellow">
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
