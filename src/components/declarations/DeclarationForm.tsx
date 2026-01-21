import { useState } from "react";
import { Camera, X, Send, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const problemTypes = [
  { id: "too-low", label: "Boîte trop basse", icon: "📦" },
  { id: "too-far", label: "Boîte trop éloignée", icon: "📍" },
  { id: "dog", label: "Présence de chien", icon: "🐕" },
  { id: "dangerous-access", label: "Accès dangereux", icon: "⚠️" },
  { id: "other", label: "Autre problème technique", icon: "🔧" },
];

interface DeclarationFormProps {
  mailboxId: string;
  mailboxAddress: string;
  onSubmit: (data: { type: string; comment: string; photo?: string }) => void;
  onCancel: () => void;
}

export function DeclarationForm({ mailboxAddress, onSubmit, onCancel }: DeclarationFormProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedType) return;
    onSubmit({
      type: selectedType,
      comment,
      photo: photo || undefined,
    });
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setPhoto("photo_uploaded.jpg");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-secondary-foreground hover:bg-secondary-foreground/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="font-semibold">Déclarer un problème</h1>
          <p className="text-xs text-secondary-foreground/70">{mailboxAddress}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-4 pb-24">
        {/* Problem Type */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-foreground mb-3 block">
            Type de problème
          </Label>
          <RadioGroup
            value={selectedType}
            onValueChange={setSelectedType}
            className="space-y-2"
          >
            {problemTypes.map((type) => (
              <label
                key={type.id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedType === type.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <RadioGroupItem value={type.id} className="sr-only" />
                <span className="text-xl">{type.icon}</span>
                <span className="font-medium flex-1">{type.label}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedType === type.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedType === type.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <Label htmlFor="comment" className="text-sm font-semibold text-foreground mb-2 block">
            Commentaire (optionnel)
          </Label>
          <Textarea
            id="comment"
            placeholder="Décrivez le problème en détail..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none border-border focus:ring-primary"
          />
        </div>

        {/* Photo */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            Photo (optionnel)
          </Label>
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

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={!selectedType}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-laposte-yellow-dark font-semibold text-base disabled:opacity-50"
        >
          <Send className="w-5 h-5 mr-2" />
          Envoyer la déclaration
        </Button>
      </div>
    </div>
  );
}
