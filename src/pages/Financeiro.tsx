import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { agendamentos } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Financeiro() {
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');

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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico por serviço */}
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

        {/* Stats por serviço */}
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

      {/* Tabela de serviços */}
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
    </div>
  );
}
