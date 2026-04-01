export type LeadStatus =
  | "novo"
  | "sem_contato"
  | "primeiro_contato"
  | "em_conversa"
  | "reuniao_agendada"
  | "proposta_enviada"
  | "em_negociacao"
  | "fechado"
  | "perdido";

export type LeadTemperature = "frio" | "morno" | "quente";
export type LeadPotential = "baixo" | "medio" | "alto" | "premium";

export type Nicho =
  | "Clínica de Estética"
  | "Odontologia"
  | "Pet Shop"
  | "Academia"
  | "Clínica de Saúde"
  | "Nutrição"
  | "Psicologia"
  | "Automotivo"
  | "Serviços B2B"
  | "Salão de Beleza"
  | "Fisioterapia"
  | "Educação"
  | "Coworking"
  | "Contabilidade"
  | "Limpeza Empresarial";

export type Bairro =
  | "Centro"
  | "Jardim dos Estados"
  | "Chácara Cachoeira"
  | "Santa Fé"
  | "Aero Rancho"
  | "Vila Alba"
  | "Vila Nasser"
  | "Coronel Antonino"
  | "Universitário"
  | "Outras";

export interface LeadInteraction {
  date: string;
  type: string;
  note: string;
  author?: string;
}

export interface Lead {
  id: string;
  empresa: string;
  segmento: Nicho;
  bairro: Bairro;
  telefone: string;
  instagram: string;
  potencial: LeadPotential;
  temperatura: LeadTemperature;
  status: LeadStatus;
  ultimoContato: string;
  proximaAcao: string;
  responsavel: string;
  observacoes: string;
  descricao: string;
  motivoRecorrencia: string;
  historico: LeadInteraction[];
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  sem_contato: "Sem contato",
  primeiro_contato: "Primeiro contato",
  em_conversa: "Em conversa",
  reuniao_agendada: "Reunião agendada",
  proposta_enviada: "Proposta enviada",
  em_negociacao: "Em negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: "bg-blue-100 text-blue-800",
  sem_contato: "bg-gray-100 text-gray-800",
  primeiro_contato: "bg-yellow-100 text-yellow-800",
  em_conversa: "bg-orange-100 text-orange-800",
  reuniao_agendada: "bg-purple-100 text-purple-800",
  proposta_enviada: "bg-indigo-100 text-indigo-800",
  em_negociacao: "bg-cyan-100 text-cyan-800",
  fechado: "bg-green-100 text-green-800",
  perdido: "bg-red-100 text-red-800",
};

export const TEMP_COLORS: Record<LeadTemperature, string> = {
  frio: "bg-sky-100 text-sky-800",
  morno: "bg-amber-100 text-amber-800",
  quente: "bg-red-100 text-red-800",
};

export const POTENTIAL_COLORS: Record<LeadPotential, string> = {
  baixo: "bg-gray-100 text-gray-600",
  medio: "bg-blue-100 text-blue-700",
  alto: "bg-emerald-100 text-emerald-700",
  premium: "bg-yellow-100 text-yellow-800",
};

export const NICHOS: Nicho[] = [
  "Clínica de Estética", "Odontologia", "Pet Shop", "Academia",
  "Clínica de Saúde", "Nutrição", "Psicologia", "Automotivo",
  "Serviços B2B", "Salão de Beleza", "Fisioterapia", "Educação",
  "Coworking", "Contabilidade", "Limpeza Empresarial",
];

export const BAIRROS: Bairro[] = [
  "Centro", "Jardim dos Estados", "Chácara Cachoeira", "Santa Fé",
  "Aero Rancho", "Vila Alba", "Vila Nasser", "Coronel Antonino",
  "Universitário", "Outras",
];

export const RESPONSAVEIS = ["Carlos", "Ana", "Rafael", "Juliana", "Pedro"];

const MOCK_LEADS: Lead[] = [
  {
    id: "1", empresa: "Estética Bella Donna", segmento: "Clínica de Estética", bairro: "Jardim dos Estados",
    telefone: "(67) 99901-1234", instagram: "@belladonna.cg", potencial: "premium", temperatura: "quente",
    status: "reuniao_agendada", ultimoContato: "2026-03-30", proximaAcao: "Reunião dia 02/04",
    responsavel: "Carlos", observacoes: "Já trabalha com pacotes, quer automatizar",
    descricao: "Clínica premium de harmonização facial e tratamentos estéticos avançados.",
    motivoRecorrencia: "Alta frequência de retorno dos pacientes para manutenção. Ticket médio R$800+.",
    historico: [
      { date: "2026-03-28", type: "WhatsApp", note: "Primeiro contato, demonstrou interesse" },
      { date: "2026-03-30", type: "Ligação", note: "Agendada reunião presencial" },
    ],
  },
  {
    id: "2", empresa: "PetLove CG", segmento: "Pet Shop", bairro: "Chácara Cachoeira",
    telefone: "(67) 99802-5678", instagram: "@petlovecg", potencial: "alto", temperatura: "morno",
    status: "primeiro_contato", ultimoContato: "2026-03-29", proximaAcao: "Enviar proposta de plano mensal",
    responsavel: "Ana", observacoes: "Tem 400+ clientes fixos de banho e tosa",
    descricao: "Pet shop completo com banho, tosa, veterinário e venda de rações premium.",
    motivoRecorrencia: "Clientes já retornam mensalmente. Plano de assinatura aumentaria retenção em 60%.",
    historico: [
      { date: "2026-03-29", type: "Instagram", note: "Contato via DM, pediu mais informações" },
    ],
  },
  {
    id: "3", empresa: "Odonto Premium", segmento: "Odontologia", bairro: "Centro",
    telefone: "(67) 99703-9012", instagram: "@odontopremium", potencial: "premium", temperatura: "quente",
    status: "proposta_enviada", ultimoContato: "2026-03-31", proximaAcao: "Follow-up da proposta",
    responsavel: "Carlos", observacoes: "3 unidades em CG, quer plano de manutenção",
    descricao: "Rede de clínicas odontológicas com foco em implantes e ortodontia.",
    motivoRecorrencia: "Pacientes precisam de manutenções semestrais. Plano preventivo gera receita previsível.",
    historico: [
      { date: "2026-03-25", type: "Ligação", note: "Apresentação inicial" },
      { date: "2026-03-28", type: "Reunião", note: "Reunião com o sócio" },
      { date: "2026-03-31", type: "Email", note: "Proposta enviada - R$2.500/mês" },
    ],
  },
  {
    id: "4", empresa: "Studio Fitness Pro", segmento: "Academia", bairro: "Santa Fé",
    telefone: "(67) 99604-3456", instagram: "@studiofitpro", potencial: "alto", temperatura: "morno",
    status: "em_conversa", ultimoContato: "2026-03-28", proximaAcao: "Agendar visita presencial",
    responsavel: "Rafael", observacoes: "200 alunos, plano mensal básico, quer upgradar",
    descricao: "Studio de musculação e funcional com personal trainers especializados.",
    motivoRecorrencia: "Base de alunos recorrente. Plano trimestral/semestral aumenta retenção e ticket médio.",
    historico: [
      { date: "2026-03-26", type: "WhatsApp", note: "Interesse em plano fidelidade" },
      { date: "2026-03-28", type: "WhatsApp", note: "Pediu exemplos de outros studios" },
    ],
  },
  {
    id: "5", empresa: "Auto Shine Detailing", segmento: "Automotivo", bairro: "Vila Nasser",
    telefone: "(67) 99505-7890", instagram: "@autoshinecg", potencial: "alto", temperatura: "frio",
    status: "novo", ultimoContato: "", proximaAcao: "Primeiro contato via WhatsApp",
    responsavel: "Ana", observacoes: "Estética automotiva premium, potencial para plano mensal",
    descricao: "Detailing automotivo premium com serviços de polimento, vitrificação e higienização.",
    motivoRecorrencia: "Clientes de alto padrão que fazem manutenção mensal. Plano recorrente natural.",
    historico: [],
  },
  {
    id: "6", empresa: "Nutri Vida", segmento: "Nutrição", bairro: "Universitário",
    telefone: "(67) 99406-1122", instagram: "@nutrivida.cg", potencial: "medio", temperatura: "morno",
    status: "primeiro_contato", ultimoContato: "2026-03-27", proximaAcao: "Enviar case de sucesso",
    responsavel: "Juliana", observacoes: "Nutricionista com 150 pacientes ativos",
    descricao: "Consultório de nutrição com acompanhamento mensal e planos alimentares personalizados.",
    motivoRecorrencia: "Pacientes já fazem acompanhamento mensal. Estruturar plano recorrente é natural.",
    historico: [
      { date: "2026-03-27", type: "WhatsApp", note: "Enviado material sobre recorrência" },
    ],
  },
  {
    id: "7", empresa: "ContaFácil", segmento: "Contabilidade", bairro: "Centro",
    telefone: "(67) 99307-3344", instagram: "@contafacil.cg", potencial: "medio", temperatura: "frio",
    status: "sem_contato", ultimoContato: "", proximaAcao: "Prospectar via LinkedIn",
    responsavel: "Pedro", observacoes: "Escritório com 80 clientes, potencial B2B",
    descricao: "Escritório de contabilidade focado em PMEs e MEIs.",
    motivoRecorrencia: "Já opera com contratos recorrentes. Pode expandir serviços adicionais.",
    historico: [],
  },
  {
    id: "8", empresa: "Psi Mente", segmento: "Psicologia", bairro: "Jardim dos Estados",
    telefone: "(67) 99208-5566", instagram: "@psimente.cg", potencial: "alto", temperatura: "quente",
    status: "em_negociacao", ultimoContato: "2026-03-31", proximaAcao: "Fechar contrato",
    responsavel: "Juliana", observacoes: "3 psicólogos, querem plano de sessões mensais",
    descricao: "Clínica de psicologia com atendimento presencial e online.",
    motivoRecorrencia: "Terapia é naturalmente recorrente. Plano mensal facilita adesão e reduz no-show.",
    historico: [
      { date: "2026-03-20", type: "Ligação", note: "Primeiro contato" },
      { date: "2026-03-25", type: "Reunião", note: "Apresentação completa" },
      { date: "2026-03-31", type: "WhatsApp", note: "Negociando valores finais" },
    ],
  },
  {
    id: "9", empresa: "Lava Jato Premium CG", segmento: "Automotivo", bairro: "Aero Rancho",
    telefone: "(67) 99109-7788", instagram: "@lavajatopremium", potencial: "alto", temperatura: "morno",
    status: "em_conversa", ultimoContato: "2026-03-30", proximaAcao: "Apresentar modelo de assinatura",
    responsavel: "Rafael", observacoes: "Lava-rápido premium com 300 clientes/mês",
    descricao: "Lava-rápido premium com serviços de lavagem completa e estética automotiva.",
    motivoRecorrencia: "Volume alto de clientes frequentes. Plano mensal garante fidelização e caixa previsível.",
    historico: [
      { date: "2026-03-28", type: "Visita", note: "Visita ao local, bom potencial" },
      { date: "2026-03-30", type: "WhatsApp", note: "Interessado no modelo" },
    ],
  },
  {
    id: "10", empresa: "Beleza & Arte Salon", segmento: "Salão de Beleza", bairro: "Vila Alba",
    telefone: "(67) 99010-9900", instagram: "@belezaarte.cg", potencial: "medio", temperatura: "frio",
    status: "novo", ultimoContato: "", proximaAcao: "Primeiro contato",
    responsavel: "Ana", observacoes: "Salão grande, bairro com potencial",
    descricao: "Salão de beleza completo com cabelo, unha, maquiagem e depilação.",
    motivoRecorrencia: "Clientes fiéis retornam mensalmente. Plano fidelidade aumenta retenção.",
    historico: [],
  },
  {
    id: "11", empresa: "Fisio Integral", segmento: "Fisioterapia", bairro: "Coronel Antonino",
    telefone: "(67) 98911-1100", instagram: "@fisiointegral", potencial: "alto", temperatura: "quente",
    status: "proposta_enviada", ultimoContato: "2026-03-31", proximaAcao: "Aguardando retorno",
    responsavel: "Carlos", observacoes: "Clínica com 5 fisioterapeutas, quer pacotes",
    descricao: "Clínica de fisioterapia e reabilitação com tratamentos contínuos.",
    motivoRecorrencia: "Pacientes precisam de sessões contínuas por semanas/meses. Pacote recorrente é natural.",
    historico: [
      { date: "2026-03-27", type: "Reunião", note: "Apresentação do modelo" },
      { date: "2026-03-31", type: "Email", note: "Proposta enviada" },
    ],
  },
  {
    id: "12", empresa: "CleanPro Serviços", segmento: "Limpeza Empresarial", bairro: "Centro",
    telefone: "(67) 98812-2200", instagram: "@cleanpro.cg", potencial: "premium", temperatura: "morno",
    status: "reuniao_agendada", ultimoContato: "2026-03-30", proximaAcao: "Reunião dia 03/04",
    responsavel: "Pedro", observacoes: "Atende 15 empresas, quer escalar com recorrência",
    descricao: "Empresa de limpeza e conservação predial para escritórios e comércios.",
    motivoRecorrencia: "Serviço naturalmente recorrente. Contratos mensais são o padrão do setor.",
    historico: [
      { date: "2026-03-28", type: "Ligação", note: "Contato inicial positivo" },
      { date: "2026-03-30", type: "WhatsApp", note: "Reunião confirmada" },
    ],
  },
  {
    id: "13", empresa: "Smart Cowork", segmento: "Coworking", bairro: "Chácara Cachoeira",
    telefone: "(67) 98713-3300", instagram: "@smartcowork", potencial: "medio", temperatura: "frio",
    status: "sem_contato", ultimoContato: "", proximaAcao: "Pesquisar mais sobre o negócio",
    responsavel: "Rafael", observacoes: "Coworking novo, potencial de planos",
    descricao: "Espaço de coworking com salas de reunião e escritórios privativos.",
    motivoRecorrencia: "Modelo já é recorrente. Pode agregar serviços extras por assinatura.",
    historico: [],
  },
  {
    id: "14", empresa: "Clínica Derma Plus", segmento: "Clínica de Saúde", bairro: "Jardim dos Estados",
    telefone: "(67) 98614-4400", instagram: "@dermaplus.cg", potencial: "premium", temperatura: "quente",
    status: "em_conversa", ultimoContato: "2026-03-31", proximaAcao: "Enviar proposta personalizada",
    responsavel: "Juliana", observacoes: "Dermatologia + estética, ticket alto",
    descricao: "Clínica de dermatologia com tratamentos estéticos de alta tecnologia.",
    motivoRecorrencia: "Tratamentos requerem múltiplas sessões e manutenção. LTV altíssimo.",
    historico: [
      { date: "2026-03-29", type: "Reunião", note: "Reunião com a dra. proprietária" },
      { date: "2026-03-31", type: "WhatsApp", note: "Pediu proposta detalhada" },
    ],
  },
  {
    id: "15", empresa: "English Now CG", segmento: "Educação", bairro: "Universitário",
    telefone: "(67) 98515-5500", instagram: "@englishnowcg", potencial: "medio", temperatura: "morno",
    status: "primeiro_contato", ultimoContato: "2026-03-29", proximaAcao: "Agendar call",
    responsavel: "Pedro", observacoes: "Escola de idiomas, 120 alunos",
    descricao: "Escola de inglês e espanhol com turmas presenciais e online.",
    motivoRecorrencia: "Mensalidades já são recorrentes. Estruturar melhor reduz evasão.",
    historico: [
      { date: "2026-03-29", type: "Email", note: "Primeiro contato por email" },
    ],
  },
];

export function getInitialLeads(): Lead[] {
  const stored = localStorage.getItem("crm_leads");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return MOCK_LEADS;
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem("crm_leads", JSON.stringify(leads));
}

export const SALES_ARGUMENTS = [
  {
    title: "Previsibilidade de receita",
    text: "Em vez de depender de vendas pontuais, seu cliente sabe exatamente quanto entra todo mês. Use: 'Imagine saber no dia 1º quanto vai faturar no mês inteiro.'",
  },
  {
    title: "Redução de inadimplência",
    text: "Cobrança automática no cartão reduz inadimplência de 20-30% para menos de 5%. Use: 'Chega de ficar cobrando cliente por cliente.'",
  },
  {
    title: "Retenção de clientes",
    text: "Cliente recorrente fica 3x mais tempo que cliente avulso. Use: 'Seu cliente já volta todo mês — por que não garantir isso no contrato?'",
  },
  {
    title: "Aumento de LTV",
    text: "Cliente recorrente gasta 2.5x mais ao longo do tempo. Use: 'Um cliente de R$200/mês vale R$2.400/ano garantidos.'",
  },
  {
    title: "Profissionalização da operação",
    text: "Sistema de recorrência organiza agenda, pagamento e relacionamento. Use: 'Sair da planilha e do caderninho muda o jogo.'",
  },
  {
    title: "Escala sem aumentar equipe",
    text: "Automatizando cobrança e gestão, cresce sem contratar. Use: 'Você pode dobrar os clientes sem dobrar a dor de cabeça.'",
  },
  {
    title: "Valuation do negócio",
    text: "Negócio com receita recorrente vale 3-5x mais na venda. Use: 'Se um dia quiser vender, recorrência é o que mais valoriza.'",
  },
  {
    title: "Previsibilidade de caixa",
    text: "Permite planejar investimentos, contratar e crescer com segurança. Use: 'Parar de apagar incêndio e começar a planejar crescimento.'",
  },
];

export const SCRIPTS = {
  abertura: `Olá, tudo bem? Vi que vocês atuam no segmento de [SEGMENTO] aqui em Campo Grande e queria te mostrar uma forma de transformar atendimentos recorrentes em receita mensal previsível, sem aumentar complexidade na operação.`,
  gatilho: `Muitos negócios como o de vocês já têm clientes que voltam todo mês, mas ainda não estruturaram isso da forma certa. O resultado? Perdem clientes que poderiam ficar anos pagando mensalidade.`,
  fechamento: `Se fizer sentido pra vocês, te explico em 15 minutos como isso pode funcionar na prática pro [SEGMENTO]. Sem compromisso — só uma conversa rápida pra ver se faz sentido. Que tal?`,
  followup: `Oi! Passando pra dar continuidade na nossa conversa sobre o modelo de recorrência. Vi que empresas do mesmo segmento que o de vocês estão tendo resultados expressivos. Posso te mostrar rapidamente?`,
};
