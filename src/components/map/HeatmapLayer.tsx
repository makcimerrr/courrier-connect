import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

interface HeatmapLayerProps {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
  maxOpacity?: number;
  gradient?: Record<number, string>;
  visible?: boolean;
}

// Gradient par défaut La Poste
const defaultGradient: Record<number, string> = {
  0.0: "rgba(34, 197, 94, 0)",      // Vert transparent
  0.2: "rgba(34, 197, 94, 0.3)",    // Vert léger
  0.4: "rgba(250, 204, 21, 0.5)",   // Jaune La Poste
  0.6: "rgba(245, 158, 11, 0.6)",   // Orange
  0.8: "rgba(239, 68, 68, 0.7)",    // Rouge
  1.0: "rgba(185, 28, 28, 0.8)",    // Rouge foncé
};

export function HeatmapLayer({
  points,
  radius = 25,
  blur = 15,
  maxOpacity = 0.6,
  gradient = defaultGradient,
  visible = true,
}: HeatmapLayerProps) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!visible || points.length === 0) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      return;
    }

    // Créer le canvas overlay
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;

    const HeatmapOverlay = L.Layer.extend({
      onAdd: function (map: L.Map) {
        this._map = map;
        const pane = map.getPane("overlayPane");
        if (pane) {
          pane.appendChild(canvas);
        }
        map.on("moveend", this._reset, this);
        this._reset();
      },

      onRemove: function (map: L.Map) {
        const pane = map.getPane("overlayPane");
        if (pane && canvas.parentNode === pane) {
          pane.removeChild(canvas);
        }
        map.off("moveend", this._reset, this);
      },

      _reset: function () {
        const topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(canvas, topLeft);

        const size = this._map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;

        this._draw();
      },

      _draw: function () {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner chaque point de chaleur
        points.forEach((point) => {
          const pixelPoint = this._map.latLngToContainerPoint([point.lat, point.lng]);

          // Créer un gradient radial pour chaque point
          const grd = ctx.createRadialGradient(
            pixelPoint.x,
            pixelPoint.y,
            0,
            pixelPoint.x,
            pixelPoint.y,
            radius
          );

          // Appliquer le gradient basé sur l'intensité
          const intensity = point.intensity;
          Object.entries(gradient).forEach(([stop, color]) => {
            const stopValue = parseFloat(stop);
            // Ajuster la couleur en fonction de l'intensité
            const adjustedColor = color.replace(
              /[\d.]+\)$/,
              `${parseFloat(color.match(/[\d.]+\)$/)?.[0] || "0.5") * intensity * maxOpacity})`
            );
            grd.addColorStop(stopValue, adjustedColor);
          });

          ctx.beginPath();
          ctx.arc(pixelPoint.x, pixelPoint.y, radius + blur, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        });

        // Appliquer le flou
        if (blur > 0) {
          ctx.filter = `blur(${blur}px)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
        }
      },
    });

    const layer = new HeatmapOverlay();
    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, points, radius, blur, maxOpacity, gradient, visible]);

  return null;
}

// Composant de légende pour la heatmap
export function HeatmapLegend({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-foreground mb-2">Densité de risques</p>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground">Faible</span>
        <div
          className="flex-1 h-2 rounded-full"
          style={{
            background: "linear-gradient(to right, #22c55e, #facc15, #f59e0b, #ef4444, #b91c1c)",
          }}
        />
        <span className="text-[10px] text-muted-foreground">Élevé</span>
      </div>
    </div>
  );
}

// Fonction utilitaire pour convertir les mailboxes en points de chaleur
export function mailboxesToHeatPoints(
  mailboxes: Array<{
    position: { lat: number; lng: number };
    problemCount: number;
    urgent?: boolean;
    problemType?: string;
  }>
): HeatPoint[] {
  return mailboxes
    .filter((m) => m.problemCount > 0 || m.urgent || m.problemType)
    .map((mailbox) => {
      // Calculer l'intensité basée sur le nombre de problèmes et l'urgence
      let intensity = Math.min(mailbox.problemCount * 0.3, 0.6);

      if (mailbox.urgent) {
        intensity += 0.3;
      }

      if (mailbox.problemType === "dog" || mailbox.problemType === "dangerous-access") {
        intensity += 0.2;
      }

      return {
        lat: mailbox.position.lat,
        lng: mailbox.position.lng,
        intensity: Math.min(intensity, 1),
      };
    });
}
