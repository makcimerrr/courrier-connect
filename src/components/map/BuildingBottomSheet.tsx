import { Building2, MapPin, AlertTriangle, ChevronRight, Users } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { StatusBadge, type TicketStatus } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import type { ProblemType } from "./MapPin";

export interface BuildingMailbox {
  id: string;
  apartment: string; // "Apt 1", "Apt 2A", "RDC Gauche", etc.
  residentName?: string;
  problemCount: number;
  status?: TicketStatus | "normal" | "action-required";
  problemType?: ProblemType;
  urgent?: boolean;
  ticketId?: string; // ID du ticket associé si problème
}

export interface BuildingData {
  id: string;
  address: string;
  reference: string;
  buildingName?: string; // "Résidence Les Lilas", etc.
  totalMailboxes: number;
  mailboxes: BuildingMailbox[];
  position: { x: number; y: number };
}

interface BuildingBottomSheetProps {
  building: BuildingData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMailbox: (mailbox: BuildingMailbox) => void;
  onDeclareAll: () => void;
}

export function BuildingBottomSheet({
  building,
  open,
  onOpenChange,
  onSelectMailbox,
  onDeclareAll,
}: BuildingBottomSheetProps) {
  if (!building) return null;

  const problemMailboxes = building.mailboxes.filter((m) => m.problemCount > 0);
  const urgentCount = building.mailboxes.filter((m) => m.urgent).length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <DrawerTitle className="text-lg font-semibold text-foreground text-left">
                {building.buildingName || building.address}
              </DrawerTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{building.address}</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {building.totalMailboxes} boîtes aux lettres
                </span>
                {problemMailboxes.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-status-signaled">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {problemMailboxes.length} signalement{problemMailboxes.length > 1 ? "s" : ""}
                  </span>
                )}
                {urgentCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-semibold">
                    {urgentCount} urgent{urgentCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DrawerHeader>

        {/* Liste des boîtes aux lettres */}
        <div className="flex-1 overflow-y-auto max-h-[50vh]">
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wide">
              Sélectionner une boîte aux lettres
            </p>
            <div className="space-y-1">
              {building.mailboxes.map((mailbox) => (
                <button
                  key={mailbox.id}
                  onClick={() => onSelectMailbox(mailbox)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left",
                    "transition-colors hover:bg-muted/50",
                    mailbox.urgent && "bg-destructive/5 hover:bg-destructive/10"
                  )}
                >
                  {/* Indicateur de statut */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                      mailbox.status === "signaled" && "bg-status-signaled/15 text-status-signaled",
                      mailbox.status === "in-progress" && "bg-status-in-progress/15 text-status-in-progress",
                      mailbox.status === "pending" && "bg-status-pending/15 text-status-pending",
                      mailbox.status === "resolved" && "bg-status-resolved/15 text-status-resolved",
                      mailbox.status === "action-required" && "bg-laposte-yellow/15 text-laposte-yellow-dark",
                      (!mailbox.status || mailbox.status === "normal") && "bg-muted text-muted-foreground"
                    )}
                  >
                    {mailbox.apartment.slice(0, 3)}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{mailbox.apartment}</p>
                      {mailbox.urgent && (
                        <span className="px-1.5 py-0.5 rounded bg-destructive text-white text-[9px] font-bold uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                    {mailbox.residentName && (
                      <p className="text-sm text-muted-foreground truncate">{mailbox.residentName}</p>
                    )}
                    {mailbox.problemCount > 0 && mailbox.status && mailbox.status !== "normal" && mailbox.status !== "action-required" && (
                      <div className="mt-1">
                        <StatusBadge status={mailbox.status as TicketStatus} size="sm" />
                      </div>
                    )}
                    {mailbox.status === "action-required" && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-laposte-yellow/15 text-laposte-yellow-dark">
                        Action requise
                      </span>
                    )}
                  </div>

                  {/* Badge problème */}
                  {mailbox.problemCount > 0 && (
                    <span className="flex-shrink-0 min-w-[24px] h-6 px-2 rounded-full bg-status-signaled text-white text-xs font-bold flex items-center justify-center">
                      {mailbox.problemCount}
                    </span>
                  )}

                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/30">
          <Button
            onClick={onDeclareAll}
            variant="outline"
            className="w-full"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Signaler un problème général
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
