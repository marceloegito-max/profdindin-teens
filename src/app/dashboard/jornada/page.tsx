'use client';

import React, { useState, useEffect } from 'react';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ISJFChart } from '@/components/ISJFChart';
import { Timeline } from '@/components/Timeline';
import { AchievementsGrid } from '@/components/AchievementCard';

export default function JornadaPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'isjf' | 'timeline' | 'achievements'>('overview');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchJornadaData();
  }, []);

  const fetchJornadaData = async () => {
    try {
      // Buscar dados de várias APIs
      const [isjfHistory, userProgress, badges, activities] = await Promise.all([
        fetch('/api/isjf/history').then(r => r.ok ? r.json() : { history: [] }),
        fetch('/api/user/progress').then(r => r.ok ? r.json() : null),
        fetch('/api/badges').then(r => r.ok ? r.json() : { badges: [] }),
        fetch('/api/activities').then(r => r.ok ? r.json() : { activities: [] }),
      ]);

      // Criar eventos da timeline
      const timelineEvents = [];
      
      // Adicionar eventos de ISJF
      if (isjfHistory.history) {
        isjfHistory.history.forEach((entry: any) => {
          timelineEvents.push({
            id: `isjf-${entry.id}`,
            date: entry.createdAt,
            type: 'mapa-tesouro',
            title: 'ISJF Calculado',
            description: `Seu índice ficou em ${entry.isjfValue?.toFixed(2)}`,
            points: 0,
          });
        });
      }

      // Adicionar atividades completadas
      if (activities.completedActivities) {
        activities.completedActivities.forEach((activity: any) => {
          timelineEvents.push({
            id: `activity-${activity.id}`,
            date: activity.completedAt,
            type: 'atividade',
            title: `Atividade: ${activity.activity?.name || 'Completada'}`,
            description: activity.activity?.objective,
            points: activity.pointsEarned,
          });
        });
      }

      // Adicionar badges conquistados
      if (badges.userBadges) {
        badges.userBadges.forEach((userBadge: any) => {
          timelineEvents.push({
            id: `badge-${userBadge.id}`,
            date: userBadge.earnedAt,
            type: 'badge',
            title: `Badge: ${userBadge.badge?.name || 'Conquistado'}`,
            description: userBadge.badge?.description,
            icon: userBadge.badge?.icon || '🏆',
          });
        });
      }

      // Ordenar por data (mais recente primeiro)
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setData({
        isjfHistory: isjfHistory.history || [],
        userProgress: userProgress || {},
        badges: badges.badges || [],
        userBadges: badges.userBadges || [],
        activities: activities.activities || [],
        completedActivities: activities.completedActivities || [],
        timelineEvents: timelineEvents.slice(0, 20), // Últimos 20 eventos
      });
    } catch (error) {
      console.error('Erro ao buscar dados da jornada:', error);
    } finally {
      setLoading(false);
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

  const latestISJF = data?.isjfHistory?.[0];
  const progress = data?.userProgress || {};
  
  // Calcular nível baseado em XP
  const level = Math.floor(progress.xp / 500) + 1;
  const xpForNextLevel = level * 500;
  const xpProgress = progress.xp % 500;

  return (
    <TeenLayout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            📈 Sua Jornada Financeira
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe seu progresso e evolução!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { key: 'overview', label: '📊 Visão Geral', icon: '📊' },
            { key: 'isjf', label: '🗺️ ISJF', icon: '🗺️' },
            { key: 'timeline', label: '📅 Timeline', icon: '📅' },
            { key: 'achievements', label: '🏆 Conquistas', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`
                px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all
                ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Nível Atual"
                value={level}
                icon="🎮"
                color="purple"
              />
              <StatCard
                label="XP Total"
                value={progress.xp || 0}
                icon="⭐"
                color="yellow"
              />
              <StatCard
                label="Streak Atual"
                value={(progress.currentStreak || 0) + ' dias'}
                icon="🔥"
                color="red"
              />
              <StatCard
                label="Atividades"
                value={progress.totalActivitiesCompleted || 0}
                icon="📚"
                color="blue"
              />
            </div>

            {/* ISJF Card */}
            {latestISJF && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>🗺️ Seu ISJF Atual</CardTitle>
                      <CardDescription>
                        Índice de Saúde da Jornada Financeira
                      </CardDescription>
                    </div>
                    <Button
                      href="/dashboard/mapa-tesouro"
                      size="sm"
                      variant="outline"
                    >
                      Recalcular
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-5xl font-bold text-purple-600">
                          {latestISJF.isjfValue?.toFixed(2) || 'N/A'}
                        </span>
                        <Badge variant="purple" size="lg">
                          Calculado
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">
                        Última atualização: {new Date(latestISJF.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Garantia (GAR)</p>
                          <p className="font-bold text-red-600">{latestISJF.gar?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Habilidade (HAB)</p>
                          <p className="font-bold text-blue-600">{latestISJF.hab?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Recursos (REC)</p>
                          <p className="font-bold text-green-600">{latestISJF.rec?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Risco (RI)</p>
                          <p className="font-bold text-yellow-600">{latestISJF.ri?.toFixed(2) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progresso para próximo nível */}
            <Card>
              <CardHeader>
                <CardTitle>🚀 Progresso para Nível {level + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{xpProgress} XP</span>
                    <span>{xpForNextLevel} XP</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${(xpProgress / xpForNextLevel) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    Faltam {xpForNextLevel - xpProgress} XP para o próximo nível!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Estatísticas de Módulos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">😰</span>
                        <span className="text-gray-700">Check-ups</span>
                      </div>
                      <Badge variant="purple">{progress.totalCheckups || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🧠</span>
                        <span className="text-gray-700">Raio-X</span>
                      </div>
                      <Badge variant="info">{progress.totalRaioX || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🗺️</span>
                        <span className="text-gray-700">Mapas do Tesouro</span>
                      </div>
                      <Badge variant="warning">{progress.totalMapasTesouro || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏆 Recordes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-gray-700">Maior Streak</span>
                      </div>
                      <Badge variant="danger">{progress.longestStreak || 0} dias</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-gray-700">Total XP</span>
                      </div>
                      <Badge variant="warning">{progress.xp || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🏅</span>
                        <span className="text-gray-700">Badges</span>
                      </div>
                      <Badge variant="purple">{data?.userBadges?.length || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ISJF Tab */}
        {activeTab === 'isjf' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Evolução do ISJF</CardTitle>
                <CardDescription>
                  Acompanhe a evolução do seu Índice de Saúde da Jornada Financeira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ISJFChart data={data?.isjfHistory || []} showDeterminants />
              </CardContent>
            </Card>

            {latestISJF && (
              <Card>
                <CardHeader>
                  <CardTitle>💡 Recomendações Personalizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-bold text-blue-900 mb-2">
                        🎯 Foco de Melhoria
                      </h4>
                      <p className="text-sm text-blue-800">
                        {latestISJF.ri < latestISJF.gar && latestISJF.ri < latestISJF.hab && latestISJF.ri < latestISJF.rec
                          ? 'Seu Risco (RI) está mais baixo. Foque em construir uma reserva de emergência e melhorar seu planejamento.'
                          : latestISJF.gar < latestISJF.hab && latestISJF.gar < latestISJF.rec
                          ? 'Sua Garantia (GAR) precisa de atenção. Trabalhe em controlar seus gastos essenciais e capacidade de dívida.'
                          : latestISJF.hab < latestISJF.rec
                          ? 'Suas Habilidades (HAB) podem melhorar. Foque em desenvolver hábitos financeiros consistentes.'
                          : 'Seus Recursos (REC) estão mais baixos. Trabalhe em aumentar suas fontes de renda e investimentos.'}
                      </p>
                    </div>

                    <Button href="/dashboard/atividades" className="w-full">
                      Ver Atividades Recomendadas 📚
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <Card>
            <CardHeader>
              <CardTitle>📅 Sua Timeline Financeira</CardTitle>
              <CardDescription>
                Todos os seus marcos e conquistas em ordem cronológica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline events={data?.timelineEvents || []} />
            </CardContent>
          </Card>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🏆 Suas Conquistas</CardTitle>
                <CardDescription>
                  Badges e marcos que você conquistou na sua jornada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AchievementsGrid
                  achievements={
                    data?.badges?.map((badge: any) => {
                      const userBadge = data?.userBadges?.find(
                        (ub: any) => ub.badgeId === badge.id
                      );
                      return {
                        id: badge.id,
                        name: badge.name,
                        description: badge.description,
                        icon: badge.icon || '🏆',
                        earnedAt: userBadge?.earnedAt,
                        progress: userBadge ? badge.requiredValue : progress[badge.criteria] || 0,
                        requiredValue: badge.requiredValue,
                        locked: false,
                      };
                    }) || []
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TeenLayout>
  );
}
