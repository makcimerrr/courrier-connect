import { useState } from "react";
import { Check, AlertTriangle, ChevronRight } from "lucide-react";
import { problemTypes, getRiskLevelColor, getRiskLevelLabel, type ProblemType } from "@/data/problemTypes";
import { cn } from "@/lib/utils";

interface ProblemTypeSelectorProps {
  selectedType: string | null;
  onSelect: (type: ProblemType) => void;
}

export function ProblemTypeSelector({ selectedType, onSelect }: ProblemTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">
          Quel problème rencontrez-vous ?
        </h2>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Cliquez sur l'image correspondant à votre situation
      </p>

      <div className="grid grid-cols-2 gap-3">
        {problemTypes.map((type) => {
          const isSelected = selectedType === type.id;
          const isHovered = hoveredType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type)}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
              className={cn(
                "relative rounded-xl overflow-hidden transition-all duration-300 group",
                "border-2 bg-card",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                  : "border-border hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/30"
              )}
            >
              {/* Image Container */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={type.image}
                  alt={type.label}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300",
                    (isSelected || isHovered) && "scale-105"
                  )}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                    <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                  </div>
                )}
                
                {/* Risk Level Badge */}
                <div className={cn(
                  "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                  getRiskLevelColor(type.riskLevel)
                )}>
                  {getRiskLevelLabel(type.riskLevel)}
                </div>
              </div>

              {/* Label Section */}
              <div className="p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{type.icon}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    isSelected && "text-primary translate-x-0.5"
                  )} />
                </div>
                <h3 className={cn(
                  "font-semibold text-sm mt-1 line-clamp-1",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {type.shortLabel}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
