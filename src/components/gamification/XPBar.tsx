'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface XPBarProps {
  currentXP: number;
  xpForNextLevel: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function XPBar({
  currentXP,
  xpForNextLevel,
  level,
  showLabel = true,
  size = 'md',
  animated = true,
}: XPBarProps) {
  const [displayXP, setDisplayXP] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const percentage = Math.min((currentXP / xpForNextLevel) * 100, 100);

  useEffect(() => {
    if (animated) {
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = currentXP / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= currentXP) {
          setDisplayXP(currentXP);
          clearInterval(timer);
        } else {
          setDisplayXP(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayXP(currentXP);
    }
  }, [currentXP, animated]);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-500" size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
            <span className={`font-semibold text-gray-900 dark:text-white ${textSizes[size]}`}>
              Nível {level}
            </span>
          </div>
          <span className={`font-medium text-gray-600 dark:text-gray-400 ${textSizes[size]}`}>
            {displayXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
          </span>
        </div>
      )}

      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClasses[size]}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10"
          >
            <div className="text-center">
              <div className="font-semibold">{Math.round(percentage)}% completo</div>
              <div className="text-gray-300 mt-1">
                Faltam {(xpForNextLevel - currentXP).toLocaleString()} XP para o próximo nível
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
