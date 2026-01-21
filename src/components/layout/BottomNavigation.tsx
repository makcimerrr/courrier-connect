import { Map, FileText, Clock, User, ClipboardList, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Map, label: "Carte" },
  { path: "/declarations", icon: FileText, label: "Déclarations" },
  { path: "/actions", icon: ClipboardList, label: "Actions" },
  { path: "/history", icon: Clock, label: "Suivi" },
  { path: "/profile", icon: User, label: "Profil" },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFabClick = () => {
    navigate("/?declare=true");
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
          <button
            onClick={handleFabClick}
            className={cn(
              "absolute -top-6 w-14 h-14 rounded-full",
              "bg-primary shadow-lg",
              "flex items-center justify-center",
              "text-primary-foreground",
              "transition-all duration-200",
              "hover:bg-laposte-yellow-dark hover:scale-105",
              "active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
            style={{ boxShadow: "0 4px 14px hsl(48 100% 50% / 0.4)" }}
            aria-label="Nouvelle déclaration"
          >
            <Plus className="w-7 h-7" strokeWidth={2.5} />
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
