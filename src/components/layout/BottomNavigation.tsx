import { useState } from "react";
import { Map, FileText, Clock, User, ClipboardList, Plus, AlertTriangle, Camera, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Map, label: "Carte" },
  { path: "/declarations", icon: FileText, label: "Déclarations" },
  { path: "/actions", icon: ClipboardList, label: "Actions" },
  { path: "/history", icon: Clock, label: "Suivi" },
  { path: "/profile", icon: User, label: "Profil" },
];

const fabActions = [
  { id: "declaration", icon: AlertTriangle, label: "Nouvelle déclaration", color: "bg-status-signaled" },
  { id: "photo", icon: Camera, label: "Prendre une photo", color: "bg-laposte-blue" },
  { id: "actions", icon: ClipboardList, label: "Mes actions", color: "bg-status-action-required" },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFabOpen, setIsFabOpen] = useState(false);

  const handleFabClick = () => {
    setIsFabOpen(!isFabOpen);
  };

  const handleActionClick = (actionId: string) => {
    setIsFabOpen(false);
    switch (actionId) {
      case "declaration":
        navigate("/?declare=true");
        break;
      case "photo":
        // Ouvre directement le formulaire de déclaration avec focus sur la photo
        navigate("/?declare=true");
        break;
      case "actions":
        navigate("/actions");
        break;
    }
  };

  return (
    <nav className="bottom-nav">
      <div className="relative flex items-center h-16">
        {/* Items de navigation - répartis autour du FAB central */}
        <div className="flex-1 flex justify-around items-center">
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-2 px-3",
                  "text-muted-foreground transition-colors duration-200",
                  "min-w-[56px]",
                  isActive && "text-secondary"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "text-laposte-yellow"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive && "text-secondary font-semibold"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-laposte-yellow animate-scale-in" />
                )}
              </Link>
            );
          })}
        </div>

        {/* FAB Central */}
        <div className="relative flex items-center justify-center w-16">
          {/* Overlay pour fermer le menu */}
          {isFabOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsFabOpen(false)}
            />
          )}

          {/* Menu d'actions */}
          {isFabOpen && (
            <div className="absolute bottom-16 z-50 flex flex-col items-center gap-3 animate-fade-in">
              {fabActions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg",
                    "bg-card border border-border",
                    "transition-all duration-200 hover:scale-105",
                    "animate-slide-up"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", action.color)}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap pr-2">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Bouton FAB principal */}
          <button
            onClick={handleFabClick}
            className={cn(
              "absolute -top-6 w-14 h-14 rounded-full z-50",
              "bg-primary shadow-lg",
              "flex items-center justify-center",
              "text-primary-foreground",
              "transition-all duration-200",
              "hover:bg-laposte-yellow-dark hover:scale-105",
              "active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isFabOpen && "rotate-45"
            )}
            style={{ boxShadow: "0 4px 14px hsl(48 100% 50% / 0.4)" }}
            aria-label={isFabOpen ? "Fermer le menu" : "Ouvrir le menu d'actions"}
          >
            {isFabOpen ? (
              <X className="w-7 h-7" strokeWidth={2.5} />
            ) : (
              <Plus className="w-7 h-7" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Items de navigation - côté droit */}
        <div className="flex-1 flex justify-around items-center">
          {navItems.slice(2).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-2 px-3",
                  "text-muted-foreground transition-colors duration-200",
                  "min-w-[56px]",
                  isActive && "text-secondary"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "text-laposte-yellow"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive && "text-secondary font-semibold"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-laposte-yellow animate-scale-in" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
