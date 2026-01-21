import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title: string;
  showNotifications?: boolean;
}

export function AppHeader({ title, showNotifications = true }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LP</span>
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {showNotifications && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-secondary-foreground hover:bg-secondary-foreground/10"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
        )}
      </div>
    </header>
  );
}
