import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', icon, className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description?: string;
  earned?: boolean;
  earnedAt?: Date;
  onClick?: () => void;
  className?: string;
}

export function AchievementBadge({
  icon,
  name,
  description,
  earned = false,
  earnedAt,
  onClick,
  className = '',
}: AchievementBadgeProps) {
  return (
    <button
      onClick={onClick}
      disabled={!earned}
      className={`
        group relative p-4 rounded-xl border-2 transition-all duration-200
        ${earned
          ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-300 hover:shadow-lg hover:scale-105 cursor-pointer'
          : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
        }
        ${className}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`text-4xl ${earned ? 'animate-bounce' : 'grayscale'}`}>
          {icon}
        </div>
        <div>
          <h4 className={`font-bold text-sm ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
            {name}
          </h4>
          {description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
          )}
          {earned && earnedAt && (
            <p className="text-xs text-purple-600 mt-1 font-medium">
              {new Date(earnedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
          )}
        </div>
      </div>
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-xl">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </button>
  );
}
