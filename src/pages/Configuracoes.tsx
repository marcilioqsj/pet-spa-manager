import { useState } from "react";
import { Plus, CreditCard, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formasPagamento as initialFormas, type FormaPagamento } from "@/data/mockData";
import { toast } from "sonner";

export default function Configuracoes() {
  const [formas, setFormas] = useState<FormaPagamento[]>(initialFormas);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleForma = (id: string) => {
    setFormas(prev => prev.map(f => f.id === id ? { ...f, ativo: !f.ativo } : f));
    toast.success('Forma de pagamento atualizada');
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nova: FormaPagamento = {
      id: `fp${Date.now()}`,
      nome: form.get('nome') as string,
      ativo: true,
    };
    setFormas(prev => [...prev, nova]);
    setDialogOpen(false);
    toast.success('Forma de pagamento adicionada!');
  };

  const remover = (id: string) => {
    setFormas(prev => prev.filter(f => f.id !== id));
    toast.success('Forma de pagamento removida');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure as preferências do petshop</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {formas.map(fp => (
            <div
              key={fp.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-opacity ${!fp.ativo ? 'opacity-50' : ''}`}
            >
              <span className="font-medium text-sm">{fp.nome}</span>
              <div className="flex items-center gap-3">
                <Switch checked={fp.ativo} onCheckedChange={() => toggleForma(fp.id)} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => remover(fp.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nova Forma de Pagamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input name="nome" required placeholder="Ex: Vale Alimentação" />
            </div>
            <Button type="submit" className="w-full">Adicionar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
