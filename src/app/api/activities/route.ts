import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar todas as atividades
    const activities = await prisma.activity.findMany({
      orderBy: [
        { module: 'asc' },
        { code: 'asc' },
      ],
    });

    // Buscar atividades completadas pelo usuário
    const completedActivities = await prisma.completedActivity.findMany({
      where: { userId: session.user.id },
      select: { activityId: true },
    });

    const completedIds = new Set(completedActivities.map(ca => ca.activityId));

    // Buscar progresso do usuário para determinar atividades bloqueadas
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    });

    // Marcar atividades como completas ou bloqueadas
    const activitiesWithStatus = activities.map(activity => ({
      ...activity,
      completed: completedIds.has(activity.id),
      locked: false, // Simplificado - implementar lógica de pré-requisitos depois
    }));

    return NextResponse.json({
      activities: activitiesWithStatus,
      userProgress,
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    );
  }
}
