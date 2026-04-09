import { Calendar, PawPrint, DollarSign, Clock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { agendamentos } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const hoje = new Date().toISOString().split('T')[0];

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  agendado: { label: 'Aguardando', icon: Clock, className: 'bg-info/10 text-info border-info/20' },
  em_andamento: { label: 'Em Atendimento', icon: Loader2, className: 'bg-warning/10 text-warning border-warning/20' },
  concluido: { label: 'Finalizado', icon: CheckCircle2, className: 'bg-success/10 text-success border-success/20' },
  cancelado: { label: 'Cancelado', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function Dashboard() {
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
  const concluidos = agendamentos.filter(a => a.status === 'concluido');
  const faturamentoHoje = agendamentosHoje.filter(a => a.status === 'concluido').reduce((s, a) => s + a.valor, 0);
  const faturamentoMes = concluidos.reduce((s, a) => s + a.valor, 0);

  // Dados para gráfico dos últimos 7 dias
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const count = agendamentos.filter(a => a.data === dateStr && a.status !== 'cancelado').length;
    return { dia: diaSemana, atendimentos: count };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral do seu petshop</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agendamentos Hoje</p>
                <p className="text-3xl font-bold mt-1">{agendamentosHoje.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pets Atendidos</p>
                <p className="text-3xl font-bold mt-1">{concluidos.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <PawPrint className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faturamento Hoje</p>
                <p className="text-3xl font-bold mt-1">R$ {faturamentoHoje}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-info/5 to-info/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faturamento Mês</p>
                <p className="text-3xl font-bold mt-1">R$ {faturamentoMes}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        {/* Próximos agendamentos */}
        <Card className="lg:col-span-3 shadow-md border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Agendamentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agendamentosHoje.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Nenhum agendamento para hoje</p>
            ) : (
              agendamentosHoje.map((a) => {
                const cfg = statusConfig[a.status];
                const Icon = cfg.icon;
                return (
                  <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <PawPrint className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{a.petNome}</p>
                      <p className="text-xs text-muted-foreground">{a.tutorNome} · {a.servico}</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground shrink-0">{a.hora}</span>
                    <Badge variant="outline" className={`shrink-0 gap-1 ${cfg.className}`}>
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Gráfico */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Atendimentos da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dias}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="atendimentos" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
