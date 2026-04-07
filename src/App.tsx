import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index.tsx";
import CRM from "./pages/CRM.tsx";
import ActivityLog from "./pages/ActivityLog.tsx";
import LoginScreen from "./pages/LoginScreen.tsx";
import NotFound from "./pages/NotFound.tsx";
import RoutePlanner from "./pages/RoutePlanner.tsx";
import ComercialEvolution from "./pages/ComercialEvolution.tsx";
import VisitCalendar from "./pages/VisitCalendar.tsx";
import HomeEquity from "./pages/HomeEquity.tsx";
import GestaoComercialCampo from "./pages/GestaoComercialCampo.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(
    () => sessionStorage.getItem("crm_user")
  );

  if (!currentUser) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginScreen onLogin={setCurrentUser} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("crm_user");
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar currentUser={currentUser} onLogout={handleLogout} />
              <div className="flex-1 flex flex-col min-w-0">
                <header className="h-10 flex items-center border-b border-border px-2 shrink-0">
                  <SidebarTrigger />
                </header>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<CRM currentUser={currentUser} onLogout={handleLogout} />} />
                    <Route path="/evolucao" element={<ComercialEvolution />} />
                    <Route path="/agenda" element={<VisitCalendar />} />
                    <Route path="/log" element={<ActivityLog />} />
                    <Route path="/landing" element={<Index />} />
                    <Route path="/roteiro" element={<RoutePlanner />} />
                    <Route path="/home-equity" element={<HomeEquity />} />
                    <Route path="/gestao-campo" element={<GestaoComercialCampo />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
