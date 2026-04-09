import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldAlert, Download } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EXPORT_PASSWORD = "56239050";

export default function ExportDialog({ open, onClose, onConfirm }: ExportDialogProps) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  const handleConfirm = () => {
    if (senha === EXPORT_PASSWORD) {
      setErro(false);
      setSenha("");
      onConfirm();
      onClose();
    } else {
      setErro(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setSenha(""); setErro(false); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Lock className="h-5 w-5" /> Exportação Protegida
          </DialogTitle>
          <DialogDescription className="sr-only">Autorização para exportar leads</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              A exportação de leads só pode ser realizada com <strong className="text-foreground">autorização</strong>.
              Sem registros de interação direta pela plataforma, os dados não podem ser exportados livremente.
              Garanta que seus leads possuem atividade registrada no sistema antes de solicitar a exportação.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha de autorização</label>
            <Input
              type="password"
              placeholder="Digite a senha"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErro(false); }}
              onKeyDown={e => e.key === "Enter" && handleConfirm()}
            />
            {erro && <p className="text-xs text-destructive">Senha incorreta. Solicite ao gestor.</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleConfirm} className="gold-gradient text-background font-semibold">
              <Download className="h-4 w-4 mr-1" /> Exportar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
