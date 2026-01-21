import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AppHeaderProps {
  title: string;
  showNotifications?: boolean;
  rightElement?: ReactNode;
}

export function AppHeader({ title, showNotifications = true, rightElement }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <img src="/lot-de-2-logos-la-poste-2024.jpg" alt="Project logo" className="w-25 h-25 object-contain" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightElement ? (
          rightElement
        ) : showNotifications ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-secondary-foreground hover:bg-secondary-foreground/10 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
