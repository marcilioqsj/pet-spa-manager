

# Plano de Expansão - Fase 2

## 1. Vales e Produtos de Funcionários

**Onde:** Nova seção no Financeiro + controle no perfil do funcionário

- Novo tipo de registro: `MovimentacaoFuncionario` (vale em dinheiro, produto retirado da loja)
- Botão "Registrar Vale/Produto" no Financeiro com modal: funcionário, tipo (vale/produto), valor, descrição, data
- Aba "Movimentações de Equipe" no Financeiro com tabela filtrável por funcionário/período
- No fechamento de comissão, os vales/produtos são descontados automaticamente do saldo

---

## 2. Acréscimo por Forma de Pagamento

**Onde:** Configurações (formas de pagamento existentes)

- Adicionar campo `acrescimo` (percentual) na interface `FormaPagamento` - ex: Cartão Crédito +5%
- No modal de cadastro/edição de forma de pagamento, campo opcional "Acréscimo (%)"
- No fechamento (modal da fila), ao selecionar forma de pagamento, valor total recalcula automaticamente mostrando: valor base + acréscimo
- Visual claro: "R$ 100 + 5% cartão = R$ 105"

---

## 3. Login Mockado e Perfis de Acesso

**Onde:** Tela de login + novo módulo de Equipe

### Login simulado
- Tela de login simples com select de usuário (sem senha) - perfis pré-cadastrados
- Usuários mock: 1 admin ("Carlos - Dono"), 2 funcionários ("Ana - Banhista", "Pedro - Tosador")
- Contexto global (`AuthContext`) com usuário logado e papel (admin/funcionario)

### Página Equipe (`/equipe`) - apenas admin
- Cadastro de funcionários: nome, cargo, comissão padrão (% ou valor fixo por serviço)
- Tabela de permissões por perfil: quais módulos cada tipo acessa
- Toggle de permissões: Dashboard, Agendamentos, Fila, Financeiro, Serviços, Configurações, Equipe

### Visão do funcionário
- Sidebar mostra apenas módulos permitidos
- Página "Minhas Comissões" acessível ao funcionário: lista de serviços realizados, valores de comissão, vales descontados, saldo

---

## 4. Controle de Comissões (Admin)

**Onde:** Nova aba no Financeiro ou página separada `/comissoes`

- Tabela: funcionário, período, total de serviços, comissão bruta, vales/produtos descontados, comissão líquida, status (pendente/pago)
- Filtro por funcionário e período
- Botão "Marcar como Pago" que registra data do pagamento
- Cards de resumo: total de comissões pendentes, total pago no mês
- No fechamento do serviço (fila), campo para selecionar qual funcionário realizou o atendimento (vincula a comissão)

---

## Dados Mock Adicionados

```text
Funcionarios:
  - Carlos (admin/dono)
  - Ana (banhista) - comissão 40% banho, R$25 fixo tosa
  - Pedro (tosador) - comissão 35% tosa, R$20 fixo banho

Movimentações:
  - Ana: vale R$50 (05/04), produto shampoo R$25 (08/04)
  - Pedro: vale R$100 (07/04)

Comissões:
  - Registros vinculados aos agendamentos concluídos
```

## Arquivos

### Novos
- `src/contexts/AuthContext.tsx` - contexto de autenticação mockada
- `src/pages/Login.tsx` - tela de login simulado
- `src/pages/Equipe.tsx` - gestão de funcionários e permissões (admin)
- `src/pages/Comissoes.tsx` - controle de comissões (admin)
- `src/pages/MinhasComissoes.tsx` - visão do funcionário

### Modificados
- `src/data/mockData.ts` - interfaces Funcionario, MovimentacaoFuncionario, Comissao; campo acrescimo em FormaPagamento
- `src/App.tsx` - AuthProvider, rota de login, rotas protegidas
- `src/components/AppSidebar.tsx` - menu dinâmico por permissão, item Equipe
- `src/pages/Configuracoes.tsx` - campo acréscimo na forma de pagamento
- `src/pages/FilaAtendimento.tsx` - seleção de funcionário no fechamento, cálculo de acréscimo
- `src/pages/Financeiro.tsx` - aba movimentações de equipe

