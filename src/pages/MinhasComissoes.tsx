import { DollarSign, TrendingDown, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { comissoes, movimentacoesFuncionarios } from "@/data/mockData";

export default function MinhasComissoes() {
  const { usuario } = useAuth();
  if (!usuario) return null;

  const minhas = comissoes.filter(c => c.funcionarioId === usuario.id);
  const movs = movimentacoesFuncionarios.filter(m => m.funcionarioId === usuario.id);

  const totalBruto = minhas.reduce((s, c) => s + c.valorComissao, 0);
  const totalPendente = minhas.filter(c => !c.pago).reduce((s, c) => s + c.valorComissao, 0);
  const totalDescontos = movs.reduce((s, m) => s + m.valor, 0);
  const saldoLiquido = Math.max(0, totalPendente - totalDescontos);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Minhas Comissões</h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe seus ganhos e descontos</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase">Total Bruto</p>
            <p className="text-2xl font-bold mt-1">R$ {totalBruto.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase">Pendente</p>
            <p className="text-2xl font-bold mt-1">R$ {totalPendente.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase">Descontos</p>
            <p className="text-2xl font-bold mt-1 text-destructive">R$ {totalDescontos.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase">Saldo Líquido</p>
            <p className="text-2xl font-bold mt-1 text-success">R$ {saldoLiquido.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Comissões */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Serviços Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Data</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead className="text-right">Valor Serviço</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {minhas.sort((a, b) => b.data.localeCompare(a.data)).map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm">{new Date(c.data + 'T12:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{c.servicoNome}</Badge></TableCell>
                    <TableCell>{c.petNome}</TableCell>
                    <TableCell className="text-right text-sm">R$ {c.valorServico}</TableCell>
                    <TableCell className="text-right font-semibold">R$ {c.valorComissao.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {c.pago ? (
                        <Badge className="bg-success/10 text-success text-xs">Pago</Badge>
                      ) : (
                        <Badge className="bg-warning/10 text-warning text-xs">Pendente</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Movimentações (vales/produtos) */}
      {movs.length > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Vales & Produtos Descontados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movs.sort((a, b) => b.data.localeCompare(a.data)).map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm">{new Date(m.data + 'T12:00:00').toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{m.tipo}</Badge>
                      </TableCell>
                      <TableCell>{m.descricao}</TableCell>
                      <TableCell className="text-right font-semibold text-destructive">- R$ {m.valor.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
