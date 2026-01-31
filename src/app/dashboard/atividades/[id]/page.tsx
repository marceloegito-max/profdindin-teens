'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Activity {
  id: string;
  code: string;
  module: string;
  name: string;
  objective: string;
  tasks: any;
  tools: any;
  successCriteria: any;
  points: number;
  suggestedDuration: string;
  completed?: boolean;
}

export default function AtividadeDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [atividade, setAtividade] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [concluindo, setConcluindo] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAtividade(params.id as string);
    }
  }, [params.id]);

  const fetchAtividade = async (id: string) => {
    try {
      const response = await fetch(`/api/activities/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAtividade(data.activity);
      }
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async () => {
    if (!atividade) return;

    setConcluindo(true);
    try {
      const response = await fetch(`/api/activities/${atividade.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respostas }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mostrar sucesso
        alert(`🎉 Parabéns! Você ganhou +${data.pointsEarned} XP!`);
        router.push('/dashboard/atividades');
      } else {
        alert('Erro ao concluir atividade. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao concluir atividade:', error);
      alert('Erro ao concluir atividade. Tente novamente.');
    } finally {
      setConcluindo(false);
    }
  };

  if (loading) {
    return (
      <TeenLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </TeenLayout>
    );
  }

  if (!atividade) {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Atividade não encontrada
              </h3>
              <Button href="/dashboard/atividades" className="mt-4">
                Voltar para Atividades
              </Button>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (!executando) {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Button
              href="/dashboard/atividades"
              variant="outline"
              size="sm"
            >
              ← Voltar
            </Button>
          </div>

          {/* Card Principal */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{atividade.code}</Badge>
                  {atividade.completed && (
                    <Badge variant="success">✓ Completa</Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">
                  {atividade.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {atividade.objective}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm text-gray-600">Recompensa</p>
                  <p className="text-xl font-bold text-purple-600">
                    +{atividade.points} XP
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl mb-2">⏱️</div>
                  <p className="text-sm text-gray-600">Duração</p>
                  <p className="text-xl font-bold text-blue-600">
                    {atividade.suggestedDuration || '~10 min'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl mb-2">📁</div>
                  <p className="text-sm text-gray-600">Módulo</p>
                  <p className="text-xl font-bold text-green-600">
                    {atividade.module.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Tarefas */}
              {atividade.tasks && typeof atividade.tasks === 'object' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    📋 O que você vai fazer:
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(atividade.tasks).map(([key, value], index) => (
                      <div
                        key={key}
                        className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500"
                      >
                        <p className="font-medium text-gray-900">
                          {index + 1}. {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critérios de Sucesso */}
              {atividade.successCriteria && typeof atividade.successCriteria === 'object' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    ✅ Critérios de Sucesso:
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(atividade.successCriteria).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start space-x-2"
                      >
                        <span className="text-green-600 mt-1">✓</span>
                        <p className="text-gray-700">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de Iniciar */}
              <div className="pt-6">
                <Button
                  onClick={() => setExecutando(true)}
                  size="lg"
                  className="w-full"
                >
                  {atividade.completed ? 'Fazer Novamente' : 'Iniciar Atividade'} 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  // Tela de execução da atividade
  return (
    <TeenLayout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Realizando: {atividade.name}</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para concluir a atividade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulário simples de execução */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 O que você aprendeu com esta atividade?
                </label>
                <textarea
                  value={respostas['aprendizado'] || ''}
                  onChange={(e) => setRespostas({ ...respostas, aprendizado: e.target.value })}
                  rows={4}
                  placeholder="Conte o que você descobriu..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚀 Como você vai aplicar isso na sua vida?
                </label>
                <textarea
                  value={respostas['aplicacao'] || ''}
                  onChange={(e) => setRespostas({ ...respostas, aplicacao: e.target.value })}
                  rows={4}
                  placeholder="Seus próximos passos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⭐ Avalie sua experiência (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((nota) => (
                    <button
                      key={nota}
                      onClick={() => setRespostas({ ...respostas, avaliacao: nota.toString() })}
                      className={`
                        w-12 h-12 rounded-lg font-bold transition-all
                        ${respostas['avaliacao'] === nota.toString()
                          ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {nota}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setExecutando(false)}
              >
                ← Voltar
              </Button>
              <Button
                onClick={handleConcluir}
                loading={concluindo}
                disabled={!respostas['aprendizado'] || !respostas['aplicacao']}
              >
                Concluir Atividade ✓
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeenLayout>
  );
}
