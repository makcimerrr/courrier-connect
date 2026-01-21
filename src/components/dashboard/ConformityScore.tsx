import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConformityScoreProps {
  score: number; // 0-100
  trend: "up" | "down" | "stable";
  totalMailboxes: number;
  conformMailboxes: number;
  issuesCount: number;
}

export function ConformityScore({
  score,
  trend,
  totalMailboxes,
  conformMailboxes,
  issuesCount,
}: ConformityScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return "text-status-resolved";
    if (score >= 60) return "text-status-signaled";
    return "text-destructive";
  };

  const getScoreBgColor = () => {
    if (score >= 80) return "bg-status-resolved/10";
    if (score >= 60) return "bg-status-signaled/10";
    return "bg-destructive/10";
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Score de Conformité</h3>
        </div>
        <button className="p-1 rounded-full hover:bg-muted">
          <Info className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Main Score */}
      <div className="flex items-center gap-4 mb-4">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center",
          getScoreBgColor()
        )}>
          <span className={cn("text-3xl font-bold", getScoreColor())}>
            {score}%
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground">Tournée du jour</span>
            {TrendIcon && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs",
                trend === "up" ? "text-status-resolved" : "text-destructive"
              )}>
                <TrendIcon className="w-3 h-3" />
                <span>{trend === "up" ? "+2%" : "-2%"}</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                score >= 80 ? "bg-status-resolved" :
                score >= 60 ? "bg-status-signaled" : "bg-destructive"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <span className="text-lg font-bold text-foreground">{totalMailboxes}</span>
          <p className="text-xs text-muted-foreground">BAL total</p>
        </div>
        <div className="bg-status-resolved/10 rounded-lg p-3 text-center">
          <span className="text-lg font-bold text-status-resolved">{conformMailboxes}</span>
          <p className="text-xs text-muted-foreground">Conformes</p>
        </div>
        <div className={cn(
          "rounded-lg p-3 text-center",
          issuesCount > 0 ? "bg-destructive/10" : "bg-muted/50"
        )}>
          <div className="flex items-center justify-center gap-1">
            {issuesCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
            <span className={cn(
              "text-lg font-bold",
              issuesCount > 0 ? "text-destructive" : "text-foreground"
            )}>
              {issuesCount}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Problèmes</p>
        </div>
      </div>
    </div>
  );
}
