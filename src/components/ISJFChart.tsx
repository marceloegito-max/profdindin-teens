'use client';

import React from 'react';

interface ISJFChartProps {
  data: Array<{
    date: string;
    isjfValue: number;
    gar?: number;
    hab?: number;
    rec?: number;
    ri?: number;
  }>;
  showDeterminants?: boolean;
}

export function ISJFChart({ data, showDeterminants = false }: ISJFChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📈</div>
        <p>Nenhum dado disponível ainda.</p>
        <p className="text-sm mt-2">Complete o Mapa do Tesouro para ver seu ISJF!</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.isjfValue), 2.5);
  const minValue = Math.min(...data.map(d => d.isjfValue), 0);
  const range = maxValue - minValue;

  return (
    <div className="space-y-6">
      {/* Gráfico de Linha do ISJF */}
      <div className="relative h-64 bg-gradient-to-b from-purple-50 to-white rounded-lg p-4">
        {/* Linhas de referência */}
        <div className="absolute inset-4 flex flex-col justify-between">
          {[2.5, 2.0, 1.5, 1.0, 0.5].map((value) => (
            <div key={value} className="relative">
              <div className="border-t border-gray-200" />
              <span className="absolute -left-2 -top-2 text-xs text-gray-500">
                {value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Linha do gráfico */}
        <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]">
          <polyline
            points={data
              .map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((point.isjfValue - minValue) / range) * 100;
                return `${x}%,${y}%`;
              })
              .join(' ')}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Pontos */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.isjfValue - minValue) / range) * 100;
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="white"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legenda de datas */}
      <div className="flex justify-between text-xs text-gray-600 px-4">
        {data.map((point, index) => {
          if (index === 0 || index === data.length - 1 || data.length <= 5) {
            return (
              <span key={index}>
                {new Date(point.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            );
          }
          return null;
        })}
      </div>

      {/* Determinantes */}
      {showDeterminants && data[data.length - 1] && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'gar', label: 'Garantia', color: 'bg-red-500', emoji: '🛡️' },
            { key: 'hab', label: 'Habilidade', color: 'bg-blue-500', emoji: '🎯' },
            { key: 'rec', label: 'Recursos', color: 'bg-green-500', emoji: '💼' },
            { key: 'ri', label: 'Risco', color: 'bg-yellow-500', emoji: '⚠️' },
          ].map(({ key, label, color, emoji }) => {
            const value = data[data.length - 1][key as keyof typeof data[0]];
            return (
              <div key={key} className="p-4 bg-white rounded-lg border-2 border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-medium text-gray-600">{label}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    {value ? (value as number).toFixed(2) : 'N/A'}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color}`}
                    style={{ width: `${((value as number) / 125) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
