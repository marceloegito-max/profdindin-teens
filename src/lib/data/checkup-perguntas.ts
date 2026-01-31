/**
 * Perguntas do Check-up Financeiro para Teens
 * Identificação dos 12 agentes estressores
 */

export interface CheckupPergunta {
  id: string;
  pergunta: string;
  opcoes: string[];
  agente: string;
}

export const checkupPerguntas: CheckupPergunta[] = [
  {
    id: 'p1',
    pergunta: '💳 Você tem assinaturas de apps, streamings ou jogos que esqueceu de cancelar?',
    opcoes: [
      'Sim, tenho várias',
      'Tenho 1 ou 2',
      'Não, cancelo o que não uso',
      'Não tenho assinaturas',
    ],
    agente: 'Assinaturas Fantasma',
  },
  {
    id: 'p2',
    pergunta: '😰 Quando pensa em dinheiro, como você se sente?',
    opcoes: [
      'Super estressado(a), não sei nem por onde começar',
      'Preocupado(a), mas tento não pensar muito nisso',
      'Tranquilo(a), sei que vou dar um jeito',
      'Confiante, tenho tudo sob controle',
    ],
    agente: 'Estresse Financeiro',
  },
  {
    id: 'p3',
    pergunta: '🛍️ Você já comprou algo por impulso e se arrependeu depois?',
    opcoes: [
      'Sempre! Compro e depois me arrependo',
      'De vez em quando acontece',
      'Raramente, penso bem antes',
      'Nunca, sempre planejo minhas compras',
    ],
    agente: 'Compras Impulsivas',
  },
  {
    id: 'p4',
    pergunta: '👨‍👩‍👧 Como sua família lida com dinheiro?',
    opcoes: [
      'Ninguém fala sobre isso, é tabu',
      'Só falam quando tá faltando',
      'Conversamos às vezes',
      'Conversamos abertamente sobre finanças',
    ],
    agente: 'Padrões Familiares',
  },
  {
    id: 'p5',
    pergunta: '☕ Quanto você gasta com "pequenos luxos" (lanche, doces, apps)?',
    opcoes: [
      'Nem sei, gasto bastante',
      'Uns R$ 50-100 por semana',
      'Uns R$ 20-50 por semana',
      'Quase nada, evito gastar',
    ],
    agente: 'Pequenos Luxos',
  },
  {
    id: 'p6',
    pergunta: '⏰ Se você trabalha/faz bicos, sabe quanto vale sua hora?',
    opcoes: [
      'Não faço ideia',
      'Já pensei nisso, mas não calculei',
      'Sei mais ou menos',
      'Sei exatamente quanto vale',
    ],
    agente: 'Valor do Tempo',
  },
  {
    id: 'p7',
    pergunta: '👥 Seus amigos influenciam seus gastos?',
    opcoes: [
      'Muito! Acabo gastando pra não ficar de fora',
      'Às vezes, depende da situação',
      'Pouco, sei dizer não',
      'Nada, cada um com seu rolê',
    ],
    agente: 'Influência Social',
  },
  {
    id: 'p8',
    pergunta: '😴 Você gasta mais quando está entediado(a)?',
    opcoes: [
      'Sim, direto fico scrollando e comprando',
      'Às vezes rola umas compras',
      'Raramente, acho outras coisas pra fazer',
      'Não, tédio não me faz gastar',
    ],
    agente: 'Tédio Financeiro',
  },
  {
    id: 'p9',
    pergunta: '🔄 Consegue ficar um dia sem gastar nada?',
    opcoes: [
      'Impossível, gasto todo dia',
      'Difícil, mas consigo às vezes',
      'Sim, consigo facilmente',
      'Sim, faço isso regularmente',
    ],
    agente: 'Dependência de Consumo',
  },
  {
    id: 'p10',
    pergunta: '💪 Se acontecesse um imprevisto (celular quebrar, precisar de grana), você teria como resolver?',
    opcoes: [
      'Não, ficaria totalmente perdido(a)',
      'Teria que pedir ajuda pra alguém',
      'Teria uma pequena reserva',
      'Sim, tenho uma reserva de emergência',
    ],
    agente: 'Fragilidade Financeira',
  },
  {
    id: 'p11',
    pergunta: '📱 Você sabe quanto gasta por mês com apps, jogos e internet?',
    opcoes: [
      'Não faço ideia',
      'Tenho uma noção vaga',
      'Sei mais ou menos',
      'Sei exatamente quanto',
    ],
    agente: 'Consciência Digital',
  },
  {
    id: 'p12',
    pergunta: '🎯 Você tem algum objetivo financeiro (comprar algo, juntar grana)?',
    opcoes: [
      'Não, vivo o momento',
      'Tenho, mas não faço nada pra alcançar',
      'Tenho e estou tentando',
      'Tenho e estou no caminho certo',
    ],
    agente: 'Falta de Objetivos',
  },
];

export const agentesEstressores = [
  'Assinaturas Fantasma',
  'Estresse Financeiro',
  'Compras Impulsivas',
  'Padrões Familiares',
  'Pequenos Luxos',
  'Valor do Tempo',
  'Influência Social',
  'Tédio Financeiro',
  'Dependência de Consumo',
  'Fragilidade Financeira',
  'Consciência Digital',
  'Falta de Objetivos',
];
