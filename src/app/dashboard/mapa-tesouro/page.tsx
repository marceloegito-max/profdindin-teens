'use client';

import React, { useState, useEffect } from 'react';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';

interface Objetivo {
  id?: string;
  titulo: string;
  valor: number;
  prazo: number; // em meses
  prioridade: 'alta' | 'media' | 'baixa';
  categoria: string;
}

export default function MapaTesouroPage() {
  const [step, setStep] = useState<'intro' | 'objetivos' | 'calculos' | 'resultado'>('intro');
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [novoObjetivo, setNovoObjetivo] = useState<Objetivo>({
    titulo: '',
    valor: 0,
    prazo: 6,
    prioridade: 'media',
    categoria: 'outros',
  });
  const [rendaMensal, setRendaMensal] = useState(0);
  const [gastosFixos, setGastosFixos] = useState(0);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isjfData, setIsjfData] = useState<any>(null);

  useEffect(() => {
    // Buscar último ISJF
    fetchLatestISJF();
  }, []);

  const fetchLatestISJF = async () => {
    try {
      const response = await fetch('/api/isjf/latest');
      if (response.ok) {
        const data = await response.json();
        setIsjfData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar ISJF:', error);
    }
  };

  const adicionarObjetivo = () => {
    if (novoObjetivo.titulo && novoObjetivo.valor > 0) {
      setObjetivos([...objetivos, { ...novoObjetivo, id: Date.now().toString() }]);
      setNovoObjetivo({
        titulo: '',
        valor: 0,
        prazo: 6,
        prioridade: 'media',
        categoria: 'outros',
      });
    }
  };

  const removerObjetivo = (id: string) => {
    setObjetivos(objetivos.filter(obj => obj.id !== id));
  };

  const calcularPlano = async () => {
    setLoading(true);
    try {
      const disponivel = rendaMensal - gastosFixos;
      const totalObjetivos = objetivos.reduce((sum, obj) => sum + obj.valor, 0);

      // Calcular economia mensal necessária
      const prazoMedio = objetivos.reduce((sum, obj) => sum + obj.prazo, 0) / objetivos.length;
      const economiaMensal = totalObjetivos / prazoMedio;

      // Salvar no banco via API
      const response = await fetch('/api/mapa-tesouro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objetivos,
          rendaMensal,
          gastosFixos,
          economiaMensal,
          disponivel,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar Mapa do Tesouro');

      const data = await response.json();
      
      // Recalcular ISJF
      const isjfResponse = await fetch('/api/isjf/calculate', {
        method: 'POST',
      });
      
      if (isjfResponse.ok) {
        const isjfData = await isjfResponse.json();
        data.isjf = isjfData;
      }

      setResultado(data);
      setStep('resultado');
    } catch (error) {
      console.error('Erro ao calcular plano:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'intro') {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-6xl text-center mb-4">🗺️</div>
              <CardTitle className="text-3xl text-center">
                Mapa do Tesouro
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Transforme seus sonhos em planos concretos!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-orange-900">
                  🎯 O que você vai criar:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✅ Definir seus objetivos financeiros (sonhos teen!)</li>
                  <li>✅ Calcular quanto precisa guardar por mês</li>
                  <li>✅ Ver seu progresso em formato de mapa</li>
                  <li>✅ Ganhar marcos e conquistas ao atingir metas</li>
                  <li>✅ Calcular seu ISJF (Índice de Saúde da Jornada Financeira)</li>
                </ul>
              </div>

              {isjfData && (
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">
                    📊 Seu ISJF Atual
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">
                        {isjfData.isjfValue?.toFixed(2) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Classificação: {isjfData.classificacao || 'Calculando...'}
                      </p>
                    </div>
                    <Button variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-blue-900 mb-2">
                  💡 Exemplos de objetivos teen:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>📱 Celular novo</div>
                  <div>🎮 Videogame</div>
                  <div>✈️ Viagem</div>
                  <div>🎸 Instrumento</div>
                  <div>💻 Computador</div>
                  <div>🚗 CNH</div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span>⏱️ ~10 minutos</span>
                  <span>•</span>
                  <span>🎯 +200 XP</span>
                  <span>•</span>
                  <span>🏆 Badge Planejador</span>
                </div>
                <Button
                  size="lg"
                  onClick={() => setStep('objetivos')}
                  className="w-full sm:w-auto"
                >
                  Criar meu mapa! 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (step === 'objetivos') {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Defina seus Objetivos</CardTitle>
              <CardDescription>
                Quais são seus sonhos financeiros? Vamos transformá-los em realidade!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário de novo objetivo */}
              <div className="p-6 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que você quer conquistar? 🎯
                  </label>
                  <input
                    type="text"
                    value={novoObjetivo.titulo}
                    onChange={(e) => setNovoObjetivo({ ...novoObjetivo, titulo: e.target.value })}
                    placeholder="Ex: iPhone 15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quanto custa? 💰
                    </label>
                    <input
                      type="number"
                      value={novoObjetivo.valor || ''}
                      onChange={(e) => setNovoObjetivo({ ...novoObjetivo, valor: parseFloat(e.target.value) || 0 })}
                      placeholder="R$ 0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Em quantos meses? ⏰
                    </label>
                    <input
                      type="number"
                      value={novoObjetivo.prazo}
                      onChange={(e) => setNovoObjetivo({ ...novoObjetivo, prazo: parseInt(e.target.value) || 6 })}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade 🔥
                    </label>
                    <select
                      value={novoObjetivo.prioridade}
                      onChange={(e) => setNovoObjetivo({ ...novoObjetivo, prioridade: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="alta">Alta - Urgente!</option>
                      <option value="media">Média - Importante</option>
                      <option value="baixa">Baixa - Quando der</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria 📁
                    </label>
                    <select
                      value={novoObjetivo.categoria}
                      onChange={(e) => setNovoObjetivo({ ...novoObjetivo, categoria: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="tecnologia">📱 Tecnologia</option>
                      <option value="educacao">📚 Educação</option>
                      <option value="lazer">🎉 Lazer</option>
                      <option value="transporte">🚗 Transporte</option>
                      <option value="outros">🎯 Outros</option>
                    </select>
                  </div>
                </div>

                <Button onClick={adicionarObjetivo} className="w-full">
                  Adicionar Objetivo ➕
                </Button>
              </div>

              {/* Lista de objetivos */}
              {objetivos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">Seus Objetivos ({objetivos.length})</h3>
                  {objetivos.map((obj) => (
                    <div
                      key={obj.id}
                      className="p-4 bg-white border-2 border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-gray-900">{obj.titulo}</h4>
                            <Badge
                              variant={
                                obj.prioridade === 'alta' ? 'danger' :
                                obj.prioridade === 'media' ? 'warning' : 'default'
                              }
                              size="sm"
                            >
                              {obj.prioridade}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                            <span>💰 R$ {obj.valor.toFixed(2)}</span>
                            <span>•</span>
                            <span>⏰ {obj.prazo} meses</span>
                            <span>•</span>
                            <span>📊 R$ {(obj.valor / obj.prazo).toFixed(2)}/mês</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removerObjetivo(obj.id!)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('intro')}
                >
                  ← Voltar
                </Button>
                <Button
                  onClick={() => setStep('calculos')}
                  disabled={objetivos.length === 0}
                >
                  Próximo: Cálculos →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (step === 'calculos') {
    const disponivel = rendaMensal - gastosFixos;
    const totalObjetivos = objetivos.reduce((sum, obj) => sum + obj.valor, 0);
    const prazoMedio = objetivos.reduce((sum, obj) => sum + obj.prazo, 0) / objetivos.length;
    const economiaNecessaria = totalObjetivos / prazoMedio;
    const consegueRealizar = disponivel >= economiaNecessaria;

    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>💰 Sua Situação Financeira</CardTitle>
              <CardDescription>
                Vamos ver se dá pra alcançar seus objetivos!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto você ganha/recebe por mês? 💵
                </label>
                <input
                  type="number"
                  value={rendaMensal || ''}
                  onChange={(e) => setRendaMensal(parseFloat(e.target.value) || 0)}
                  placeholder="R$ 0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Inclua mesada, salário, freelas, bicos, etc.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto você gasta com coisas fixas? 📊
                </label>
                <input
                  type="number"
                  value={gastosFixos || ''}
                  onChange={(e) => setGastosFixos(parseFloat(e.target.value) || 0)}
                  placeholder="R$ 0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Transporte, lanches, celular, streaming, etc.
                </p>
              </div>

              {rendaMensal > 0 && gastosFixos >= 0 && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg space-y-4">
                  <h3 className="font-bold text-lg">📊 Análise Rápida</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Disponível por mês:</span>
                      <span className="font-bold text-xl text-green-600">
                        R$ {disponivel.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Precisa economizar:</span>
                      <span className="font-bold text-xl text-blue-600">
                        R$ {economiaNecessaria.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      {consegueRealizar ? (
                        <div className="text-green-600 font-bold flex items-center">
                          ✅ Dá pra realizar! Você consegue!
                        </div>
                      ) : (
                        <div className="text-orange-600 font-bold flex items-center">
                          ⚠️ Vai ser apertado, mas não desiste!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('objetivos')}
                >
                  ← Voltar
                </Button>
                <Button
                  onClick={calcularPlano}
                  loading={loading}
                  disabled={rendaMensal <= 0}
                >
                  Criar Mapa! 🗺️
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TeenLayout>
    );
  }

  if (step === 'resultado' && resultado) {
    return (
      <TeenLayout>
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="text-center space-y-4">
                <div className="text-6xl">🗺️</div>
                <CardTitle className="text-3xl">
                  Mapa Criado!
                </CardTitle>
                <CardDescription className="text-lg">
                  Seu plano de ação está pronto! <Badge variant="success" size="lg">+{resultado.xpGanho || 200} XP</Badge>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          {resultado.isjf && (
            <Card>
              <CardHeader>
                <CardTitle>📊 Seu ISJF Atualizado</CardTitle>
                <CardDescription>
                  Índice de Saúde da Jornada Financeira recalculado!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div>
                    <p className="text-4xl font-bold text-purple-600">
                      {resultado.isjf.isjfValue?.toFixed(2) || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Determinantes:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>GAR: {resultado.isjf.gar?.toFixed(2)}</div>
                      <div>HAB: {resultado.isjf.hab?.toFixed(2)}</div>
                      <div>REC: {resultado.isjf.rec?.toFixed(2)}</div>
                      <div>RI: {resultado.isjf.ri?.toFixed(2)}</div>
                    </div>
                  </div>
                  <Button href="/dashboard/jornada" size="sm">
                    Ver Análise Completa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>🎯 Seus Objetivos no Mapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {objetivos.map((obj, index) => {
                const progresso = 0; // Será atualizado conforme o usuário for economizando
                return (
                  <div
                    key={obj.id}
                    className="p-4 bg-white border-2 border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <h4 className="font-bold text-gray-900">{obj.titulo}</h4>
                      </div>
                      <Badge variant="purple" size="sm">
                        R$ {(obj.valor / obj.prazo).toFixed(2)}/mês
                      </Badge>
                    </div>
                    <ProgressBar
                      value={progresso}
                      max={obj.valor}
                      showLabel
                      color="purple"
                      size="md"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Prazo: {obj.prazo} meses • Economia total: R$ {obj.valor.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💡 Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900">
                  1. Crie o hábito de guardar todo mês
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">
                  2. Acompanhe seu progresso na Jornada Financeira
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">
                  3. Complete atividades para ganhar XP e badges
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              href="/dashboard/jornada"
              size="lg"
              className="flex-1"
            >
              Ver Jornada Completa 📈
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
