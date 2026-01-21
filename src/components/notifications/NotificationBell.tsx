import { useState } from "react";
import { Bell, X, Check, Clock, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NotificationType = "status_change" | "action_requested" | "ticket_closed" | "new_response";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  ticketRef?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "action_requested",
    title: "Action requise",
    message: "Déposer un flyer au 12 Rue de la République",
    timestamp: "Il y a 10 min",
    read: false,
    ticketRef: "TK-2026-0042",
  },
  {
    id: "2",
    type: "status_change",
    title: "Statut mis à jour",
    message: "Ticket TK-2026-0038 passé en 'En cours de traitement'",
    timestamp: "Il y a 1h",
    read: false,
    ticketRef: "TK-2026-0038",
  },
  {
    id: "3",
    type: "new_response",
    title: "Réponse client",
    message: "Le propriétaire a confirmé la mise en conformité",
    timestamp: "Il y a 2h",
    read: false,
    ticketRef: "TK-2026-0025",
  },
  {
    id: "4",
    type: "ticket_closed",
    title: "Ticket résolu",
    message: "Problème de boîte détériorée résolu",
    timestamp: "Hier",
    read: true,
    ticketRef: "TK-2026-0019",
  },
];

const notificationIcons: Record<NotificationType, typeof Bell> = {
  status_change: Clock,
  action_requested: AlertTriangle,
  ticket_closed: Check,
  new_response: MessageSquare,
};

const notificationColors: Record<NotificationType, string> = {
  status_change: "bg-status-in-progress/15 text-status-in-progress",
  action_requested: "bg-status-signaled/15 text-status-signaled",
  ticket_closed: "bg-status-resolved/15 text-status-resolved",
  new_response: "bg-primary/15 text-primary",
};

interface NotificationBellProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationBell({ onNotificationClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-secondary-foreground hover:bg-secondary-foreground/10"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="overflow-auto h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full p-4 text-left transition-colors hover:bg-muted/50",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        colorClass
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-semibold text-sm",
                            !notification.read && "text-foreground"
                          )}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          {notification.ticketRef && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-primary font-medium">
                                {notification.ticketRef}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
