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
}

export type ServicoTipo = 'Banho' | 'Tosa' | 'Banho + Tosa';
export type AgendamentoStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';

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
}

export const tutores: Tutor[] = [
  {
    id: '1', nome: 'Maria Silva', telefone: '(11) 99876-5432', endereco: 'Rua das Flores, 123 - São Paulo',
    pets: [
      { id: 'p1', nome: 'Thor', raca: 'Golden Retriever', porte: 'Grande', idade: '3 anos', observacoes: 'Alérgico a shampoo com parabenos', tutorId: '1' },
      { id: 'p2', nome: 'Luna', raca: 'Shih Tzu', porte: 'Pequeno', idade: '5 anos', observacoes: 'Muito dócil', tutorId: '1' },
    ],
  },
  {
    id: '2', nome: 'João Oliveira', telefone: '(11) 98765-1234', endereco: 'Av. Paulista, 456 - São Paulo',
    pets: [
      { id: 'p3', nome: 'Bob', raca: 'Bulldog Francês', porte: 'Pequeno', idade: '2 anos', observacoes: 'Agitado durante a tosa', tutorId: '2' },
    ],
  },
  {
    id: '3', nome: 'Ana Costa', telefone: '(21) 97654-3210', endereco: 'Rua do Sol, 789 - Rio de Janeiro',
    pets: [
      { id: 'p4', nome: 'Mel', raca: 'Poodle', porte: 'Médio', idade: '4 anos', observacoes: 'Precisa de tosa higiênica', tutorId: '3' },
      { id: 'p5', nome: 'Simba', raca: 'Spitz Alemão', porte: 'Pequeno', idade: '1 ano', observacoes: 'Primeira vez no petshop', tutorId: '3' },
    ],
  },
  {
    id: '4', nome: 'Carlos Santos', telefone: '(31) 96543-2109', endereco: 'Rua Minas Gerais, 321 - Belo Horizonte',
    pets: [
      { id: 'p6', nome: 'Rex', raca: 'Pastor Alemão', porte: 'Grande', idade: '6 anos', observacoes: 'Calmo, mas não gosta de secador', tutorId: '4' },
    ],
  },
  {
    id: '5', nome: 'Fernanda Lima', telefone: '(41) 95432-1098', endereco: 'Av. Brasil, 654 - Curitiba',
    pets: [
      { id: 'p7', nome: 'Pipoca', raca: 'Yorkshire', porte: 'Pequeno', idade: '2 anos', observacoes: 'Tosa na tesoura', tutorId: '5' },
      { id: 'p8', nome: 'Bidu', raca: 'Labrador', porte: 'Grande', idade: '5 anos', observacoes: '', tutorId: '5' },
    ],
  },
];

const hoje = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const agendamentos: Agendamento[] = [
  { id: 'a1', petId: 'p1', petNome: 'Thor', tutorNome: 'Maria Silva', servico: 'Banho + Tosa', data: formatDate(hoje), hora: '09:00', status: 'concluido', observacoes: 'Usar shampoo hipoalergênico', valor: 120 },
  { id: 'a2', petId: 'p2', petNome: 'Luna', tutorNome: 'Maria Silva', servico: 'Banho', data: formatDate(hoje), hora: '10:30', status: 'em_andamento', observacoes: '', valor: 60 },
  { id: 'a3', petId: 'p3', petNome: 'Bob', tutorNome: 'João Oliveira', servico: 'Tosa', data: formatDate(hoje), hora: '14:00', status: 'agendado', observacoes: 'Tosa na máquina 3', valor: 80 },
  { id: 'a4', petId: 'p4', petNome: 'Mel', tutorNome: 'Ana Costa', servico: 'Banho + Tosa', data: formatDate(hoje), hora: '15:30', status: 'agendado', observacoes: 'Tosa higiênica incluída', valor: 110 },
  { id: 'a5', petId: 'p5', petNome: 'Simba', tutorNome: 'Ana Costa', servico: 'Banho', data: formatDate(addDays(hoje, 1)), hora: '09:00', status: 'agendado', observacoes: 'Primeiro banho - ter paciência', valor: 70 },
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

export const servicoPrecos: Record<ServicoTipo, { pequeno: number; medio: number; grande: number }> = {
  'Banho': { pequeno: 55, medio: 70, grande: 85 },
  'Tosa': { pequeno: 70, medio: 85, grande: 100 },
  'Banho + Tosa': { pequeno: 100, medio: 120, grande: 140 },
};
