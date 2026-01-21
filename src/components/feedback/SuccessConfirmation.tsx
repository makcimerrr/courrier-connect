import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SuccessConfirmationProps {
  show: boolean;
  title?: string;
  message?: string;
  onComplete?: () => void;
  autoHideDuration?: number;
}

export function SuccessConfirmation({
  show,
  title = "Déclaration envoyée",
  message = "Votre signalement a été enregistré avec succès",
  onComplete,
  autoHideDuration = 2500,
}: SuccessConfirmationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Déclencher l'animation après le montage
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });

      // Auto-hide après la durée spécifiée
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [show, autoHideDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "transition-opacity duration-300",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-4 p-8 rounded-2xl",
          "bg-card shadow-lg border border-border",
          "transition-all duration-500",
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-4"
        )}
      >
        {/* Cercle animé avec check */}
        <div className="relative w-20 h-20">
          {/* Cercle de fond */}
          <svg className="w-20 h-20" viewBox="0 0 80 80">
            {/* Cercle de progression */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="hsl(var(--status-resolved) / 0.2)"
              strokeWidth="4"
            />
            {/* Cercle animé */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="hsl(var(--status-resolved))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="226"
              strokeDashoffset="226"
              className={cn(
                "origin-center -rotate-90",
                isAnimating && "animate-circle-draw"
              )}
            />
          </svg>

          {/* Checkmark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-status-resolved"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                strokeDashoffset="24"
                className={cn(isAnimating && "animate-check-path")}
              />
            </svg>
          </div>

          {/* Confetti particles */}
          {isAnimating && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    left: "50%",
                    top: "50%",
                    backgroundColor: [
                      "hsl(var(--laposte-yellow))",
                      "hsl(var(--status-resolved))",
                      "hsl(var(--status-in-progress))",
                      "hsl(var(--laposte-blue))",
                    ][i % 4],
                    animationDelay: `${i * 0.05}s`,
                    transform: `rotate(${i * 45}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Texte */}
        <div className="text-center">
          <h3
            className={cn(
              "text-lg font-semibold text-foreground mb-1",
              "transition-all duration-500 delay-300",
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm text-muted-foreground max-w-[250px]",
              "transition-all duration-500 delay-400",
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            {message}
          </p>
        </div>

        {/* Indicateur de référence */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-status-resolved/10 text-status-resolved text-sm font-medium",
            "transition-all duration-500 delay-500",
            isAnimating
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-status-resolved animate-pulse" />
          Traitement en cours
        </div>
      </div>
    </div>
  );
}
