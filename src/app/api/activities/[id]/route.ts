import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Buscar atividade
    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Atividade não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o usuário já completou
    const completed = await prisma.completedActivity.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: id,
        },
      },
    });

    return NextResponse.json({
      activity: {
        ...activity,
        completed: !!completed,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar atividade' },
      { status: 500 }
    );
  }
}
