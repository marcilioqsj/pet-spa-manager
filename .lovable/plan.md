

# Plano de Expansão - PetCare Banho & Tosa

## Resumo

6 novas funcionalidades adicionadas ao sistema existente, sem alterar o que já está feito. Tudo mockado, apenas front-end.

---

## 1. Fila de Atendimento (nova página `/fila`)

**Decisão: página separada** - A fila merece seu próprio espaço porque é uma visão operacional em tempo real, diferente do agendamento que é planejamento. A fila mostra apenas os pets do dia, com foco no fluxo.

- Kanban horizontal com colunas: **Aguardando** → **Banho** → **Tosa** → **Secagem** → **Finalizado**
- Cada card mostra: nome do pet, tutor, serviço, hora de entrada, tempo na etapa atual
- Arrastar cards entre colunas (ou botão "Avançar") para mudar status
- Indicador visual de tempo (fica amarelo/vermelho se demorar demais)
- Link no sidebar com ícone de lista/fila

**Novo item no sidebar:** "Fila do Dia" entre Agendamentos e Pets & Tutores.

---

## 2. Fechamento e Pagamento (dentro da Fila)

Quando o pet chega na coluna "Finalizado":
- Abre um **modal de fechamento** com:
  - Resumo do serviço base + extras adicionados
  - Valor total calculado automaticamente
  - Seleção da forma de pagamento (das formas cadastradas - item 6)
  - Campo para desconto opcional
  - Botão "Registrar Pagamento"
- Após registrar, o agendamento muda para status `concluido` e o valor vai pro Financeiro
- Badge "Pago" aparece no card

---

## 3. Cadastro de Serviços (nova página `/servicos`)

- **Serviços base**: lista editável (Banho, Tosa, Banho+Tosa, Hidratação, etc.) com preço por porte (Pequeno/Médio/Grande)
- **Extras/Adicionais**: lista separada de itens avulsos - Perfume, Lacinho, Shampoo Premium, Escovação de dentes, etc. - cada um com preço fixo
- Modal para criar/editar serviço ou extra
- Na criação de agendamento e no fechamento, os extras ficam como checkboxes que somam ao valor

**Novo item no sidebar:** "Serviços" com ícone de Scissors/Wrench.

---

## 4. Tags de Observações nos Pets

Inspirado no Notion:
- Campo de tags no cadastro/ficha do pet com **input autocomplete**
- Ao digitar, mostra tags existentes para selecionar; se não existir, opção "Criar nova tag"
- Tags com cores (palette pré-definida de ~8 cores, selecionável ao criar)
- Exemplos mockados: "Agressivo", "Alérgico", "Primeiro banho", "Idoso", "Ansioso", "Não gosta de secador"
- Tags ficam visíveis nos cards da fila e nos agendamentos
- Dados das tags armazenados em `mockData.ts` como array global reutilizável

**Alteração em:** `mockData.ts` (nova interface `Tag`, array de tags, campo `tags: string[]` no Pet) e `PetsTutores.tsx` (UI de tags).

---

## 5. Controle de Transporte (dentro do Agendamento)

- Checkbox "Necessita transporte" no formulário de agendamento
- Se marcado, campos extras aparecem: **endereço de coleta**, **horário de coleta**, **horário de retorno**
- No card do agendamento, ícone de van/truck quando tem transporte
- Na fila do dia, indicador visual de "buscar" e "devolver"
- Seção colapsável na fila: "Transportes do dia" mostrando lista de coletas/devoluções com horários

**Alteração em:** `mockData.ts` (campos de transporte no Agendamento) e `Agendamentos.tsx` (campos no form).

---

## 6. Formas de Pagamento (nova página `/configuracoes`)

- Página de Configurações com seção "Formas de Pagamento"
- Lista editável: Dinheiro, PIX, Cartão Crédito, Cartão Débito, etc.
- Toggle para ativar/desativar cada forma
- Essas opções alimentam o select no modal de fechamento (item 2)

**Novo item no sidebar:** "Configurações" com ícone de Settings, posicionado no footer do sidebar.

---

## Arquivos Novos
- `src/pages/FilaAtendimento.tsx` - Kanban da fila do dia
- `src/pages/Servicos.tsx` - Cadastro de serviços e extras
- `src/pages/Configuracoes.tsx` - Formas de pagamento e configs

## Arquivos Modificados
- `src/data/mockData.ts` - Novas interfaces (Tag, Servico, Extra, FormaPagamento, Transporte) e dados mock
- `src/App.tsx` - Novas rotas
- `src/components/AppSidebar.tsx` - Novos itens de menu
- `src/pages/PetsTutores.tsx` - Sistema de tags nos pets
- `src/pages/Agendamentos.tsx` - Campos de transporte e extras no form

## Design
Mantém o mesmo padrão visual existente (paleta roxa, cards com sombra, badges coloridas). O kanban da fila usa as mesmas cores de status já definidas.

