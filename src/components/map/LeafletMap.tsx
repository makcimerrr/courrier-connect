import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Shield, Route, AlertTriangle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/components/ui/StatusBadge";
import type { ProblemType } from "./MapPin";

// Types
export interface MapMailbox {
  id: string;
  address: string;
  reference: string;
  lastInspection: string;
  problemCount: number;
  status: TicketStatus | "normal" | "action-required";
  problemType?: ProblemType;
  position: { lat: number; lng: number };
  urgent?: boolean;
  inTour?: boolean;
}

interface LeafletMapProps {
  mailboxes: MapMailbox[];
  onMailboxSelect: (mailbox: MapMailbox | null) => void;
  selectedMailboxId?: string | null;
  className?: string;
}

// Couleurs selon le statut
const statusColors: Record<string, string> = {
  normal: "#1e3a5f", // laposte-blue
  signaled: "#f59e0b", // orange
  "in-progress": "#3b82f6", // blue
  pending: "#8b5cf6", // purple
  resolved: "#22c55e", // green
  "action-required": "#facc15", // yellow
};

// Icônes SVG pour les pins
const getPinSvg = (
  status: string,
  problemType?: ProblemType,
  problemCount?: number,
  urgent?: boolean
) => {
  const color = statusColors[status] || statusColors.normal;
  const hasRing = status !== "normal" && status !== "resolved";
  const showBadge = (problemCount && problemCount > 0) || status === "action-required";

  // Icône selon le type de problème
  let iconPath = "";
  switch (problemType) {
    case "dog":
      iconPath = `<path d="M10 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1c0 .5-.4 1-.9 1.1l-1.1.2v1.2c0 .3-.1.6-.2.8l-.9 1.4c-.2.3-.6.3-.8.1-.3-.2-.3-.6-.1-.8l.8-1.2v-1.1l-1.4-.3c-.5-.1-.9-.4-1.2-.8l-.5-.7c-.4-.5-.3-1.2.2-1.6.5-.4 1.2-.3 1.6.2l.5.7c.1.1.2.2.3.2l1 .2.5-1.5c.1-.4.5-.7.9-.6.4.1.7.5.6.9l-.6 2 .8.2c.5.1.9.5.9 1.1v.3z" fill="white"/>`;
      break;
    case "too-low":
      iconPath = `<path d="M10 6v8m0 0l-3-3m3 3l3-3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
      break;
    case "too-far":
      iconPath = `<path d="M6 10h8m0 0l-3-3m3 3l-3 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
      break;
    case "dangerous-access":
      iconPath = `<path d="M10 7v3m0 3h.01M10 17a7 7 0 100-14 7 7 0 000 14z" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>`;
      break;
    case "damaged":
      iconPath = `<path d="M14.7 6.3a1 1 0 00-1.4 0l-1.8 1.8-1.8-1.8a1 1 0 00-1.4 1.4l1.8 1.8-1.8 1.8a1 1 0 101.4 1.4l1.8-1.8 1.8 1.8a1 1 0 001.4-1.4l-1.8-1.8 1.8-1.8a1 1 0 000-1.4z" fill="white"/>`;
      break;
    default:
      // Icône boîte aux lettres
      iconPath = `<rect x="6" y="7" width="8" height="6" rx="1" stroke="white" stroke-width="1.5" fill="none"/><path d="M6 9h8" stroke="white" stroke-width="1.5"/>`;
  }

  const ringAnimation = hasRing
    ? `<circle cx="10" cy="10" r="14" fill="${color}" opacity="0.3">
        <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
       </circle>`
    : "";

  const urgentRing = urgent
    ? `<circle cx="10" cy="10" r="14" fill="#ef4444" opacity="0.4">
        <animate attributeName="r" values="14;20;14" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0;0.4" dur="1s" repeatCount="indefinite"/>
       </circle>`
    : "";

  const badge = showBadge
    ? `<circle cx="16" cy="4" r="6" fill="#ef4444" stroke="white" stroke-width="1.5"/>
       <text x="16" y="7" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${status === "action-required" ? "!" : problemCount}</text>`
    : "";

  return `
    <svg width="40" height="48" viewBox="-10 -10 40 48" xmlns="http://www.w3.org/2000/svg">
      ${urgentRing}
      ${ringAnimation}
      <circle cx="10" cy="10" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      <g transform="translate(0, 0)">${iconPath}</g>
      <path d="M10 22 L6 28 L14 28 Z" fill="${color}"/>
      ${badge}
    </svg>
  `;
};

// Créer une icône Leaflet personnalisée
const createCustomIcon = (mailbox: MapMailbox, isSelected: boolean) => {
  const svg = getPinSvg(
    mailbox.status,
    mailbox.problemType,
    mailbox.problemCount,
    mailbox.urgent
  );

  const size = isSelected ? 48 : 40;
  const anchor = isSelected ? 24 : 20;

  return L.divIcon({
    html: `<div class="${isSelected ? "scale-125" : ""} transition-transform duration-200" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">${svg}</div>`,
    className: "custom-map-pin",
    iconSize: [size, size + 8],
    iconAnchor: [anchor / 2, size + 8],
    popupAnchor: [0, -size],
  });
};

// Composant pour centrer la carte sur la position de l'utilisateur
function LocationButton({ onLocate }: { onLocate: () => void }) {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onLocate}
      className="bg-card shadow-lg hover:bg-card/90 text-foreground h-10 w-10"
    >
      <Locate className="w-5 h-5" />
    </Button>
  );
}

// Composant pour gérer les événements de la carte
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

// Filtres disponibles
type FilterMode = "all" | "tour" | "security" | "urgent";

const filterChips: { id: FilterMode; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "Tous" },
  { id: "tour", label: "Ma tournée", icon: <Route className="w-3.5 h-3.5" /> },
  { id: "security", label: "Sécurité", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "urgent", label: "Urgents", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

export function LeafletMap({
  mailboxes,
  onMailboxSelect,
  selectedMailboxId,
  className,
}: LeafletMapProps) {
  const [activeFilter, setActiveFilter] = useState<FilterMode>("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const [mapZoom, setMapZoom] = useState(15);
  const mapRef = useRef<L.Map | null>(null);

  // Filtrage des boîtes selon le mode actif
  const filteredMailboxes = mailboxes.filter((mailbox) => {
    switch (activeFilter) {
      case "tour":
        return mailbox.inTour;
      case "security":
        return mailbox.problemType === "dog" || mailbox.problemType === "dangerous-access";
      case "urgent":
        return mailbox.urgent || mailbox.status === "action-required";
      default:
        return true;
    }
  });

  // Compteurs pour les badges de filtre
  const urgentCount = mailboxes.filter(
    (m) => m.urgent || m.status === "action-required"
  ).length;
  const securityCount = mailboxes.filter(
    (m) => m.problemType === "dog" || m.problemType === "dangerous-access"
  ).length;

  // Géolocalisation
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(17);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  };

  // Icône pour la position utilisateur
  const userLocationIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        <div class="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping"></div>
      </div>
    `,
    className: "user-location-marker",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* Filter Chips */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              "transition-all duration-200 shadow-md",
              activeFilter === chip.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-card text-foreground hover:bg-card/90"
            )}
          >
            {chip.icon}
            {chip.label}
            {chip.id === "urgent" && urgentCount > 0 && (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {urgentCount}
              </span>
            )}
            {chip.id === "security" && securityCount > 0 && (
              <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-status-signaled text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {securityCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Contrôle de zoom personnalisé */}
        <ZoomControl position="topright" />

        {/* Marqueurs des boîtes aux lettres avec clustering */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            const markers = cluster.getAllChildMarkers();

            // Déterminer la couleur du cluster selon le statut le plus critique
            let hasUrgent = false;
            let hasSignaled = false;
            let hasInProgress = false;

            markers.forEach((marker: L.Marker) => {
              const mailbox = filteredMailboxes.find(
                (m) =>
                  m.position.lat === marker.getLatLng().lat &&
                  m.position.lng === marker.getLatLng().lng
              );
              if (mailbox?.urgent || mailbox?.status === "action-required") hasUrgent = true;
              else if (mailbox?.status === "signaled") hasSignaled = true;
              else if (mailbox?.status === "in-progress") hasInProgress = true;
            });

            let bgColor = "#1e3a5f"; // bleu par défaut
            if (hasUrgent) bgColor = "#ef4444";
            else if (hasSignaled) bgColor = "#f59e0b";
            else if (hasInProgress) bgColor = "#3b82f6";

            return L.divIcon({
              html: `
                <div class="cluster-marker" style="
                  width: 40px;
                  height: 40px;
                  background: ${bgColor};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                ">
                  ${count}
                </div>
              `,
              className: "custom-cluster-icon",
              iconSize: L.point(40, 40),
            });
          }}
        >
          {filteredMailboxes.map((mailbox) => (
            <Marker
              key={mailbox.id}
              position={[mailbox.position.lat, mailbox.position.lng]}
              icon={createCustomIcon(mailbox, selectedMailboxId === mailbox.id)}
              eventHandlers={{
                click: () => {
                  onMailboxSelect(
                    selectedMailboxId === mailbox.id ? null : mailbox
                  );
                },
              }}
            />
          ))}
        </MarkerClusterGroup>

        {/* Marqueur de position utilisateur */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon} />
        )}
      </MapContainer>

      {/* Contrôles de carte */}
      <div className="absolute left-4 top-16 z-[1000] flex flex-col gap-2">
        <LocationButton onLocate={handleLocate} />
        <Button
          variant="secondary"
          size="icon"
          className="bg-card shadow-lg hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Légende */}
      <div
        className={cn(
          "absolute left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border",
          "transition-all duration-300",
          selectedMailboxId ? "bottom-48" : "bottom-4"
        )}
      >
        <p className="text-xs font-semibold text-foreground mb-2">Légende</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-laposte-blue shadow-sm" />
            <span className="text-xs text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-status-signaled shadow-sm relative">
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
            </div>
            <span className="text-xs text-muted-foreground">Signalé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-status-in-progress shadow-sm" />
            <span className="text-xs text-muted-foreground">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-laposte-yellow shadow-sm" />
            <span className="text-xs text-muted-foreground">Action requise</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-status-resolved shadow-sm" />
            <span className="text-xs text-muted-foreground">Résolu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
