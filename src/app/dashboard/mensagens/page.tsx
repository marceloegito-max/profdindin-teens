'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageCircle } from 'lucide-react';

export default function MensagensPage() {
  const { data: session } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  const currentUserId = (session.user as any).id;

  // Mobile: Mostrar apenas chat window quando conversa está selecionada
  if (isMobile && selectedUserId) {
    return (
      <div className="h-screen">
        <ChatWindow
          userId={selectedUserId}
          currentUserId={currentUserId}
          onBack={() => setSelectedUserId(null)}
        />
      </div>
    );
  }

  // Mobile: Mostrar apenas lista quando nenhuma conversa selecionada
  if (isMobile && !selectedUserId) {
    return (
      <div className="h-screen">
        <ChatList
          onSelectConversation={setSelectedUserId}
          selectedUserId={selectedUserId || undefined}
        />
      </div>
    );
  }

  // Desktop: Mostrar lado a lado
  return (
    <div className="h-screen flex">
      {/* Lista de Conversas */}
      <div className="w-80 border-r">
        <ChatList
          onSelectConversation={setSelectedUserId}
          selectedUserId={selectedUserId || undefined}
        />
      </div>

      {/* Janela de Chat */}
      <div className="flex-1">
        {selectedUserId ? (
          <ChatWindow userId={selectedUserId} currentUserId={currentUserId} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Selecione uma conversa</p>
              <p className="text-sm mt-1">Escolha uma conversa da lista para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
