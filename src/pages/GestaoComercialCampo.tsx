import { useState, useEffect, useMemo } from "react";
import { format, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { getInitialLeads, Lead, COMERCIAIS } from "@/data/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  MapPin, CheckCircle2, XCircle, Clock, Trophy, TrendingUp,
  Play, Square, RotateCcw, User, Building2, Lock
} from "lucide-react";

interface Visita {
  id: string;
  lead_id: string;
  lead_empresa: string;
  comercial: string;
  data_visita: string;
  duracao_min: number;
  status: string;
  notas: string | null;
  endereco: string | null;
  lat: number | null;
  lng: number | null;
}

const PASSWORD = "56239050";

export default function GestaoComercialCampo() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  if (!authenticated) {
    return <PasswordGate
      value={passwordInput}
      onChange={setPasswordInput}
      error={passwordError}
      onSubmit={() => {
        if (passwordInput === PASSWORD) {
          setAuthenticated(true);
          setPasswordError(false);
        } else {
          setPasswordError(true);
        }
      }}
    />;
  }

  return <ExecucaoCampo />;
}

function PasswordGate({ value, onChange, error, onSubmit }: {
  value: string; onChange: (v: string) => void; error: boolean; onSubmit: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <CardTitle className="text-lg">Gestão Comercial Campo</CardTitle>
          <p className="text-sm text-muted-foreground">Digite a senha para acessar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pw">Senha</Label>
            <Input
              id="pw"
              type="password"
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSubmit()}
              placeholder="••••••••"
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive mt-1">Senha incorreta</p>}
          </div>
          <Button className="w-full" onClick={onSubmit}>Entrar</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ExecucaoCampo() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const leads = useMemo(() => getInitialLeads(), []);

  const fetchVisitas = async () => {
    setLoading(true);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from("visitas")
      .select("*")
      .gte("data_visita", startOfDay)
      .lte("data_visita", endOfDay)
      .order("data_visita", { ascending: true });

    if (data) setVisitas(data);
    setLoading(false);
  };

  useEffect(() => { fetchVisitas(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("visitas")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      toast({ title: "Status atualizado", description: `Visita marcada como "${newStatus}"` });
      fetchVisitas();
    }
  };

  // Stats
  const totalHoje = visitas.length;
  const realizadas = visitas.filter(v => v.status === "realizada").length;
  const naoRealizadas = visitas.filter(v => v.status === "cancelada" || v.status === "nao_realizada").length;
  const pendentes = visitas.filter(v => v.status === "pendente").length;
  const emVisita = visitas.filter(v => v.status === "em_visita").length;
  const taxa = totalHoje > 0 ? Math.round((realizadas / totalHoje) * 100) : 0;

  // Top vendedor
  const vendedorCount: Record<string, number> = {};
  visitas.filter(v => v.status === "realizada").forEach(v => {
    vendedorCount[v.comercial] = (vendedorCount[v.comercial] || 0) + 1;
  });
  const topVendedor = Object.entries(vendedorCount).sort((a, b) => b[1] - a[1])[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case "em_visita": return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30"><MapPin className="h-3 w-3 mr-1" />Em visita</Badge>;
      case "realizada": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Finalizado</Badge>;
      case "cancelada":
      case "nao_realizada": return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Não visitado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold">Execução de Campo</h1>
        <span className="text-sm text-muted-foreground ml-2">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </span>
      </div>

      {/* Cards de visão geral */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{totalHoje}</p>
            <p className="text-xs text-muted-foreground">Visitas hoje</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-2xl font-bold text-emerald-600">{realizadas}</p>
            <p className="text-xs text-muted-foreground">Realizadas</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/30">
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-500 mb-1" />
            <p className="text-2xl font-bold text-red-600">{naoRealizadas}</p>
            <p className="text-xs text-muted-foreground">Não realizadas</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold text-amber-600">{taxa}%</p>
            <p className="text-xs text-muted-foreground">Taxa de conversão</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <Trophy className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-sm font-bold truncate">{topVendedor ? topVendedor[0] : "—"}</p>
            <p className="text-xs text-muted-foreground">
              {topVendedor ? `${topVendedor[1]} visita(s)` : "Top vendedor"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de check-in */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Mapa de Visitas — Check-in em tempo real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapaCheckin visitas={visitas} leads={leads} onUpdateStatus={updateStatus} />
        </CardContent>
      </Card>

      {/* Lista de visitas do dia */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">📋 Visitas do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm text-center py-8">Carregando visitas...</p>
          ) : visitas.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhuma visita agendada para hoje.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estabelecimento</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitas.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {v.lead_empresa}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {v.endereco || "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(v.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" /> {v.comercial}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(parseISO(v.data_visita), "HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {v.status === "pendente" && (
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-500/30 h-7 text-xs"
                              onClick={() => updateStatus(v.id, "em_visita")}>
                              <Play className="h-3 w-3 mr-1" /> Iniciar
                            </Button>
                          )}
                          {v.status === "em_visita" && (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-500/30 h-7 text-xs"
                              onClick={() => updateStatus(v.id, "realizada")}>
                              <Square className="h-3 w-3 mr-1" /> Finalizar
                            </Button>
                          )}
                          {(v.status === "pendente" || v.status === "cancelada" || v.status === "nao_realizada") && (
                            <Button size="sm" variant="ghost" className="text-muted-foreground h-7 text-xs"
                              onClick={() => updateStatus(v.id, "nao_realizada")}>
                              <RotateCcw className="h-3 w-3 mr-1" /> Remarcar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MapaCheckin({ visitas, leads, onUpdateStatus }: {
  visitas: Visita[]; leads: Lead[]; onUpdateStatus: (id: string, s: string) => void;
}) {
  // Simple map representation showing visit pins
  const visitasComCoord = visitas.filter(v => v.lat && v.lng);
  const leadsMap = new Map(leads.map(l => [l.id, l]));

  if (visitasComCoord.length === 0 && visitas.length === 0) {
    return (
      <div className="h-64 rounded-lg bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Nenhuma visita com coordenadas para exibir no mapa</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-48 rounded-lg bg-gradient-to-br from-muted/20 to-muted/40 border border-border p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {visitas.map(v => {
            const statusColor = v.status === "realizada" ? "border-emerald-500 bg-emerald-500/5"
              : v.status === "em_visita" ? "border-blue-500 bg-blue-500/5"
              : v.status === "cancelada" || v.status === "nao_realizada" ? "border-red-500 bg-red-500/5"
              : "border-amber-500 bg-amber-500/5";
            return (
              <div key={v.id} className={`rounded-md border p-2 text-xs ${statusColor} flex items-center justify-between`}>
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate font-medium">{v.lead_empresa}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  {v.status === "pendente" && (
                    <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px] text-blue-600"
                      onClick={() => onUpdateStatus(v.id, "em_visita")}>Check-in</Button>
                  )}
                  {v.status === "em_visita" && (
                    <Button size="sm" variant="ghost" className="h-5 px-1 text-[10px] text-emerald-600"
                      onClick={() => onUpdateStatus(v.id, "realizada")}>Finalizar</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pendente</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Em visita</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Finalizado</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Não visitado</span>
      </div>
    </div>
  );
}
