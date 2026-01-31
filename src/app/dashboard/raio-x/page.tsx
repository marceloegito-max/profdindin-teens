'use client';

import React, { useState } from 'react';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { raioXPerguntas, arquetipos } from '@/lib/data/raio-x-perguntas';
import { useRouter } from 'next/navigation';

export default function RaioXPage() {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'form' | 'resultado'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleResposta = (perguntaId: string, opcaoIndex: number) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: opcaoIndex }));
  };

  const handleProximaPergunta = () => {
    if (currentQuestion < raioXPerguntas.length - 1) {
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
      // Calcular arquetipo dominante
      const pontuacoes: Record<string, number> = {};

      Object.entries(respostas).forEach(([perguntaId, opcaoIndex]) => {
        const pergunta = raioXPerguntas.find(p => p.id === perguntaId);
        if (pergunta) {
          const opcao = pergunta.opcoes[opcaoIndex];
          pontuacoes[opcao.arquetipo] = (pontuacoes[opcao.arquetipo] || 0) + 1;
        }
      });

      const arquetipoDominante = Object.entries(pontuacoes)
        .sort(([, a], [, b]) => b - a)[0][0];

      // Salvar no banco via API
      const response = await fetch('/api/raio-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respostas,
          arquetipoDominante,
          pontuacoes,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar Raio-X');

      const data = await response.json();
      setResultado(data);
      setStep('resultado');
    } catch (error) {
      console.error('Erro ao finalizar Raio-X:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const perguntaAtual = raioXPerguntas[currentQuestion];
  const respostaAtual = respostas[perguntaAtual?.id];
  const progresso = (Object.keys(respostas).length / raioXPerguntas.length) * 100;

  if (step === 'intro') {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-6xl text-center mb-4">🧠</div>
              <CardTitle className="text-3xl text-center">
                Raio-X Financeiro
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Descubra sua personalidade financeira!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-blue-900">
                  🔍 O que você vai descobrir:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✅ Seu arquétipo financeiro (Gastador, Poupador, Equilibrado ou Investidor)</li>
                  <li>✅ Seus pontos fortes e fracos com dinheiro</li>
                  <li>✅ Seu perfil de risco e como você toma decisões</li>
                  <li>✅ Recomendações personalizadas pra seu perfil</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(arquetipos).map(([key, arq]) => (
                  <div key={key} className="p-4 bg-white border-2 border-gray-200 rounded-lg text-center">
                    <div className="text-3xl mb-2">{arq.emoji}</div>
                    <h4 className="font-bold text-sm text-gray-900">{arq.nome}</h4>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-yellow-900 mb-2">
                  💡 Como funciona:
                </h3>
                <p className="text-gray-700">
                  São <strong>{raioXPerguntas.length} perguntas</strong> sobre como você pensa e age com dinheiro. 
                  Não tem resposta certa ou errada - seja você mesmo(a)! 😊
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span>⏱️ ~7 minutos</span>
                  <span>•</span>
                  <span>🎯 +150 XP</span>
                  <span>•</span>
                  <span>🏆 Badge Raio-X</span>
                </div>
                <Button
                  size="lg"
                  onClick={() => setStep('form')}
                  className="w-full sm:w-auto"
                >
                  Descobrir meu perfil! 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (step === 'form') {
    const opcaoSelecionada = respostaAtual !== undefined
      ? perguntaAtual.opcoes[respostaAtual]
      : null;

    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-600">
                Questão {currentQuestion + 1} de {raioXPerguntas.length}
              </h2>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progresso)}% completo
              </span>
            </div>
            <ProgressBar value={progresso} max={100} color="blue" size="md" />
          </div>

          <Card>
            <CardContent className="pt-8 space-y-6">
              <div>
                <Badge variant="default" size="sm" className="mb-3">
                  {perguntaAtual.categoria}
                </Badge>
                <h3 className="text-2xl font-bold text-gray-900">
                  {perguntaAtual.pergunta}
                </h3>
              </div>

              <div className="space-y-3">
                {perguntaAtual.opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => handleResposta(perguntaAtual.id, index)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all
                      ${respostaAtual === index
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{opcao.texto}</span>
                      {respostaAtual === index && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
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
                  loading={loading && currentQuestion === raioXPerguntas.length - 1}
                >
                  {currentQuestion === raioXPerguntas.length - 1
                    ? 'Ver Resultado 🎯'
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
    const arq = arquetipos[resultado.arquetipoDominante as keyof typeof arquetipos];

    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="text-center space-y-4">
                <div className="text-6xl">{arq.emoji}</div>
                <CardTitle className="text-3xl">
                  Você é: {arq.nome}!
                </CardTitle>
                <CardDescription className="text-lg">
                  {arq.descricao}
                </CardDescription>
                <div>
                  <Badge variant="success" size="lg">+{resultado.xpGanho || 150} XP</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✨ Suas Características</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {arq.caracteristicas.map((caracteristica, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">✓ {caracteristica}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💡 Dicas para Você</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {arq.dicas.map((dica, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
                >
                  <p className="text-gray-900">{index + 1}. {dica}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {resultado.recomendacao && (
            <Card>
              <CardHeader>
                <CardTitle>🧠 Análise Psico-Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-700">
                  <p>{resultado.recomendacao.perfilPsicoFinanceiro}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              href="/dashboard/mapa-tesouro"
              size="lg"
              className="flex-1"
            >
              Próxima Etapa: Mapa do Tesouro 🗺️
            </Button>
            <Button
              href="/dashboard/atividades"
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Ver Atividades 📚
            </Button>
          </div>
        </div>
      </TeenLayout>
    );
  }

  return null;
}
