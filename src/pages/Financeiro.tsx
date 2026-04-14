import { useState } from "react";
import { DollarSign, TrendingUp, BarChart3, Filter, Plus, Package, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { agendamentos, funcionarios, movimentacoesFuncionarios as initialMovs, type MovimentacaoFuncionario } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "sonner";

export default function Financeiro() {
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [movs, setMovs] = useState<MovimentacaoFuncionario[]>(initialMovs);
  const [movDialogOpen, setMovDialogOpen] = useState(false);
  const [filtroFunc, setFiltroFunc] = useState('');

  const concluidos = agendamentos.filter(a => a.status === 'concluido');
  const totalFaturado = concluidos.reduce((s, a) => s + a.valor, 0);
  const totalAtendimentos = concluidos.length;
  const ticketMedio = totalAtendimentos > 0 ? Math.round(totalFaturado / totalAtendimentos) : 0;

  const servicoStats = concluidos.reduce<Record<string, { count: number; total: number }>>((acc, a) => {
    if (!acc[a.servico]) acc[a.servico] = { count: 0, total: 0 };
    acc[a.servico].count++;
    acc[a.servico].total += a.valor;
    return acc;
  }, {});

  const chartData = Object.entries(servicoStats).map(([servico, data]) => ({
    servico,
    faturamento: data.total,
    atendimentos: data.count,
  }));

  let filtered = concluidos;
  if (periodoInicio) filtered = filtered.filter(a => a.data >= periodoInicio);
  if (periodoFim) filtered = filtered.filter(a => a.data <= periodoFim);
  filtered = filtered.sort((a, b) => b.data.localeCompare(a.data) || b.hora.localeCompare(a.hora));

  const filteredTotal = filtered.reduce((s, a) => s + a.valor, 0);

  // Movimentações filtradas
  let filteredMovs = movs;
  if (filtroFunc) filteredMovs = filteredMovs.filter(m => m.funcionarioId === filtroFunc);
  filteredMovs = filteredMovs.sort((a, b) => b.data.localeCompare(a.data));
  const totalMovs = filteredMovs.reduce((s, m) => s + m.valor, 0);

  const handleCreateMov = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nova: MovimentacaoFuncionario = {
      id: `mov${Date.now()}`,
      funcionarioId: form.get('funcionarioId') as string,
      tipo: form.get('tipo') as 'vale' | 'produto',
      valor: Number(form.get('valor')),
      descricao: form.get('descricao') as string,
      data: new Date().toISOString().split('T')[0],
    };
    setMovs(prev => [...prev, nova]);
    setMovDialogOpen(false);
    toast.success('Movimentação registrada!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm mt-1">Controle de faturamento e serviços</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-none shadow-md bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Faturado</p>
                <p className="text-3xl font-bold mt-1">R$ {totalFaturado}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Atendimentos</p>
                <p className="text-3xl font-bold mt-1">{totalAtendimentos}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticket Médio</p>
                <p className="text-3xl font-bold mt-1">R$ {ticketMedio}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faturamento">
        <TabsList>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações da Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="faturamento" className="space-y-6 mt-4">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-md border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Faturamento por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="servico" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      formatter={(value: number) => [`R$ ${value}`, 'Faturamento']}
                    />
                    <Bar dataKey="faturamento" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Detalhamento por Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(servicoStats).map(([servico, data]) => (
                  <div key={servico} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <div>
                      <p className="font-semibold text-sm">{servico}</p>
                      <p className="text-xs text-muted-foreground">{data.count} atendimentos</p>
                    </div>
                    <p className="font-bold text-primary">R$ {data.total}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md border-none">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg">Serviços Realizados</CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Input type="date" value={periodoInicio} onChange={e => setPeriodoInicio(e.target.value)} className="w-36 text-xs" />
                  <span className="text-muted-foreground text-xs">até</span>
                  <Input type="date" value={periodoFim} onChange={e => setPeriodoFim(e.target.value)} className="w-36 text-xs" />
                </div>
              </div>
              {(periodoInicio || periodoFim) && (
                <p className="text-sm text-muted-foreground mt-1">
                  Total no período: <span className="font-semibold text-foreground">R$ {filteredTotal}</span> · {filtered.length} atendimentos
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Data</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="text-sm">{new Date(a.data + 'T12:00:00').toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-medium">{a.petNome}</TableCell>
                        <TableCell className="text-muted-foreground">{a.tutorNome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{a.servico}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">R$ {a.valor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimentacoes" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={filtroFunc}
                onChange={e => setFiltroFunc(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="">Todos os funcionários</option>
                {funcionarios.filter(f => f.papel === 'funcionario').map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">R$ {totalMovs.toFixed(2)}</span>
              </span>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setMovDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Registrar Vale/Produto
            </Button>
          </div>

          <Card className="border-none shadow-md">
            <CardContent className="p-0">
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Data</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovs.map(m => {
                      const func = funcionarios.find(f => f.id === m.funcionarioId);
                      return (
                        <TableRow key={m.id}>
                          <TableCell className="text-sm">{new Date(m.data + 'T12:00:00').toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="font-medium">{func?.nome}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs gap-1">
                              {m.tipo === 'vale' ? <Banknote className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                              {m.tipo === 'vale' ? 'Vale' : 'Produto'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{m.descricao}</TableCell>
                          <TableCell className="text-right font-semibold text-destructive">R$ {m.valor.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog registrar movimentação */}
      <Dialog open={movDialogOpen} onOpenChange={setMovDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar Vale / Produto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateMov} className="space-y-4">
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <select name="funcionarioId" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione...</option>
                {funcionarios.filter(f => f.papel === 'funcionario').map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select name="tipo" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="vale">Vale (dinheiro)</option>
                <option value="produto">Produto</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input name="valor" type="number" min={0.01} step={0.01} required placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input name="descricao" required placeholder="Ex: Vale em dinheiro" />
            </div>
            <Button type="submit" className="w-full">Registrar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
