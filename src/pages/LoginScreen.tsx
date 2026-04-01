import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserPlus, LogIn } from "lucide-react";
import logoVfmoney from "@/assets/logo-vfmoney.png";

const COMERCIAIS = ["Dorileu", "Felipe", "Gabi", "Janna"];

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);

  // Check for previously saved custom names
  const savedNames: string[] = JSON.parse(localStorage.getItem("crm_custom_comerciais") || "[]");
  const allNames = [...COMERCIAIS, ...savedNames.filter(n => !COMERCIAIS.includes(n))];

  const handleLogin = () => {
    const name = showNewInput ? newName.trim() : selectedName;
    if (!name) return;

    // Save custom name if new
    if (showNewInput && !allNames.includes(name)) {
      const updated = [...savedNames, name];
      localStorage.setItem("crm_custom_comerciais", JSON.stringify(updated));
    }

    sessionStorage.setItem("crm_user", name);
    onLogin(name);
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
          {!showNewInput ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {allNames.map(name => (
                  <Button
                    key={name}
                    variant={selectedName === name ? "default" : "outline"}
                    className={`h-14 text-base ${selectedName === name ? "gold-gradient text-background font-semibold" : "border-border hover:border-primary"}`}
                    onClick={() => setSelectedName(name)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    {name}
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
