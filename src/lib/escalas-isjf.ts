/**
 * ESCALAS DE CONVERSÃO - CÁLCULO DO ISJF
 * Dindin Teens - Educação Financeira para Jovens
 * 
 * Conversão de respostas textuais para valores numéricos (1-5) 
 * Linguagem adaptada para teens! 🎯
 */

// Escala de Importância - "Quão importante isso é pra você?"
export const ESCALA_IMPORTANCIA: Record<string, number> = {
  'SUPER IMPORTANTE': 5,
  'IMPORTANTE': 4,
  'MAIS OU MENOS': 3,
  'SERIA LEGAL': 2,
  'NÃO É PRA MIM': 1,
};

// Escala de Dificuldade - "Quão difícil é fazer isso?"
export const ESCALA_DIFICULDADE: Record<string, number> = {
  'TRANQUILO DEMAIS': 5,
  'CONSIGO DE BOA': 4,
  'MAIS OU MENOS': 3,
  'É COMPLICADO': 2,
  'MUITO DIFÍCIL': 1,
};

// Escala de Frequência - "Com que frequência você faz isso?"
export const ESCALA_FREQUENCIA: Record<string, number> = {
  'SEMPRE': 5,
  'QUASE SEMPRE': 4,
  'AS VEZES': 3,
  'RARAMENTE': 2,
  'QUASE NUNCA': 1,
};

/**
 * Converte resposta de importância para valor numérico
 * Aceita números (1-5) ou textos teens
 */
export function converterImportancia(resposta: string | number): number {
  if (typeof resposta === 'number') {
    return Math.min(Math.max(resposta, 1), 5);
  }
  
  const respostaNormalizada = resposta.trim().toUpperCase();
  
  // Tenta converter número direto
  const numeroDirecto = parseInt(respostaNormalizada);
  if (!isNaN(numeroDirecto) && numeroDirecto >= 1 && numeroDirecto <= 5) {
    return numeroDirecto;
  }
  
  return ESCALA_IMPORTANCIA[respostaNormalizada] || 3; // Default: MAIS OU MENOS
}

/**
 * Converte resposta de dificuldade para valor numérico
 * Aceita números (1-5) ou textos teens
 */
export function converterDificuldade(resposta: string | number): number {
  if (typeof resposta === 'number') {
    return Math.min(Math.max(resposta, 1), 5);
  }
  
  const respostaNormalizada = resposta.trim().toUpperCase();
  
  // Tenta converter número direto
  const numeroDirecto = parseInt(respostaNormalizada);
  if (!isNaN(numeroDirecto) && numeroDirecto >= 1 && numeroDirecto <= 5) {
    return numeroDirecto;
  }
  
  return ESCALA_DIFICULDADE[respostaNormalizada] || 3; // Default: MAIS OU MENOS
}

/**
 * Converte resposta de frequência para valor numérico
 * Aceita números (1-5) ou textos teens
 */
export function converterFrequencia(resposta: string | number): number {
  if (typeof resposta === 'number') {
    return Math.min(Math.max(resposta, 1), 5);
  }
  
  const respostaNormalizada = resposta.trim().toUpperCase();
  
  // Tenta converter número direto
  const numeroDirecto = parseInt(respostaNormalizada);
  if (!isNaN(numeroDirecto) && numeroDirecto >= 1 && numeroDirecto <= 5) {
    return numeroDirecto;
  }
  
  return ESCALA_FREQUENCIA[respostaNormalizada] || 3; // Default: AS VEZES
}

/**
 * Obtém o texto descritivo para um valor de importância
 */
export function getTextoImportancia(valor: number): string {
  const mapa: Record<number, string> = {
    5: 'Super importante 🔥',
    4: 'Importante 💪',
    3: 'Mais ou menos 🤷',
    2: 'Seria legal ✨',
    1: 'Não é pra mim 😅',
  };
  return mapa[valor] || 'Mais ou menos 🤷';
}

/**
 * Obtém o texto descritivo para um valor de dificuldade
 */
export function getTextoDificuldade(valor: number): string {
  const mapa: Record<number, string> = {
    5: 'Tranquilo demais 😎',
    4: 'Consigo de boa ✌️',
    3: 'Mais ou menos 🤔',
    2: 'É complicado 😰',
    1: 'Muito difícil 😵',
  };
  return mapa[valor] || 'Mais ou menos 🤔';
}

/**
 * Obtém o texto descritivo para um valor de frequência
 */
export function getTextoFrequencia(valor: number): string {
  const mapa: Record<number, string> = {
    5: 'Sempre 💯',
    4: 'Quase sempre 👍',
    3: 'As vezes 🔄',
    2: 'Raramente 😬',
    1: 'Quase nunca 🚫',
  };
  return mapa[valor] || 'As vezes 🔄';
}
