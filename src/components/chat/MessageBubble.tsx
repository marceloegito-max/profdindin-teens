'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  conteudo: string;
  createdAt: Date;
  lida: boolean;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex items-end gap-2 ${
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          {message.sender.image ? (
            <img
              src={message.sender.image}
              alt={message.sender.name || 'Usuário'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {message.sender.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isCurrentUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 border rounded-bl-none'
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-semibold text-blue-600 mb-1">
            {message.sender.name}
          </p>
        )}
        
        <p className="break-words whitespace-pre-wrap">{message.conteudo}</p>
        
        <div
          className={`flex items-center gap-1 mt-1 text-xs ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <span>
            {format(new Date(message.createdAt), "HH:mm", { locale: ptBR })}
          </span>
          
          {isCurrentUser && (
            <span className="ml-1">
              {message.lida ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
