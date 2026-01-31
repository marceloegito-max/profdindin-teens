'use client';

import React from 'react';
import { Badge } from './ui/Badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress?: number;
  requiredValue?: number;
  locked?: boolean;
}

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

export function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const isEarned = !!achievement.earnedAt;
  const progress = achievement.progress || 0;
  const requiredValue = achievement.requiredValue || 100;
  const progressPercent = Math.min((progress / requiredValue) * 100, 100);

  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-lg border-2 transition-all cursor-pointer
        ${
          isEarned
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-500 hover:shadow-xl'
            : achievement.locked
            ? 'bg-gray-50 border-gray-200 opacity-60'
            : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg'
        }
      `}
    >
      {/* Badge de conquista */}
      {isEarned && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ✓ Conquistado!
          </div>
        </div>
      )}

      {/* Ícone */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`
            text-6xl transform transition-transform
            ${isEarned ? 'scale-110 animate-pulse' : achievement.locked ? 'grayscale' : ''}
          `}
        >
          {achievement.locked ? '🔒' : achievement.icon}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="text-center space-y-2">
        <h3
          className={`
            text-xl font-bold
            ${isEarned ? 'text-yellow-900' : achievement.locked ? 'text-gray-400' : 'text-gray-900'}
          `}
        >
          {achievement.name}
        </h3>
        <p
          className={`
            text-sm
            ${isEarned ? 'text-yellow-700' : achievement.locked ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          {achievement.description}
        </p>

        {/* Data de conquista */}
        {isEarned && achievement.earnedAt && (
          <p className="text-xs text-yellow-600">
            Conquistado em{' '}
            {new Date(achievement.earnedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}

        {/* Progresso */}
        {!isEarned && !achievement.locked && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium text-gray-600">
              <span>Progresso</span>
              <span>
                {progress} / {requiredValue}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Badge de bloqueado */}
        {achievement.locked && (
          <Badge variant="default" size="sm" className="mt-2">
            Bloqueado
          </Badge>
        )}
      </div>
    </div>
  );
}

interface AchievementsGridProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
}

export function AchievementsGrid({ achievements, onAchievementClick }: AchievementsGridProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">🏆</div>
        <p>Nenhuma conquista ainda.</p>
        <p className="text-sm mt-2">Complete atividades para desbloquear!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          onClick={() => onAchievementClick?.(achievement)}
        />
      ))}
    </div>
  );
}
