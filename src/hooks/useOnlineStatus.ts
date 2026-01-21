import { useState, useEffect, useCallback } from "react";

interface OnlineStatusState {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineAt: Date | null;
  pendingSync: number;
}

interface UseOnlineStatusReturn extends OnlineStatusState {
  addPendingItem: () => void;
  removePendingItem: (count?: number) => void;
  clearPending: () => void;
}

const STORAGE_KEY = "courrier-connect-pending-sync";

// Récupérer le nombre d'éléments en attente depuis le localStorage
function getPendingSyncCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

// Sauvegarder le nombre d'éléments en attente
function setPendingSyncCount(count: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, count.toString());
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [state, setState] = useState<OnlineStatusState>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    wasOffline: false,
    lastOnlineAt: null,
    pendingSync: getPendingSyncCount(),
  });

  // Gérer les événements online/offline
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({
        ...prev,
        isOnline: true,
        lastOnlineAt: new Date(),
      }));
    };

    const handleOffline = () => {
      setState((prev) => ({
        ...prev,
        isOnline: false,
        wasOffline: true,
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Ajouter un élément en attente de sync
  const addPendingItem = useCallback(() => {
    setState((prev) => {
      const newCount = prev.pendingSync + 1;
      setPendingSyncCount(newCount);
      return { ...prev, pendingSync: newCount };
    });
  }, []);

  // Retirer des éléments en attente
  const removePendingItem = useCallback((count = 1) => {
    setState((prev) => {
      const newCount = Math.max(0, prev.pendingSync - count);
      setPendingSyncCount(newCount);
      return { ...prev, pendingSync: newCount };
    });
  }, []);

  // Vider tous les éléments en attente
  const clearPending = useCallback(() => {
    setState((prev) => {
      setPendingSyncCount(0);
      return { ...prev, pendingSync: 0 };
    });
  }, []);

  return {
    ...state,
    addPendingItem,
    removePendingItem,
    clearPending,
  };
}
