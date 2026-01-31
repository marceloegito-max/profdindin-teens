'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

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

interface ChatWindowProps {
  userId: string;
  currentUserId: string;
  onBack?: () => void;
}

export function ChatWindow({ userId, currentUserId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    markAsRead();

    // Polling para atualizar mensagens (a cada 5 segundos)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/conversations/${userId}`);
      const data = await res.json();
      if (data.data) {
        setMessages(data.data.messages);
        setOtherUser(data.data.otherUser);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`/api/messages/conversations/${userId}`, {
        method: 'PATCH'
      });
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const res = await fetch(`/api/messages/conversations/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo: newMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {otherUser && (
          <>
            {otherUser.image ? (
              <img
                src={otherUser.image}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {otherUser.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
              <p className="text-xs text-gray-500">{otherUser.email}</p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Nenhuma mensagem ainda.</p>
            <p className="text-sm mt-1">Envie a primeira mensagem para iniciar a conversa!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={msg.senderId === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            <Send className="h-4 w-4" />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
