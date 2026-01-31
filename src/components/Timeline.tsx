'use client';

import React from 'react';
import { Badge } from './ui/Badge';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'checkup' | 'raio-x' | 'mapa-tesouro' | 'atividade' | 'badge' | 'level';
  title: string;
  description?: string;
  icon?: string;
  points?: number;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📅</div>
        <p>Sua jornada começa aqui!</p>
        <p className="text-sm mt-2">Complete atividades para ver seu progresso.</p>
      </div>
    );
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'bg-purple-500';
      case 'raio-x':
        return 'bg-blue-500';
      case 'mapa-tesouro':
        return 'bg-yellow-500';
      case 'atividade':
        return 'bg-green-500';
      case 'badge':
        return 'bg-orange-500';
      case 'level':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string, icon?: string) => {
    if (icon) return icon;
    
    switch (type) {
      case 'checkup':
        return '😰';
      case 'raio-x':
        return '🧠';
      case 'mapa-tesouro':
        return '🗺️';
      case 'atividade':
        return '📚';
      case 'badge':
        return '🏆';
      case 'level':
        return '🎉';
      default:
        return '✨';
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="relative">
          {/* Linha conectora */}
          {index < events.length - 1 && (
            <div
              className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"
              style={{ height: 'calc(100% + 1rem)' }}
            />
          )}

          {/* Evento */}
          <div className="flex items-start space-x-4">
            {/* Ícone */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full ${
                getEventColor(event.type)
              } flex items-center justify-center text-2xl shadow-lg z-10`}
            >
              {getEventIcon(event.type, event.icon)}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 bg-white rounded-lg border-2 border-gray-100 p-4 hover:border-purple-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900">{event.title}</h4>
                    {event.points && (
                      <Badge variant="success" size="sm">
                        +{event.points} XP
                      </Badge>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600">{event.description}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(event.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
