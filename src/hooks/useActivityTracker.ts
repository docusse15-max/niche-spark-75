import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent, initLocationTracking } from "@/lib/activity-tracker";

const PAGE_NAMES: Record<string, string> = {
  "/": "CRM",
  "/evolucao": "Evolução Comercial",
  "/agenda": "Agenda de Visitas",
  "/log": "Log de Atividades",
  "/roteiro": "Roteiro",
  "/home-equity": "Home Equity",
  "/gestao-campo": "Gestão Comercial",
  "/dashboard-gestor": "Dashboard Gestor",
  "/agenda-sugerida": "Agenda Sugerida",
  "/landing": "Landing Page",
};

export function useActivityTracker(currentUser: string) {
  const location = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    initLocationTracking();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === prevPath.current) return;
    prevPath.current = path;

    const pageName = PAGE_NAMES[path] || path;
    trackEvent({
      action: "navegacao",
      author: currentUser,
      details: `Acessou: ${pageName}`,
      page: path,
    });
  }, [location.pathname, currentUser]);
}
