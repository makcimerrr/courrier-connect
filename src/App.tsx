import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import DeclarationsPage from "./pages/DeclarationsPage";
import ActionsPage from "./pages/ActionsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerTicketsPage from "./pages/ManagerTicketsPage";
import ManagerMapPage from "./pages/ManagerMapPage";
import ManagerAnalyticsPage from "./pages/ManagerAnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Facteur routes */}
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/declarations" element={<DeclarationsPage />} />
          <Route path="/declarations/new" element={<DeclarationsPage />} />
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:ticketId" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Manager routes */}
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/tickets" element={<ManagerTicketsPage />} />
          <Route path="/manager/map" element={<ManagerMapPage />} />
          <Route path="/manager/analytics" element={<ManagerAnalyticsPage />} />
          <Route path="/manager/team" element={<ManagerDashboard />} />
          <Route path="/manager/zones" element={<ManagerMapPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
