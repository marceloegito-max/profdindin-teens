'use client';

import { motion } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StreakCounterProps {
  streakDays: number;
  lastActivityDate?: Date | string;
  size?: 'sm' | 'md' | 'lg';
  showWarning?: boolean;
}

export function StreakCounter({
  streakDays,
  lastActivityDate,
  size = 'md',
  showWarning = true,
}: StreakCounterProps) {
  const [isAtRisk, setIsAtRisk] = useState(false);

  useEffect(() => {
    if (lastActivityDate) {
      const lastActivity = new Date(lastActivityDate);
      const now = new Date();
      const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
      
      // At risk if more than 20 hours since last activity
      setIsAtRisk(hoursSinceActivity > 20);
    }
  }, [lastActivityDate]);

  const sizeClasses = {
    sm: { container: 'p-3', icon: 24, text: 'text-xl', label: 'text-xs' },
    md: { container: 'p-4', icon: 32, text: 'text-3xl', label: 'text-sm' },
    lg: { container: 'p-6', icon: 48, text: 'text-5xl', label: 'text-base' },
  };

  const config = sizeClasses[size];

  return (
    <div className="relative inline-block">
      <motion.div
        className={`
          ${config.container}
          bg-gradient-to-br from-orange-400 to-red-500
          rounded-2xl shadow-lg
          flex items-center gap-4
          ${isAtRisk && showWarning ? 'ring-4 ring-yellow-400' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {/* Flame icon with animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Flame
            className="text-white drop-shadow-lg"
            size={config.icon}
            fill="currentColor"
          />
        </motion.div>

        {/* Streak counter */}
        <div className="flex flex-col">
          <motion.span
            className={`${config.text} font-bold text-white`}
            key={streakDays}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
          >
            {streakDays}
          </motion.span>
          <span className={`${config.label} text-white/90 font-medium uppercase tracking-wider`}>
            {streakDays === 1 ? 'dia' : 'dias'}
          </span>
        </div>
      </motion.div>

      {/* Warning badge */}
      {isAtRisk && showWarning && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg"
        >
          <AlertTriangle size={16} />
        </motion.div>
      )}

      {/* Tooltip on hover */}
      {isAtRisk && showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 text-yellow-800 dark:text-yellow-200 text-xs px-4 py-2 rounded-lg shadow-lg whitespace-nowrap z-10"
        >
          <AlertTriangle className="inline mr-2" size={14} />
          Sua sequência está em risco! Complete uma atividade hoje.
        </motion.div>
      )}
    </div>
  );
}
