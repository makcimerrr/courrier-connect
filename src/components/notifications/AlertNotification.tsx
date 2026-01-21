import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Dog,
  X,
  MapPin,
  ChevronRight,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AlertType = "dog" | "danger" | "action-required" | "resolved" | "info";
export type AlertPriority = "low" | "medium" | "high" | "urgent";

export interface AlertNotificationData {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  address?: string;
  reference?: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface AlertNotificationProps {
  notification: AlertNotificationData;
  onDismiss: (id: string) => void;
  onAction?: () => void;
  className?: string;
}

const alertConfig: Record<
  AlertType,
  {
    icon: typeof AlertTriangle;
    bgColor: string;
    iconColor: string;
    borderColor: string;
  }
> = {
  dog: {
    icon: Dog,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    borderColor: "border-l-destructive",
  },
  danger: {
    icon: AlertTriangle,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    borderColor: "border-l-destructive",
  },
  "action-required": {
    icon: Clock,
    bgColor: "bg-laposte-yellow/10",
    iconColor: "text-laposte-yellow-dark",
    borderColor: "border-l-laposte-yellow",
  },
  resolved: {
    icon: CheckCircle,
    bgColor: "bg-status-resolved/10",
    iconColor: "text-status-resolved",
    borderColor: "border-l-status-resolved",
  },
  info: {
    icon: Bell,
    bgColor: "bg-status-in-progress/10",
    iconColor: "text-status-in-progress",
    borderColor: "border-l-status-in-progress",
  },
};

// Format du temps relatif
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR");
}

export function AlertNotification({
  notification,
  onDismiss,
  onAction,
  className,
}: AlertNotificationProps) {
  const config = alertConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex gap-3 p-4 rounded-lg border-l-4",
        "bg-card shadow-sm",
        config.borderColor,
        !notification.read && "ring-1 ring-primary/20",
        className
      )}
    >
      {/* Icône */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          config.bgColor
        )}
      >
        <Icon className={cn("w-5 h-5", config.iconColor)} />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-foreground">{notification.title}</h4>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>

        {/* Adresse si présente */}
        {notification.address && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{notification.address}</span>
            {notification.reference && (
              <span className="text-muted-foreground/60">• {notification.reference}</span>
            )}
          </div>
        )}

        {/* Action */}
        {notification.actionLabel && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-8 px-3 text-xs font-medium"
            onClick={() => {
              notification.onAction?.();
              onAction?.();
            }}
          >
            {notification.actionLabel}
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Indicateur non lu */}
      {!notification.read && (
        <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-primary" />
      )}
    </div>
  );
}

// Toast d'alerte urgente
interface UrgentAlertToastProps {
  notification: AlertNotificationData;
  onDismiss: () => void;
  onViewMap: () => void;
  autoHideDuration?: number;
}

export function UrgentAlertToast({
  notification,
  onDismiss,
  onViewMap,
  autoHideDuration = 8000,
}: UrgentAlertToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoHideDuration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setIsVisible(false);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [autoHideDuration, onDismiss]);

  if (!isVisible) return null;

  const config = alertConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "fixed top-4 left-4 right-4 z-[3000] animate-slide-up",
        "bg-card rounded-xl shadow-xl border border-border overflow-hidden"
      )}
      style={{ marginTop: "env(safe-area-inset-top, 0)" }}
    >
      {/* Barre de progression */}
      <div className="h-1 bg-muted">
        <div
          className={cn("h-full transition-all duration-50", config.iconColor.replace("text-", "bg-"))}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icône animée */}
          <div
            className={cn(
              "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
              config.bgColor,
              "animate-pulse"
            )}
          >
            <Icon className={cn("w-6 h-6", config.iconColor)} />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-destructive text-white text-[10px] font-bold uppercase">
                Urgent
              </span>
              <h4 className="font-semibold text-foreground">{notification.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            {notification.address && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {notification.address}
              </p>
            )}
          </div>

          {/* Fermer */}
          <button onClick={onDismiss} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button onClick={onViewMap} className="flex-1 h-10">
            <MapPin className="w-4 h-4 mr-2" />
            Voir sur la carte
          </Button>
          <Button variant="outline" onClick={onDismiss} className="h-10">
            Ignorer
          </Button>
        </div>
      </div>
    </div>
  );
}
