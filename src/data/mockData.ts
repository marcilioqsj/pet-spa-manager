export interface Tag {
  id: string;
  nome: string;
  cor: string;
}

export const tagCores = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

export const tags: Tag[] = [
  { id: 'tag1', nome: 'Agressivo', cor: '#ef4444' },
  { id: 'tag2', nome: 'Alérgico', cor: '#f97316' },
  { id: 'tag3', nome: 'Primeiro banho', cor: '#22c55e' },
  { id: 'tag4', nome: 'Idoso', cor: '#8b5cf6' },
  { id: 'tag5', nome: 'Ansioso', cor: '#eab308' },
  { id: 'tag6', nome: 'Não gosta de secador', cor: '#3b82f6' },
  { id: 'tag7', nome: 'Dócil', cor: '#22c55e' },
  { id: 'tag8', nome: 'Sensível na pata', cor: '#ec4899' },
];

export interface Tutor {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  pets: Pet[];
}

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  porte: 'Pequeno' | 'Médio' | 'Grande';
  idade: string;
  observacoes: string;
  tutorId: string;
  tags: string[]; // tag ids
}

export type ServicoTipo = string;
export type AgendamentoStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface Servico {
  id: string;
  nome: string;
  precos: { pequeno: number; medio: number; grande: number };
  ativo: boolean;
}

export interface Extra {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean;
}

export interface FormaPagamento {
  id: string;
  nome: string;
  ativo: boolean;
  acrescimo: number; // percentual, ex: 5 = 5%
}

export type CargoFuncionario = 'admin' | 'banhista' | 'tosador' | 'auxiliar';

export interface ComissaoConfig {
  servicoId: string;
  tipo: 'percentual' | 'fixo';
  valor: number; // se percentual: 40 = 40%, se fixo: valor em reais
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: CargoFuncionario;
  papel: 'admin' | 'funcionario';
  comissoes: ComissaoConfig[];
  ativo: boolean;
  permissoes: string[]; // module names allowed
}

export type MovimentacaoTipo = 'vale' | 'produto';

export interface MovimentacaoFuncionario {
  id: string;
  funcionarioId: string;
  tipo: MovimentacaoTipo;
  valor: number;
  descricao: string;
  data: string;
}

export interface Comissao {
  id: string;
  funcionarioId: string;
  agendamentoId: string;
  servicoNome: string;
  petNome: string;
  valorServico: number;
  valorComissao: number;
  data: string;
  pago: boolean;
  dataPagamento?: string;
}

export interface Transporte {
  necessita: boolean;
  enderecoColeta?: string;
  horarioColeta?: string;
  horarioRetorno?: string;
}

export type FilaEtapa = 'aguardando' | 'banho' | 'tosa' | 'secagem' | 'finalizado';

export interface FilaItem {
  agendamentoId: string;
  petNome: string;
  tutorNome: string;
  servico: string;
  hora: string;
  etapa: FilaEtapa;
  inicioEtapa: Date;
  pago: boolean;
  extras: string[]; // extra ids
  transporte?: Transporte;
  petTags: string[];
}

export interface Agendamento {
  id: string;
  petId: string;
  petNome: string;
  tutorNome: string;
  servico: ServicoTipo;
  data: string;
  hora: string;
  status: AgendamentoStatus;
  observacoes: string;
  valor: number;
  extras?: string[];
  transporte?: Transporte;
}

export const servicos: Servico[] = [
  { id: 's1', nome: 'Banho', precos: { pequeno: 55, medio: 70, grande: 85 }, ativo: true },
  { id: 's2', nome: 'Tosa', precos: { pequeno: 70, medio: 85, grande: 100 }, ativo: true },
  { id: 's3', nome: 'Banho + Tosa', precos: { pequeno: 100, medio: 120, grande: 140 }, ativo: true },
  { id: 's4', nome: 'Hidratação', precos: { pequeno: 40, medio: 55, grande: 70 }, ativo: true },
  { id: 's5', nome: 'Tosa Higiênica', precos: { pequeno: 35, medio: 45, grande: 55 }, ativo: true },
];

export const extras: Extra[] = [
  { id: 'e1', nome: 'Perfume', preco: 15, ativo: true },
  { id: 'e2', nome: 'Lacinho', preco: 5, ativo: true },
  { id: 'e3', nome: 'Shampoo Premium', preco: 25, ativo: true },
  { id: 'e4', nome: 'Escovação de dentes', preco: 20, ativo: true },
  { id: 'e5', nome: 'Hidratação express', preco: 30, ativo: true },
  { id: 'e6', nome: 'Corte de unha', preco: 15, ativo: true },
  { id: 'e7', nome: 'Limpeza de ouvido', preco: 15, ativo: true },
];

export const formasPagamento: FormaPagamento[] = [
  { id: 'fp1', nome: 'Dinheiro', ativo: true, acrescimo: 0 },
  { id: 'fp2', nome: 'PIX', ativo: true, acrescimo: 0 },
  { id: 'fp3', nome: 'Cartão de Crédito', ativo: true, acrescimo: 5 },
  { id: 'fp4', nome: 'Cartão de Débito', ativo: true, acrescimo: 3 },
  { id: 'fp5', nome: 'Transferência Bancária', ativo: false, acrescimo: 0 },
];

export const todosModulos = [
  'dashboard', 'agendamentos', 'fila', 'pets-tutores', 'servicos', 'financeiro', 'configuracoes', 'equipe', 'comissoes',
];

export const funcionarios: Funcionario[] = [
  {
    id: 'func1', nome: 'Carlos Pereira', cargo: 'admin', papel: 'admin',
    comissoes: [], ativo: true,
    permissoes: todosModulos,
  },
  {
    id: 'func2', nome: 'Ana Souza', cargo: 'banhista', papel: 'funcionario',
    comissoes: [
      { servicoId: 's1', tipo: 'percentual', valor: 40 },
      { servicoId: 's2', tipo: 'fixo', valor: 25 },
      { servicoId: 's3', tipo: 'percentual', valor: 40 },
    ],
    ativo: true,
    permissoes: ['fila', 'agendamentos', 'minhas-comissoes'],
  },
  {
    id: 'func3', nome: 'Pedro Lima', cargo: 'tosador', papel: 'funcionario',
    comissoes: [
      { servicoId: 's1', tipo: 'fixo', valor: 20 },
      { servicoId: 's2', tipo: 'percentual', valor: 35 },
      { servicoId: 's3', tipo: 'percentual', valor: 35 },
    ],
    ativo: true,
    permissoes: ['fila', 'agendamentos', 'minhas-comissoes'],
  },
];

export const movimentacoesFuncionarios: MovimentacaoFuncionario[] = [
  { id: 'mov1', funcionarioId: 'func2', tipo: 'vale', valor: 50, descricao: 'Vale em dinheiro', data: formatDate(addDays(hoje, -9)) },
  { id: 'mov2', funcionarioId: 'func2', tipo: 'produto', valor: 25, descricao: 'Shampoo pet 500ml', data: formatDate(addDays(hoje, -6)) },
  { id: 'mov3', funcionarioId: 'func3', tipo: 'vale', valor: 100, descricao: 'Vale em dinheiro', data: formatDate(addDays(hoje, -7)) },
  { id: 'mov4', funcionarioId: 'func3', tipo: 'produto', valor: 18, descricao: 'Perfume colônia', data: formatDate(addDays(hoje, -3)) },
];

export const comissoes: Comissao[] = [
  { id: 'com1', funcionarioId: 'func2', agendamentoId: 'a1', servicoNome: 'Banho + Tosa', petNome: 'Thor', valorServico: 120, valorComissao: 48, data: formatDate(hoje), pago: false },
  { id: 'com2', funcionarioId: 'func2', agendamentoId: 'a9', servicoNome: 'Banho', petNome: 'Thor', valorServico: 80, valorComissao: 32, data: formatDate(addDays(hoje, -1)), pago: true, dataPagamento: formatDate(addDays(hoje, -1)) },
  { id: 'com3', funcionarioId: 'func3', agendamentoId: 'a10', servicoNome: 'Banho + Tosa', petNome: 'Bob', valorServico: 120, valorComissao: 42, data: formatDate(addDays(hoje, -1)), pago: true, dataPagamento: formatDate(addDays(hoje, -1)) },
  { id: 'com4', funcionarioId: 'func2', agendamentoId: 'a11', servicoNome: 'Tosa', petNome: 'Mel', valorServico: 80, valorComissao: 25, data: formatDate(addDays(hoje, -2)), pago: false },
  { id: 'com5', funcionarioId: 'func3', agendamentoId: 'a12', servicoNome: 'Banho', petNome: 'Pipoca', valorServico: 55, valorComissao: 20, data: formatDate(addDays(hoje, -2)), pago: false },
  { id: 'com6', funcionarioId: 'func3', agendamentoId: 'a13', servicoNome: 'Banho + Tosa', petNome: 'Rex', valorServico: 140, valorComissao: 49, data: formatDate(addDays(hoje, -3)), pago: false },
];

export const tutores: Tutor[] = [
  {
    id: '1', nome: 'Maria Silva', telefone: '(11) 99876-5432', endereco: 'Rua das Flores, 123 - São Paulo',
    pets: [
      { id: 'p1', nome: 'Thor', raca: 'Golden Retriever', porte: 'Grande', idade: '3 anos', observacoes: 'Alérgico a shampoo com parabenos', tutorId: '1', tags: ['tag2', 'tag6'] },
      { id: 'p2', nome: 'Luna', raca: 'Shih Tzu', porte: 'Pequeno', idade: '5 anos', observacoes: 'Muito dócil', tutorId: '1', tags: ['tag7'] },
    ],
  },
  {
    id: '2', nome: 'João Oliveira', telefone: '(11) 98765-1234', endereco: 'Av. Paulista, 456 - São Paulo',
    pets: [
      { id: 'p3', nome: 'Bob', raca: 'Bulldog Francês', porte: 'Pequeno', idade: '2 anos', observacoes: 'Agitado durante a tosa', tutorId: '2', tags: ['tag1', 'tag5'] },
    ],
  },
  {
    id: '3', nome: 'Ana Costa', telefone: '(21) 97654-3210', endereco: 'Rua do Sol, 789 - Rio de Janeiro',
    pets: [
      { id: 'p4', nome: 'Mel', raca: 'Poodle', porte: 'Médio', idade: '4 anos', observacoes: 'Precisa de tosa higiênica', tutorId: '3', tags: [] },
      { id: 'p5', nome: 'Simba', raca: 'Spitz Alemão', porte: 'Pequeno', idade: '1 ano', observacoes: 'Primeira vez no petshop', tutorId: '3', tags: ['tag3', 'tag5'] },
    ],
  },
  {
    id: '4', nome: 'Carlos Santos', telefone: '(31) 96543-2109', endereco: 'Rua Minas Gerais, 321 - Belo Horizonte',
    pets: [
      { id: 'p6', nome: 'Rex', raca: 'Pastor Alemão', porte: 'Grande', idade: '6 anos', observacoes: 'Calmo, mas não gosta de secador', tutorId: '4', tags: ['tag4', 'tag6'] },
    ],
  },
  {
    id: '5', nome: 'Fernanda Lima', telefone: '(41) 95432-1098', endereco: 'Av. Brasil, 654 - Curitiba',
    pets: [
      { id: 'p7', nome: 'Pipoca', raca: 'Yorkshire', porte: 'Pequeno', idade: '2 anos', observacoes: 'Tosa na tesoura', tutorId: '5', tags: [] },
      { id: 'p8', nome: 'Bidu', raca: 'Labrador', porte: 'Grande', idade: '5 anos', observacoes: '', tutorId: '5', tags: ['tag7'] },
    ],
  },
];

const hoje = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const agendamentos: Agendamento[] = [
  { id: 'a1', petId: 'p1', petNome: 'Thor', tutorNome: 'Maria Silva', servico: 'Banho + Tosa', data: formatDate(hoje), hora: '09:00', status: 'concluido', observacoes: 'Usar shampoo hipoalergênico', valor: 120, extras: ['e1', 'e3'] },
  { id: 'a2', petId: 'p2', petNome: 'Luna', tutorNome: 'Maria Silva', servico: 'Banho', data: formatDate(hoje), hora: '10:30', status: 'em_andamento', observacoes: '', valor: 60, extras: ['e1'] },
  { id: 'a3', petId: 'p3', petNome: 'Bob', tutorNome: 'João Oliveira', servico: 'Tosa', data: formatDate(hoje), hora: '14:00', status: 'agendado', observacoes: 'Tosa na máquina 3', valor: 80, transporte: { necessita: true, enderecoColeta: 'Av. Paulista, 456', horarioColeta: '13:30', horarioRetorno: '15:30' } },
  { id: 'a4', petId: 'p4', petNome: 'Mel', tutorNome: 'Ana Costa', servico: 'Banho + Tosa', data: formatDate(hoje), hora: '15:30', status: 'agendado', observacoes: 'Tosa higiênica incluída', valor: 110 },
  { id: 'a5', petId: 'p5', petNome: 'Simba', tutorNome: 'Ana Costa', servico: 'Banho', data: formatDate(addDays(hoje, 1)), hora: '09:00', status: 'agendado', observacoes: 'Primeiro banho - ter paciência', valor: 70, transporte: { necessita: true, enderecoColeta: 'Rua do Sol, 789', horarioColeta: '08:30', horarioRetorno: '10:30' } },
  { id: 'a6', petId: 'p6', petNome: 'Rex', tutorNome: 'Carlos Santos', servico: 'Banho', data: formatDate(addDays(hoje, 1)), hora: '11:00', status: 'agendado', observacoes: 'Secar com toalha, sem secador', valor: 90 },
  { id: 'a7', petId: 'p7', petNome: 'Pipoca', tutorNome: 'Fernanda Lima', servico: 'Tosa', data: formatDate(addDays(hoje, 2)), hora: '10:00', status: 'agendado', observacoes: 'Tosa na tesoura - padrão raça', valor: 100 },
  { id: 'a8', petId: 'p8', petNome: 'Bidu', tutorNome: 'Fernanda Lima', servico: 'Banho + Tosa', data: formatDate(addDays(hoje, 2)), hora: '14:00', status: 'agendado', observacoes: '', valor: 130 },
  { id: 'a9', petId: 'p1', petNome: 'Thor', tutorNome: 'Maria Silva', servico: 'Banho', data: formatDate(addDays(hoje, -1)), hora: '09:00', status: 'concluido', observacoes: '', valor: 80 },
  { id: 'a10', petId: 'p3', petNome: 'Bob', tutorNome: 'João Oliveira', servico: 'Banho + Tosa', data: formatDate(addDays(hoje, -1)), hora: '11:00', status: 'concluido', observacoes: '', valor: 120 },
  { id: 'a11', petId: 'p4', petNome: 'Mel', tutorNome: 'Ana Costa', servico: 'Tosa', data: formatDate(addDays(hoje, -2)), hora: '10:00', status: 'concluido', observacoes: '', valor: 80 },
  { id: 'a12', petId: 'p7', petNome: 'Pipoca', tutorNome: 'Fernanda Lima', servico: 'Banho', data: formatDate(addDays(hoje, -2)), hora: '14:00', status: 'concluido', observacoes: '', valor: 55 },
  { id: 'a13', petId: 'p6', petNome: 'Rex', tutorNome: 'Carlos Santos', servico: 'Banho + Tosa', data: formatDate(addDays(hoje, -3)), hora: '09:00', status: 'concluido', observacoes: '', valor: 140 },
  { id: 'a14', petId: 'p2', petNome: 'Luna', tutorNome: 'Maria Silva', servico: 'Banho + Tosa', data: formatDate(addDays(hoje, -3)), hora: '15:00', status: 'cancelado', observacoes: 'Tutora cancelou', valor: 90 },
  { id: 'a15', petId: 'p8', petNome: 'Bidu', tutorNome: 'Fernanda Lima', servico: 'Banho', data: formatDate(addDays(hoje, -4)), hora: '10:00', status: 'concluido', observacoes: '', valor: 85 },
  { id: 'a16', petId: 'p5', petNome: 'Simba', tutorNome: 'Ana Costa', servico: 'Banho', data: formatDate(addDays(hoje, -5)), hora: '11:00', status: 'concluido', observacoes: '', valor: 65 },
  { id: 'a17', petId: 'p1', petNome: 'Thor', tutorNome: 'Maria Silva', servico: 'Tosa', data: formatDate(addDays(hoje, -6)), hora: '09:00', status: 'concluido', observacoes: '', valor: 90 },
];

export const servicoPrecos: Record<string, { pequeno: number; medio: number; grande: number }> = {
  'Banho': { pequeno: 55, medio: 70, grande: 85 },
  'Tosa': { pequeno: 70, medio: 85, grande: 100 },
  'Banho + Tosa': { pequeno: 100, medio: 120, grande: 140 },
};
