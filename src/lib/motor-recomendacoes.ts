/**
 * MOTOR DE RECOMENDAÇÕES - DINDIN TEENS
 * 
 * Sistema de recomendações personalizadas baseado em:
 * - Check-up de Estresse Financeiro 😰
 * - Raio-X da Personalidade Financeira 🧠
 * - Mapa do Tesouro (ISJF) 🗺️
 * 
 * Integração com Abacus.AI para análises inteligentes adaptadas para teens! 🚀
 */

import { ResultadoISJF } from './calculo-isjf';

// ==========================================
// TIPOS E INTERFACES
// ==========================================

export interface PerfilTeen {
  idade?: number;
  rendaMensal?: number;
  fonteRenda?: string;
  metaPrincipal?: string;
  arquetipo?: string;
  perfilRisco?: string;
  cidade?: string;
}

export interface ContextoRecomendacao {
  modulo: 'checkup' | 'raio-x' | 'mapa-tesouro';
  teen: PerfilTeen;
  resultadoISJF?: ResultadoISJF;
  agenteEstressor?: string;
  perfilPsicoFinanceiro?: string;
  primeiraVez?: boolean;
}

export interface RecomendacaoGerada {
  titulo: string;
  mensagem: string;
  acaoImediata: string[];
  proximosPassos: string[];
  atividadesSugeridas: string[];
  motivacao: string;
  referenciasModelos: string[];
}

// ==========================================
// PROMPTS PARA ABACUS.AI
// ==========================================

/**
 * Gera prompt contextual para Abacus.AI adaptado para teens
 */
function gerarPromptTeens(contexto: ContextoRecomendacao): string {
  const { modulo, teen, resultadoISJF, agenteEstressor, primeiraVez } = contexto;

  let prompt = `Você é o Dindin Teens, um coach financeiro virtual especializado em ajudar adolescentes (12-19 anos) com educação financeira. Use linguagem jovem, emojis e seja motivacional!

📋 PERFIL DO TEEN:
- Idade: ${teen.idade || 'não informada'}
- Renda mensal: R$ ${teen.rendaMensal || 0}
- Fonte de renda: ${teen.fonteRenda || 'não informada'}
- Meta principal: ${teen.metaPrincipal || 'não definida'}
- Arquétipo: ${teen.arquetipo || 'não definido'}
- É primeira vez? ${primeiraVez ? 'Sim! 🆕' : 'Não'}

`;

  // Adicionar contexto específico do módulo
  if (modulo === 'mapa-tesouro' && resultadoISJF) {
    prompt += `
🗺️ RESULTADO DO MAPA DO TESOURO (ISJF):
- ISJF: ${resultadoISJF.isjf.toFixed(2)}
- Classificação: ${resultadoISJF.classificacao}
- Restrictores (precisam atenção): ${resultadoISJF.restrictores.length} objetivos
- Facilitadores (tão de boa): ${resultadoISJF.facilitadores.length} objetivos

📊 DETERMINANTES:
- 🛡️ Garantia (GAR): ${resultadoISJF.determinantes.GAR.toFixed(1)}
- 🎯 Habilidade (HAB): ${resultadoISJF.determinantes.HAB.toFixed(1)}
- 🔧 Recursos (REC): ${resultadoISJF.determinantes.REC.toFixed(1)}
- ⚠️ Risco (RI): ${resultadoISJF.determinantes.RI.toFixed(1)}
- 🚀 Oportunidade (OP): ${resultadoISJF.determinantes.OP.toFixed(2)}
- 💎 Utilidade (UTIL): ${resultadoISJF.determinantes.UTIL.toFixed(2)}

⚠️ PRINCIPAIS RESTRICTORES:
${resultadoISJF.restrictores.slice(0, 5).map(r => 
  `- ${r.sigla}: ${r.assunto} (IER: ${r.ier.toFixed(1)})`
).join('\n')}
`;
  }

  if (modulo === 'checkup' && agenteEstressor) {
    prompt += `
😰 CHECK-UP DE ESTRESSE FINANCEIRO:
- Agente Estressor identificado: ${agenteEstressor}
`;
  }

  // Instrução final
  prompt += `

🎯 TAREFA:
Gere recomendações personalizadas para este teen, incluindo:

1. **Mensagem Inicial** (tom motivacional, use emojis, max 200 palavras)
   - Parabenize ou encoraje conforme a situação
   - Seja empático e realista

2. **Ações Imediatas** (3-5 ações que podem fazer AGORA)
   - Práticas e específicas
   - Adaptadas para a realidade do teen

3. **Próximos Passos** (3-5 passos para médio prazo)
   - Sequenciais e progressivos
   - Incluir timeframes (ex: "nas próximas 2 semanas")

4. **Atividades Sugeridas** (3-5 códigos de atividades do banco)
   - Priorize atividades que abordem os restrictores
   - Formato: CK-01, RX-02, MT-03, etc.

5. **Motivação Final** (frase inspiradora em tom teen, max 50 palavras)

6. **Referências Teóricas** (cite 2-3 dos 7 modelos aplicáveis)
   - Taleb (Antifragilidade)
   - Falconi (PDCA)
   - Freud (Id, Ego, Superego)
   - Piaget (Desenvolvimento)
   - Kurt Lewin (Mudança)
   - Kübler-Ross (Aceitação)
   - BRAVO360 (Performance)

Formato da resposta: JSON estruturado
{
  "titulo": "...",
  "mensagem": "...",
  "acaoImediata": ["...", "...", "..."],
  "proximosPassos": ["...", "...", "..."],
  "atividadesSugeridas": ["CK-01", "RX-02", "..."],
  "motivacao": "...",
  "referenciasModelos": ["...", "...", "..."]
}
`;

  return prompt;
}

// ==========================================
// INTEGRAÇÃO COM ABACUS.AI
// ==========================================

/**
 * Chama Abacus.AI LLM para gerar recomendações
 */
async function chamarAbacusAI(prompt: string): Promise<string> {
  const ABACUS_API_KEY = process.env.ABACUS_API_KEY;

  if (!ABACUS_API_KEY) {
    console.warn('⚠️ ABACUS_API_KEY não configurada. Usando fallback.');
    return gerarRecomendacaoFallback();
  }

  try {
    // Chamar API do Abacus.AI via fetch
    // Nota: Ajuste a URL e formato conforme documentação oficial da Abacus.AI
    const response = await fetch('https://api.abacus.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ABACUS_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Abacus.AI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || data?.text;
    
    return text || gerarRecomendacaoFallback();
  } catch (error) {
    console.error('Erro ao chamar Abacus.AI:', error);
    return gerarRecomendacaoFallback();
  }
}

/**
 * Fallback: Recomendação genérica quando IA não está disponível
 */
function gerarRecomendacaoFallback(): string {
  return JSON.stringify({
    titulo: "🚀 Vamos nessa, parceiro(a)!",
    mensagem: "Parabéns por dar esse passo na sua jornada financeira! 🎉 Todo mundo começa de algum lugar, e o importante é começar. Identificamos alguns pontos que precisam de atenção, mas nada que você não consiga melhorar com as atividades certas e um pouquinho de disciplina. Bora fazer acontecer? 💪",
    acaoImediata: [
      "📱 Baixe um app de controle financeiro (Mobills, GuiaBolso ou até uma planilha)",
      "📝 Anote TODOS os gastos de hoje (até aquele lanche de R$ 5)",
      "🎯 Defina UMA meta clara pro seu dinheiro (ex: comprar um celular novo em 6 meses)"
    ],
    proximosPassos: [
      "📊 Nas próximas 2 semanas: Registre todos os gastos diariamente",
      "💡 Em 1 mês: Faça uma revisão dos seus gastos e veja onde dá pra economizar",
      "🚀 Em 2 meses: Crie um orçamento mensal e separe 10% pra guardar"
    ],
    atividadesSugeridas: [
      "CK-01: O Detector de Glitches Emocionais",
      "CK-02: O Detetive das Micro-Sangrias",
      "RX-01: O Espelho do Arquétipo"
    ],
    motivacao: "Lembre-se: Pequenas mudanças hoje = grandes resultados amanhã! 🌟 Você consegue!",
    referenciasModelos: [
      "BRAVO360: Desenvolvimento progressivo de habilidades financeiras",
      "Taleb: Antifragilidade - pequenos erros agora evitam grandes problemas depois",
      "Falconi: PDCA - Planejar, Fazer, Checar, Agir"
    ]
  });
}

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

/**
 * 🚀 FUNÇÃO PRINCIPAL: Gera recomendações personalizadas para teens
 */
export async function gerarRecomendacoesTeens(
  contexto: ContextoRecomendacao
): Promise<RecomendacaoGerada> {
  try {
    // Gerar prompt contextual
    const prompt = gerarPromptTeens(contexto);

    // Chamar Abacus.AI
    const responseText = await chamarAbacusAI(prompt);

    // Parse da resposta
    const recomendacao: RecomendacaoGerada = JSON.parse(responseText);

    return recomendacao;
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    
    // Fallback em caso de erro
    return JSON.parse(gerarRecomendacaoFallback());
  }
}

/**
 * Gera recomendação específica para resultado ISJF
 */
export async function gerarRecomendacaoISJF(
  teen: PerfilTeen,
  resultadoISJF: ResultadoISJF
): Promise<RecomendacaoGerada> {
  return gerarRecomendacoesTeens({
    modulo: 'mapa-tesouro',
    teen,
    resultadoISJF,
    primeiraVez: false,
  });
}

/**
 * Gera recomendação para Check-up de Estresse
 */
export async function gerarRecomendacaoCheckup(
  teen: PerfilTeen,
  agenteEstressor: string
): Promise<RecomendacaoGerada> {
  return gerarRecomendacoesTeens({
    modulo: 'checkup',
    teen,
    agenteEstressor,
    primeiraVez: false,
  });
}
