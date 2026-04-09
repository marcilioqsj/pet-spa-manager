import { useState } from "react";
import { Plus, Clock, CheckCircle2, Loader2, XCircle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { agendamentos as initialData, tutores, type Agendamento, type AgendamentoStatus, type ServicoTipo } from "@/data/mockData";
import { toast } from "sonner";

const statusConfig: Record<AgendamentoStatus, { label: string; icon: React.ElementType; className: string }> = {
  agendado: { label: 'Agendado', icon: Clock, className: 'bg-info/10 text-info border-info/20' },
  em_andamento: { label: 'Em Andamento', icon: Loader2, className: 'bg-warning/10 text-warning border-warning/20' },
  concluido: { label: 'Concluído', icon: CheckCircle2, className: 'bg-success/10 text-success border-success/20' },
  cancelado: { label: 'Cancelado', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(initialData);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const allPets = tutores.flatMap(t => t.pets.map(p => ({ ...p, tutorNome: t.nome })));

  const filtered = agendamentos
    .filter(a => filtroStatus === 'todos' || a.status === filtroStatus)
    .filter(a => a.petNome.toLowerCase().includes(busca.toLowerCase()) || a.tutorNome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (a.data !== b.data) return b.data.localeCompare(a.data);
      return a.hora.localeCompare(b.hora);
    });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const petId = form.get('petId') as string;
    const pet = allPets.find(p => p.id === petId);
    if (!pet) return;

    const novo: Agendamento = {
      id: `a${Date.now()}`,
      petId,
      petNome: pet.nome,
      tutorNome: pet.tutorNome,
      servico: form.get('servico') as ServicoTipo,
      data: form.get('data') as string,
      hora: form.get('hora') as string,
      status: 'agendado',
      observacoes: form.get('observacoes') as string,
      valor: Number(form.get('valor')),
    };
    setAgendamentos(prev => [novo, ...prev]);
    setDialogOpen(false);
    toast.success('Agendamento criado com sucesso!');
  };

  const updateStatus = (id: string, status: AgendamentoStatus) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Status atualizado para ${statusConfig[status].label}`);
  };

  // Agrupa por data
  const groupedByDate = filtered.reduce<Record<string, Agendamento[]>>((acc, a) => {
    (acc[a.data] = acc[a.data] || []).push(a);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    const hoje = new Date().toISOString().split('T')[0];
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    if (dateStr === hoje) return 'Hoje';
    if (dateStr === amanha.toISOString().split('T')[0]) return 'Amanhã';
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie os agendamentos do petshop</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Pet</Label>
                <select name="petId" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Selecione um pet...</option>
                  {allPets.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.tutorNome})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Serviço</Label>
                <select name="servico" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Banho">Banho</option>
                  <option value="Tosa">Tosa</option>
                  <option value="Banho + Tosa">Banho + Tosa</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input type="date" name="data" required />
                </div>
                <div className="space-y-2">
                  <Label>Hora</Label>
                  <Input type="time" name="hora" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input type="number" name="valor" required min={0} step={0.01} placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea name="observacoes" placeholder="Observações sobre o atendimento..." />
              </div>
              <Button type="submit" className="w-full">Criar Agendamento</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar pet ou tutor..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9" />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista agrupada por data */}
      {Object.keys(groupedByDate).length === 0 ? (
        <Card className="border-none shadow-md">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum agendamento encontrado
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider capitalize">{formatDate(date)}</h3>
            <div className="grid gap-3">
              {items.map(a => {
                const cfg = statusConfig[a.status];
                const Icon = cfg.icon;
                return (
                  <Card key={a.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg font-bold text-primary shrink-0 w-14">{a.hora}</span>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{a.petNome}</p>
                            <p className="text-sm text-muted-foreground">{a.tutorNome} · {a.servico}</p>
                            {a.observacoes && <p className="text-xs text-muted-foreground/70 mt-1 truncate">{a.observacoes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-semibold">R$ {a.valor}</span>
                          <Badge variant="outline" className={`gap-1 ${cfg.className}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </Badge>
                          {a.status === 'agendado' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, 'em_andamento')} className="text-xs">
                              Iniciar
                            </Button>
                          )}
                          {a.status === 'em_andamento' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, 'concluido')} className="text-xs">
                              Finalizar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
