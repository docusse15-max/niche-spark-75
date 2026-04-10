import { useState, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, RefreshCw, MapPin, Lock, ShieldAlert, Activity, Users,
  LogIn, MousePointerClick, FileText, Eye, TrendingUp, AlertTriangle, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoVfmoney from "@/assets/logo-vfmoney.png";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/activity-tracker";
import { toast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from "recharts";

const LOG_PASSWORD = "56239050";

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

const ACTION_META: Record<string, { label: string; color: string; icon: string; chartColor: string }> = {
  login:                { label: "Login",               color: "bg-green-500/20 text-green-400",   icon: "🔐", chartColor: "#22c55e" },
  logout:               { label: "Logout",              color: "bg-orange-500/20 text-orange-400", icon: "🚪", chartColor: "#f97316" },
  navegacao:            { label: "Navegação",           color: "bg-cyan-500/20 text-cyan-400",     icon: "📍", chartColor: "#06b6d4" },
  lead_criado:          { label: "Lead criado",         color: "bg-emerald-500/20 text-emerald-400", icon: "✨", chartColor: "#10b981" },
  status_alterado:      { label: "Status alterado",     color: "bg-amber-500/20 text-amber-400",   icon: "🔄", chartColor: "#f59e0b" },
  nota_adicionada:      { label: "Nota adicionada",     color: "bg-blue-500/20 text-blue-400",     icon: "📝", chartColor: "#3b82f6" },
  lead_exportado:       { label: "Lead exportado",      color: "bg-purple-500/20 text-purple-400", icon: "📤", chartColor: "#a855f7" },
  lead_excluido:        { label: "Lead excluído",       color: "bg-red-500/20 text-red-400",       icon: "🗑️", chartColor: "#ef4444" },
  acesso_log:           { label: "Acesso ao Log",       color: "bg-emerald-500/20 text-emerald-400", icon: "✅", chartColor: "#10b981" },
  tentativa_acesso_log: { label: "Tentativa de acesso", color: "bg-red-600/20 text-red-500",       icon: "🚨", chartColor: "#dc2626" },
};

const PIE_COLORS = ["#d4a843", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#06b6d4", "#ef4444", "#f97316", "#10b981", "#dc2626"];

export default function ActivityLog() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("crm_user") || "Desconhecido";

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000) as { data: LogEntry[] | null };
    setLog(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) {
      refresh();
      const interval = setInterval(refresh, 8000);
      return () => clearInterval(interval);
    }
  }, [refresh, authenticated]);

  const handlePasswordSubmit = () => {
    if (password === LOG_PASSWORD) {
      setAuthenticated(true);
      trackEvent({ action: "acesso_log", author: currentUser, details: "Acessou o Log de Atividades com senha correta", page: "/log" });
    } else {
      trackEvent({ action: "tentativa_acesso_log", author: currentUser, details: "Tentativa de acesso ao Log com senha incorreta", page: "/log" });
      toast({ title: "Senha incorreta", description: "Essa tentativa foi registrada no sistema.", variant: "destructive" });
      setPassword("");
    }
  };

  // ===== COMPUTED STATS =====
  const users = useMemo(() => [...new Set(log.map(e => e.author).filter(Boolean))], [log]);
  const actionTypes = useMemo(() => [...new Set(log.map(e => e.action))], [log]);

  const filteredLog = useMemo(() => {
    return log.filter(e => {
      if (filterUser !== "all" && e.author !== filterUser) return false;
      if (filterAction !== "all" && e.action !== filterAction) return false;
      return true;
    });
  }, [log, filterUser, filterAction]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayEntries = log.filter(e => e.created_at.slice(0, 10) === today);
    const logins = log.filter(e => e.action === "login").length;
    const loginsToday = todayEntries.filter(e => e.action === "login").length;
    const leadsCreated = log.filter(e => e.action === "lead_criado").length;
    const leadsToday = todayEntries.filter(e => e.action === "lead_criado").length;
    const alerts = log.filter(e => e.action === "tentativa_acesso_log").length;
    const withLocation = log.filter(e => e.latitude && e.longitude).length;
    return { total: log.length, todayTotal: todayEntries.length, logins, loginsToday, leadsCreated, leadsToday, alerts, withLocation, users: users.length };
  }, [log, users]);

  // Actions breakdown for pie chart
  const actionBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLog.forEach(e => { counts[e.action] = (counts[e.action] || 0) + 1; });
    return Object.entries(counts)
      .map(([action, count]) => ({ name: ACTION_META[action]?.label || action, value: count, action }))
      .sort((a, b) => b.value - a.value);
  }, [filteredLog]);

  // Activity per day (last 7 days)
  const dailyActivity = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    log.forEach(e => {
      const day = e.created_at.slice(0, 10);
      if (day in days) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      ações: count,
    }));
  }, [log]);

  // Activity per user
  const userActivity = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLog.forEach(e => { if (e.author) counts[e.author] = (counts[e.author] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, ações: count }))
      .sort((a, b) => b.ações - a.ações)
      .slice(0, 10);
  }, [filteredLog]);

  // Hourly heatmap (current day)
  const hourlyActivity = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const hours: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hours[i] = 0;
    log.filter(e => e.created_at.slice(0, 10) === today).forEach(e => {
      const h = new Date(e.created_at).getHours();
      hours[h]++;
    });
    return Object.entries(hours).map(([h, count]) => ({ hora: `${h}h`, ações: count }));
  }, [log]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border gold-border gold-glow">
          <CardHeader className="text-center space-y-3">
            <ShieldAlert className="h-12 w-12 mx-auto text-primary" />
            <CardTitle className="text-xl gold-text">Acesso Restrito</CardTitle>
            <p className="text-sm text-muted-foreground">O Log de Atividades é protegido. Digite a senha para acessar.</p>
            <p className="text-xs text-destructive/80">⚠️ Tentativas incorretas são registradas no sistema</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="password" placeholder="Digite a senha..." value={password} onChange={e => setPassword(e.target.value)} className="h-12 text-base text-center" autoFocus onKeyDown={e => e.key === "Enter" && password && handlePasswordSubmit()} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
              <Button className="flex-1 gold-gradient text-background font-semibold hover:opacity-90" disabled={!password} onClick={handlePasswordSubmit}><Lock className="h-4 w-4 mr-2" />Entrar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg gold-border">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary"><ArrowLeft className="h-5 w-5" /></Button>
            <img src={logoVfmoney} alt="VF Money" className="h-8 w-auto" />
            <div>
              <h1 className="text-xl font-bold gold-text">Central de Monitoramento</h1>
              <p className="text-xs text-muted-foreground">Visão completa de todas as atividades, acessos e interações</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} className="border-border hover:border-primary hover:text-primary"><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <StatCard icon={<Activity className="h-5 w-5" />} label="Total de Ações" value={stats.total} sub={`${stats.todayTotal} hoje`} />
          <StatCard icon={<LogIn className="h-5 w-5" />} label="Logins" value={stats.logins} sub={`${stats.loginsToday} hoje`} />
          <StatCard icon={<FileText className="h-5 w-5" />} label="Leads Criados" value={stats.leadsCreated} sub={`${stats.leadsToday} hoje`} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Usuários Ativos" value={stats.users} sub={`${stats.withLocation} c/ GPS`} />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Alertas" value={stats.alerts} sub="Tentativas" alert={stats.alerts > 0} />
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/20">👥 Por Usuário</TabsTrigger>
            <TabsTrigger value="hourly" className="data-[state=active]:bg-primary/20">🕐 Por Hora</TabsTrigger>
            <TabsTrigger value="feed" className="data-[state=active]:bg-primary/20">📋 Feed Completo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Daily Activity Area Chart */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" />Atividade nos últimos 7 dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={dailyActivity}>
                      <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(43, 75%, 52%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(43, 75%, 52%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
                      <XAxis dataKey="date" tick={{ fill: "hsl(220, 8%, 55%)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(220, 8%, 55%)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "hsl(220, 15%, 11%)", border: "1px solid hsl(220, 12%, 20%)", borderRadius: 8, color: "hsl(45, 10%, 90%)" }} />
                      <Area type="monotone" dataKey="ações" stroke="hsl(43, 75%, 52%)" fill="url(#goldGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Eye className="h-4 w-4" />Tipos de Ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={220}>
                      <PieChart>
                        <Pie data={actionBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                          {actionBreakdown.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(220, 15%, 11%)", border: "1px solid hsl(220, 12%, 20%)", borderRadius: 8, color: "hsl(45, 10%, 90%)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-1.5 max-h-[220px] overflow-y-auto">
                      {actionBreakdown.map((item, i) => (
                        <div key={item.action} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="text-muted-foreground">{item.name}</span>
                          </div>
                          <span className="font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Ações por Usuário <span className="text-[10px] text-primary/60">(clique para detalhar)</span></CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userActivity} layout="vertical" margin={{ left: 20 }} onClick={(data) => {
                      if (data?.activePayload?.[0]?.payload?.name) {
                        setSelectedUser(data.activePayload[0].payload.name);
                      }
                    }} style={{ cursor: "pointer" }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
                      <XAxis type="number" tick={{ fill: "hsl(220, 8%, 55%)", fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "hsl(220, 8%, 55%)", fontSize: 11 }} width={80} />
                      <Tooltip contentStyle={{ background: "hsl(220, 15%, 11%)", border: "1px solid hsl(220, 12%, 20%)", borderRadius: 8, color: "hsl(45, 10%, 90%)" }} />
                      <Bar dataKey="ações" fill="hsl(43, 75%, 52%)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Detail Panel */}
              {selectedUser ? (
                <UserDetailPanel user={selectedUser} log={log} onClose={() => setSelectedUser(null)} />
              ) : (
                <Card className="border-border flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <MousePointerClick className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Clique em um usuário no gráfico para ver o detalhamento completo</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="hourly">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Atividade por Hora (Hoje)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
                    <XAxis dataKey="hora" tick={{ fill: "hsl(220, 8%, 55%)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(220, 8%, 55%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(220, 15%, 11%)", border: "1px solid hsl(220, 12%, 20%)", borderRadius: 8, color: "hsl(45, 10%, 90%)" }} />
                    <Bar dataKey="ações" fill="hsl(43, 75%, 42%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed" className="space-y-3">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-[180px] h-9 bg-card border-border">
                  <SelectValue placeholder="Usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  {users.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[200px] h-9 bg-card border-border">
                  <SelectValue placeholder="Tipo de ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {actionTypes.map(a => <SelectItem key={a} value={a}>{ACTION_META[a]?.icon} {ACTION_META[a]?.label || a}</SelectItem>)}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground ml-auto">{filteredLog.length} registros</span>
            </div>

            {/* Feed */}
            {loading && log.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground"><p className="text-lg">Carregando...</p></div>
            ) : filteredLog.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground"><p>Nenhuma atividade encontrada</p></div>
            ) : (
              <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
                {filteredLog.map(entry => {
                  const date = new Date(entry.created_at);
                  const timeStr = date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
                  const hasLocation = entry.latitude && entry.longitude;
                  const mapsUrl = hasLocation ? `https://www.google.com/maps?q=${entry.latitude},${entry.longitude}` : null;
                  const meta = ACTION_META[entry.action];

                  return (
                    <div key={entry.id} className={`flex items-start gap-3 p-3 bg-card border rounded-lg transition-colors ${entry.action === "tentativa_acesso_log" ? "border-red-500/40 bg-red-500/5" : "border-border hover:border-primary/30"}`}>
                      <div className="text-xs text-muted-foreground whitespace-nowrap mt-0.5 w-[110px] shrink-0 font-mono">{timeStr}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-[10px] ${meta?.color || "bg-zinc-500/20 text-zinc-400"}`}>
                            {meta?.icon} {meta?.label || entry.action.replace("_", " ")}
                          </Badge>
                          {entry.lead_empresa && entry.lead_empresa !== "-" && (
                            <span className="font-semibold text-sm text-foreground">{entry.lead_empresa}</span>
                          )}
                          {entry.author && (
                            <span className="text-xs text-muted-foreground">
                              por <span className="font-medium text-primary">{entry.author}</span>
                            </span>
                          )}
                        </div>
                        {entry.details && <p className="text-xs text-muted-foreground mt-0.5">{entry.details}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          {entry.page && <span className="text-[10px] text-muted-foreground/60">📄 {entry.page}</span>}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, alert }: { icon: React.ReactNode; label: string; value: number; sub: string; alert?: boolean }) {
  return (
    <Card className={`border-border ${alert ? "border-red-500/40" : ""}`}>
      <CardContent className="p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className={`${alert ? "text-red-400" : "text-primary"}`}>{icon}</span>
          <span className={`text-2xl font-bold ${alert ? "text-red-400" : "gold-text"}`}>{value}</span>
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground/60">{sub}</span>
      </CardContent>
    </Card>
  );
}

function UserDetailPanel({ user, log, onClose }: { user: string; log: LogEntry[]; onClose: () => void }) {
  const userLog = useMemo(() => log.filter(e => e.author === user), [log, user]);

  const actionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    userLog.forEach(e => { counts[e.action] = (counts[e.action] || 0) + 1; });
    return Object.entries(counts)
      .map(([action, count]) => ({ action, count, ...(ACTION_META[action] || { label: action, icon: "•", color: "bg-zinc-500/20 text-zinc-400" }) }))
      .sort((a, b) => b.count - a.count);
  }, [userLog]);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = userLog.filter(e => e.created_at.slice(0, 10) === today).length;
  const firstSeen = userLog.length > 0 ? new Date(userLog[userLog.length - 1].created_at) : null;
  const lastSeen = userLog.length > 0 ? new Date(userLog[0].created_at) : null;
  const logins = userLog.filter(e => e.action === "login").length;
  const leadsCreated = userLog.filter(e => e.action === "lead_criado").length;
  const hasLocation = userLog.some(e => e.latitude && e.longitude);
  const lastLocation = userLog.find(e => e.latitude && e.longitude);

  const recentActions = userLog.slice(0, 15);

  return (
    <Card className="border-primary/30 border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base gold-text flex items-center gap-2">
            <Users className="h-4 w-4" /> {user}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs">✕ Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold gold-text">{userLog.length}</p>
            <p className="text-[10px] text-muted-foreground">Total de ações</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold gold-text">{todayCount}</p>
            <p className="text-[10px] text-muted-foreground">Ações hoje</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold gold-text">{logins}</p>
            <p className="text-[10px] text-muted-foreground">Logins</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold gold-text">{leadsCreated}</p>
            <p className="text-[10px] text-muted-foreground">Leads criados</p>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-1 text-xs text-muted-foreground">
          {firstSeen && <p>📅 Primeiro acesso: <span className="text-foreground">{firstSeen.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></p>}
          {lastSeen && <p>🕐 Último acesso: <span className="text-foreground">{lastSeen.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></p>}
          {lastLocation && (
            <p className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" />
              Última localização:
              <a href={`https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {(lastLocation.latitude as number).toFixed(4)}, {(lastLocation.longitude as number).toFixed(4)}
              </a>
            </p>
          )}
        </div>

        {/* Action Breakdown */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Breakdown de Ações</p>
          <div className="space-y-1.5">
            {actionCounts.map(item => {
              const pct = Math.round((item.count / userLog.length) * 100);
              return (
                <div key={item.action} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.icon} {item.label}</span>
                    <span className="font-semibold text-foreground">{item.count} <span className="text-muted-foreground/60">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Actions */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Últimas 15 ações</p>
          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
            {recentActions.map(entry => {
              const meta = ACTION_META[entry.action];
              const time = new Date(entry.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
              return (
                <div key={entry.id} className="flex items-center gap-2 text-[11px] p-1.5 rounded bg-secondary/30">
                  <span className="text-muted-foreground/60 w-[75px] shrink-0 font-mono">{time}</span>
                  <Badge className={`text-[9px] py-0 ${meta?.color || "bg-zinc-500/20 text-zinc-400"}`}>
                    {meta?.icon} {meta?.label || entry.action}
                  </Badge>
                  {entry.lead_empresa !== "-" && <span className="text-foreground truncate">{entry.lead_empresa}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
