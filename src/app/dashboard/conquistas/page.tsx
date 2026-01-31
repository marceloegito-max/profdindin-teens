'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BadgeDisplay } from '@/components/gamification/BadgeDisplay';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { Trophy, Award, Filter, Users, TrendingUp } from 'lucide-react';
import { Badge as BadgeType } from '@prisma/client';

type BadgeCategory = 'all' | 'learning' | 'social' | 'achievement' | 'streak';

interface UserProgress {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  streakDays: number;
  lastActivityDate: Date;
  totalBadges: number;
  unlockedBadges: number;
}

interface BadgeWithProgress extends BadgeType {
  unlocked: boolean;
  progress?: number;
}

export default function ConquistasPage() {
  const { data: session } = useSession();
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>('all');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConquistas();
  }, []);

  const fetchConquistas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gamification/conquistas');
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges);
        setUserProgress(data.userProgress);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = badges
    .filter((badge) => {
      if (showLockedOnly && badge.unlocked) {
        return false;
      }
      return true;
    });

  const categories: { value: BadgeCategory; label: string; icon: any }[] = [
    { value: 'all', label: 'Todas', icon: Trophy },
    { value: 'learning', label: 'Aprendizado', icon: TrendingUp },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'achievement', label: 'Conquistas', icon: Award },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Suas Conquistas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe seu progresso e desbloqueie novas conquistas!
          </p>
        </div>

        {/* Progress Summary */}
        {userProgress && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* XP Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <XPBar
                currentXP={userProgress.currentXP}
                xpForNextLevel={userProgress.xpForNextLevel}
                level={userProgress.level}
                size="md"
              />
            </div>

            {/* Streak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <StreakCounter
                streakDays={userProgress.streakDays}
                lastActivityDate={userProgress.lastActivityDate}
                size="md"
              />
            </div>

            {/* Badges Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4">
                  <Award className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Badges Conquistados</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userProgress.unlockedBadges}/{userProgress.totalBadges}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                      style={{
                        width: `${(userProgress.unlockedBadges / userProgress.totalBadges) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-gray-400" />
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      selectedCategory === cat.value
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <Icon size={18} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Locked Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLockedOnly}
              onChange={(e) => setShowLockedOnly(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Mostrar apenas bloqueados
            </span>
          </label>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {showLockedOnly ? 'Badges a Desbloquear' : 'Todos os Badges'}
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-base font-normal">
            ({filteredBadges.length})
          </span>
        </h2>
        {filteredBadges.length > 0 ? (
          <BadgeDisplay badges={filteredBadges} size="lg" showLocked />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum badge encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
