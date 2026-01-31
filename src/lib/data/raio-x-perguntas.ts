/**
 * Perguntas do Raio-X Financeiro para Teens
 * Mapeamento de personalidade psico-financeira
 */

export interface RaioXPergunta {
  id: string;
  pergunta: string;
  opcoes: {
    texto: string;
    arquetipo: string;
    pontos: number;
  }[];
  categoria: string;
}

export const raioXPerguntas: RaioXPergunta[] = [
  {
    id: 'rx1',
    pergunta: '🤔 Quando você recebe dinheiro (mesada, presente, pagamento), o que faz primeiro?',
    opcoes: [
      { texto: 'Gasto logo com algo que quero', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Guardo tudo sem pensar muito', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Divido: uma parte gasto, outra guardo', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Pesquiso onde posso fazer render', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Comportamento',
  },
  {
    id: 'rx2',
    pergunta: '😱 Como você reage quando vê algo que quer muito mas não pode comprar agora?',
    opcoes: [
      { texto: 'Compro mesmo assim, dou um jeito depois', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Fico com pena e não compro', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Planejo e espero o momento certo', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Analiso se realmente vale a pena', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Impulso',
  },
  {
    id: 'rx3',
    pergunta: '🎮 Você prefere gastar seu dinheiro com:',
    opcoes: [
      { texto: 'Coisas do momento (roupas, jogos, lanches)', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Não gasto, guardo tudo', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Experiências e memórias', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Coisas que vão me trazer retorno', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Valores',
  },
  {
    id: 'rx4',
    pergunta: '👨‍👩‍👧 Seus pais/responsáveis falam sobre dinheiro com você?',
    opcoes: [
      { texto: 'Não, é um assunto proibido em casa', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Só falam que não tem', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Às vezes conversamos', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Sim, eles me ensinam sobre finanças', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Influência',
  },
  {
    id: 'rx5',
    pergunta: '⏰ Você prefere ter o dinheiro agora ou esperar e ter o dobro depois?',
    opcoes: [
      { texto: 'Agora! Não sei nem se vou estar vivo depois', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Agora, pra garantir que tenho', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Depende da situação', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Espero, o dobro vale a pena', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Tempo',
  },
  {
    id: 'rx6',
    pergunta: '😤 Quando seus amigos fazem algo que você não pode pagar:',
    opcoes: [
      { texto: 'Dou um jeito e vou, não posso ficar de fora', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Fico triste e não vou', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Sugiro algo mais em conta', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Não vou e não me importo', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Social',
  },
  {
    id: 'rx7',
    pergunta: '🎯 Você tem objetivos de longo prazo (faculdade, viagem, negócio)?',
    opcoes: [
      { texto: 'Não penso no futuro, vivo o agora', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Penso, mas tenho medo de arriscar', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Sim, e estou me preparando', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Sim, e tenho um plano de ação', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Planejamento',
  },
  {
    id: 'rx8',
    pergunta: '💡 Como você aprende sobre dinheiro?',
    opcoes: [
      { texto: 'Não aprendo, acho chato', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Aprendo com os erros dos outros', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Leio e pesquiso quando preciso', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Busco ativamente conhecimento', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Aprendizado',
  },
  {
    id: 'rx9',
    pergunta: '🎲 Como você lida com riscos?',
    opcoes: [
      { texto: 'Adoro riscos, a vida é uma só!', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Evito ao máximo, segurança primeiro', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Aceito riscos calculados', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Analiso bem antes de arriscar', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Risco',
  },
  {
    id: 'rx10',
    pergunta: '🧠 O que você pensa sobre educação financeira?',
    opcoes: [
      { texto: 'Coisa de adulto chato', arquetipo: 'GASTADOR', pontos: 3 },
      { texto: 'Importante, mas não pra mim agora', arquetipo: 'POUPADOR', pontos: 2 },
      { texto: 'Essencial pra ter uma vida melhor', arquetipo: 'EQUILIBRADO', pontos: 1 },
      { texto: 'Fundamental, quero aprender tudo', arquetipo: 'INVESTIDOR', pontos: 0 },
    ],
    categoria: 'Mindset',
  },
];

export const arquetipos = {
  GASTADOR: {
    nome: 'João Friável',
    emoji: '🎉',
    descricao: 'Você vive o momento e curte gastar! Mas cuidado pra não ficar no vermelho.',
    caracteristicas: [
      'Impulsivo(a)',
      'Focado(a) no presente',
      'Gosta de experiências',
      'Dificuldade em poupar',
    ],
    dicas: [
      'Tente esperar 24h antes de comprar algo',
      'Crie o hábito de guardar pelo menos 10%',
      'Use apps de controle de gastos',
    ],
  },
  POUPADOR: {
    nome: 'Lucas Negador',
    emoji: '💰',
    descricao: 'Você guarda tudo com medo de faltar! Mas viver também é importante.',
    caracteristicas: [
      'Cauteloso(a)',
      'Gosta de segurança',
      'Evita riscos',
      'Pode perder oportunidades',
    ],
    dicas: [
      'Permita-se gastar um pouco com lazer',
      'Aprenda sobre investimentos seguros',
      'Equilibre presente e futuro',
    ],
  },
  EQUILIBRADO: {
    nome: 'Paula Teórica',
    emoji: '⚖️',
    descricao: 'Você busca o equilíbrio entre gastar e guardar. Tá no caminho certo!',
    caracteristicas: [
      'Consciente',
      'Planeja antes',
      'Flexível',
      'Busca conhecimento',
    ],
    dicas: [
      'Continue aprendendo sobre finanças',
      'Estabeleça metas claras',
      'Diversifique suas fontes de renda',
    ],
  },
  INVESTIDOR: {
    nome: 'Rafael Invisível',
    emoji: '📈',
    descricao: 'Você pensa no futuro e quer fazer o dinheiro trabalhar pra você. Mandou bem!',
    caracteristicas: [
      'Visionário(a)',
      'Disciplinado(a)',
      'Busca retorno',
      'Pensa no longo prazo',
    ],
    dicas: [
      'Não esqueça de curtir o presente também',
      'Compartilhe conhecimento com amigos',
      'Explore diferentes tipos de investimento',
    ],
  },
};
