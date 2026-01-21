import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConformityStats {
  totalMailboxes: number;
  conformMailboxes: number;
  signaledMailboxes: number;
  inProgressMailboxes: number;
  resolvedThisMonth: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

interface ConformityScoreCardProps {
  score: number; // 0-100
  stats: ConformityStats;
  sectorName?: string;
  className?: string;
}

// Cercle de progression animé
function CircularProgress({
  value,
  size = 140,
  strokeWidth = 10,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  // Animation au montage
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Couleur selon le score
  const getColor = (score: number) => {
    if (score >= 80) return "hsl(var(--status-resolved))";
    if (score >= 60) return "hsl(var(--laposte-yellow))";
    if (score >= 40) return "hsl(var(--status-signaled))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(animatedValue)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold transition-colors duration-500"
          style={{ color: getColor(animatedValue) }}
        >
          {Math.round(animatedValue)}
        </span>
        <span className="text-sm text-muted-foreground font-medium">%</span>
      </div>
    </div>
  );
}

// Stat item compact
function StatItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof CheckCircle;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
      </div>
    </div>
  );
}

export function ConformityScoreCard({
  score,
  stats,
  sectorName = "Mon secteur",
  className,
}: ConformityScoreCardProps) {
  const TrendIcon = stats.trend === "up" ? TrendingUp : stats.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    stats.trend === "up"
      ? "text-status-resolved"
      : stats.trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div className={cn("bg-card rounded-2xl p-5 shadow-sm border border-border", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{sectorName}</h3>
          <p className="text-xs text-muted-foreground">Score de conformité</p>
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>{stats.trendValue > 0 ? "+" : ""}{stats.trendValue}%</span>
        </div>
      </div>

      {/* Score circle */}
      <div className="flex justify-center mb-5">
        <CircularProgress value={score} size={140} strokeWidth={12} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatItem
          icon={CheckCircle}
          label="Conformes"
          value={stats.conformMailboxes}
          color="bg-status-resolved/15 text-status-resolved"
        />
        <StatItem
          icon={AlertTriangle}
          label="Signalées"
          value={stats.signaledMailboxes}
          color="bg-status-signaled/15 text-status-signaled"
        />
        <StatItem
          icon={Clock}
          label="En cours"
          value={stats.inProgressMailboxes}
          color="bg-status-in-progress/15 text-status-in-progress"
        />
      </div>

      {/* Progress bar for the month */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Résolutions ce mois</span>
          <span className="font-semibold text-foreground">{stats.resolvedThisMonth}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-status-resolved rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min((stats.resolvedThisMonth / (stats.signaledMailboxes + stats.resolvedThisMonth || 1)) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Version compacte pour le header ou les widgets
export function ConformityScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-status-resolved/15 text-status-resolved";
    if (score >= 60) return "bg-laposte-yellow/15 text-laposte-yellow-dark";
    if (score >= 40) return "bg-status-signaled/15 text-status-signaled";
    return "bg-destructive/15 text-destructive";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
        getColor(score),
        className
      )}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
        <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {score}%
    </div>
  );
}
