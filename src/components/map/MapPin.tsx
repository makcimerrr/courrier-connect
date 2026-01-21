import { Mail } from "lucide-react";
import type { TicketStatus } from "@/components/ui/StatusBadge";

interface MapPinProps {
  status?: TicketStatus | "normal";
  onClick?: () => void;
  selected?: boolean;
}

const pinClasses: Record<string, string> = {
  normal: "map-pin-normal",
  signaled: "map-pin-signaled",
  "in-progress": "map-pin-in-progress",
  pending: "map-pin-in-progress",
  resolved: "map-pin-resolved",
};

export function MapPin({ status = "normal", onClick, selected }: MapPinProps) {
  return (
    <button
      onClick={onClick}
      className={`map-pin ${pinClasses[status]} ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      <Mail className="w-4 h-4 text-white" />
    </button>
  );
}
