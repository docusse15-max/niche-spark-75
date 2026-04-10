import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoVfmoney from "@/assets/logo-vfmoney.png";
import { supabase } from "@/integrations/supabase/client";

interface LogEntry {
  id: string;
  action: string;
  lead_empresa: string;
  lead_id: string;
  author: string;
  details: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  user_agent: string;
  page: string;
}

export default function ActivityLog() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500) as { data: LogEntry[] | null };
    setLog(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  const actionColors: Record<string, string> = {
    "status_alterado": "bg-amber-500/20 text-amber-400",
    "nota_adicionada": "bg-blue-500/20 text-blue-400",
    "lead_criado": "bg-emerald-500/20 text-emerald-400",
    "lead_exportado": "bg-purple-500/20 text-purple-400",
    "lead_excluido": "bg-red-500/20 text-red-400",
    "login": "bg-green-500/20 text-green-400",
    "logout": "bg-orange-500/20 text-orange-400",
    "navegacao": "bg-cyan-500/20 text-cyan-400",
  };

  const actionLabels: Record<string, string> = {
    "status_alterado": "Status alterado",
    "nota_adicionada": "Nota adicionada",
    "lead_criado": "Lead criado",
    "lead_exportado": "Lead exportado",
    "lead_excluido": "Lead excluído",
    "login": "🔐 Login",
    "logout": "🚪 Logout",
    "navegacao": "📍 Navegação",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg gold-border">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary"><ArrowLeft className="h-5 w-5" /></Button>
            <img src={logoVfmoney} alt="VF Money" className="h-8 w-auto" />
            <div>
              <h1 className="text-xl font-bold gold-text">Log de Atividades</h1>
              <p className="text-xs text-muted-foreground">Monitoramento completo — login, navegação, ações e localização</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} className="border-border hover:border-primary hover:text-primary"><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
        </div>

        {loading && log.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Carregando...</p>
          </div>
        ) : log.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhuma atividade registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-1">
            {log.map(entry => {
              const date = new Date(entry.created_at);
              const timeStr = date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
              const hasLocation = entry.latitude && entry.longitude;
              const mapsUrl = hasLocation ? `https://www.google.com/maps?q=${entry.latitude},${entry.longitude}` : null;

              return (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                  <div className="text-xs text-muted-foreground whitespace-nowrap mt-0.5 w-[90px] shrink-0">{timeStr}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-[10px] ${actionColors[entry.action] || "bg-zinc-500/20 text-zinc-400"}`}>
                        {actionLabels[entry.action] || entry.action.replace("_", " ")}
                      </Badge>
                      {entry.lead_empresa && entry.lead_empresa !== "-" && (
                        <span className="font-semibold text-sm text-foreground">{entry.lead_empresa}</span>
                      )}
                      {entry.author && <span className="text-xs text-muted-foreground">por <span className="font-medium text-primary">{entry.author}</span></span>}
                    </div>
                    {entry.details && <p className="text-xs text-muted-foreground mt-0.5">{entry.details}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      {entry.page && (
                        <span className="text-[10px] text-muted-foreground/60">📄 {entry.page}</span>
                      )}
                      {hasLocation && mapsUrl && (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {(entry.latitude as number).toFixed(4)}, {(entry.longitude as number).toFixed(4)}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
