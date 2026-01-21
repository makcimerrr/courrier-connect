import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ProfilePage as ProfilePageContent } from "@/components/profile/ProfilePage";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    // In a real app, this would handle auth logout
    navigate("/");
  };

  return (
    <MobileLayout>
      <ProfilePageContent onLogout={handleLogout} />
    </MobileLayout>
  );
}
