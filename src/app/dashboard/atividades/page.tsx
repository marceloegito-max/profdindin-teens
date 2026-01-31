'use client';

import React, { useState, useEffect } from 'react';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Activity {
  id: string;
  code: string;
  module: string;
  name: string;
  objective: string;
  points: number;
  suggestedDuration: string;
  completed?: boolean;
  locked?: boolean;
}

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroModulo, setFiltroModulo] = useState<string>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetchAtividades();
  }, []);

  const fetchAtividades = async () => {
    try {
      const response = await fetch('/api/activities');
      if (response.ok) {
        const data = await response.json();
        setAtividades(data.activities);
      }
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar atividades
  const atividadesFiltradas = atividades.filter(atividade => {
    const matchModulo = filtroModulo === 'TODOS' || atividade.module === filtroModulo;
    const matchStatus = 
      filtroStatus === 'TODOS' ||
      (filtroStatus === 'COMPLETAS' && atividade.completed) ||
      (filtroStatus === 'PENDENTES' && !atividade.completed) ||
      (filtroStatus === 'BLOQUEADAS' && atividade.locked);
    const matchBusca = 
      atividade.name.toLowerCase().includes(busca.toLowerCase()) ||
      atividade.objective.toLowerCase().includes(busca.toLowerCase());
    
    return matchModulo && matchStatus && matchBusca;
  });

  const totalCompletas = atividades.filter(a => a.completed).length;
  const totalPendentes = atividades.filter(a => !a.completed && !a.locked).length;
  const totalBloqueadas = atividades.filter(a => a.locked).length;

  const moduloEmoji: Record<string, string> = {
    CHECKUP: '😰',
    RAIO_X: '🧠',
    MAPA_TESOURO: '🗺️',
  };

  const moduloNome: Record<string, string> = {
    CHECKUP: 'Check-up',
    RAIO_X: 'Raio-X',
    MAPA_TESOURO: 'Mapa do Tesouro',
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

  return (
    <TeenLayout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            📚 Atividades
          </h1>
          <p className="text-lg text-gray-600">
            Complete atividades para ganhar XP e melhorar sua saúde financeira!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completas</p>
                  <p className="text-3xl font-bold text-green-600">{totalCompletas}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disponíveis</p>
                  <p className="text-3xl font-bold text-blue-600">{totalPendentes}</p>
                </div>
                <div className="text-4xl">📄</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bloqueadas</p>
                  <p className="text-3xl font-bold text-gray-400">{totalBloqueadas}</p>
                </div>
                <div className="text-4xl">🔒</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Busca */}
            <div>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="🔍 Buscar atividades..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filtros de Módulo e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Módulo
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFiltroModulo('TODOS')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtroModulo === 'TODOS'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  {['CHECKUP', 'RAIO_X', 'MAPA_TESOURO'].map((modulo) => (
                    <button
                      key={modulo}
                      onClick={() => setFiltroModulo(modulo)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filtroModulo === modulo
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {moduloEmoji[modulo]} {moduloNome[modulo]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['TODOS', 'PENDENTES', 'COMPLETAS', 'BLOQUEADAS'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFiltroStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filtroStatus === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Atividades */}
        {atividadesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhuma atividade encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou buscar por outro termo.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {atividadesFiltradas.map((atividade) => (
              <Card
                key={atividade.id}
                className={`
                  transition-all hover:shadow-lg
                  ${atividade.locked ? 'opacity-60' : ''}
                  ${atividade.completed ? 'border-2 border-green-500' : ''}
                `}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">
                            {moduloEmoji[atividade.module]}
                          </span>
                          <Badge variant="default" size="sm">
                            {atividade.code}
                          </Badge>
                          {atividade.completed && (
                            <Badge variant="success" size="sm">
                              ✓ Completa
                            </Badge>
                          )}
                          {atividade.locked && (
                            <Badge variant="default" size="sm">
                              🔒 Bloqueada
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {atividade.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {atividade.objective}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>🎯 +{atividade.points} XP</span>
                        <span>•</span>
                        <span>⏱️ {atividade.suggestedDuration || '~10 min'}</span>
                      </div>
                      <Link href={`/dashboard/atividades/${atividade.id}`}>
                        <Button
                          size="sm"
                          disabled={atividade.locked}
                          variant={atividade.completed ? 'outline' : 'primary'}
                        >
                          {atividade.completed ? 'Ver Novamente' : 'Iniciar'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TeenLayout>
  );
}
