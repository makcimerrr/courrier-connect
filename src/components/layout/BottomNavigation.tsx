import { Map, FileText, Clock, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: Map, label: "Carte" },
  { path: "/declarations", icon: FileText, label: "Déclarations" },
  { path: "/history", icon: Clock, label: "Suivi" },
  { path: "/profile", icon: User, label: "Profil" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
