'use client';

import { useEffect, useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Conversation {
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  lastMessage: {
    conteudo: string;
    createdAt: Date;
    lida: boolean;
    senderId: string;
  };
  unreadCount: number;
}

interface ChatListProps {
  onSelectConversation: (userId: string) => void;
  selectedUserId?: string;
}

export function ChatList({ onSelectConversation, selectedUserId }: ChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations');
      const data = await res.json();
      if (data.data) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'TEEN':
        return 'bg-blue-100 text-blue-700';
      case 'PROFESSOR':
        return 'bg-purple-100 text-purple-700';
      case 'RESPONSIBLE':
        return 'bg-green-100 text-green-700';
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'TEEN':
        return 'Aluno';
      case 'PROFESSOR':
        return 'Professor';
      case 'RESPONSIBLE':
        return 'Responsável';
      case 'ADMIN':
        return 'Admin';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          Mensagens
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.userId}
              onClick={() => onSelectConversation(conv.userId)}
              className={`w-full p-4 hover:bg-gray-50 transition-colors border-b text-left ${
                selectedUserId === conv.userId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conv.user.image ? (
                    <img
                      src={conv.user.image}
                      alt={conv.user.name || 'Usuário'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {conv.user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.user.name || 'Usuário sem nome'}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                    getRoleBadgeColor(conv.user.role)
                  }`}>
                    {getRoleLabel(conv.user.role)}
                  </span>

                  <p className={`text-sm truncate ${
                    conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}>
                    {conv.lastMessage.conteudo}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
