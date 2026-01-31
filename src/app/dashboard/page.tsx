'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TeenLayout } from '@/components/layout/TeenLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [latestISJF, setLatestISJF] = useState<any>(null);
  const [dailyMissions, setDailyMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUserProgress({
        xp: 850,
        level: 3,
        currentStreak: 5,
        longestStreak: 12,
        totalActivitiesCompleted: 8,
      });
      setLatestISJF({
        indiceISJF: 1.35,
        classificacao: 'Resiliente',
      });
      setDailyMissions([
        { id: 1, title: 'Complete uma atividade', progress: 0, target: 1, reward: 50, icon: '✅' },
        { id: 2, title: 'Ganhe 100 XP', progress: 50, target: 100, reward: 75, icon: '⭐' },
        { id: 3, title: 'Mantenha o streak', progress: 5, target: 7, reward: 100, icon: '🔥' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <TeenLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </TeenLayout>
    );
  }

  const xpForNextLevel = userProgress.level * 500;

  return (
    <TeenLayout>
      <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            E aí, {session?.user?.name || 'Teen'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Bem-vindo de volta à sua jornada financeira! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Nível Atual"
            value={userProgress.level}
            icon="🎮"
            color="purple"
          />
          <StatCard
            label="XP Total"
            value={userProgress.xp}
            icon="⭐"
            color="yellow"
          />
          <StatCard
            label="Streak Atual"
            value={userProgress.currentStreak + ' dias'}
            icon="🔥"
            color="red"
          />
          <StatCard
            label="Atividades"
            value={userProgress.totalActivitiesCompleted}
            icon="📚"
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🗺️ Seu Índice ISJF</CardTitle>
                <CardDescription>Saúde da sua Jornada Financeira</CardDescription>
              </CardHeader>
              <CardContent>
                {latestISJF ? (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-5xl font-bold text-purple-600">
                          {latestISJF.indiceISJF.toFixed(2)}
                        </span>
                        <Badge variant="purple" size="lg">
                          {latestISJF.classificacao}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">
                        Você tá no caminho certo! 🎯
                      </p>
                      <div className="mt-4 space-x-2">
                        <Button href="/dashboard/mapa-tesouro" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                    <CircularProgress
                      value={latestISJF.indiceISJF}
                      max={2.5}
                      size={120}
                      color="purple"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Você ainda não fez o Mapa do Tesouro! 🗺️
                    </p>
                    <Button href="/dashboard/mapa-tesouro">Fazer Agora</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Progresso para Nível {userProgress.level + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  value={userProgress.xp}
                  max={xpForNextLevel}
                  showLabel
                  color="purple"
                  size="lg"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Missões Diárias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyMissions.map((mission) => (
                    <div key={mission.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{mission.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{mission.title}</p>
                            <p className="text-xs text-gray-600">
                              {mission.progress}/{mission.target}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">
                          +{mission.reward} XP
                        </Badge>
                      </div>
                      <ProgressBar
                        value={mission.progress}
                        max={mission.target}
                        color="green"
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeenLayout>
  );
}
