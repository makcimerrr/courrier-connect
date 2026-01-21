import { useState, useEffect } from "react";
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  isOnline: boolean;
  pendingSync: number;
  lastOnlineAt: Date | null;
  onSyncClick?: () => void;
  className?: string;
}

export function OfflineIndicator({
  isOnline,
  pendingSync,
  lastOnlineAt,
  onSyncClick,
  className,
}: OfflineIndicatorProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  // Afficher le banner quand l'état change
  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
      setJustReconnected(false);
    } else if (showBanner) {
      // Vient de se reconnecter
      setJustReconnected(true);
      setIsAnimating(true);

      // Masquer après quelques secondes si en ligne et pas de sync en attente
      const timer = setTimeout(() => {
        if (pendingSync === 0) {
          setShowBanner(false);
        }
        setJustReconnected(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSync, showBanner]);

  // Afficher si hors ligne ou si des éléments sont en attente
  useEffect(() => {
    if (pendingSync > 0) {
      setShowBanner(true);
    }
  }, [pendingSync]);

  // Format de la dernière connexion
  const formatLastOnline = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return date.toLocaleDateString("fr-FR");
  };

  if (!showBanner && pendingSync === 0) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[2000]",
        "transition-all duration-300 ease-out",
        showBanner ? "translate-y-0" : "-translate-y-full",
        className
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0)" }}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-3",
          "text-sm font-medium shadow-lg",
          "transition-colors duration-300",
          !isOnline && "bg-destructive text-white",
          isOnline && pendingSync > 0 && "bg-status-signaled text-white",
          isOnline && pendingSync === 0 && justReconnected && "bg-status-resolved text-white"
        )}
      >
        {/* Icône et message */}
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Hors ligne</span>
              {lastOnlineAt && (
                <span className="text-white/70 text-xs">
                  • Dernière sync: {formatLastOnline(lastOnlineAt)}
                </span>
              )}
            </>
          ) : pendingSync > 0 ? (
            <>
              <Cloud className="w-4 h-4" />
              <span>{pendingSync} élément{pendingSync > 1 ? "s" : ""} en attente</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Connexion rétablie</span>
            </>
          )}
        </div>

        {/* Bouton de sync */}
        {isOnline && pendingSync > 0 && (
          <button
            onClick={() => {
              setIsAnimating(true);
              onSyncClick?.();
              setTimeout(() => setIsAnimating(false), 1000);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full",
              "bg-white/20 hover:bg-white/30 transition-colors",
              "text-xs font-semibold"
            )}
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isAnimating && "animate-spin")}
            />
            Synchroniser
          </button>
        )}

        {/* Bouton fermer si en ligne et pas de sync */}
        {isOnline && pendingSync === 0 && (
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/70 hover:text-white text-xs"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}

// Version compacte pour le header
export function OfflineBadge({
  isOnline,
  pendingSync,
  className,
}: {
  isOnline: boolean;
  pendingSync: number;
  className?: string;
}) {
  if (isOnline && pendingSync === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        !isOnline && "bg-destructive/15 text-destructive",
        isOnline && pendingSync > 0 && "bg-status-signaled/15 text-status-signaled",
        className
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Hors ligne</span>
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3" />
          <span>{pendingSync}</span>
        </>
      )}
    </div>
  );
}

// Indicateur minimal pour la carte
export function OfflineDot({
  isOnline,
  className,
}: {
  isOnline: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "w-2.5 h-2.5 rounded-full",
        isOnline ? "bg-status-resolved" : "bg-destructive animate-pulse",
        className
      )}
      title={isOnline ? "En ligne" : "Hors ligne"}
    />
  );
}
