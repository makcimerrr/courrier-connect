import {
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Plus,
  History,
  Navigation,
  Dog,
  ArrowDown,
  MoveRight,
  Wrench,
  Clock,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";
import type { MapMailbox } from "./LeafletMap";
import type { ProblemType } from "./MapPin";
import { cn } from "@/lib/utils";

interface MailboxBottomSheetProps {
  mailbox: MapMailbox | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeclare: (mailboxId: string) => void;
  onViewHistory: (mailboxId: string) => void;
}

// Infos du type de problème
const problemTypeInfo: Record<
  NonNullable<ProblemType>,
  { label: string; icon: React.ReactNode; color: string }
> = {
  dog: {
    label: "Chien signalé",
    icon: <Dog className="w-4 h-4" />,
    color: "bg-destructive/15 text-destructive",
  },
  "too-low": {
    label: "Boîte trop basse",
    icon: <ArrowDown className="w-4 h-4" />,
    color: "bg-status-signaled/15 text-status-signaled",
  },
  "too-far": {
    label: "Boîte trop éloignée",
    icon: <MoveRight className="w-4 h-4" />,
    color: "bg-status-resolved/15 text-status-resolved",
  },
  "dangerous-access": {
    label: "Accès dangereux",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "bg-destructive/15 text-destructive",
  },
  damaged: {
    label: "Boîte détériorée",
    icon: <Wrench className="w-4 h-4" />,
    color: "bg-status-signaled/15 text-status-signaled",
  },
};

// Chip d'information
function InfoChip({
  icon,
  label,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "warning" | "danger" | "success";
}) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    warning: "bg-status-signaled/15 text-status-signaled",
    danger: "bg-destructive/15 text-destructive",
    success: "bg-status-resolved/15 text-status-resolved",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        variantClasses[variant]
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function MailboxBottomSheet({
  mailbox,
  open,
  onOpenChange,
  onDeclare,
  onViewHistory,
}: MailboxBottomSheetProps) {
  if (!mailbox) return null;

  const hasActiveIssue =
    mailbox.status !== "normal" && mailbox.status !== "resolved";
  const problemInfo = mailbox.problemType
    ? problemTypeInfo[mailbox.problemType]
    : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Réf. {mailbox.reference}</span>
              </div>
              <DrawerTitle className="text-lg leading-tight">
                {mailbox.address}
              </DrawerTitle>
            </div>
            {hasActiveIssue && mailbox.status !== "action-required" && (
              <StatusBadge status={mailbox.status as TicketStatus} />
            )}
            {mailbox.status === "action-required" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-laposte-yellow text-primary-foreground">
                <AlertTriangle className="w-3.5 h-3.5" />
                Action requise
              </span>
            )}
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4">
          {/* Chips d'information */}
          <div className="flex flex-wrap gap-2 mb-4">
            <InfoChip
              icon={<Calendar className="w-3.5 h-3.5" />}
              label={`Inspection: ${mailbox.lastInspection}`}
            />

            {mailbox.problemCount > 0 && (
              <InfoChip
                icon={<AlertTriangle className="w-3.5 h-3.5" />}
                label={`${mailbox.problemCount} signalement${mailbox.problemCount > 1 ? "s" : ""}`}
                variant="warning"
              />
            )}

            {mailbox.inTour && (
              <InfoChip
                icon={<Navigation className="w-3.5 h-3.5" />}
                label="Sur ma tournée"
                variant="success"
              />
            )}

            {mailbox.urgent && (
              <InfoChip
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Urgent"
                variant="danger"
              />
            )}
          </div>

          {/* Problème actif */}
          {problemInfo && hasActiveIssue && (
            <div
              className={cn(
                "rounded-lg p-3 mb-4",
                problemInfo.color.replace("text-", "bg-").split(" ")[0]
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {problemInfo.icon}
                <span className="font-semibold text-sm">
                  {problemInfo.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Dernier signalement actif sur cette boîte aux lettres.
              </p>
            </div>
          )}

          {/* Dernier signalement (si résolu) */}
          {mailbox.status === "resolved" && mailbox.problemType && (
            <div className="rounded-lg p-3 mb-4 bg-status-resolved/10 border border-status-resolved/20">
              <div className="flex items-center gap-2 mb-1 text-status-resolved">
                <span className="font-semibold text-sm">
                  Problème résolu
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Le dernier signalement ({problemTypeInfo[mailbox.problemType]?.label}) a été traité.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => onDeclare(mailbox.id)}
              className="w-full bg-primary text-primary-foreground hover:bg-laposte-yellow-dark font-semibold h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle déclaration
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => onViewHistory(mailbox.id)}
                variant="outline"
                className="flex-1 h-11"
              >
                <History className="w-4 h-4 mr-2" />
                Historique
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => {
                  // Ouvrir dans Maps
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${mailbox.position.lat},${mailbox.position.lng}`,
                    "_blank"
                  );
                }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Itinéraire
              </Button>
            </div>
          </div>

          {/* Informations complémentaires (expandable) */}
          <details className="mt-4 group">
            <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <span>Plus d'informations</span>
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </summary>
            <div className="pt-2 pb-1 text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Coordonnées:</span>{" "}
                {mailbox.position.lat.toFixed(6)}, {mailbox.position.lng.toFixed(6)}
              </p>
              <p>
                <span className="font-medium">Secteur:</span>{" "}
                {mailbox.reference.split("-")[1] || "N/A"}
              </p>
            </div>
          </details>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
