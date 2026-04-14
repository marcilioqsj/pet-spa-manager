import { useState } from "react";
import { DollarSign, CheckCircle2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { comissoes as initialComissoes, funcionarios, movimentacoesFuncionarios, type Comissao } from "@/data/mockData";
import { toast } from "sonner";

export default function Comissoes() {
  const [lista, setLista] = useState<Comissao[]>(initialComissoes);
  const [filtroFunc, setFiltroFunc] = useState('');

  const filtered = filtroFunc ? lista.filter(c => c.funcionarioId === filtroFunc) : lista;

  const totalPendente = filtered.filter(c => !c.pago).reduce((s, c) => s + c.valorComissao, 0);
  const totalPago = filtered.filter(c => c.pago).reduce((s, c) => s + c.valorComissao, 0);

  const marcarPago = (id: string) => {
    setLista(prev => prev.map(c => c.id === id ? { ...c, pago: true, dataPagamento: new Date().toISOString().split('T')[0] } : c));
    toast.success('Comissão marcada como paga');
  };

  // Resumo por funcionário
  const resumoPorFunc = funcionarios.filter(f => f.papel === 'funcionario').map(func => {
    const comFunc = lista.filter(c => c.funcionarioId === func.id);
    const movFunc = movimentacoesFuncionarios.filter(m => m.funcionarioId === func.id);
    const bruto = comFunc.filter(c => !c.pago).reduce((s, c) => s + c.valorComissao, 0);
    const descontos = movFunc.reduce((s, m) => s + m.valor, 0);
    return { func, bruto, descontos, liquido: Math.max(0, bruto - descontos), pendentes: comFunc.filter(c => !c.pago).length };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Comissões</h1>
        <p className="text-muted-foreground text-sm mt-1">Controle de comissões da equipe</p>
      </div>

      {/* Cards resumo */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="border-none shadow-md bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pendentes</p>
                <p className="text-3xl font-bold mt-1">R$ {totalPendente.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pagas no Mês</p>
                <p className="text-3xl font-bold mt-1">R$ {totalPago.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por funcionário */}
      <div className="grid gap-4 md:grid-cols-2">
        {resumoPorFunc.map(({ func, bruto, descontos, liquido, pendentes }) => (
          <Card key={func.id} className="border-none shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{func.nome}</p>
                  <p className="text-xs text-muted-foreground capitalize">{func.cargo}</p>
                </div>
                <Badge variant={pendentes > 0 ? 'default' : 'secondary'} className="text-xs">
                  {pendentes} pendente{pendentes !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Bruto</p>
                  <p className="text-sm font-semibold">R$ {bruto.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-destructive/5 p-2">
                  <p className="text-xs text-muted-foreground">Descontos</p>
                  <p className="text-sm font-semibold text-destructive">R$ {descontos.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-success/5 p-2">
                  <p className="text-xs text-muted-foreground">Líquido</p>
                  <p className="text-sm font-semibold text-success">R$ {liquido.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela detalhada */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Detalhamento</CardTitle>
            <select
              value={filtroFunc}
              onChange={e => setFiltroFunc(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value="">Todos</option>
              {funcionarios.filter(f => f.papel === 'funcionario').map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Data</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead className="text-right">Valor Serviço</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.sort((a, b) => b.data.localeCompare(a.data)).map(c => {
                  const func = funcionarios.find(f => f.id === c.funcionarioId);
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="text-sm">{new Date(c.data + 'T12:00:00').toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="font-medium">{func?.nome}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{c.servicoNome}</Badge></TableCell>
                      <TableCell>{c.petNome}</TableCell>
                      <TableCell className="text-right text-sm">R$ {c.valorServico}</TableCell>
                      <TableCell className="text-right font-semibold">R$ {c.valorComissao.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        {c.pago ? (
                          <Badge className="bg-success/10 text-success text-xs">Pago</Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => marcarPago(c.id)}>
                            Marcar Pago
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
