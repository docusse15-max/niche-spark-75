import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserPlus, LogIn, Lock, ShieldAlert } from "lucide-react";
import logoVfmoney from "@/assets/logo-vfmoney.png";
import { trackEvent, initLocationTracking } from "@/lib/activity-tracker";
import { toast } from "sonner";

const COMERCIAIS = ["Valdomiro", "Dorileu", "Felipe", "Gabi", "Janna", "Thyrson", "Paulo"];
const PASSWORD_PROTECTED_USERS = ["Valdomiro"];
const USER_PASSWORD = "56239050";
const LOCATION_EXCLUDED_USERS = ["Valdomiro"];

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const savedNames: string[] = JSON.parse(localStorage.getItem("crm_custom_comerciais") || "[]");
  const allNames = [...COMERCIAIS, ...savedNames.filter(n => !COMERCIAIS.includes(n))];

  const lastLogins: Record<string, number> = JSON.parse(localStorage.getItem("crm_last_logins") || "{}");

  const formatTimeSince = (name: string): string => {
    const ts = lastLogins[name];
    if (!ts) return "Nunca acessou";
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Acessou agora";
    if (mins < 60) return `Há ${mins} min sem acessar`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Há ${hours}h sem acessar`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Há ${days}d sem acessar`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Há ${months} mês(es) sem acessar`;
    const years = Math.floor(days / 365);
    return `Há ${years} ano(s) sem acessar`;
  };

  const finalizeLogin = (name: string) => {
    sessionStorage.setItem("crm_user", name);
    const updatedLogins = { ...lastLogins, [name]: Date.now() };
    localStorage.setItem("crm_last_logins", JSON.stringify(updatedLogins));
    if (!LOCATION_EXCLUDED_USERS.includes(name)) {
      initLocationTracking();
    }
    trackEvent({
      action: "login",
      author: name,
      details: `Login realizado`,
      page: "/login",
    });
    onLogin(name);
  };

  const handleLogin = () => {
    const name = showNewInput ? newName.trim() : selectedName;
    if (!name) return;

    if (showNewInput && !allNames.includes(name)) {
      const updated = [...savedNames, name];
      localStorage.setItem("crm_custom_comerciais", JSON.stringify(updated));
    }

    if (PASSWORD_PROTECTED_USERS.includes(name) && !showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }

    if (PASSWORD_PROTECTED_USERS.includes(name)) {
      if (password !== USER_PASSWORD) {
        setPasswordError(true);
        trackEvent({
          action: "tentativa_login_protegido",
          author: name,
          details: `Senha incorreta ao tentar login como ${name}`,
          page: "/login",
        });
        toast.warning("Tentativa registrada no sistema.");
        return;
      }
    }

    finalizeLogin(name);
  };

  const handleBackFromPassword = () => {
    setShowPasswordInput(false);
    setPassword("");
    setPasswordError(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border gold-border gold-glow">
        <CardHeader className="text-center space-y-3">
          <img src={logoVfmoney} alt="VF Money" className="h-14 mx-auto" />
          <CardTitle className="text-xl gold-text">Quem está acessando?</CardTitle>
          <p className="text-sm text-muted-foreground">Selecione seu nome para registrar suas atividades</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {showPasswordInput ? (
            <>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Acesso protegido para <strong className="text-foreground">{selectedName}</strong>. Digite a senha.
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Senha..."
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoFocus
                  className="h-12 text-base"
                />
                {passwordError && <p className="text-xs text-destructive flex items-center gap-1"><Lock className="h-3 w-3" /> Senha incorreta.</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleBackFromPassword}>Voltar</Button>
                <Button className="flex-1 gold-gradient text-background font-semibold hover:opacity-90" onClick={handleLogin}>
                  <LogIn className="h-5 w-5 mr-2" /> Entrar
                </Button>
              </div>
            </>
          ) : !showNewInput ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {allNames.map(name => (
                  <Button
                    key={name}
                    variant={selectedName === name ? "default" : "outline"}
                    className={`h-auto py-2 text-base flex-col gap-0.5 ${selectedName === name ? "gold-gradient text-background font-semibold" : "border-border hover:border-primary"}`}
                    onClick={() => setSelectedName(name)}
                  >
                    <span className="flex items-center">
                      {PASSWORD_PROTECTED_USERS.includes(name) && <Lock className="h-4 w-4 mr-1" />}
                      <User className="h-5 w-5 mr-2" />
                      {name}
                    </span>
                    <span className={`text-[10px] font-normal ${selectedName === name ? "text-background/80" : "text-muted-foreground"}`}>
                      {formatTimeSince(name)}
                    </span>
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-primary"
                onClick={() => { setShowNewInput(true); setSelectedName(null); }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sou novo(a) na equipe
              </Button>

              <Button
                className="w-full h-12 gold-gradient text-background font-semibold hover:opacity-90"
                disabled={!selectedName}
                onClick={handleLogin}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Entrar
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Digite seu nome..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="h-12 text-base"
                autoFocus
                onKeyDown={e => e.key === "Enter" && newName.trim() && handleLogin()}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowNewInput(false); setNewName(""); }}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1 gold-gradient text-background font-semibold hover:opacity-90"
                  disabled={!newName.trim()}
                  onClick={handleLogin}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
