'use client';

import React, { useState } from 'react';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { checkupPerguntas, agentesEstressores } from '@/lib/data/checkup-perguntas';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CheckupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<'intro' | 'form' | 'resultado'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleResposta = (perguntaId: string, opcaoIndex: number) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: opcaoIndex }));
  };

  const handleProximaPergunta = () => {
    if (currentQuestion < checkupPerguntas.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinalizar();
    }
  };

  const handleAnteriorPergunta = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinalizar = async () => {
    setLoading(true);
    try {
      // Calcular agentes estressores identificados
      const agentesIdentificados: Record<string, number> = {};
      
      Object.entries(respostas).forEach(([perguntaId, opcaoIndex]) => {
        const pergunta = checkupPerguntas.find(p => p.id === perguntaId);
        if (pergunta) {
          const impacto = 3 - opcaoIndex; // Quanto menor a opção, maior o impacto
          agentesIdentificados[pergunta.agente] = impacto;
        }
      });

      // Salvar no banco via API
      const response = await fetch('/api/checkup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respostas,
          agentesIdentificados,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar Check-up');

      const data = await response.json();
      setResultado(data);
      setStep('resultado');
    } catch (error) {
      console.error('Erro ao finalizar Check-up:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const perguntaAtual = checkupPerguntas[currentQuestion];
  const respostaAtual = respostas[perguntaAtual?.id];
  const progresso = (Object.keys(respostas).length / checkupPerguntas.length) * 100;

  if (step === 'intro') {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-6xl text-center mb-4">😰</div>
              <CardTitle className="text-3xl text-center">
                Check-up Financeiro
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Vamos identificar o que tá te estressando financeiramente!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-purple-900">
                  🎯 O que você vai descobrir:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✅ Seus principais agentes estressores financeiros</li>
                  <li>✅ Onde você tá perdendo dinheiro sem perceber</li>
                  <li>✅ O que precisa de atenção urgente na sua vida financeira</li>
                  <li>✅ Atividades personalizadas pra você melhorar</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-2">
                  💡 Como funciona:
                </h3>
                <p className="text-gray-700">
                  São apenas <strong>{checkupPerguntas.length} perguntas rápidas</strong> sobre seus hábitos financeiros. 
                  Seja sincero(a) nas respostas pra gente te ajudar de verdade! 🚀
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span>⏱️ ~5 minutos</span>
                  <span>•</span>
                  <span>🎯 +100 XP</span>
                  <span>•</span>
                  <span>🏆 Badge Check-up</span>
                </div>
                <Button
                  size="lg"
                  onClick={() => setStep('form')}
                  className="w-full sm:w-auto"
                >
                  Vamos lá! 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (step === 'form') {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-600">
                Questão {currentQuestion + 1} de {checkupPerguntas.length}
              </h2>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(progresso)}% completo
              </span>
            </div>
            <ProgressBar value={progresso} max={100} color="purple" size="md" />
          </div>

          <Card>
            <CardContent className="pt-8 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {perguntaAtual.pergunta}
              </h3>

              <div className="space-y-3">
                {perguntaAtual.opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => handleResposta(perguntaAtual.id, index)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all
                      ${respostaAtual === index
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{opcao}</span>
                      {respostaAtual === index && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleAnteriorPergunta}
                  disabled={currentQuestion === 0}
                >
                  ← Anterior
                </Button>
                <Button
                  onClick={handleProximaPergunta}
                  disabled={respostaAtual === undefined}
                  loading={loading && currentQuestion === checkupPerguntas.length - 1}
                >
                  {currentQuestion === checkupPerguntas.length - 1
                    ? 'Finalizar ✓'
                    : 'Próxima →'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (step === 'resultado' && resultado) {
    const agentesTop = Object.entries(resultado.agentesIdentificados)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3);

    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="text-center space-y-4">
                <div className="text-6xl">🎯</div>
                <CardTitle className="text-3xl">
                  Check-up Concluído!
                </CardTitle>
                <CardDescription className="text-lg">
                  Você ganhou <Badge variant="success" size="lg">+{resultado.xpGanho || 100} XP</Badge>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔴 Seus Principais Estressores</CardTitle>
              <CardDescription>
                Estes são os pontos que precisam de mais atenção:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentesTop.map(([agente, impacto]: [string, any], index) => (
                <div
                  key={agente}
                  className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {index + 1}. {agente}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Nível de impacto: {impacto > 2 ? 'Alto' : impacto > 1 ? 'Médio' : 'Baixo'}
                      </p>
                    </div>
                    <div className="text-3xl">
                      {impacto > 2 ? '🔴' : impacto > 1 ? '🟡' : '🟢'}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {resultado.atividadesSugeridas && resultado.atividadesSugeridas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🎯 Atividades Recomendadas</CardTitle>
                <CardDescription>
                  Complete estas atividades para melhorar sua saúde financeira:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {resultado.atividadesSugeridas.map((atividade: any) => (
                  <div
                    key={atividade.code}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{atividade.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{atividade.objective}</p>
                      </div>
                      <Badge variant="purple">+{atividade.points} XP</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              href="/dashboard/atividades"
              size="lg"
              className="flex-1"
            >
              Ver Atividades 📚
            </Button>
            <Button
              href="/dashboard/raio-x"
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Próxima Etapa: Raio-X 🧠
            </Button>
          </div>
        </div>
      </TeenLayout>
    );
  }

  return null;
}
