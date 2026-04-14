import { useState } from "react";
import { Users, Shield, Plus, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { funcionarios as initialFuncionarios, todosModulos, servicos, type Funcionario, type ComissaoConfig } from "@/data/mockData";
import { toast } from "sonner";

const cargoLabels: Record<string, string> = {
  admin: 'Administrador',
  banhista: 'Banhista',
  tosador: 'Tosador',
  auxiliar: 'Auxiliar',
};

const moduloLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  agendamentos: 'Agendamentos',
  fila: 'Fila do Dia',
  'pets-tutores': 'Pets & Tutores',
  servicos: 'Serviços',
  financeiro: 'Financeiro',
  configuracoes: 'Configurações',
  equipe: 'Equipe',
  comissoes: 'Comissões',
  'minhas-comissoes': 'Minhas Comissões',
};

export default function Equipe() {
  const [funcs, setFuncs] = useState<Funcionario[]>(initialFuncionarios);
  const [editFunc, setEditFunc] = useState<Funcionario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const togglePermissao = (funcId: string, modulo: string) => {
    setFuncs(prev => prev.map(f => {
      if (f.id !== funcId || f.papel === 'admin') return f;
      const has = f.permissoes.includes(modulo);
      return { ...f, permissoes: has ? f.permissoes.filter(p => p !== modulo) : [...f.permissoes, modulo] };
    }));
    toast.success('Permissão atualizada');
  };

  const openComissaoEditor = (func: Funcionario) => {
    setEditFunc({ ...func, comissoes: [...func.comissoes] });
    setDialogOpen(true);
  };

  const saveComissoes = () => {
    if (!editFunc) return;
    setFuncs(prev => prev.map(f => f.id === editFunc.id ? { ...f, comissoes: editFunc.comissoes } : f));
    setDialogOpen(false);
    toast.success('Comissões atualizadas');
  };

  const updateComissaoConfig = (servicoId: string, field: keyof ComissaoConfig, value: string | number) => {
    if (!editFunc) return;
    const existing = editFunc.comissoes.find(c => c.servicoId === servicoId);
    if (existing) {
      setEditFunc({
        ...editFunc,
        comissoes: editFunc.comissoes.map(c =>
          c.servicoId === servicoId ? { ...c, [field]: field === 'valor' ? Number(value) : value } : c
        ),
      });
    } else {
      setEditFunc({
        ...editFunc,
        comissoes: [...editFunc.comissoes, { servicoId, tipo: 'percentual' as const, valor: Number(value) || 0 }],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Equipe</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie funcionários, permissões e comissões</p>
      </div>

      {/* Funcionários */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {funcs.map(func => (
          <Card key={func.id} className="border-none shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{func.nome}</p>
                  <Badge variant="secondary" className="text-xs mt-1">{cargoLabels[func.cargo] || func.cargo}</Badge>
                </div>
                {func.papel !== 'admin' && (
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => openComissaoEditor(func)}>
                    <Edit2 className="h-3 w-3" /> Comissões
                  </Button>
                )}
              </div>

              {/* Comissões resumo */}
              {func.comissoes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Comissões configuradas:</p>
                  {func.comissoes.map(c => {
                    const srv = servicos.find(s => s.id === c.servicoId);
                    return (
                      <p key={c.servicoId} className="text-xs text-muted-foreground">
                        {srv?.nome}: {c.tipo === 'percentual' ? `${c.valor}%` : `R$ ${c.valor}`}
                      </p>
                    );
                  })}
                </div>
              )}

              {/* Permissões */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Shield className="h-3 w-3" /> Permissões
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {todosModulos.map(mod => {
                    const has = func.papel === 'admin' || func.permissoes.includes(mod);
                    return (
                      <button
                        key={mod}
                        onClick={() => togglePermissao(func.id, mod)}
                        disabled={func.papel === 'admin'}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          has
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        } ${func.papel === 'admin' ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {moduloLabels[mod] || mod}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog editar comissões */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Comissões - {editFunc?.nome}</DialogTitle>
          </DialogHeader>
          {editFunc && (
            <div className="space-y-3">
              {servicos.filter(s => s.ativo).map(srv => {
                const config = editFunc.comissoes.find(c => c.servicoId === srv.id);
                return (
                  <div key={srv.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <span className="flex-1 text-sm font-medium">{srv.nome}</span>
                    <select
                      value={config?.tipo || 'percentual'}
                      onChange={e => updateComissaoConfig(srv.id, 'tipo', e.target.value)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      <option value="percentual">%</option>
                      <option value="fixo">R$</option>
                    </select>
                    <Input
                      type="number"
                      min={0}
                      className="w-20 h-8 text-xs"
                      value={config?.valor || ''}
                      onChange={e => updateComissaoConfig(srv.id, 'valor', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                );
              })}
              <Button className="w-full" onClick={saveComissoes}>Salvar Comissões</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
