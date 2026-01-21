import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { DeclarationsList } from "@/components/declarations/DeclarationsList";

export default function DeclarationsPage() {
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/history/${id}`);
  };

  return (
    <MobileLayout>
      <DeclarationsList onViewDetails={handleViewDetails} />
    </MobileLayout>
  );
}
