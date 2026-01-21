import { Map, FileText, Clock, User, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: Map, label: "Carte" },
  { path: "/declarations", icon: FileText, label: "Déclarations" },
  { path: "/actions", icon: ClipboardList, label: "Actions" },
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
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
