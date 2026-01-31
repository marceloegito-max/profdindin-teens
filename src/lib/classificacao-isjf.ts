/**
 * CLASSIFICAÇÕES - CÁLCULO DO ISJF
 * Dindin Teens - Educação Financeira para Jovens
 * 
 * Classificação do ISJF e IER com linguagem teen! 🎯
 */

export type ClassificacaoISJF =
  | 'Fragilidade Crítica'
  | 'Fragilidade Alta'
  | 'Resiliente'
  | 'Robusto'
  | 'Antifrágil';

export type TipoObjetivo = 'RESTRICTOR' | 'FACILITADOR';

export interface InfoClassificacao {
  nivel: ClassificacaoISJF;
  descricao: string;
  cor: string;
  emoji: string;
  recomendacao: string;
}

/**
 * Classifica o valor do ISJF
 */
export function classificarISJF(isjf: number): ClassificacaoISJF {
  if (isjf < 0.5) return 'Fragilidade Crítica';
  if (isjf < 1.0) return 'Fragilidade Alta';
  if (isjf < 1.5) return 'Resiliente';
  if (isjf < 2.0) return 'Robusto';
  return 'Antifrágil';
}

/**
 * Obtém informações detalhadas sobre a classificação (linguagem teen)
 */
export function getInfoClassificacao(isjf: number): InfoClassificacao {
  const nivel = classificarISJF(isjf);

  const infos: Record<ClassificacaoISJF, Omit<InfoClassificacao, 'nivel'>> = {
    'Fragilidade Crítica': {
      descricao:
        'Sua situação financeira tá bem delicada e precisa de ação urgente! 😟 Você tá vulnerável a imprevistos.',
      cor: 'red',
      emoji: '🔴',
      recomendacao:
        'Foca nas ações imediatas pra estabilizar! Começa pelos restrictores que identificamos. Vai dar certo! 💪',
    },
    'Fragilidade Alta': {
      descricao:
        'Sua situação financeira precisa de melhorias. Você tá um pouco vulnerável a imprevistos. 😬',
      cor: 'orange',
      emoji: '🟠',
      recomendacao:
        'Bora fortalecer seus controles financeiros! Faz as atividades que recomendamos aos poucos. 📈',
    },
    Resiliente: {
      descricao:
        'Você consegue se recuperar de imprevistos financeiros! Tá equilibrado, mas dá pra melhorar. 😊',
      cor: 'yellow',
      emoji: '🟡',
      recomendacao:
        'Continua desenvolvendo seus hábitos financeiros! Foca em evoluir pro nível Robusto. 🚀',
    },
    Robusto: {
      descricao:
        'Você tem boa resistência a imprevistos financeiros! Seus controles tão sólidos. 💪',
      cor: 'green',
      emoji: '🟢',
      recomendacao:
        'Mantém essas práticas massa e explora oportunidades de investimento! Tá mandando bem! 🎯',
    },
    Antifrágil: {
      descricao:
        'Você se fortalece com imprevistos financeiros! Excelência total em gestão financeira. 🏆',
      cor: 'blue',
      emoji: '🔵',
      recomendacao:
        'Você chegou no nível LENDÁRIO! 👑 Considera ajudar outros jovens e explorar investimentos mais complexos.',
    },
  };

  return {
    nivel,
    ...infos[nivel],
  };
}

/**
 * Classifica um objetivo de controle baseado no IER
 * IER > 8 = RESTRICTOR (precisa atenção)
 * IER <= 8 = FACILITADOR (tá de boa)
 */
export function classificarObjetivo(ier: number): TipoObjetivo {
  return ier > 8 ? 'RESTRICTOR' : 'FACILITADOR';
}

/**
 * Obtém cor para exibição do tipo de objetivo
 */
export function getCorTipoObjetivo(tipo: TipoObjetivo): string {
  return tipo === 'RESTRICTOR' ? 'red' : 'green';
}

/**
 * Obtém descrição do tipo de objetivo (linguagem teen)
 */
export function getDescricaoTipoObjetivo(tipo: TipoObjetivo): string {
  return tipo === 'RESTRICTOR'
    ? '⚠️ Precisa atenção - Bora incluir no plano de ação!'
    : '✅ Tá massa - Continua assim!';
}

/**
 * Obtém emoji para o tipo de objetivo
 */
export function getEmojiTipoObjetivo(tipo: TipoObjetivo): string {
  return tipo === 'RESTRICTOR' ? '⚠️' : '✅';
}

/**
 * Calcula percentual de restrictores
 */
export function calcularPercentualRestrictores(
  quantidadeRestrictores: number,
  totalObjetivos: number = 22
): number {
  return Math.round((quantidadeRestrictores / totalObjetivos) * 100);
}

/**
 * Obtém mensagem baseada no percentual de restrictores (linguagem teen)
 */
export function getMensagemRestrictores(percentual: number): string {
  if (percentual === 0) {
    return '🎉 Parabéns! Nenhum restrictor! Tudo funcionando perfeitamente!';
  }
  if (percentual <= 20) {
    return '😊 Poucos restrictores. Tá favorável, mas tem alguns pontos pra melhorar.';
  }
  if (percentual <= 40) {
    return '🤔 Alguns restrictores identificados. Foca nas áreas mais críticas primeiro!';
  }
  if (percentual <= 60) {
    return '😬 Vários restrictores. Vamos montar um plano de ação estruturado!';
  }
  if (percentual <= 80) {
    return '😰 Muitos restrictores. Prioriza ações urgentes e pede ajuda se precisar!';
  }
  return '🆘 A maioria precisa atenção. Começa pelas ações mais simples e vai evoluindo aos poucos. Vai dar certo!';
}

/**
 * Obtém faixa de cor baseada no valor do ISJF
 */
export function getCorISJF(isjf: number): string {
  const classificacao = classificarISJF(isjf);
  const cores: Record<ClassificacaoISJF, string> = {
    'Fragilidade Crítica': 'red.500',
    'Fragilidade Alta': 'orange.500',
    'Resiliente': 'yellow.500',
    'Robusto': 'green.500',
    'Antifrágil': 'blue.500',
  };
  return cores[classificacao];
}

/**
 * Obtém classe CSS Tailwind para a classificação
 */
export function getClasseTailwindISJF(isjf: number): string {
  const classificacao = classificarISJF(isjf);
  const classes: Record<ClassificacaoISJF, string> = {
    'Fragilidade Crítica': 'bg-red-100 text-red-800 border-red-300',
    'Fragilidade Alta': 'bg-orange-100 text-orange-800 border-orange-300',
    'Resiliente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Robusto': 'bg-green-100 text-green-800 border-green-300',
    'Antifrágil': 'bg-blue-100 text-blue-800 border-blue-300',
  };
  return classes[classificacao];
}
