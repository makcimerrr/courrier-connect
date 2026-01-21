import { useState, useCallback } from "react";
import { Camera, X, Send, ChevronLeft, ChevronRight, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProblemTypeSelector } from "./ProblemTypeSelector";
import { problemTypes, getRiskLevelColor, type ProblemType } from "@/data/problemTypes";
import { cn } from "@/lib/utils";

interface SmartDeclarationFormProps {
  mailboxId: string;
  mailboxAddress: string;
  onSubmit: (data: { type: string; comment: string; photo?: string }) => void;
  onCancel: () => void;
}

type Step = "select-type" | "fill-form";

export function SmartDeclarationForm({ 
  mailboxAddress, 
  onSubmit, 
  onCancel 
}: SmartDeclarationFormProps) {
  const [step, setStep] = useState<Step>("select-type");
  const [selectedType, setSelectedType] = useState<ProblemType | null>(null);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleTypeSelect = useCallback((type: ProblemType) => {
    setSelectedType(type);
    setComment("");
    setSelectedSuggestions([]);
  }, []);

  const handleContinue = () => {
    if (selectedType) {
      setStep("fill-form");
    }
  };

  const handleBack = () => {
    if (step === "fill-form") {
      setStep("select-type");
    } else {
      onCancel();
    }
  };

  const toggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions(prev => {
      if (prev.includes(suggestion)) {
        return prev.filter(s => s !== suggestion);
      } else {
        return [...prev, suggestion];
      }
    });
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    
    // Combine selected suggestions with manual comment
    const fullComment = [
      ...selectedSuggestions,
      comment
    ].filter(Boolean).join("\n");

    onSubmit({
      type: selectedType.id,
      comment: fullComment,
      photo: photo || undefined,
    });
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setPhoto("photo_terrain.jpg");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-secondary-foreground hover:bg-secondary-foreground/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">
              {step === "select-type" ? "Déclarer un problème" : selectedType?.label}
            </h1>
            <p className="text-xs text-secondary-foreground/70">{mailboxAddress}</p>
          </div>
          {/* Step Indicator */}
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === "select-type" ? "bg-primary" : "bg-secondary-foreground/30"
            )} />
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === "fill-form" ? "bg-primary" : "bg-secondary-foreground/30"
            )} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 pb-32">
        {step === "select-type" && (
          <div className="animate-fade-in">
            <ProblemTypeSelector
              selectedType={selectedType?.id ?? null}
              onSelect={handleTypeSelect}
            />
          </div>
        )}

        {step === "fill-form" && selectedType && (
          <div className="space-y-6 animate-fade-in">
            {/* Selected Type Summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <img
                  src={selectedType.image}
                  alt={selectedType.label}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedType.icon}</span>
                    <h3 className="font-semibold text-foreground">{selectedType.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{selectedType.description}</p>
                  <Badge className={cn("mt-2 text-[10px]", getRiskLevelColor(selectedType.riskLevel))}>
                    {selectedType.riskLevel === "high" ? "⚠️ Risque élevé" : 
                     selectedType.riskLevel === "medium" ? "⚡ Risque modéré" : "✓ Risque faible"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Suggested Comments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-sm font-semibold text-foreground">
                  Suggestions rapides
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Cliquez pour ajouter à votre déclaration
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedType.suggestedComments.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSuggestion(suggestion)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left",
                      selectedSuggestions.includes(suggestion)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {selectedSuggestions.includes(suggestion) && (
                      <span className="mr-1">✓</span>
                    )}
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Comment */}
            <div>
              <Label htmlFor="comment" className="text-sm font-semibold text-foreground mb-2 block">
                Commentaire complémentaire
              </Label>
              <Textarea
                id="comment"
                placeholder="Ajoutez des précisions si nécessaire..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none border-border focus:ring-primary"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm font-semibold text-foreground">
                  Photo terrain
                </Label>
                <span className="text-xs text-muted-foreground">(recommandé)</span>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 mb-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Prenez la boîte en situation réelle, montrant clairement le problème signalé.
                </p>
              </div>

              {photo ? (
                <div className="relative">
                  <div className="bg-muted rounded-lg h-32 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Camera className="w-5 h-5" />
                      <span className="text-sm">{photo}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8"
                    onClick={() => setPhoto(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={handlePhotoUpload}
                  className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  <Camera className="w-8 h-8" />
                  <span className="text-sm">Ajouter une photo</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        {step === "select-type" ? (
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base disabled:opacity-50"
          >
            Continuer
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || (selectedSuggestions.length === 0 && !comment.trim())}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base disabled:opacity-50"
          >
            <Send className="w-5 h-5 mr-2" />
            Envoyer la déclaration
          </Button>
        )}
      </div>
    </div>
  );
}
