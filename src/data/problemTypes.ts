import problemTooLow from "@/assets/problem-too-low.jpg";
import problemTooFar from "@/assets/problem-too-far.jpg";
import problemDog from "@/assets/problem-dog.jpg";
import problemDangerous from "@/assets/problem-dangerous.jpg";
import problemDamaged from "@/assets/problem-damaged.jpg";

export interface ProblemType {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  image: string;
  suggestedComments: string[];
  icon: string;
}

export const problemTypes: ProblemType[] = [
  {
    id: "too-low",
    label: "Boîte trop basse",
    shortLabel: "Trop basse",
    description: "Risque de TMS pour le facteur - Position penchée répétée",
    riskLevel: "medium",
    image: problemTooLow,
    suggestedComments: [
      "Boîte située à moins de 50cm du sol",
      "Nécessite de se pencher excessivement",
      "Risque de douleurs dorsales à long terme",
      "Recommandation : rehausser la boîte à hauteur réglementaire"
    ],
    icon: "📦"
  },
  {
    id: "too-far",
    label: "Boîte trop éloignée",
    shortLabel: "Trop éloignée",
    description: "Distance excessive depuis la voie publique",
    riskLevel: "low",
    image: problemTooFar,
    suggestedComments: [
      "Boîte située à plus de 10m de la voie",
      "Chemin d'accès non adapté",
      "Temps de livraison impacté",
      "Demande de rapprochement vers la voie publique"
    ],
    icon: "📍"
  },
  {
    id: "dog",
    label: "Présence de chien",
    shortLabel: "Chien",
    description: "Animal potentiellement dangereux - Risque de morsure",
    riskLevel: "high",
    image: problemDog,
    suggestedComments: [
      "Chien non attaché dans la propriété",
      "Animal agressif à l'approche",
      "Propriétaire averti verbalement",
      "Livraison impossible sans mise en sécurité de l'animal"
    ],
    icon: "🐕"
  },
  {
    id: "dangerous-access",
    label: "Accès dangereux",
    shortLabel: "Accès dangereux",
    description: "Escaliers, pente, circulation - Risque d'accident",
    riskLevel: "high",
    image: problemDangerous,
    suggestedComments: [
      "Escaliers non sécurisés / glissants",
      "Pente excessive ou terrain instable",
      "Proximité dangereuse avec circulation routière",
      "Éclairage insuffisant",
      "Travaux à effectuer pour sécuriser l'accès"
    ],
    icon: "⚠️"
  },
  {
    id: "damaged",
    label: "Boîte détériorée",
    shortLabel: "Détériorée",
    description: "Boîte en mauvais état - Courrier non protégé",
    riskLevel: "medium",
    image: problemDamaged,
    suggestedComments: [
      "Boîte rouillée / percée",
      "Porte ne ferme plus correctement",
      "Courrier exposé aux intempéries",
      "Remplacement de la boîte nécessaire"
    ],
    icon: "🔧"
  }
];

export const getRiskLevelColor = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "low":
      return "bg-status-resolved/15 text-status-resolved";
    case "medium":
      return "bg-status-signaled/15 text-status-signaled";
    case "high":
      return "bg-destructive/15 text-destructive";
  }
};

export const getRiskLevelLabel = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "low":
      return "Risque faible";
    case "medium":
      return "Risque modéré";
    case "high":
      return "Risque élevé";
  }
};
