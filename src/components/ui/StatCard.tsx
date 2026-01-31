import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  color = 'blue',
  onClick,
  className = '',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  const trendIcons = {
    up: '📈',
    down: '📉',
    neutral: '➡️',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <Card
        padding="md"
        hover={!!onClick}
        className={className}
      >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className={`mt-2 flex items-center text-sm ${trendColors[trend]}`}>
              <span className="mr-1">{trendIcons[trend]}</span>
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <div className="text-2xl">{icon}</div>
          </div>
        )}
      </div>
    </Card>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: string;
  className?: string;
}

export function MiniStat({ label, value, icon, className = '' }: MiniStatProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {icon && <span className="text-xl">{icon}</span>}
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
