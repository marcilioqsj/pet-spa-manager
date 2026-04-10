import { useState } from "react";
import { Plus, Edit2, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { servicos as initialServicos, extras as initialExtras, type Servico, type Extra } from "@/data/mockData";
import { toast } from "sonner";

export default function Servicos() {
  const [servicosList, setServicosList] = useState<Servico[]>(initialServicos);
  const [extrasList, setExtrasList] = useState<Extra[]>(initialExtras);
  const [servicoDialog, setServicoDialog] = useState(false);
  const [extraDialog, setExtraDialog] = useState(false);
  const [editServico, setEditServico] = useState<Servico | null>(null);
  const [editExtra, setEditExtra] = useState<Extra | null>(null);

  const handleSaveServico = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const servico: Servico = {
      id: editServico?.id || `s${Date.now()}`,
      nome: form.get('nome') as string,
      precos: {
        pequeno: Number(form.get('pequeno')),
        medio: Number(form.get('medio')),
        grande: Number(form.get('grande')),
      },
      ativo: true,
    };
    if (editServico) {
      setServicosList(prev => prev.map(s => s.id === editServico.id ? servico : s));
      toast.success('Serviço atualizado!');
    } else {
      setServicosList(prev => [...prev, servico]);
      toast.success('Serviço criado!');
    }
    setServicoDialog(false);
    setEditServico(null);
  };

  const handleSaveExtra = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const extra: Extra = {
      id: editExtra?.id || `e${Date.now()}`,
      nome: form.get('nome') as string,
      preco: Number(form.get('preco')),
      ativo: true,
    };
    if (editExtra) {
      setExtrasList(prev => prev.map(ex => ex.id === editExtra.id ? extra : ex));
      toast.success('Extra atualizado!');
    } else {
      setExtrasList(prev => [...prev, extra]);
      toast.success('Extra criado!');
    }
    setExtraDialog(false);
    setEditExtra(null);
  };

  const toggleServico = (id: string) => {
    setServicosList(prev => prev.map(s => s.id === id ? { ...s, ativo: !s.ativo } : s));
  };

  const toggleExtra = (id: string) => {
    setExtrasList(prev => prev.map(e => e.id === id ? { ...e, ativo: !e.ativo } : e));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie os serviços e extras do petshop</p>
      </div>

      <Tabs defaultValue="servicos">
        <TabsList>
          <TabsTrigger value="servicos">Serviços Base</TabsTrigger>
          <TabsTrigger value="extras">Extras / Adicionais</TabsTrigger>
        </TabsList>

        <TabsContent value="servicos" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => { setEditServico(null); setServicoDialog(true); }}>
              <Plus className="h-4 w-4" /> Novo Serviço
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicosList.map(s => (
              <Card key={s.id} className={`border-none shadow-sm transition-opacity ${!s.ativo ? 'opacity-50' : ''}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Scissors className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{s.nome}</p>
                        <Badge variant={s.ativo ? 'default' : 'secondary'} className="text-[10px] mt-0.5">
                          {s.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={s.ativo} onCheckedChange={() => toggleServico(s.id)} />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditServico(s); setServicoDialog(true); }}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-[10px] text-muted-foreground uppercase">Pequeno</p>
                      <p className="text-sm font-bold">R$ {s.precos.pequeno}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-[10px] text-muted-foreground uppercase">Médio</p>
                      <p className="text-sm font-bold">R$ {s.precos.medio}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-[10px] text-muted-foreground uppercase">Grande</p>
                      <p className="text-sm font-bold">R$ {s.precos.grande}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="extras" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => { setEditExtra(null); setExtraDialog(true); }}>
              <Plus className="h-4 w-4" /> Novo Extra
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {extrasList.map(e => (
              <Card key={e.id} className={`border-none shadow-sm transition-opacity ${!e.ativo ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{e.nome}</p>
                      <p className="text-lg font-bold text-primary mt-1">R$ {e.preco}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={e.ativo} onCheckedChange={() => toggleExtra(e.id)} />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditExtra(e); setExtraDialog(true); }}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Serviço */}
      <Dialog open={servicoDialog} onOpenChange={(open) => { if (!open) { setServicoDialog(false); setEditServico(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editServico ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveServico} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input name="nome" required defaultValue={editServico?.nome || ''} placeholder="Nome do serviço" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Pequeno (R$)</Label>
                <Input type="number" name="pequeno" required min={0} step={0.01} defaultValue={editServico?.precos.pequeno || ''} />
              </div>
              <div className="space-y-2">
                <Label>Médio (R$)</Label>
                <Input type="number" name="medio" required min={0} step={0.01} defaultValue={editServico?.precos.medio || ''} />
              </div>
              <div className="space-y-2">
                <Label>Grande (R$)</Label>
                <Input type="number" name="grande" required min={0} step={0.01} defaultValue={editServico?.precos.grande || ''} />
              </div>
            </div>
            <Button type="submit" className="w-full">{editServico ? 'Salvar' : 'Criar Serviço'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Extra */}
      <Dialog open={extraDialog} onOpenChange={(open) => { if (!open) { setExtraDialog(false); setEditExtra(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editExtra ? 'Editar Extra' : 'Novo Extra'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveExtra} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input name="nome" required defaultValue={editExtra?.nome || ''} placeholder="Nome do extra" />
            </div>
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input type="number" name="preco" required min={0} step={0.01} defaultValue={editExtra?.preco || ''} />
            </div>
            <Button type="submit" className="w-full">{editExtra ? 'Salvar' : 'Criar Extra'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
