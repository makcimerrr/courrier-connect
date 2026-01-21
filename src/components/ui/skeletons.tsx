import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

/**
 * Skeleton pour les cartes de boîtes aux lettres (MailboxCard)
 */
export function MailboxCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mailbox-card animate-fade-in", className)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10 rounded-lg" />
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Skeleton pour les cartes de déclaration (DeclarationCard)
 */
export function DeclarationCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mailbox-card flex items-start gap-3 animate-fade-in", className)}>
      {/* Icône type de problème */}
      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48 mb-2" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-2" />
    </div>
  );
}

/**
 * Skeleton pour la liste de déclarations
 */
export function DeclarationsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <DeclarationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour la carte sur la map
 */
export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("h-full w-full relative overflow-hidden", className)}>
      {/* Fond avec shimmer */}
      <div className="absolute inset-0 bg-muted">
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.05), transparent)`,
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Simulated roads skeleton */}
      <Skeleton className="absolute top-1/4 left-0 right-0 h-2" />
      <Skeleton className="absolute top-2/3 left-0 right-0 h-3" />
      <Skeleton className="absolute left-1/3 top-0 bottom-0 w-2" />
      <Skeleton className="absolute left-2/3 top-0 bottom-0 w-3" />

      {/* Placeholder pins */}
      <div className="absolute left-[30%] top-[25%] -translate-x-1/2 -translate-y-1/2">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="absolute left-[55%] top-[40%] -translate-x-1/2 -translate-y-1/2">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="absolute left-[70%] top-[60%] -translate-x-1/2 -translate-y-1/2">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      {/* Controls skeleton */}
      <div className="absolute right-4 top-16 flex flex-col gap-2">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>

      {/* Legend skeleton */}
      <div className="absolute left-4 bottom-4">
        <Skeleton className="w-24 h-32 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Skeleton pour une carte d'action
 */
export function ActionCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mailbox-card animate-fade-in", className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-32 mb-3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour la timeline
 */
export function TimelineSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="timeline-item animate-fade-in">
          <Skeleton className="timeline-dot w-6 h-6 rounded-full" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton pour le score de conformité
 */
export function ConformityScoreSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-6 animate-fade-in", className)}>
      <Skeleton className="w-32 h-32 rounded-full" />
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="text-center">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-3 w-14 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour le profil utilisateur
 */
export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-fade-in", className)}>
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
