import { useState } from "react";
import { Shield, Check, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  critical?: boolean;
}

const checklistItems: ChecklistItem[] = [
  {
    id: "equipment",
    label: "Équipements de protection vérifiés",
    description: "Chaussures, gilet, gants si nécessaire",
    critical: true,
  },
  {
    id: "vehicle",
    label: "Véhicule inspecté",
    description: "Freins, phares, pneus, rétroviseurs",
  },
  {
    id: "phone",
    label: "Téléphone chargé",
    description: "Batterie > 50% pour la tournée",
  },
  {
    id: "route",
    label: "Itinéraire consulté",
    description: "Zones à risque identifiées",
    critical: true,
  },
  {
    id: "alerts",
    label: "Alertes météo vérifiées",
    description: "Conditions de circulation",
  },
  {
    id: "contacts",
    label: "Contacts d'urgence accessibles",
    description: "Numéros du centre enregistrés",
    critical: true,
  },
];

interface SecurityChecklistProps {
  onComplete: () => void;
}

export function SecurityChecklist({ onComplete }: SecurityChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const allChecked = checkedItems.size === checklistItems.length;
  const criticalComplete = checklistItems
    .filter(item => item.critical)
    .every(item => checkedItems.has(item.id));
  const progress = Math.round((checkedItems.size / checklistItems.length) * 100);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            allChecked ? "bg-status-resolved/15" : "bg-primary/10"
          )}>
            <Shield className={cn(
              "w-5 h-5",
              allChecked ? "text-status-resolved" : "text-primary"
            )} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Checklist Sécurité</h3>
            <p className="text-xs text-muted-foreground">
              {allChecked ? "Tournée prête ✓" : `${progress}% complété`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!criticalComplete && (
            <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className="text-xs text-destructive font-medium">Points critiques</span>
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            allChecked ? "bg-status-resolved" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="p-4 pt-2 space-y-2">
          {checklistItems.map((item) => {
            const isChecked = checkedItems.has(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                  isChecked
                    ? "bg-status-resolved/10"
                    : item.critical && !isChecked
                    ? "bg-destructive/5 hover:bg-destructive/10"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                  isChecked
                    ? "bg-status-resolved border-status-resolved"
                    : item.critical
                    ? "border-destructive"
                    : "border-muted-foreground"
                )}>
                  {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium text-sm",
                      isChecked ? "text-status-resolved line-through" : "text-foreground"
                    )}>
                      {item.label}
                    </span>
                    {item.critical && !isChecked && (
                      <span className="px-1.5 py-0.5 bg-destructive/15 text-destructive text-[10px] font-bold rounded uppercase">
                        Critique
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {/* Complete Button */}
          <Button
            onClick={onComplete}
            disabled={!criticalComplete}
            className={cn(
              "w-full mt-4",
              allChecked
                ? "bg-status-resolved hover:bg-status-resolved/90"
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {allChecked ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Tournée validée
              </>
            ) : criticalComplete ? (
              "Démarrer la tournée"
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Points critiques requis
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
