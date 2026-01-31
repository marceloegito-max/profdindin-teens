'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, Share2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  rewards?: string[];
  onShare?: () => void;
}

export function LevelUpModal({ isOpen, onClose, level, rewards = [], onShare }: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showConfetti && (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-pink-500/20" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Trophy animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <Trophy className="relative text-yellow-500" size={80} />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Parabéns! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Você subiu para o
                  </p>
                  <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-lg mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wider">Nível</p>
                    <p className="text-5xl font-bold">{level}</p>
                  </div>
                </motion.div>

                {/* Rewards */}
                {rewards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Sparkles className="text-yellow-500" size={20} />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Recompensas Desbloqueadas
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {rewards.map((reward, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center gap-3"
                        >
                          <ChevronRight className="text-green-500" size={20} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{reward}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex gap-3"
                >
                  {onShare && (
                    <button
                      onClick={onShare}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <Share2 size={20} />
                      Compartilhar
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continuar
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
