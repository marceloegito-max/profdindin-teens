import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/messages/conversations - Listar conversas do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Buscar mensagens enviadas e recebidas
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Agrupar por conversa (userId do outro)
    const conversationsMap = new Map<string, any>();

    messages.forEach((msg) => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
          messages: []
        });
      }

      const conv = conversationsMap.get(otherUserId)!;

      // Atualizar lastMessage se for mais recente
      if (new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = msg;
      }

      // Contar não lidas (mensagens recebidas)
      if (msg.receiverId === userId && !msg.lida) {
        conv.unreadCount++;
      }

      conv.messages.push(msg);
    });

    const conversations = Array.from(conversationsMap.values());

    // Ordenar por última mensagem
    conversations.sort((a, b) => {
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });

    return NextResponse.json({ data: conversations });
  } catch (error: any) {
    console.error('Erro ao buscar conversas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conversas', details: error.message },
      { status: 500 }
    );
  }
}
