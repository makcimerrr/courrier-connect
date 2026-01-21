import { useEffect } from "react";
import { useMap, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import { cn } from "@/lib/utils";
import type { MapMailbox } from "./LeafletMap";

interface TourRouteProps {
  mailboxes: MapMailbox[];
  visible: boolean;
  currentIndex?: number; // Index de la boîte actuelle dans la tournée
}

// Composant pour dessiner l'itinéraire sur la carte
export function TourRoute({ mailboxes, visible, currentIndex = 0 }: TourRouteProps) {
  const map = useMap();

  // Trier les boîtes par ordre de tournée (simulé ici par proximité)
  const tourMailboxes = mailboxes
    .filter((m) => m.inTour)
    .sort((a, b) => {
      // Simuler un ordre de tournée basé sur la longitude
      return a.position.lng - b.position.lng;
    });

  // Créer les positions pour la polyline
  const positions = tourMailboxes.map((m) => [m.position.lat, m.position.lng] as [number, number]);

  // Centrer la carte sur la tournée
  useEffect(() => {
    if (visible && positions.length > 0) {
      const bounds = positions.map((p) => ({ lat: p[0], lng: p[1] }));
      map.fitBounds(bounds.map((b) => [b.lat, b.lng] as [number, number]), {
        padding: [50, 50],
      });
    }
  }, [visible, positions, map]);

  if (!visible || positions.length < 2) return null;

  return (
    <>
      {/* Ligne de l'itinéraire */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: "hsl(220, 60%, 25%)", // Bleu La Poste
          weight: 4,
          opacity: 0.7,
          dashArray: "10, 10",
        }}
      />

      {/* Numéros d'ordre sur chaque point */}
      {tourMailboxes.map((mailbox, index) => {
        const isVisited = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <CircleMarker
            key={`tour-marker-${mailbox.id}`}
            center={[mailbox.position.lat, mailbox.position.lng]}
            radius={isCurrent ? 16 : 12}
            pathOptions={{
              fillColor: isVisited
                ? "hsl(145, 60%, 45%)" // Vert - visité
                : isCurrent
                ? "hsl(48, 100%, 50%)" // Jaune - actuel
                : "hsl(220, 60%, 25%)", // Bleu - à venir
              fillOpacity: 0.9,
              color: "white",
              weight: 2,
            }}
          >
            <Tooltip permanent direction="center" className="tour-number-tooltip">
              <span
                className={cn(
                  "font-bold text-white",
                  isCurrent && "text-primary-foreground"
                )}
                style={{ fontSize: isCurrent ? "14px" : "12px" }}
              >
                {index + 1}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

// Panel latéral avec la liste de la tournée
interface TourPanelProps {
  mailboxes: MapMailbox[];
  currentIndex: number;
  onSelectMailbox: (mailbox: MapMailbox) => void;
  onMarkVisited: (mailboxId: string) => void;
  className?: string;
}

export function TourPanel({
  mailboxes,
  currentIndex,
  onSelectMailbox,
  onMarkVisited,
  className,
}: TourPanelProps) {
  const tourMailboxes = mailboxes
    .filter((m) => m.inTour)
    .sort((a, b) => a.position.lng - b.position.lng);

  const visitedCount = currentIndex;
  const totalCount = tourMailboxes.length;
  const progressPercent = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  return (
    <div className={cn("bg-card rounded-xl shadow-lg border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Ma tournée</h3>
          <span className="text-sm text-muted-foreground">
            {visitedCount}/{totalCount} visités
          </span>
        </div>

        {/* Barre de progression */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-status-resolved rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Liste des boîtes */}
      <div className="max-h-64 overflow-y-auto">
        {tourMailboxes.map((mailbox, index) => {
          const isVisited = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <button
              key={mailbox.id}
              onClick={() => onSelectMailbox(mailbox)}
              className={cn(
                "w-full flex items-center gap-3 p-3 text-left",
                "border-b border-border last:border-b-0",
                "transition-colors hover:bg-muted/50",
                isCurrent && "bg-laposte-yellow/10"
              )}
            >
              {/* Numéro */}
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                  isVisited && "bg-status-resolved text-white",
                  isCurrent && "bg-laposte-yellow text-primary-foreground",
                  !isVisited && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isVisited ? "✓" : index + 1}
              </span>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    isVisited ? "text-muted-foreground line-through" : "text-foreground"
                  )}
                >
                  {mailbox.address}
                </p>
                <p className="text-xs text-muted-foreground">{mailbox.reference}</p>
              </div>

              {/* Indicateur de problème */}
              {mailbox.problemCount > 0 && !isVisited && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-status-signaled text-white text-[10px] font-bold flex items-center justify-center">
                  {mailbox.problemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-border bg-muted/30">
        {currentIndex < tourMailboxes.length && (
          <button
            onClick={() => onMarkVisited(tourMailboxes[currentIndex].id)}
            className={cn(
              "w-full py-2.5 px-4 rounded-lg font-medium text-sm",
              "bg-laposte-yellow text-primary-foreground",
              "hover:bg-laposte-yellow-dark transition-colors"
            )}
          >
            Marquer "{tourMailboxes[currentIndex]?.address?.slice(0, 20)}..." comme visité
          </button>
        )}
        {currentIndex >= tourMailboxes.length && (
          <div className="text-center py-2">
            <span className="text-status-resolved font-medium text-sm">
              ✓ Tournée terminée !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Badge compact pour afficher le progrès de la tournée
export function TourProgressBadge({
  current,
  total,
  className,
}: {
  current: number;
  total: number;
  className?: string;
}) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-secondary text-secondary-foreground text-xs font-medium",
        className
      )}
    >
      <span className="font-bold">{current}/{total}</span>
      <div className="w-12 h-1.5 bg-secondary-foreground/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-laposte-yellow rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span>{percent}%</span>
    </div>
  );
}
