import { cn } from "@/lib/utils";

export type ProblemTypeId = "too-low" | "too-far" | "dog" | "dangerous-access" | "damaged";
export type RiskLevel = "low" | "medium" | "high";

interface ProblemTypeIconProps {
  type: ProblemTypeId;
  size?: "sm" | "md" | "lg" | "xl";
  withBackground?: boolean;
  showRiskBadge?: boolean;
  className?: string;
}

// Mapping type -> niveau de risque
const riskLevels: Record<ProblemTypeId, RiskLevel> = {
  "too-low": "medium",
  "too-far": "low",
  dog: "high",
  "dangerous-access": "high",
  damaged: "medium",
};

// Couleurs selon le niveau de risque
const riskColors: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  low: {
    bg: "bg-status-resolved/15",
    text: "text-status-resolved",
    border: "border-status-resolved/30",
  },
  medium: {
    bg: "bg-status-signaled/15",
    text: "text-status-signaled",
    border: "border-status-signaled/30",
  },
  high: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    border: "border-destructive/30",
  },
};

// Tailles
const sizes = {
  sm: { container: "w-8 h-8", icon: 16, badge: "w-3 h-3 text-[8px]" },
  md: { container: "w-10 h-10", icon: 20, badge: "w-4 h-4 text-[9px]" },
  lg: { container: "w-12 h-12", icon: 24, badge: "w-5 h-5 text-[10px]" },
  xl: { container: "w-16 h-16", icon: 32, badge: "w-6 h-6 text-[11px]" },
};

// Labels de risque
const riskLabels: Record<RiskLevel, string> = {
  low: "!",
  medium: "!!",
  high: "!!!",
};

// Icônes SVG personnalisées pour chaque type de problème
function DogIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 4c-.55 0-1 .45-1 1v1h-2V5c0-.55-.45-1-1-1s-1 .45-1 1v1.5c0 .83.67 1.5 1.5 1.5h.5v1.11c-1.23.57-2.11 1.78-2.11 3.19v4.2c0 1.1.9 2 2 2h.22c1.1 0 2-.9 2-2V13.3c0-1.41-.88-2.62-2.11-3.19V9h.5c.83 0 1.5-.67 1.5-1.5V5c0-.55-.45-1-1-1z"
        fill="currentColor"
      />
      <path
        d="M10 9.5C10 8.67 9.33 8 8.5 8H8V6c0-.55-.45-1-1-1s-1 .45-1 1v2H4V6c0-.55-.45-1-1-1s-1 .45-1 1v1.5c0 .83.67 1.5 1.5 1.5H5v1.11C3.77 10.68 2.89 11.89 2.89 13.3v4.2c0 1.1.9 2 2 2h.22c1.1 0 2-.9 2-2V13.3c0-1.41-.88-2.62-2.11-3.19V9h.5c.83 0 1.5-.67 1.5-1.5V7.45c.88.35 1.54 1.19 1.54 2.19v.86c0 .28.22.5.5.5h1.92c.28 0 .5-.22.5-.5v-.86c0-1-.66-1.84-1.54-2.19V7.5c0-.83-.67-1.5-1.5-1.5H8v-.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.5h1V5c0-1.38-1.12-2.5-2.5-2.5S7 3.62 7 5v.5c-.83 0-1.5.67-1.5 1.5v.45"
        fill="currentColor"
        opacity="0"
      />
      <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M6 11.5c.5-.5 1.5-.5 2 0M8 13.5v1M6.5 15c.5.5 1.5.5 2 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 8l-1-2M12 8l1-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 16l3 2M15 18l3-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TooLowIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Boîte aux lettres */}
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M5 14h14" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="17" r="1.5" fill="currentColor" />
      {/* Flèche vers le bas */}
      <path
        d="M12 2v6M9 5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sol */}
      <path
        d="M2 22h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function TooFarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Boîte aux lettres (petite, loin) */}
      <rect
        x="16"
        y="12"
        width="6"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M16 15h6" stroke="currentColor" strokeWidth="1.5" />
      {/* Personnage facteur */}
      <circle cx="6" cy="8" r="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 10v6M4 12h4M6 16l-2 4M6 16l2 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Flèche distance */}
      <path
        d="M10 14h4M12 12l2 2-2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DangerousAccessIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Triangle d'avertissement */}
      <path
        d="M12 2L2 20h20L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Point d'exclamation */}
      <path
        d="M12 9v4M12 16v.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DamagedIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Boîte aux lettres endommagée */}
      <path
        d="M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" />
      {/* Fissure */}
      <path
        d="M10 8l2 4-2 4M14 8l-2 4 2 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Croix de dommage */}
      <path
        d="M3 3l4 4M21 3l-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Composant principal
export function ProblemTypeIcon({
  type,
  size = "md",
  withBackground = true,
  showRiskBadge = false,
  className,
}: ProblemTypeIconProps) {
  const riskLevel = riskLevels[type];
  const colors = riskColors[riskLevel];
  const sizeConfig = sizes[size];

  const iconProps = {
    size: sizeConfig.icon,
    className: colors.text,
  };

  const renderIcon = () => {
    switch (type) {
      case "dog":
        return <DogIcon {...iconProps} />;
      case "too-low":
        return <TooLowIcon {...iconProps} />;
      case "too-far":
        return <TooFarIcon {...iconProps} />;
      case "dangerous-access":
        return <DangerousAccessIcon {...iconProps} />;
      case "damaged":
        return <DamagedIcon {...iconProps} />;
    }
  };

  if (!withBackground) {
    return <span className={className}>{renderIcon()}</span>;
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl border",
        sizeConfig.container,
        colors.bg,
        colors.border,
        className
      )}
    >
      {renderIcon()}

      {/* Badge de niveau de risque */}
      {showRiskBadge && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold",
            "bg-card border-2 border-current shadow-sm",
            sizeConfig.badge,
            colors.text
          )}
        >
          {riskLabels[riskLevel]}
        </span>
      )}
    </div>
  );
}

// Export des infos pour usage externe
export const problemTypeLabels: Record<ProblemTypeId, string> = {
  "too-low": "Boîte trop basse",
  "too-far": "Boîte trop éloignée",
  dog: "Présence de chien",
  "dangerous-access": "Accès dangereux",
  damaged: "Boîte détériorée",
};

export const problemTypeShortLabels: Record<ProblemTypeId, string> = {
  "too-low": "Trop basse",
  "too-far": "Trop éloignée",
  dog: "Chien",
  "dangerous-access": "Danger",
  damaged: "Détériorée",
};

export { riskLevels, riskColors };
