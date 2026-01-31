/**
 * CÁLCULO DO ISJF - Índice da Saúde da Jornada Financeira
 * Dindin Teens - Educação Financeira para Jovens
 * 
 * Motor completo de cálculo do ISJF baseado na metodologia BRAVO360
 * Adaptado para linguagem teen! 🚀
 */

import {
  converterImportancia,
  converterDificuldade,
  converterFrequencia,
} from './escalas-isjf';
import { OBJETIVOS_CONTROLE, SIGLA_PARA_ID } from './mapeamento-objetivos-isjf';
import { classificarObjetivo, classificarISJF } from './classificacao-isjf';
import type { TipoObjetivo, ClassificacaoISJF } from './classificacao-isjf';

// ==========================================
// CONSTANTES DO SISTEMA ISJF
// ==========================================

export const CONSTANTES_ISJF = {
  Kf: 711,   // Constante de eficiência financeira
  Ks: 2036,  // Fator de simplificação numérica
  Ki: 125,   // Constante para cálculo do IER
  Kg: 10,    // Divisor do IER
  Kj: 5,     // Multiplicador do IRB360
};

// ==========================================
// TIPOS E INTERFACES
// ==========================================

export interface RespostaObjetivo {
  id: number;
  importancia: string | number;
  dificuldade: string | number;
  frequencia: string | number;
}

export interface ResultadoObjetivo {
  id: number;
  assunto: string;
  sigla: string;
  objetivo: string;
  determinante: string;
  x: number;      // Importância convertida
  y: number;      // Dificuldade convertida
  z: number;      // Frequência convertida
  ier: number;    // Índice de Exposição ao Risco
  irb360: number; // Índice de Resiliência BRAVO360
  tipo: TipoObjetivo;
}

export interface VariaveisComportamentais {
  M1: number;  // Utilidade (Importância atribuída)
  M2: number;  // Interesse (Importância + Frequência)
  M3: number;  // Engajamento (Dificuldade baixa)
  M4: number;  // Estado Atual (Média M1, M2, M3)
}

export interface DeterminantesPerformance {
  GAR: number;   // Garantia
  HAB: number;   // Habilidade
  REC: number;   // Recursos
  RI: number;    // Risco
  OP: number;    // Oportunidade
  UTIL: number;  // Utilidade
}

export interface ResultadoISJF {
  isjf: number;
  classificacao: ClassificacaoISJF;
  determinantes: DeterminantesPerformance;
  variaveis: VariaveisComportamentais;
  objetivos: ResultadoObjetivo[];
  restrictores: ResultadoObjetivo[];
  facilitadores: ResultadoObjetivo[];
}

// ==========================================
// FUNÇÕES DE CONVERSÃO E VALIDAÇÃO
// ==========================================

/**
 * Converte respostas textuais/numéricas para valores calculados (X, Y, Z, IER, IRB360)
 */
function converterRespostas(respostas: RespostaObjetivo[]): ResultadoObjetivo[] {
  return respostas.map((resposta) => {
    const objetivo = OBJETIVOS_CONTROLE.find((obj) => obj.id === resposta.id);

    if (!objetivo) {
      throw new Error(`Objetivo com ID ${resposta.id} não encontrado`);
    }

    // Converter respostas para valores numéricos (1-5)
    const x = converterImportancia(resposta.importancia);
    const y = converterDificuldade(resposta.dificuldade);
    const z = converterFrequencia(resposta.frequencia);

    // Calcular IER (Índice de Exposição ao Risco)
    // Fórmula: (125 - X*Y*Z) / 10
    const ier = (CONSTANTES_ISJF.Ki - x * y * z) / CONSTANTES_ISJF.Kg;

    // Calcular IRB360 (Índice de Resiliência BRAVO360)
    // Fórmula: ((X*Y)*Z) * 5
    const irb360 = ((x * y) * z) * CONSTANTES_ISJF.Kj;

    // Classificar objetivo (RESTRICTOR se IER > 8)
    const tipo = classificarObjetivo(ier);

    return {
      id: resposta.id,
      assunto: objetivo.assunto,
      sigla: objetivo.sigla,
      objetivo: objetivo.objetivo,
      determinante: objetivo.determinante,
      x,
      y,
      z,
      ier,
      irb360,
      tipo,
    };
  });
}

// ==========================================
// HELPERS PARA VARIÁVEIS COMPORTAMENTAIS
// ==========================================

/**
 * Verifica se importância é alta (>= 4 ou "SUPER IMPORTANTE"/"IMPORTANTE")
 */
function isImportanciaAlta(valor: string | number): boolean {
  if (typeof valor === 'number') {
    return valor >= 4;
  }
  const normalizado = String(valor).trim().toUpperCase();
  const numeroDirecto = parseInt(normalizado);
  if (!isNaN(numeroDirecto)) {
    return numeroDirecto >= 4;
  }
  return normalizado === 'SUPER IMPORTANTE' || normalizado === 'IMPORTANTE' ||
         normalizado === 'MUITO IMPORTANTE';
}

/**
 * Verifica se frequência é alta (>= 4 ou "SEMPRE"/"QUASE SEMPRE")
 */
function isFrequenciaAlta(valor: string | number): boolean {
  if (typeof valor === 'number') {
    return valor >= 4;
  }
  const normalizado = String(valor).trim().toUpperCase();
  const numeroDirecto = parseInt(normalizado);
  if (!isNaN(numeroDirecto)) {
    return numeroDirecto >= 4;
  }
  return normalizado === 'SEMPRE' || normalizado === 'QUASE SEMPRE' ||
         normalizado === 'A MAIORIA DAS VEZES';
}

/**
 * Verifica se dificuldade é baixa (>= 4 ou "TRANQUILO DEMAIS"/"CONSIGO DE BOA")
 */
function isDificuldadeBaixa(valor: string | number): boolean {
  if (typeof valor === 'number') {
    return valor >= 4;
  }
  const normalizado = String(valor).trim().toUpperCase();
  const numeroDirecto = parseInt(normalizado);
  if (!isNaN(numeroDirecto)) {
    return numeroDirecto >= 4;
  }
  return normalizado === 'TRANQUILO DEMAIS' || normalizado === 'CONSIGO DE BOA' ||
         normalizado === 'NENHUMA DIFICULDADE' || normalizado === 'CONSIGO FAZER';
}

// ==========================================
// CÁLCULO DAS VARIÁVEIS COMPORTAMENTAIS
// ==========================================

/**
 * Calcula as 4 variáveis comportamentais (M1, M2, M3, M4)
 * 
 * Fórmulas BRAVO360:
 * - M1 (Utilidade) = Contagem(Importância Alta) × 0,09
 * - M2 (Interesse) = (Contagem Importância Alta + Contagem Frequência Alta) × 0,09
 * - M3 (Engajamento) = Contagem(Dificuldade Baixa) × 0,09
 * - M4 (Estado Atual) = Média(M1, M2, M3)
 */
function calcularVariaveisComportamentais(
  respostas: RespostaObjetivo[]
): VariaveisComportamentais {
  const MULTIPLICADOR = 0.09;

  // M1 - Utilidade (Importância atribuída aos controles)
  const contagemImportante = respostas.filter((r) => isImportanciaAlta(r.importancia)).length;
  const M1 = contagemImportante * MULTIPLICADOR;

  // M2 - Interesse (Importância + Frequência)
  const contagemImportanteM2 = respostas.filter((r) => isImportanciaAlta(r.importancia)).length;
  const contagemFrequente = respostas.filter((r) => isFrequenciaAlta(r.frequencia)).length;
  const M2 = (contagemImportanteM2 + contagemFrequente) * MULTIPLICADOR;

  // M3 - Engajamento (Dificuldade baixa)
  const contagemSemDificuldade = respostas.filter((r) => isDificuldadeBaixa(r.dificuldade)).length;
  const M3 = contagemSemDificuldade * MULTIPLICADOR;

  // M4 - Estado Atual (Média de M1, M2, M3)
  const M4 = (M1 + M2 + M3) / 3;

  return { M1, M2, M3, M4 };
}

// ==========================================
// CÁLCULO DOS DETERMINANTES EXECUTIVOS
// ==========================================

/**
 * Calcula os 6 determinantes de performance executiva
 * 
 * Fórmulas BRAVO360:
 * - GAR (Garantia) = SOMA(BS, CONTRA, CD)
 * - HAB (Habilidade) = SOMA(COMP, GI, PR, SEG_GERAL, POL)
 * - REC (Recursos) = SOMA(INV, INF_GERAL, APP, SW)
 * - RI (Risco) = SOMA(LE, RC, QUA, CTN)
 * - OP (Oportunidade) = MÉDIA(M2, M3, M4)
 * - UTIL (Utilidade) = M1
 * 
 * Variáveis Compostas:
 * - SEG_GERAL = MÉDIA(ACC, CI, SF, SEG)
 * - INF_GERAL = MÉDIA(TL, INF, BKP, FAC)
 */
function calcularDeterminantes(
  objetivosCalculados: ResultadoObjetivo[],
  variaveis: VariaveisComportamentais
): DeterminantesPerformance {
  // Helper para obter IRB360 por sigla
  const getIRBBySigla = (sigla: string): number => {
    const obj = objetivosCalculados.find((o) => o.sigla === sigla);
    return obj?.irb360 || 0;
  };

  // Variáveis Compostas (MÉDIA)
  const SEG_GERAL = (
    getIRBBySigla('ACC') + 
    getIRBBySigla('CI') + 
    getIRBBySigla('SF') + 
    getIRBBySigla('SEG')
  ) / 4;

  const INF_GERAL = (
    getIRBBySigla('TL') + 
    getIRBBySigla('INF') + 
    getIRBBySigla('BKP') + 
    getIRBBySigla('FAC')
  ) / 4;

  // Determinantes Primários (SOMA)
  const GAR = 
    getIRBBySigla('BS') + 
    getIRBBySigla('CONTRA') + 
    getIRBBySigla('CD');

  const HAB = 
    getIRBBySigla('COMP') + 
    getIRBBySigla('GI') + 
    getIRBBySigla('PR') + 
    SEG_GERAL + 
    getIRBBySigla('POL');

  const REC = 
    getIRBBySigla('INV') + 
    INF_GERAL + 
    getIRBBySigla('APP') + 
    getIRBBySigla('SW');

  const RI = 
    getIRBBySigla('LE') + 
    getIRBBySigla('RC') + 
    getIRBBySigla('QUA') + 
    getIRBBySigla('CTN');

  // Determinantes Derivados
  const OP = (variaveis.M2 + variaveis.M3 + variaveis.M4) / 3;
  const UTIL = variaveis.M1;

  return { GAR, HAB, REC, RI, OP, UTIL };
}

// ==========================================
// CÁLCULO DO ISJF FINAL
// ==========================================

/**
 * Calcula o valor final do ISJF
 * 
 * Fórmula BRAVO360:
 * ISJF = ((((MÉDIA(GAR, HAB, REC)) × (RI / Kf)) / Ks) × OP) ^ UTIL
 * 
 * Onde:
 * - Kf = 711 (Constante de eficiência financeira)
 * - Ks = 2036 (Fator de simplificação numérica)
 */
function calcularISJFFinal(determinantes: DeterminantesPerformance): number {
  const { GAR, HAB, REC, RI, OP, UTIL } = determinantes;
  const { Kf, Ks } = CONSTANTES_ISJF;

  // Passo 1: Média dos 3 primeiros determinantes
  const mediaGarHabRec = (GAR + HAB + REC) / 3;

  // Passo 2: Fator de risco normalizado
  const fatorRisco = RI / Kf;

  // Passo 3: Produto dos fatores
  const produto = mediaGarHabRec * fatorRisco;

  // Passo 4: Normalização
  const normalizado = produto / Ks;

  // Passo 5: Aplicar oportunidade
  const comOportunidade = normalizado * OP;

  // Passo 6: Aplicar utilidade (exponencial)
  const isjf = Math.pow(comOportunidade, UTIL);

  return isjf;
}

// ==========================================
// FUNÇÃO PRINCIPAL - CALCULAR ISJF COMPLETO
// ==========================================

/**
 * 🚀 FUNÇÃO PRINCIPAL: Calcula o ISJF completo a partir das 22 respostas
 * 
 * @param respostas - Array com 22 respostas (importância, dificuldade, frequência)
 * @returns ResultadoISJF com ISJF, classificação, determinantes, variáveis e objetivos
 */
export function calcularISJF(respostas: RespostaObjetivo[]): ResultadoISJF {
  // Validar entrada
  if (respostas.length !== 22) {
    throw new Error(`Esperado 22 respostas, recebido ${respostas.length} 🤔`);
  }

  // Passo 1: Converter respostas e calcular IER/IRB360
  const objetivosCalculados = converterRespostas(respostas);

  // Passo 2: Calcular variáveis comportamentais (M1, M2, M3, M4)
  const variaveis = calcularVariaveisComportamentais(respostas);

  // Passo 3: Calcular determinantes de performance (GAR, HAB, REC, RI, OP, UTIL)
  const determinantes = calcularDeterminantes(objetivosCalculados, variaveis);

  // Passo 4: Calcular ISJF final
  const isjf = calcularISJFFinal(determinantes);

  // Passo 5: Separar restrictores e facilitadores
  const restrictores = objetivosCalculados.filter((obj) => obj.tipo === 'RESTRICTOR');
  const facilitadores = objetivosCalculados.filter((obj) => obj.tipo === 'FACILITADOR');

  // Passo 6: Obter classificação
  const classificacao = classificarISJF(isjf);

  return {
    isjf,
    classificacao,
    determinantes,
    variaveis,
    objetivos: objetivosCalculados,
    restrictores,
    facilitadores,
  };
}

// ==========================================
// FUNÇÕES DE FORMATAÇÃO
// ==========================================

/**
 * Formata o ISJF para exibição (2 casas decimais)
 */
export function formatarISJF(isjf: number): string {
  return isjf.toFixed(2);
}

/**
 * Formata determinante para exibição (1 casa decimal)
 */
export function formatarDeterminante(valor: number): string {
  return valor.toFixed(1);
}

/**
 * Formata variável comportamental para exibição (2 casas decimais)
 */
export function formatarVariavel(valor: number): string {
  return valor.toFixed(2);
}

/**
 * Formata IER para exibição (1 casa decimal)
 */
export function formatarIER(ier: number): string {
  return ier.toFixed(1);
}

/**
 * Formata IRB360 para exibição (sem casas decimais)
 */
export function formatarIRB360(irb360: number): string {
  return Math.round(irb360).toString();
}
