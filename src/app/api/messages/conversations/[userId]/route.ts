import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/messages/conversations/[userId] - Listar mensagens da conversa
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const currentUserId = (session.user as any).id;
    const otherUserId = params.userId;

    // Buscar mensagens entre os dois usuários
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Buscar informações do outro usuário
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      }
    });

    return NextResponse.json({
      data: {
        otherUser,
        messages
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/messages/conversations/[userId] - Enviar mensagem
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const currentUserId = (session.user as any).id;
    const receiverId = params.userId;

    const body = await req.json();
    const { conteudo, assunto, tipo, prioridade } = body;

    if (!conteudo?.trim()) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: currentUserId,
        receiverId,
        conteudo: conteudo.trim(),
        assunto: assunto || '',
        tipo: tipo || 'mensagem',
        prioridade: prioridade || 'normal'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // TODO: Criar notificação para o destinatário
    await prisma.notificacao.create({
      data: {
        userId: receiverId,
        tipo: 'mensagem',
        titulo: `Nova mensagem de ${session.user.name}`,
        mensagem: conteudo.substring(0, 100)
      }
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/conversations/[userId] - Marcar mensagens como lidas
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const currentUserId = (session.user as any).id;
    const senderId = params.userId;

    // Marcar todas as mensagens não lidas do sender como lidas
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: currentUserId,
        lida: false
      },
      data: {
        lida: true,
        dataLeitura: new Date()
      }
    });

    return NextResponse.json({ message: 'Mensagens marcadas como lidas' });
  } catch (error: any) {
    console.error('Erro ao marcar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao marcar mensagens', details: error.message },
      { status: 500 }
    );
  }
}
