import { useState, useEffect } from "react";
import { getActivityLog, ActivityLogEntry } from "@/data/leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoVfmoney from "@/assets/logo-vfmoney.png";

export default function ActivityLog() {
  const [log, setLog] = useState<ActivityLogEntry[]>([]);
  const navigate = useNavigate();

  const refresh = () => setLog(getActivityLog());

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const actionColors: Record<string, string> = {
    "status_alterado": "bg-amber-500/20 text-amber-400",
    "nota_adicionada": "bg-blue-500/20 text-blue-400",
    "lead_criado": "bg-emerald-500/20 text-emerald-400",
    "lead_exportado": "bg-purple-500/20 text-purple-400",
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
              <p className="text-xs text-muted-foreground">Registro público de todas as ações no sistema</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} className="border-border hover:border-primary hover:text-primary"><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
        </div>

        {log.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhuma atividade registrada ainda</p>
            <p className="text-sm mt-1">As ações feitas na Central Comercial aparecerão aqui em tempo real.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {log.map(entry => {
              const date = new Date(entry.timestamp);
              const timeStr = date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
              return (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                  <div className="text-xs text-muted-foreground whitespace-nowrap mt-0.5 w-[90px] shrink-0">{timeStr}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-[10px] ${actionColors[entry.action] || "bg-zinc-500/20 text-zinc-400"}`}>{entry.action.replace("_", " ")}</Badge>
                      <span className="font-semibold text-sm text-foreground">{entry.leadEmpresa}</span>
                      {entry.author && <span className="text-xs text-muted-foreground">por <span className="font-medium text-primary">{entry.author}</span></span>}
                    </div>
                    {entry.details && <p className="text-xs text-muted-foreground mt-0.5">{entry.details}</p>}
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
