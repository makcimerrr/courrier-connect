import { User, MapPin, Mail, Phone, FileText, Settings, LogOut, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  onLogout: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Mon Profil" showNotifications={false} />

      {/* Profile Card */}
      <div className="bg-secondary text-secondary-foreground p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Jean Dupont</h2>
            <p className="text-secondary-foreground/70 text-sm">Facteur</p>
            <p className="text-secondary-foreground/70 text-sm">ID: FAC-75001-0042</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Informations
        </h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Secteur</p>
              <p className="text-sm font-medium">Paris 1er - Zone A</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">j.dupont@laposte.fr</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Téléphone</p>
              <p className="text-sm font-medium">+33 6 12 34 56 78</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Statistiques
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Déclarations</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-status-resolved">8</p>
            <p className="text-xs text-muted-foreground">Résolues</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-status-in-progress">4</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Actions
        </h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          <button className="flex items-center gap-3 p-4 w-full hover:bg-muted/50 transition-colors">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium">Mes rapports</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="flex items-center gap-3 p-4 w-full hover:bg-muted/50 transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium">Paramètres</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-8 mt-auto">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
