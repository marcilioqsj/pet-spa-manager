import { useState, useEffect } from "react";
import { ArrowRight, Clock, DollarSign, Truck, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  agendamentos,
  extras as extrasData,
  formasPagamento,
  funcionarios,
  tags as tagsData,
  tutores,
  type FilaEtapa,
  type FilaItem,
} from "@/data/mockData";
import { toast } from "sonner";

const etapas: { key: FilaEtapa; label: string; cor: string }[] = [
  { key: 'aguardando', label: 'Aguardando', cor: 'bg-muted text-muted-foreground' },
  { key: 'banho', label: 'Banho', cor: 'bg-info/10 text-info' },
  { key: 'tosa', label: 'Tosa', cor: 'bg-warning/10 text-warning' },
  { key: 'secagem', label: 'Secagem', cor: 'bg-primary/10 text-primary' },
  { key: 'finalizado', label: 'Finalizado', cor: 'bg-success/10 text-success' },
];

function getMinutesElapsed(start: Date) {
  return Math.floor((Date.now() - start.getTime()) / 60000);
}

function getTimeColor(minutes: number) {
  if (minutes > 60) return 'text-destructive';
  if (minutes > 30) return 'text-warning';
  return 'text-muted-foreground';
}

export default function FilaAtendimento() {
  const hoje = new Date().toISOString().split('T')[0];

  const initialItems: FilaItem[] = agendamentos
    .filter(a => a.data === hoje && a.status !== 'cancelado')
    .map(a => {
      const pet = tutores.flatMap(t => t.pets).find(p => p.id === a.petId);
      let etapa: FilaEtapa = 'aguardando';
      if (a.status === 'concluido') etapa = 'finalizado';
      else if (a.status === 'em_andamento') etapa = 'banho';

      return {
        agendamentoId: a.id,
        petNome: a.petNome,
        tutorNome: a.tutorNome,
        servico: a.servico,
        hora: a.hora,
        etapa,
        inicioEtapa: new Date(),
        pago: a.status === 'concluido',
        extras: a.extras || [],
        transporte: a.transporte,
        petTags: pet?.tags || [],
      };
    });

  const [fila, setFila] = useState<FilaItem[]>(initialItems);
  const [checkoutItem, setCheckoutItem] = useState<FilaItem | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [formaPag, setFormaPag] = useState('');
  const [desconto, setDesconto] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const avancar = (item: FilaItem) => {
    const ordem: FilaEtapa[] = ['aguardando', 'banho', 'tosa', 'secagem', 'finalizado'];
    const idx = ordem.indexOf(item.etapa);
    if (idx >= ordem.length - 1) return;
    const proxima = ordem[idx + 1];

    if (proxima === 'finalizado') {
      setSelectedExtras(item.extras);
      setCheckoutItem(item);
      return;
    }

    setFila(prev => prev.map(f =>
      f.agendamentoId === item.agendamentoId
        ? { ...f, etapa: proxima, inicioEtapa: new Date() }
        : f
    ));
    toast.success(`${item.petNome} movido para ${etapas.find(e => e.key === proxima)?.label}`);
  };

  const registrarPagamento = () => {
    if (!checkoutItem || !formaPag) {
      toast.error('Selecione a forma de pagamento');
      return;
    }
    setFila(prev => prev.map(f =>
      f.agendamentoId === checkoutItem.agendamentoId
        ? { ...f, etapa: 'finalizado', pago: true, extras: selectedExtras }
        : f
    ));
    setCheckoutItem(null);
    setFormaPag('');
    setDesconto('');
    setFuncionarioId('');
    toast.success('Pagamento registrado com sucesso!');
  };

  const calcularTotal = () => {
    if (!checkoutItem) return { base: 0, extrasTotal: 0, acrescimo: 0, descontoVal: 0, total: 0 };
    const ag = agendamentos.find(a => a.id === checkoutItem.agendamentoId);
    const base = ag?.valor || 0;
    const extrasTotal = selectedExtras.reduce((sum, eId) => {
      const ex = extrasData.find(e => e.id === eId);
      return sum + (ex?.preco || 0);
    }, 0);
    const subtotal = base + extrasTotal;
    const fp = formasPagamento.find(f => f.id === formaPag);
    const acrescimoPercent = fp?.acrescimo || 0;
    const acrescimo = subtotal * acrescimoPercent / 100;
    const descontoVal = Number(desconto) || 0;
    const total = Math.max(0, subtotal + acrescimo - descontoVal);
    return { base, extrasTotal, acrescimo, descontoVal, total };
  };

  const transportes = fila.filter(f => f.transporte?.necessita);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fila do Dia</h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe o fluxo de atendimento em tempo real</p>
      </div>

      {/* Transportes do dia */}
      {transportes.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Transportes do Dia</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {transportes.map(t => (
                <div key={t.agendamentoId} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{t.petNome}</p>
                    <p className="text-xs text-muted-foreground">{t.transporte?.enderecoColeta}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p>Coleta: <span className="font-semibold">{t.transporte?.horarioColeta}</span></p>
                    <p>Retorno: <span className="font-semibold">{t.transporte?.horarioRetorno}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {etapas.map(etapa => {
          const items = fila.filter(f => f.etapa === etapa.key);
          return (
            <div key={etapa.key} className="space-y-3">
              <div className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${etapa.cor}`}>
                {etapa.label}
                <Badge variant="secondary" className="ml-2 text-xs">{items.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {items.map(item => {
                  const minutes = getMinutesElapsed(item.inicioEtapa);
                  const petTags = item.petTags.map(tId => tagsData.find(t => t.id === tId)).filter(Boolean);
                  return (
                    <Card key={item.agendamentoId} className="border-none shadow-sm">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{item.petNome}</p>
                            <p className="text-xs text-muted-foreground">{item.tutorNome}</p>
                          </div>
                          {item.transporte?.necessita && (
                            <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.servico}</p>
                        {petTags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {petTags.map(tag => tag && (
                              <span
                                key={tag.id}
                                className="inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                                style={{ backgroundColor: tag.cor }}
                              >
                                {tag.nome}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-1 text-xs ${getTimeColor(minutes)}`}>
                            <Clock className="h-3 w-3" />
                            {item.etapa !== 'finalizado' && <span>{minutes}min</span>}
                            {item.etapa === 'finalizado' && item.pago && (
                              <span className="text-success flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" /> Pago</span>
                            )}
                          </div>
                          <span className="text-xs font-medium">{item.hora}</span>
                        </div>
                        {item.etapa !== 'finalizado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs gap-1"
                            onClick={() => avancar(item)}
                          >
                            Avançar <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                        {item.etapa === 'finalizado' && !item.pago && (
                          <Button
                            size="sm"
                            className="w-full text-xs gap-1"
                            onClick={() => { setSelectedExtras(item.extras); setCheckoutItem(item); }}
                          >
                            <DollarSign className="h-3 w-3" /> Registrar Pagamento
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Fechamento */}
      <Dialog open={!!checkoutItem} onOpenChange={(open) => !open && setCheckoutItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fechamento - {checkoutItem?.petNome}</DialogTitle>
          </DialogHeader>
          {checkoutItem && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Serviço: {checkoutItem.servico}</span>
                  <span className="font-semibold">
                    R$ {agendamentos.find(a => a.id === checkoutItem.agendamentoId)?.valor || 0}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Tutor: {checkoutItem.tutorNome}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Extras / Adicionais</Label>
                <div className="grid grid-cols-2 gap-2">
                  {extrasData.filter(e => e.ativo).map(extra => (
                    <label key={extra.id} className="flex items-center gap-2 text-sm cursor-pointer rounded-lg border p-2 hover:bg-muted/30 transition-colors">
                      <Checkbox
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={(checked) =>
                          setSelectedExtras(prev =>
                            checked ? [...prev, extra.id] : prev.filter(id => id !== extra.id)
                          )
                        }
                      />
                      <span className="flex-1">{extra.nome}</span>
                      <span className="text-xs text-muted-foreground">R$ {extra.preco}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Forma de Pagamento</Label>
                <select
                  value={formaPag}
                  onChange={e => setFormaPag(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {formasPagamento.filter(f => f.ativo).map(fp => (
                    <option key={fp.id} value={fp.id}>{fp.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Desconto (R$)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={desconto}
                  onChange={e => setDesconto(e.target.value)}
                  placeholder="0,00"
                />
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">R$ {calcularTotal().toFixed(2)}</span>
                </div>
                {selectedExtras.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {selectedExtras.map(eId => {
                      const ex = extrasData.find(e => e.id === eId);
                      return ex && (
                        <p key={eId} className="text-xs text-muted-foreground">+ {ex.nome}: R$ {ex.preco}</p>
                      );
                    })}
                  </div>
                )}
                {Number(desconto) > 0 && (
                  <p className="text-xs text-destructive mt-1">- Desconto: R$ {Number(desconto).toFixed(2)}</p>
                )}
              </div>

              <Button className="w-full gap-2" onClick={registrarPagamento}>
                <CheckCircle2 className="h-4 w-4" /> Registrar Pagamento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
