/**
 * MAPEAMENTO DOS 22 OBJETIVOS DE CONTROLE BRAVO360
 * Dindin Teens - Educação Financeira para Jovens
 * 
 * Os 22 objetivos do ISJF adaptados para linguagem teen! 🎯
 */

export interface ObjetivoControle {
  id: number;
  sigla: string;
  assunto: string;
  objeto: string;
  objetivo: string;
  determinante: 'GAR' | 'HAB' | 'REC' | 'RI';
}

// 22 Objetivos de Controle - IDs correspondem ao banco de dados
export const OBJETIVOS_CONTROLE: ObjetivoControle[] = [
  {
    id: 1,
    sigla: 'ACC',
    assunto: 'Acesso e Autorização',
    objeto: 'Contas, cartões, senhas',
    objetivo: 'Só você pode acessar sua conta bancária, cartão e senhas. Não empresta pra ninguém! 🔐',
    determinante: 'HAB'
  },
  {
    id: 2,
    sigla: 'BKP',
    assunto: 'Backup de Informações',
    objeto: 'Comprovantes, prints, notas',
    objetivo: 'Salvar prints de pix, comprovantes e notas fiscais. Tudo documentado! 📸',
    determinante: 'REC'
  },
  {
    id: 3,
    sigla: 'BS',
    assunto: 'Essencial (Budget Saving)',
    objeto: 'Extrato, limite do cartão',
    objetivo: 'Sempre saber quanto tem na conta e quanto pode gastar antes de comprar algo. 💳',
    determinante: 'GAR'
  },
  {
    id: 4,
    sigla: 'CD',
    assunto: 'Capacidade de Dívida',
    objeto: 'Controle de parcelamentos',
    objetivo: 'Garantir que consegue pagar todas as parcelas sem explodir o orçamento. ⚠️',
    determinante: 'GAR'
  },
  {
    id: 5,
    sigla: 'CI',
    assunto: 'Confidencialidade',
    objeto: 'Senhas de banco e apps',
    objetivo: 'Senhas fortes e guardadas em local seguro. Troca pelo menos 1x por ano! 🛡️',
    determinante: 'HAB'
  },
  {
    id: 6,
    sigla: 'COMP',
    assunto: 'Compliance (Consciência)',
    objeto: 'Prioridades vs compras impulsivas',
    objetivo: 'Saber diferenciar o que é prioridade (lanche, transporte) do que pode esperar (skin de jogo). 🤔',
    determinante: 'HAB'
  },
  {
    id: 7,
    sigla: 'CTN',
    assunto: 'Continuidade (Plano B)',
    objeto: 'Reserva de emergência',
    objetivo: 'Ter uma graninha guardada pra imprevistos (celular quebrou, remédio caro). 🆘',
    determinante: 'RI'
  },
  {
    id: 8,
    sigla: 'CONTRA',
    assunto: 'Contratos',
    objeto: 'Parcelamentos, assinaturas',
    objetivo: 'Ler e entender todo contrato antes de assinar. Conhecer juros e prazos! 📄',
    determinante: 'GAR'
  },
  {
    id: 9,
    sigla: 'APP',
    assunto: 'Aplicações e Ferramentas',
    objeto: 'Apps de controle financeiro',
    objetivo: 'Usar apps tipo Mobills, GuiaBolso ou planilhas do Google pra controlar gastos. 📊',
    determinante: 'REC'
  },
  {
    id: 10,
    sigla: 'GI',
    assunto: 'Gestão Interna',
    objeto: 'Rotinas de controle',
    objetivo: 'Ter uma rotina de anotar gastos todo dia. Tipo um checklist financeiro! ✅',
    determinante: 'HAB'
  },
  {
    id: 11,
    sigla: 'INF',
    assunto: 'Infraestrutura',
    objeto: 'Caderno, pasta, celular, wi-fi',
    objetivo: 'Ter ferramentas pra controlar suas finanças: caderno, pasta de documentos, wi-fi. 💻',
    determinante: 'REC'
  },
  {
    id: 12,
    sigla: 'FAC',
    assunto: 'Patrimônio (Facilities)',
    objeto: 'Seus bens conquistados',
    objetivo: 'Cuidar dos seus bens: celular, computador, bike. São suas conquistas! 🏆',
    determinante: 'REC'
  },
  {
    id: 13,
    sigla: 'INV',
    assunto: 'Investimentos',
    objeto: 'Poupança, Tesouro Direto',
    objetivo: 'Guardar grana na poupança ou investir em algo que rende (Tesouro, CDB). 💰',
    determinante: 'REC'
  },
  {
    id: 14,
    sigla: 'LE',
    assunto: 'Legal (Aspectos Legais)',
    objeto: 'Direitos do consumidor',
    objetivo: 'Conhecer seus direitos: devolução em 7 dias, cancelamento de assinatura. 📜',
    determinante: 'RI'
  },
  {
    id: 15,
    sigla: 'POL',
    assunto: 'Políticas Pessoais',
    objeto: 'Valores e ética',
    objetivo: 'Seus valores: comprar de marcas éticas, evitar impulsos, ser consciente. 🌱',
    determinante: 'HAB'
  },
  {
    id: 16,
    sigla: 'PR',
    assunto: 'Processos e Rotinas',
    objeto: 'Registro de gastos',
    objetivo: 'Anotar TODOS os gastos, até os pequenos (lanche, uber, apps). 📓',
    determinante: 'HAB'
  },
  {
    id: 17,
    sigla: 'QUA',
    assunto: 'Qualidade do Planejamento',
    objeto: 'Orçamento organizado',
    objetivo: 'Planejar gastos do mês, ter orçamento organizado com metas claras. 📅',
    determinante: 'RI'
  },
  {
    id: 18,
    sigla: 'RC',
    assunto: 'Risco de Crédito',
    objeto: 'Uso consciente de crédito',
    objetivo: 'Não parcelar demais, evitar juros rotativos, usar crédito com sabedoria. ⚠️',
    determinante: 'RI'
  },
  {
    id: 19,
    sigla: 'SEG',
    assunto: 'Segurança da Informação',
    objeto: 'CPF, RG, documentos',
    objetivo: 'Não compartilhar CPF, senha do banco. Cuidado com golpes e phishing! 🔐',
    determinante: 'HAB'
  },
  {
    id: 20,
    sigla: 'SF',
    assunto: 'Saúde Física e Mental',
    objeto: 'Bem-estar geral',
    objetivo: 'Dormir bem, comer direito, estudar. Saúde é investimento! 💪',
    determinante: 'HAB'
  },
  {
    id: 21,
    sigla: 'SW',
    assunto: 'Software e Tecnologia',
    objeto: 'Apps, celular, computador',
    objetivo: 'Usar apps do banco, calculadoras, lembretes de vencimento. Tech a seu favor! 📲',
    determinante: 'REC'
  },
  {
    id: 22,
    sigla: 'TL',
    assunto: 'Telecom (Canais)',
    objeto: 'Contato com banco/credores',
    objetivo: 'Ter telefone/e-mail do banco, saber como falar com atendimento. 📞',
    determinante: 'REC'
  }
];

// MAPEAMENTO DE DETERMINANTES EXECUTIVOS
// Conforme metodologia BRAVO360

export const MAPEAMENTO_DETERMINANTES = {
  // Determinantes Primários (SOMA de IRB360s)
  GAR: ['BS', 'CONTRA', 'CD'],  // Garantia
  HAB: ['COMP', 'GI', 'PR', 'SEG_GERAL', 'POL'],  // Habilidade
  REC: ['INV', 'INF_GERAL', 'APP', 'SW'],  // Recursos
  RI: ['LE', 'RC', 'QUA', 'CTN'],  // Risco
  
  // Variáveis Compostas (MÉDIA de IRB360s)
  INF_GERAL: ['TL', 'INF', 'BKP', 'FAC'],  // Infraestrutura Geral
  SEG_GERAL: ['ACC', 'CI', 'SF', 'SEG']  // Segurança Geral
};

// Mapeamento sigla <-> ID
export const SIGLA_PARA_ID: Record<string, number> = {
  ACC: 1, BKP: 2, BS: 3, CD: 4, CI: 5, COMP: 6,
  CTN: 7, CONTRA: 8, APP: 9, GI: 10, INF: 11, FAC: 12,
  INV: 13, LE: 14, POL: 15, PR: 16, QUA: 17, RC: 18,
  SEG: 19, SF: 20, SW: 21, TL: 22
};

export const ID_PARA_SIGLA: Record<number, string> = Object.fromEntries(
  Object.entries(SIGLA_PARA_ID).map(([sigla, id]) => [id, sigla])
);

// FUNÇÕES AUXILIARES

export function getObjetivoBySigla(sigla: string): ObjetivoControle | undefined {
  return OBJETIVOS_CONTROLE.find(obj => obj.sigla === sigla);
}

export function getObjetivoById(id: number): ObjetivoControle | undefined {
  return OBJETIVOS_CONTROLE.find(obj => obj.id === id);
}

export function getObjetivosByDeterminante(determinante: 'GAR' | 'HAB' | 'REC' | 'RI'): ObjetivoControle[] {
  return OBJETIVOS_CONTROLE.filter(obj => obj.determinante === determinante);
}

export function getDeterminanteNome(sigla: string): string {
  const nomes: Record<string, string> = {
    GAR: '🛡️ Garantia',
    HAB: '🎯 Habilidade',
    REC: '🔧 Recursos',
    RI: '⚠️ Risco',
    OP: '🚀 Oportunidade',
    UTIL: '💎 Utilidade',
  };
  return nomes[sigla] || sigla;
}

export function getDeterminanteDescricao(sigla: string): string {
  const descricoes: Record<string, string> = {
    GAR: 'Sua capacidade de lidar com o básico das suas finanças. Ter o controle essencial!',
    HAB: 'Suas habilidades financeiras. O quanto você manja de controlar sua grana!',
    REC: 'Os recursos que você tem disponíveis: apps, celular, conhecimento.',
    RI: 'Potencial de dar ruim. Quanto risco você tá correndo com seu dinheiro?',
    OP: 'Suas oportunidades de melhoria. O quanto você pode evoluir!',
    UTIL: 'Seu interesse real em assuntos financeiros. O quanto você liga pra isso!',
  };
  return descricoes[sigla] || '';
}
