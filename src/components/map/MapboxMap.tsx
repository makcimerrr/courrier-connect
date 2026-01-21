import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Locate, Plus, Minus, Layers, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/components/ui/StatusBadge";
import type { ProblemType } from "./MapPin";

// Token Mapbox public (à remplacer par votre propre token en production)
mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

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
  isBuilding?: boolean;
  buildingName?: string;
  totalMailboxes?: number;
}

interface MapboxMapProps {
  mailboxes: MapMailbox[];
  onMailboxSelect: (mailbox: MapMailbox | null) => void;
  selectedMailboxId?: string;
  showHeatmap?: boolean;
  className?: string;
}

// Convertir le statut en couleur
const getStatusColor = (status: string, urgent?: boolean): string => {
  if (urgent) return "#dc2626"; // red-600
  switch (status) {
    case "signaled": return "#f59e0b"; // amber-500
    case "in-progress": return "#3b82f6"; // blue-500
    case "pending": return "#8b5cf6"; // violet-500
    case "resolved": return "#22c55e"; // green-500
    case "action-required": return "#facc15"; // yellow-400
    default: return "#1e3a5f"; // laposte blue
  }
};

export function MapboxMap({
  mailboxes,
  onMailboxSelect,
  selectedMailboxId,
  showHeatmap = false,
  className,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [2.3522, 48.8566], // Paris
      zoom: 13,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.current.on("load", () => {
      setMapLoaded(true);

      // Ajouter source pour le clustering
      map.current!.addSource("mailboxes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Layer pour les clusters
      map.current!.addLayer({
        id: "clusters",
        type: "circle",
        source: "mailboxes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#1e3a5f", // < 10
            10, "#f59e0b", // 10-30
            30, "#dc2626", // > 30
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            10, 30,
            30, 40,
          ],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Layer pour le texte des clusters
      map.current!.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "mailboxes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 14,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Ajouter source et layer pour la heatmap
      map.current!.addSource("heatmap-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current!.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap-source",
        maxzoom: 15,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0, 0, 255, 0)",
            0.2, "rgb(0, 255, 0)",
            0.4, "rgb(255, 255, 0)",
            0.6, "rgb(255, 128, 0)",
            1, "rgb(255, 0, 0)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 20],
          "heatmap-opacity": 0.6,
        },
        layout: {
          visibility: "none",
        },
      });

      // Click sur cluster pour zoomer
      map.current!.on("click", "clusters", (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties!.cluster_id;
        (map.current!.getSource("mailboxes") as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            map.current!.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom!,
            });
          }
        );
      });

      // Curseur pointer sur clusters
      map.current!.on("mouseenter", "clusters", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current!.on("mouseleave", "clusters", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Mettre à jour les markers et données
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Supprimer les anciens markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Préparer les features GeoJSON pour le clustering
    const features: GeoJSON.Feature[] = mailboxes.map((mailbox) => ({
      type: "Feature",
      properties: {
        id: mailbox.id,
        status: mailbox.status,
        urgent: mailbox.urgent,
        problemCount: mailbox.problemCount,
        isBuilding: mailbox.isBuilding,
      },
      geometry: {
        type: "Point",
        coordinates: [mailbox.position.lng, mailbox.position.lat],
      },
    }));

    // Mettre à jour la source de données
    const source = map.current.getSource("mailboxes") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features,
      });
    }

    // Créer des markers personnalisés pour les points non-clustérisés
    mailboxes.forEach((mailbox) => {
      const el = document.createElement("div");
      el.className = "mapbox-custom-marker";

      const color = getStatusColor(mailbox.status, mailbox.urgent);
      const isSelected = selectedMailboxId === mailbox.id;

      if (mailbox.isBuilding) {
        el.innerHTML = `
          <div class="relative flex items-center justify-center w-12 h-12 rounded-xl shadow-lg cursor-pointer transition-transform ${isSelected ? 'scale-110 ring-2 ring-yellow-400' : ''}" style="background-color: ${color}">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-xs font-bold flex items-center justify-center" style="color: ${color}">${mailbox.totalMailboxes || '?'}</span>
          </div>
        `;
      } else {
        el.innerHTML = `
          <div class="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer transition-transform ${isSelected ? 'scale-110 ring-2 ring-yellow-400' : ''} ${mailbox.urgent ? 'animate-pulse' : ''}" style="background-color: ${color}">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            ${mailbox.problemCount > 0 ? `<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">${mailbox.problemCount}</span>` : ''}
          </div>
        `;
      }

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMailboxSelect(mailbox);

        // Zoom sur le point sélectionné
        map.current?.easeTo({
          center: [mailbox.position.lng, mailbox.position.lat],
          zoom: Math.max(map.current.getZoom(), 15),
        });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([mailbox.position.lng, mailbox.position.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds si plusieurs points
    if (mailboxes.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      mailboxes.forEach((m) => bounds.extend([m.position.lng, m.position.lat]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [mailboxes, mapLoaded, selectedMailboxId, onMailboxSelect]);

  // Toggle heatmap
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    map.current.setLayoutProperty(
      "heatmap-layer",
      "visibility",
      showHeatmap ? "visible" : "none"
    );

    if (showHeatmap) {
      // Mettre à jour les données de la heatmap
      const heatmapFeatures: GeoJSON.Feature[] = mailboxes
        .filter((m) => m.problemCount > 0)
        .map((mailbox) => ({
          type: "Feature",
          properties: {
            weight: mailbox.urgent ? 1 : 0.5,
          },
          geometry: {
            type: "Point",
            coordinates: [mailbox.position.lng, mailbox.position.lat],
          },
        }));

      const source = map.current.getSource("heatmap-source") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: heatmapFeatures,
        });
      }
    }
  }, [showHeatmap, mailboxes, mapLoaded]);

  // Localisation utilisateur
  const handleLocate = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        map.current?.flyTo({ center: coords, zoom: 15 });

        // Ajouter un marker pour la position utilisateur
        new mapboxgl.Marker({ color: "#3b82f6" })
          .setLngLat(coords)
          .addTo(map.current!);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleStyleToggle = () => {
    const currentStyle = map.current?.getStyle().name;
    const newStyle = currentStyle?.includes("Light")
      ? "mapbox://styles/mapbox/satellite-streets-v12"
      : "mapbox://styles/mapbox/light-v11";
    map.current?.setStyle(newStyle);
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          className="bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          className="bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Minus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleStyleToggle}
          className="bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Locate Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={handleLocate}
        className="absolute left-4 top-4 bg-card shadow-md hover:bg-card/90 text-foreground h-10 w-10 z-10"
      >
        <Locate className="w-5 h-5" />
      </Button>

      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}
