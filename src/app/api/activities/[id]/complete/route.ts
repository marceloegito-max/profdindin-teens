import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
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
    const body = await request.json();
    const { respostas } = body;

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

    // Verificar se já foi completada
    const alreadyCompleted = await prisma.completedActivity.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: id,
        },
      },
    });

    // Se já foi completada, não dar XP novamente
    const pointsEarned = alreadyCompleted ? 0 : activity.points;

    // Salvar conclusão da atividade
    await prisma.completedActivity.upsert({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: id,
        },
      },
      create: {
        userId: session.user.id,
        activityId: id,
        pointsEarned,
        responses: respostas,
      },
      update: {
        responses: respostas,
      },
    });

    // Atualizar progresso do usuário
    if (pointsEarned > 0) {
      await prisma.userProgress.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          xp: pointsEarned,
          totalActivitiesCompleted: 1,
        },
        update: {
          xp: { increment: pointsEarned },
          totalActivitiesCompleted: { increment: 1 },
        },
      });

      // Atualizar streak
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      await prisma.streak.upsert({
        where: {
          userId_date: {
            userId: session.user.id,
            date: hoje,
          },
        },
        create: {
          userId: session.user.id,
          date: hoje,
        },
        update: {},
      });

      // Calcular streak atual
      const streaks = await prisma.streak.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
        take: 30,
      });

      let currentStreak = 0;
      let lastDate: Date | null = null;

      for (const streak of streaks) {
        if (!lastDate) {
          lastDate = streak.date;
          currentStreak = 1;
        } else {
          const diffDays = Math.floor(
            (lastDate.getTime() - streak.date.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (diffDays === 1) {
            currentStreak++;
            lastDate = streak.date;
          } else {
            break;
          }
        }
      }

      // Atualizar streak no progresso
      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: {
          currentStreak,
          longestStreak: { set: Math.max(currentStreak, (await prisma.userProgress.findUnique({ where: { userId: session.user.id } }))?.longestStreak || 0) },
          lastActiveDate: hoje,
        },
      });
    }

    return NextResponse.json({
      success: true,
      pointsEarned,
      message: pointsEarned > 0 ? 'Atividade concluída!' : 'Atividade atualizada!',
    });
  } catch (error) {
    console.error('Erro ao concluir atividade:', error);
    return NextResponse.json(
      { error: 'Erro ao concluir atividade' },
      { status: 500 }
    );
  }
}
