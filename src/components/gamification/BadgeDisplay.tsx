'use client';

import { Badge as BadgeType } from '@prisma/client';
import { motion } from 'framer-motion';
import { Award, Lock, Trophy, Star, TrendingUp, Target, Zap, Heart } from 'lucide-react';
import { useState } from 'react';

interface BadgeDisplayProps {
  badges: (BadgeType & { unlocked?: boolean; progress?: number })[];
  size?: 'sm' | 'md' | 'lg';
  showLocked?: boolean;
}

const BADGE_ICONS: Record<string, any> = {
  Trophy,
  Star,
  Award,
  TrendingUp,
  Target,
  Zap,
  Heart,
};

export function BadgeDisplay({ badges, size = 'md', showLocked = true }: BadgeDisplayProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const displayBadges = showLocked ? badges : badges.filter(b => b.unlocked);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {displayBadges.map((badge) => {
        const Icon = BADGE_ICONS[badge.icon] || Award;
        const isLocked = !badge.unlocked;

        return (
          <motion.div
            key={badge.id}
            className="relative"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredBadge(badge.id)}
            onHoverEnd={() => setHoveredBadge(null)}
          >
            <div
              className={`
                ${sizeClasses[size]}
                rounded-full flex items-center justify-center
                ${isLocked
                  ? 'bg-gray-200 dark:bg-gray-700 opacity-50'
                  : 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                }
                transition-all duration-300
              `}
            >
              {isLocked ? (
                <Lock className="text-gray-400" size={iconSizes[size] * 0.6} />
              ) : (
                <Icon className="text-white" size={iconSizes[size] * 0.7} />
              )}
            </div>

            {/* Tooltip */}
            {hoveredBadge === badge.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    ${isLocked ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gradient-to-br from-yellow-400 to-orange-500'}
                    rounded-full p-2
                  `}>
                    {isLocked ? (
                      <Lock className="text-gray-400" size={20} />
                    ) : (
                      <Icon className="text-white" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {badge.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {badge.description}
                    </p>
                    {isLocked && badge.criteria && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Critério: {badge.criteria}
                        </p>
                        {badge.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                              <span className="font-semibold">{Math.round(badge.progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${badge.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
