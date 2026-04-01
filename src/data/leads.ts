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
  lat?: number;
  lng?: number;
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

// Coordenadas aproximadas dos bairros de Campo Grande
export const BAIRRO_COORDS: Record<Bairro, [number, number]> = {
  "Centro": [-20.4697, -54.6201],
  "Jardim dos Estados": [-20.4580, -54.6150],
  "Chácara Cachoeira": [-20.4520, -54.6050],
  "Santa Fé": [-20.4800, -54.6350],
  "Aero Rancho": [-20.5000, -54.6500],
  "Vila Alba": [-20.4750, -54.5950],
  "Vila Nasser": [-20.4850, -54.6100],
  "Coronel Antonino": [-20.4650, -54.6400],
  "Universitário": [-20.5050, -54.6150],
  "Outras": [-20.4900, -54.5800],
};

export const RESPONSAVEIS = ["Carlos", "Ana", "Rafael", "Juliana", "Pedro"];

function lead(id: string, empresa: string, segmento: Nicho, bairro: Bairro, telefone: string, instagram: string, potencial: LeadPotential, descricao: string, motivoRecorrencia: string): Lead {
  const base = BAIRRO_COORDS[bairro];
  return {
    id, empresa, segmento, bairro, telefone, instagram, potencial,
    temperatura: "frio", status: "novo", ultimoContato: "", proximaAcao: "",
    responsavel: "", observacoes: "", descricao, motivoRecorrencia,
    historico: [],
    lat: base[0] + (Math.random() - 0.5) * 0.012,
    lng: base[1] + (Math.random() - 0.5) * 0.012,
  };
}

const MOCK_LEADS: Lead[] = [
  // CENTRO
  lead("1", "Odonto Premium", "Odontologia", "Centro", "(67) 99703-9012", "@odontopremium", "premium", "Rede de clínicas odontológicas com foco em implantes e ortodontia.", "Pacientes precisam de manutenções semestrais."),
  lead("2", "ContaFácil", "Contabilidade", "Centro", "(67) 99307-3344", "@contafacil.cg", "medio", "Escritório de contabilidade focado em PMEs e MEIs.", "Já opera com contratos recorrentes."),
  lead("3", "CleanPro Serviços", "Limpeza Empresarial", "Centro", "(67) 98812-2200", "@cleanpro.cg", "premium", "Limpeza e conservação predial para escritórios.", "Contratos mensais são o padrão do setor."),
  lead("4", "Sorriso Perfeito", "Odontologia", "Centro", "(67) 99111-2233", "@sorrisoperfeito", "alto", "Clínica de ortodontia e clareamento dental.", "Tratamentos longos geram recorrência natural."),
  lead("5", "Espaço Zen Yoga", "Academia", "Centro", "(67) 99222-3344", "@espacozen.cg", "medio", "Studio de yoga e pilates no centro.", "Alunos mensalistas, alta fidelização."),
  lead("6", "Barber King CG", "Salão de Beleza", "Centro", "(67) 99333-4455", "@barberking.cg", "medio", "Barbearia premium masculina.", "Clientes voltam a cada 15-20 dias."),
  lead("7", "Tech Solutions CG", "Serviços B2B", "Centro", "(67) 99444-5566", "@techsolutions.cg", "alto", "Suporte de TI para empresas.", "Contratos mensais de suporte."),

  // JARDIM DOS ESTADOS
  lead("8", "Estética Bella Donna", "Clínica de Estética", "Jardim dos Estados", "(67) 99901-1234", "@belladonna.cg", "premium", "Clínica premium de harmonização facial.", "Alta frequência de retorno. Ticket médio R$800+."),
  lead("9", "Psi Mente", "Psicologia", "Jardim dos Estados", "(67) 99208-5566", "@psimente.cg", "alto", "Clínica de psicologia presencial e online.", "Terapia é naturalmente recorrente."),
  lead("10", "Clínica Derma Plus", "Clínica de Saúde", "Jardim dos Estados", "(67) 98614-4400", "@dermaplus.cg", "premium", "Dermatologia com tratamentos estéticos.", "Tratamentos requerem múltiplas sessões."),
  lead("11", "Spa & Soul", "Clínica de Estética", "Jardim dos Estados", "(67) 99555-6677", "@spaesoul.cg", "alto", "Day spa com tratamentos corporais.", "Pacotes mensais de relaxamento."),
  lead("12", "Dra. Camila Nutrição", "Nutrição", "Jardim dos Estados", "(67) 99666-7788", "@dracamilanutri", "alto", "Nutricionista esportiva e funcional.", "Acompanhamento mensal contínuo."),
  lead("13", "Instituto Cabelo & Cia", "Salão de Beleza", "Jardim dos Estados", "(67) 99777-8899", "@cabeloecia.cg", "medio", "Salão premium feminino.", "Clientes fiéis com visitas quinzenais."),

  // CHÁCARA CACHOEIRA
  lead("14", "PetLove CG", "Pet Shop", "Chácara Cachoeira", "(67) 99802-5678", "@petlovecg", "alto", "Pet shop completo com banho, tosa e vet.", "400+ clientes fixos de banho e tosa."),
  lead("15", "Smart Cowork", "Coworking", "Chácara Cachoeira", "(67) 98713-3300", "@smartcowork", "medio", "Coworking com salas de reunião.", "Modelo já é recorrente."),
  lead("16", "CrossFit CG Box", "Academia", "Chácara Cachoeira", "(67) 99888-9900", "@crossfitcg", "alto", "Box de CrossFit com 180 atletas.", "Mensalidades recorrentes, comunidade forte."),
  lead("17", "Vet Life CG", "Pet Shop", "Chácara Cachoeira", "(67) 99999-0011", "@vetlife.cg", "alto", "Clínica veterinária 24h.", "Plano de saúde pet é tendência."),
  lead("18", "Espaço Maker CG", "Coworking", "Chácara Cachoeira", "(67) 98100-1122", "@espacomaker", "medio", "Coworking criativo e eventos.", "Planos mensais de uso."),

  // SANTA FÉ
  lead("19", "Studio Fitness Pro", "Academia", "Santa Fé", "(67) 99604-3456", "@studiofitpro", "alto", "Studio de musculação e funcional.", "200 alunos, plano mensal."),
  lead("20", "Pet Center Santa Fé", "Pet Shop", "Santa Fé", "(67) 98200-2233", "@petcentersf", "medio", "Pet shop de bairro com banho e tosa.", "Clientes mensais fiéis."),
  lead("21", "Estética Natural", "Clínica de Estética", "Santa Fé", "(67) 98300-3344", "@esteticanatural.cg", "alto", "Tratamentos estéticos naturais e orgânicos.", "Pacotes de tratamento contínuo."),
  lead("22", "Auto Center SF", "Automotivo", "Santa Fé", "(67) 98400-4455", "@autocentersf", "medio", "Oficina mecânica e troca de óleo.", "Manutenção preventiva recorrente."),
  lead("23", "Escola Futuro Brilhante", "Educação", "Santa Fé", "(67) 98500-5566", "@futurobrilhante", "medio", "Reforço escolar e cursos.", "Mensalidades recorrentes."),

  // AERO RANCHO
  lead("24", "Lava Jato Premium CG", "Automotivo", "Aero Rancho", "(67) 99109-7788", "@lavajatopremium", "alto", "Lava-rápido premium com estética automotiva.", "300 clientes/mês, potencial para plano."),
  lead("25", "Salão da Rê", "Salão de Beleza", "Aero Rancho", "(67) 98600-6677", "@salaodarecg", "medio", "Salão popular com grande volume.", "Alto fluxo de clientes recorrentes."),
  lead("26", "Gym Power", "Academia", "Aero Rancho", "(67) 98700-7788", "@gympower.cg", "alto", "Academia grande com 500+ alunos.", "Base enorme para fidelização."),
  lead("27", "PetBanho AR", "Pet Shop", "Aero Rancho", "(67) 98800-8899", "@petbanhoar", "medio", "Banho e tosa delivery.", "Serviço recorrente por natureza."),
  lead("28", "Mecânica do Povo", "Automotivo", "Aero Rancho", "(67) 98900-9900", "@mecanicadopovo", "baixo", "Oficina popular com grande fluxo.", "Revisão periódica gera recorrência."),

  // VILA ALBA
  lead("29", "Beleza & Arte Salon", "Salão de Beleza", "Vila Alba", "(67) 99010-9900", "@belezaarte.cg", "medio", "Salão completo com cabelo, unha e maquiagem.", "Clientes fiéis retornam mensalmente."),
  lead("30", "Fisio Move", "Fisioterapia", "Vila Alba", "(67) 97100-1122", "@fisiomove.cg", "alto", "Fisioterapia esportiva e ortopédica.", "Sessões contínuas por semanas/meses."),
  lead("31", "Dente Saudável", "Odontologia", "Vila Alba", "(67) 97200-2233", "@dentesaudavel", "alto", "Odontologia preventiva familiar.", "Check-ups semestrais, plano preventivo."),
  lead("32", "Empada da Boa", "Serviços B2B", "Vila Alba", "(67) 97300-3344", "@empadadaboa", "baixo", "Fornecimento de salgados para eventos.", "Contratos de fornecimento regular."),

  // VILA NASSER
  lead("33", "Auto Shine Detailing", "Automotivo", "Vila Nasser", "(67) 99505-7890", "@autoshinecg", "alto", "Detailing automotivo premium.", "Clientes de alto padrão, manutenção mensal."),
  lead("34", "Clínica Vitalis", "Clínica de Saúde", "Vila Nasser", "(67) 97400-4455", "@clinicavitalis", "alto", "Clínica médica geral.", "Acompanhamento contínuo de pacientes crônicos."),
  lead("35", "Studio Pilates VN", "Academia", "Vila Nasser", "(67) 97500-5566", "@studiopilatesvn", "medio", "Pilates e funcional para mulheres.", "Alunas mensalistas fiéis."),
  lead("36", "Dog & Cat Pet", "Pet Shop", "Vila Nasser", "(67) 97600-6677", "@dogcatpet.cg", "medio", "Pet shop completo.", "Banho mensal recorrente."),

  // CORONEL ANTONINO
  lead("37", "Fisio Integral", "Fisioterapia", "Coronel Antonino", "(67) 98911-1100", "@fisiointegral", "alto", "Fisioterapia e reabilitação.", "Pacientes com sessões contínuas."),
  lead("38", "Clínica Odonto Smile", "Odontologia", "Coronel Antonino", "(67) 97700-7788", "@odontosmile.cg", "alto", "Odontologia estética e implantes.", "Manutenção de implantes é recorrente."),
  lead("39", "Clean House CG", "Limpeza Empresarial", "Coronel Antonino", "(67) 97800-8899", "@cleanhouse.cg", "medio", "Limpeza residencial e comercial.", "Serviço semanal/quinzenal recorrente."),
  lead("40", "Espaço Terapia", "Psicologia", "Coronel Antonino", "(67) 97900-9900", "@espacoterapia", "alto", "Clínica multidisciplinar de psicologia.", "Terapia é recorrência pura."),

  // UNIVERSITÁRIO
  lead("41", "Nutri Vida", "Nutrição", "Universitário", "(67) 99406-1122", "@nutrivida.cg", "medio", "Nutrição com acompanhamento mensal.", "150 pacientes ativos mensais."),
  lead("42", "English Now CG", "Educação", "Universitário", "(67) 98515-5500", "@englishnowcg", "medio", "Escola de inglês e espanhol.", "120 alunos mensalistas."),
  lead("43", "Academia Flex", "Academia", "Universitário", "(67) 96100-1122", "@academiaflex.cg", "alto", "Academia perto da UFMS.", "Alta rotação de alunos, fidelização é chave."),
  lead("44", "Copy & Print Uni", "Serviços B2B", "Universitário", "(67) 96200-2233", "@copyprintuni", "baixo", "Gráfica rápida universitária.", "Planos mensais para empresas."),
  lead("45", "Barbearia Corte Certo", "Salão de Beleza", "Universitário", "(67) 96300-3344", "@cortecerto.cg", "medio", "Barbearia moderna universitária.", "Clientes a cada 15 dias."),

  // OUTRAS
  lead("46", "Fazenda Fit", "Academia", "Outras", "(67) 96400-4455", "@fazendafit.cg", "alto", "Academia rural premium na saída para Sidrolândia.", "Público fiel, pouca concorrência."),
  lead("47", "Clínica VetMais", "Pet Shop", "Outras", "(67) 96500-5566", "@vetmais.cg", "alto", "Clínica vet na região do Noroeste.", "Plano de saúde pet é mercado virgem."),
  lead("48", "Solar Clean Energy", "Serviços B2B", "Outras", "(67) 96600-6677", "@solarclean.cg", "premium", "Manutenção de painéis solares.", "Assinatura de manutenção preventiva."),
  lead("49", "Estética Corpo & Alma", "Clínica de Estética", "Outras", "(67) 96700-7788", "@corpoealma.cg", "alto", "Estética corporal e facial.", "Tratamentos requerem múltiplas sessões."),
  lead("50", "Limpeza Total MS", "Limpeza Empresarial", "Outras", "(67) 96800-8899", "@limpezatotal.ms", "alto", "Limpeza industrial e comercial.", "Contratos mensais de grande porte."),
];

export function getInitialLeads(): Lead[] {
  const stored = localStorage.getItem("crm_leads_v2");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return MOCK_LEADS;
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem("crm_leads_v2", JSON.stringify(leads));
}

// ===== ACTIVITY LOG =====
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  leadEmpresa: string;
  leadId: string;
  author: string;
  details: string;
}

export function getActivityLog(): ActivityLogEntry[] {
  const stored = localStorage.getItem("crm_activity_log");
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return [];
}

export function addActivityLog(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
  const log = getActivityLog();
  log.unshift({
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("crm_activity_log", JSON.stringify(log.slice(0, 500)));
}

export const SALES_ARGUMENTS = [
  { title: "Previsibilidade de receita", text: "Em vez de depender de vendas pontuais, seu cliente sabe exatamente quanto entra todo mês. Use: 'Imagine saber no dia 1º quanto vai faturar no mês inteiro.'" },
  { title: "Redução de inadimplência", text: "Cobrança automática no cartão reduz inadimplência de 20-30% para menos de 5%. Use: 'Chega de ficar cobrando cliente por cliente.'" },
  { title: "Retenção de clientes", text: "Cliente recorrente fica 3x mais tempo que cliente avulso. Use: 'Seu cliente já volta todo mês — por que não garantir isso no contrato?'" },
  { title: "Aumento de LTV", text: "Cliente recorrente gasta 2.5x mais ao longo do tempo. Use: 'Um cliente de R$200/mês vale R$2.400/ano garantidos.'" },
  { title: "Profissionalização da operação", text: "Sistema de recorrência organiza agenda, pagamento e relacionamento. Use: 'Sair da planilha e do caderninho muda o jogo.'" },
  { title: "Escala sem aumentar equipe", text: "Automatizando cobrança e gestão, cresce sem contratar. Use: 'Você pode dobrar os clientes sem dobrar a dor de cabeça.'" },
  { title: "Valuation do negócio", text: "Negócio com receita recorrente vale 3-5x mais na venda. Use: 'Se um dia quiser vender, recorrência é o que mais valoriza.'" },
  { title: "Previsibilidade de caixa", text: "Permite planejar investimentos, contratar e crescer com segurança. Use: 'Parar de apagar incêndio e começar a planejar crescimento.'" },
];

export const SCRIPTS = {
  abertura: `Olá, tudo bem? Vi que vocês atuam no segmento de [SEGMENTO] aqui em Campo Grande e queria te mostrar uma forma de transformar atendimentos recorrentes em receita mensal previsível, sem aumentar complexidade na operação.`,
  gatilho: `Muitos negócios como o de vocês já têm clientes que voltam todo mês, mas ainda não estruturaram isso da forma certa. O resultado? Perdem clientes que poderiam ficar anos pagando mensalidade.`,
  fechamento: `Se fizer sentido pra vocês, te explico em 15 minutos como isso pode funcionar na prática pro [SEGMENTO]. Sem compromisso — só uma conversa rápida pra ver se faz sentido. Que tal?`,
  followup: `Oi! Passando pra dar continuidade na nossa conversa sobre o modelo de recorrência. Vi que empresas do mesmo segmento que o de vocês estão tendo resultados expressivos. Posso te mostrar rapidamente?`,
};
